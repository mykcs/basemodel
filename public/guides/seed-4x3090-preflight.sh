#!/usr/bin/env bash
set -uo pipefail

EXPECTED_GPU_COUNT="${EXPECTED_GPU_COUNT:-4}"
SEED_ROOT="${SEED_ROOT:-/srv/seed}"
MODEL_DIR="${MODEL_DIR:-$SEED_ROOT/models/Qwen2.5-3B-Instruct}"
ALFWORLD_DATA="${ALFWORLD_DATA:-$SEED_ROOT/data/alfworld}"
WEBSHOP_ROOT="${WEBSHOP_ROOT:-$SEED_ROOT/data/webshop}"
RUN_DIR="${RUN_DIR:-$SEED_ROOT/runs/preflight}"
MANIFEST="${MANIFEST:-$SEED_ROOT/SHA256SUMS.txt}"
EXPERIMENT_COMMIT_FILE="${EXPERIMENT_COMMIT_FILE:-$SEED_ROOT/code/EXPERIMENT_COMMIT}"

mkdir -p "$RUN_DIR"
failures=0

pass() { printf 'PASS  %s\n' "$*"; }
warn() { printf 'WARN  %s\n' "$*"; }
fail() { printf 'FAIL  %s\n' "$*"; failures=$((failures + 1)); }

printf 'SEED offline preflight\n'
printf 'root=%s expected_gpus=%s\n\n' "$SEED_ROOT" "$EXPECTED_GPU_COUNT"

if command -v nvidia-smi >/dev/null 2>&1; then
  gpu_count="$(nvidia-smi -L 2>/dev/null | grep -c '^GPU ' || true)"
  if [ "$gpu_count" = "$EXPECTED_GPU_COUNT" ]; then
    pass "nvidia-smi sees $gpu_count GPU(s)"
  else
    fail "expected $EXPECTED_GPU_COUNT GPU(s), nvidia-smi sees $gpu_count"
  fi
  nvidia-smi > "$RUN_DIR/nvidia-smi.txt" 2>&1 || true
  nvidia-smi topo -m > "$RUN_DIR/nvidia-smi-topo.txt" 2>&1 || true
else
  fail "nvidia-smi is not available"
fi

if [ -s "$EXPERIMENT_COMMIT_FILE" ]; then
  commit="$(tr -d '[:space:]' < "$EXPERIMENT_COMMIT_FILE")"
  if printf '%s' "$commit" | grep -Eq '^[0-9a-fA-F]{7,40}$'; then
    pass "EXPERIMENT_COMMIT=$commit"
  else
    fail "EXPERIMENT_COMMIT does not look like a Git SHA"
  fi
else
  fail "missing $EXPERIMENT_COMMIT_FILE"
fi

if [ -f "$MANIFEST" ]; then
  if (cd "$(dirname "$MANIFEST")" && sha256sum -c "$(basename "$MANIFEST")") > "$RUN_DIR/sha256-check.txt" 2>&1; then
    pass "SHA256 manifest verifies"
  else
    fail "SHA256 verification failed; see $RUN_DIR/sha256-check.txt"
  fi
else
  warn "no SHA256SUMS.txt found; large-file integrity was not checked"
fi

if [ -f "$MODEL_DIR/config.json" ]; then
  pass "model config exists: $MODEL_DIR/config.json"
else
  fail "model config missing: $MODEL_DIR/config.json"
fi

if [ -d "$ALFWORLD_DATA/json_2.1.1/train" ]; then
  pass "ALFWorld train data exists"
else
  fail "ALFWorld data missing: $ALFWORLD_DATA/json_2.1.1/train"
fi

if [ -d "$WEBSHOP_ROOT/data" ]; then
  pass "WebShop data directory exists"
else
  fail "WebShop data directory missing: $WEBSHOP_ROOT/data"
fi

if [ -d "$WEBSHOP_ROOT/search_engine" ]; then
  pass "WebShop search_engine directory exists"
else
  fail "WebShop search_engine directory missing: $WEBSHOP_ROOT/search_engine"
fi

if command -v python >/dev/null 2>&1; then
  if python - "$EXPECTED_GPU_COUNT" <<'PY' > "$RUN_DIR/torch-cuda.txt" 2>&1
import sys
expected = int(sys.argv[1])
import torch
print('torch', torch.__version__)
print('cuda', torch.cuda.is_available())
print('device_count', torch.cuda.device_count())
if not torch.cuda.is_available() or torch.cuda.device_count() != expected:
    raise SystemExit(2)
for i in range(expected):
    p = torch.cuda.get_device_properties(i)
    print(i, p.name, round(p.total_memory / 1024**3, 1), 'GiB')
PY
  then
    pass "PyTorch sees exactly $EXPECTED_GPU_COUNT CUDA device(s)"
  else
    fail "PyTorch CUDA check failed; see $RUN_DIR/torch-cuda.txt"
  fi
else
  fail "python is not available"
fi

printf '\nArtifacts saved under %s\n' "$RUN_DIR"
if [ "$failures" -eq 0 ]; then
  printf 'READY: offline bundle and GPU visibility passed the preflight gate.\n'
  exit 0
fi
printf 'NOT READY: %s required check(s) failed.\n' "$failures"
exit 1
