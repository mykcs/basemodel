#!/usr/bin/env bash
set -euo pipefail

workspace_root='/home/runner/actions-runner/_work'
workspace="${GITHUB_WORKSPACE:-}"

if [[ -z "$workspace" ]]; then
  echo 'GITHUB_WORKSPACE is unset; refusing cleanup.' >&2
  exit 1
fi

resolved_root="$(realpath -m "$workspace_root")"
resolved_workspace="$(realpath -m "$workspace")"

if [[ "$resolved_workspace" == "$resolved_root" || "$resolved_workspace" != "$resolved_root/"* ]]; then
  echo "Refusing cleanup outside a repository workspace: $resolved_workspace" >&2
  exit 1
fi

if [[ ! -d "$resolved_workspace" ]]; then
  exit 0
fi

timeout --signal=TERM 120s \
  find "$resolved_workspace" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
