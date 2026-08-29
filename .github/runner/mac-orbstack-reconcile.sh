#!/usr/bin/env bash
set -euo pipefail

container="basemodel-ci-runner-v2"
legacy_container="basemodel-ci-runner"
state_dir="${BASEMODEL_CI_STATE_DIR:-${HOME}/Library/Application Support/BasemodelCI}"
bundle_dir="${RUNNER_BUNDLE_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
log_tag="basemodel-ci-runner"
failure_epoch_file="$state_dir/reconcile-failure-epoch"
backoff_seconds=900
disk_warning_epoch_file="$state_dir/disk-warning-epoch"
disk_warning_interval=21600

log() {
  /usr/bin/logger -t "$log_tag" -- "$1"
}

mkdir -p "$state_dir"
now_epoch="$(date +%s)"
available_percent="$(df -Pk "$HOME" | awk 'NR == 2 {gsub(/%/, "", $5); print 100 - $5}')"
if [[ -n "$available_percent" ]] && [[ "$available_percent" -lt 15 ]]; then
  last_disk_warning_epoch=0
  if [[ -f "$disk_warning_epoch_file" ]]; then
    last_disk_warning_epoch="$(<"$disk_warning_epoch_file")"
  fi
  if [[ ! "$last_disk_warning_epoch" =~ ^[0-9]+$ ]] \
    || (( now_epoch - last_disk_warning_epoch >= disk_warning_interval )); then
    log "warning: Mac disk availability is ${available_percent}%; no automatic prune was attempted"
    printf '%s\n' "$now_epoch" > "$disk_warning_epoch_file"
  fi
fi

power_line="$(pmset -g batt | head -n 1)"
if ! printf '%s\n' "$power_line" | grep -q 'AC Power'; then
  if orbctl status >/dev/null 2>&1; then
    for managed_container in "$container" "$legacy_container"; do
      if docker container inspect "$managed_container" >/dev/null 2>&1 \
        && [[ "$(docker container inspect --format '{{.State.Running}}' "$managed_container")" == 'true' ]]; then
        docker stop --time 30 "$managed_container" >/dev/null
        log "runner container $managed_container stopped because AC power is unavailable"
      fi
    done
  fi
  exit 0
fi

if [[ -f "$state_dir/mode" ]] && [[ "$(<"$state_dir/mode")" == 'disabled' ]]; then
  exit 0
fi

if [[ -f "$failure_epoch_file" ]]; then
  last_failure_epoch="$(<"$failure_epoch_file")"
  if [[ "$last_failure_epoch" =~ ^[0-9]+$ ]] && (( now_epoch - last_failure_epoch < backoff_seconds )); then
    exit 0
  fi
fi

health=missing
if orbctl status >/dev/null 2>&1 && docker container inspect "$container" >/dev/null 2>&1; then
  health="$(docker container inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' "$container")"
fi

if [[ "$health" == 'healthy' ]]; then
  exit 0
fi

if BASEMODEL_CI_SUPERVISED=1 \
  BASEMODEL_CI_STATE_DIR="$state_dir" \
  RUNNER_BUNDLE_DIR="$bundle_dir" \
  "$bundle_dir/mac-orbstack-start.sh"; then
  printf '%s\n' 0 > "$failure_epoch_file"
  log "runner reconciled from health state: $health"
else
  printf '%s\n' "$now_epoch" > "$failure_epoch_file"
  log "runner reconciliation deferred or failed from health state: $health"
  exit 1
fi
