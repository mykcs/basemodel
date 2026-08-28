#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
image="basemodel-ci-runner:node24-pwdeps-1.62.1"
container="basemodel-ci-runner"
runner_name="basemodel-macbook-container"

if ! pmset -g batt | head -n 1 | grep -q 'AC Power'; then
  echo 'Refusing to start basemodel CI runner while the Mac is on battery power.' >&2
  exit 1
fi

orbctl start >/dev/null

docker build \
  --build-arg RUNNER_VERSION=2.337.0 \
  -t "$image" \
  -f "$repo_root/.github/runner/Dockerfile" \
  "$repo_root/.github/runner"

if ! docker container inspect "$container" >/dev/null 2>&1; then
  docker create \
    --name "$container" \
    --cpus 4 \
    --memory 8g \
    --pids-limit 1024 \
    --shm-size 1g \
    --security-opt no-new-privileges \
    "$image" >/dev/null
fi

docker start "$container" >/dev/null

if ! docker exec "$container" test -f /home/runner/actions-runner/.runner; then
  token="$(gh api --method POST repos/mykcs/basemodel/actions/runners/registration-token --jq .token)"
  docker exec -e RUNNER_TOKEN="$token" "$container" bash -lc \
    'cd /home/runner/actions-runner && ./config.sh --unattended --url https://github.com/mykcs/basemodel --token "$RUNNER_TOKEN" --name basemodel-macbook-container --labels basemodel-ci --work _work --replace'
  unset token
fi

if ! docker exec "$container" bash -lc "ps -ef | grep -q '[R]unner.Listener'"; then
  docker exec "$container" bash -lc \
    'cd /home/runner/actions-runner && nohup ./run.sh >>runner.log 2>&1 </dev/null >/dev/null 2>&1 &'
fi

sleep 2
docker exec "$container" tail -n 12 /home/runner/actions-runner/runner.log 2>/dev/null || true
echo "Runner started: $runner_name (4 CPU / 8 GB / no host mounts / no Docker socket)"
