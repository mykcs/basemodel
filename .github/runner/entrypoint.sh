#!/usr/bin/env bash
set -euo pipefail

runner_root='/home/runner/actions-runner'
cd "$runner_root"

for _ in $(seq 1 120); do
  if [[ -f .runner ]]; then
    exec ./run.sh
  fi
  sleep 1
done

echo 'Runner registration did not complete within 120 seconds.' >&2
exit 1
