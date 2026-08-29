#!/usr/bin/env bash
set -Eeuo pipefail

bundle_dir="${RUNNER_BUNDLE_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
state_dir="${BASEMODEL_CI_STATE_DIR:-${HOME}/Library/Application Support/BasemodelCI}"
image="basemodel-ci-runner:node24-pwdeps-1.62.1-runner-2.337.0-v2"
container="basemodel-ci-runner-v2"
legacy_container="basemodel-ci-runner"
runner_name="basemodel-macbook-container-v2"
legacy_runner_name="basemodel-macbook-container"
runtime_contract="v2-4cpu-4g-8g-total-1024pids-1gshm-capdropall"
backup_container=""

runner_is_busy() {
  local name="$1"
  local busy
  if ! busy="$(gh api repos/mykcs/basemodel/actions/runners \
    --jq ".runners[] | select(.name == \"$name\") | .busy" 2>/dev/null)"; then
    return 2
  fi
  [[ "$busy" == "true" ]]
}

require_runner_idle() {
  local name="$1"
  local status
  if runner_is_busy "$name"; then
    echo "Refusing to change runner $name while a GitHub Actions job is active." >&2
    return 1
  else
    status=$?
  fi
  if [[ "$status" -eq 2 ]]; then
    echo 'Refusing to change runner state because GitHub availability could not be verified.' >&2
    return 1
  fi
}

restore_previous_container() {
  local exit_status=$?
  local failed_container
  trap - ERR

  if docker container inspect "$container" >/dev/null 2>&1; then
    docker stop --time 30 "$container" >/dev/null 2>&1 || true
    failed_container="${container}-failed-$(date -u +%Y%m%dT%H%M%SZ)"
    docker rename "$container" "$failed_container" || true
  fi

  if docker container inspect "$legacy_container" >/dev/null 2>&1; then
    docker start "$legacy_container" >/dev/null
    echo "Runner change failed; restored independently registered legacy container $legacy_container." >&2
  elif [[ -n "$backup_container" ]] && docker container inspect "$backup_container" >/dev/null 2>&1; then
    docker rename "$backup_container" "$container"
    docker start "$container" >/dev/null
    echo "Runner update failed; restored previous container as $container." >&2
  fi

  exit "$exit_status"
}

if ! pmset -g batt | head -n 1 | grep -q 'AC Power'; then
  echo 'Refusing to start basemodel CI runner while the Mac is not on AC power.' >&2
  exit 1
fi

mkdir -p "$state_dir"
if [[ "${BASEMODEL_CI_SUPERVISED:-0}" == "1" ]]; then
  if [[ -f "$state_dir/mode" ]] && [[ "$(<"$state_dir/mode")" == "disabled" ]]; then
    exit 0
  fi
else
  printf '%s\n' enabled > "$state_dir/mode"
fi

orbctl start >/dev/null

runner_config_sha256="$({
  shasum -a 256 \
    "$bundle_dir/Dockerfile" \
    "$bundle_dir/entrypoint.sh" \
    "$bundle_dir/job-completed.sh"
} | shasum -a 256 | awk '{print $1}')"

image_config_sha256="$(docker image inspect --format '{{index .Config.Labels "com.mykcs.basemodel.runner-config-sha256"}}' "$image" 2>/dev/null || true)"
if [[ "$image_config_sha256" != "$runner_config_sha256" ]]; then
  require_runner_idle "$runner_name"
  require_runner_idle "$legacy_runner_name"
  docker build \
    --build-arg RUNNER_VERSION=2.337.0 \
    --build-arg RUNNER_CONFIG_SHA256="$runner_config_sha256" \
    -t "$image" \
    -f "$bundle_dir/Dockerfile" \
    "$bundle_dir"
fi

desired_image_id="$(docker image inspect --format '{{.Id}}' "$image")"
if docker container inspect "$container" >/dev/null 2>&1; then
  actual_image_id="$(docker container inspect --format '{{.Image}}' "$container")"
  actual_runtime_contract="$(docker container inspect --format '{{index .Config.Labels "com.mykcs.basemodel.runner-runtime-contract"}}' "$container")"
  if [[ "$actual_image_id" != "$desired_image_id" ]] || [[ "$actual_runtime_contract" != "$runtime_contract" ]]; then
    require_runner_idle "$runner_name"
    backup_container="${container}-backup-$(date -u +%Y%m%dT%H%M%SZ)"
    trap restore_previous_container ERR
    docker stop --time 30 "$container" >/dev/null
    docker rename "$container" "$backup_container"
  fi
elif docker container inspect "$legacy_container" >/dev/null 2>&1; then
  require_runner_idle "$legacy_runner_name"
  trap restore_previous_container ERR
  docker stop --time 30 "$legacy_container" >/dev/null
fi

if ! docker container inspect "$container" >/dev/null 2>&1; then
  docker create \
    --name "$container" \
    --label "com.mykcs.basemodel.runner-runtime-contract=$runtime_contract" \
    --init \
    --cpus 4 \
    --memory 4g \
    --memory-swap 8g \
    --pids-limit 1024 \
    --shm-size 1g \
    --cap-drop ALL \
    --security-opt no-new-privileges \
    --restart no \
    --log-opt max-size=20m \
    --log-opt max-file=5 \
    "$image" >/dev/null
fi

docker start "$container" >/dev/null

if ! docker exec "$container" test -f /home/runner/actions-runner/.runner; then
  token="$(gh api --method POST repos/mykcs/basemodel/actions/runners/registration-token --jq .token)"
  docker exec -e RUNNER_TOKEN="$token" "$container" bash -lc \
    'cd /home/runner/actions-runner && ./config.sh --unattended --url https://github.com/mykcs/basemodel --token "$RUNNER_TOKEN" --name basemodel-macbook-container-v2 --labels basemodel-ci --work _work --replace'
  unset token
fi

health=starting
for _ in $(seq 1 60); do
  health="$(docker container inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' "$container")"
  if [[ "$health" == 'healthy' ]]; then
    break
  fi
  if [[ "$(docker container inspect --format '{{.State.Running}}' "$container")" != 'true' ]]; then
    echo 'Runner container exited before becoming healthy.' >&2
    exit 1
  fi
  sleep 2
done

if [[ "$health" != 'healthy' ]]; then
  echo "Runner container did not become healthy (status: $health)." >&2
  exit 1
fi

trap - ERR
echo "Runner started: $runner_name (4 CPU / 4 GB RAM + 4 GB swap / no host mounts / no Docker socket)"
