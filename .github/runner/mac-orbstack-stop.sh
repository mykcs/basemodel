#!/usr/bin/env bash
set -euo pipefail
container="basemodel-ci-runner"
if docker container inspect "$container" >/dev/null 2>&1; then
  docker stop "$container" >/dev/null
  echo 'basemodel CI runner stopped.'
else
  echo 'basemodel CI runner is not installed.'
fi
