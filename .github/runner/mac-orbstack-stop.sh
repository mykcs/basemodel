#!/usr/bin/env bash
set -euo pipefail

state_dir="${BASEMODEL_CI_STATE_DIR:-${HOME}/Library/Application Support/BasemodelCI}"
containers=(basemodel-ci-runner-v2 basemodel-ci-runner)
runner_names=(basemodel-macbook-container-v2 basemodel-macbook-container)
running_indexes=()

mkdir -p "$state_dir"
printf '%s\n' disabled > "$state_dir/mode"

for index in 0 1; do
  container="${containers[$index]}"
  runner_name="${runner_names[$index]}"
  if docker container inspect "$container" >/dev/null 2>&1 \
    && [[ "$(docker container inspect --format '{{.State.Running}}' "$container")" == 'true' ]]; then
    running_indexes+=("$index")
    if ! busy="$(gh api repos/mykcs/basemodel/actions/runners \
      --jq ".runners[] | select(.name == \"$runner_name\") | .busy" 2>/dev/null)"; then
      echo 'Refusing to stop runners because GitHub availability could not be verified.' >&2
      exit 1
    fi
    if [[ "$busy" == 'true' ]]; then
      echo "Refusing to stop runner $runner_name while a GitHub Actions job is active." >&2
      exit 1
    fi
  fi
done

if [[ "${#running_indexes[@]}" -eq 0 ]]; then
  echo 'No basemodel CI runner is running; automatic starts are disabled.'
  exit 0
fi

for index in "${running_indexes[@]}"; do
  docker stop --time 30 "${containers[$index]}" >/dev/null
done
echo 'basemodel CI runners stopped; automatic restarts are disabled.'
