#!/usr/bin/env bash
set -euo pipefail

container="basemodel-ci-runner-v2"
state_dir="${BASEMODEL_CI_STATE_DIR:-${HOME}/Library/Application Support/BasemodelCI}"
shared_state_dir="${CI_HOST_HOUSEKEEPING_STATE_DIR:-${HOME}/Library/Application Support/CIHostHousekeeping}"
container_backup_prefix="${container}-backup-"
bundle_backup_prefix="libexec.backup-"
build_cache_max_used_space="${CI_HOST_BUILD_CACHE_MAX_USED_SPACE:-6GB}"
prune_interval="${CI_HOST_BUILD_CACHE_PRUNE_INTERVAL:-21600}"
check_interval="${CI_HOST_BUILD_CACHE_CHECK_INTERVAL:-900}"
command_timeout="${CI_HOST_HOUSEKEEPING_COMMAND_TIMEOUT:-20}"
prune_timeout="${CI_HOST_BUILD_CACHE_PRUNE_TIMEOUT:-180}"
dry_run="${CI_HOST_HOUSEKEEPING_DRY_RUN:-0}"
log_tag="basemodel-ci-housekeeping"

log() { /usr/bin/logger -t "$log_tag" -- "$1"; printf '%s\n' "$1"; }

run_with_timeout() {
  local seconds="$1"; shift
  local command_pid watchdog_pid status=0
  "$@" &
  command_pid=$!
  (
    sleep "$seconds"
    if kill -0 "$command_pid" 2>/dev/null; then
      kill -TERM "$command_pid" 2>/dev/null || true
      sleep 2
      kill -KILL "$command_pid" 2>/dev/null || true
    fi
  ) &
  watchdog_pid=$!
  wait "$command_pid" || status=$?
  kill "$watchdog_pid" 2>/dev/null || true
  wait "$watchdog_pid" 2>/dev/null || true
  return "$status"
}

remove_path() {
  local path="$1"
  if [[ "$dry_run" == 1 ]]; then log "dry-run: would remove $path"; return 0; fi
  rm -rf -- "$path"
}

prune_old_container_backups() {
  local -a backups=()
  local name running listing
  if ! listing="$(run_with_timeout "$command_timeout" docker container ls -a --format '{{.Names}}')"; then
    log "warning: timed out listing runner backup containers"
    return 0
  fi
  while IFS= read -r name; do
    [[ "$name" == "$container_backup_prefix"* ]] && backups+=("$name")
  done < <(printf '%s\n' "$listing" | sort -r)
  ((${#backups[@]} <= 1)) && return 0
  for name in "${backups[@]:1}"; do
    if ! running="$(run_with_timeout "$command_timeout" docker container inspect --format '{{.State.Running}}' "$name" 2>/dev/null)"; then
      log "warning: refusing to remove backup container $name because its state could not be verified"
      continue
    fi
    if [[ "$running" == true ]]; then log "warning: refusing to remove running backup container $name"; continue; fi
    if [[ "$dry_run" == 1 ]]; then
      log "dry-run: would remove backup container $name"
    elif run_with_timeout "$command_timeout" docker container rm -- "$name" >/dev/null; then
      log "removed old backup container $name"
    else
      log "warning: failed to remove old backup container $name"
    fi
  done
}

prune_old_bundle_backups() {
  local -a backups=()
  local path base
  while IFS= read -r path; do backups+=("$path"); done < <(find "$state_dir" -mindepth 1 -maxdepth 1 -type d -name "${bundle_backup_prefix}*" -print | sort -r)
  ((${#backups[@]} <= 1)) && return 0
  for path in "${backups[@]:1}"; do
    base="$(basename "$path")"
    [[ "$base" == "$bundle_backup_prefix"* ]] || { log "warning: refusing unexpected bundle path $path"; continue; }
    remove_path "$path"
    [[ "$dry_run" == 1 ]] || log "removed old runner bundle backup $base"
  done
}

runner_busy_state() {
  local repo="$1" label="$2" state
  if ! state="$(run_with_timeout "$command_timeout" gh api "repos/$repo/actions/runners" \
    --jq "[.runners[] | select(([.labels[].name] | index(\"$label\")) != null) | select(.status == \"online\") | .busy] | if length == 0 then \"unknown\" elif any then \"busy\" else \"idle\" end" 2>/dev/null)"; then
    printf '%s\n' unknown
    return 0
  fi
  case "$state" in busy|idle|unknown) printf '%s\n' "$state" ;; *) printf '%s\n' unknown ;; esac
}

maybe_prune_build_cache() {
  local now last_check=0 last_prune=0 state lock_dir
  now="$(date +%s)"
  mkdir -p "$shared_state_dir"
  lock_dir="$shared_state_dir/lock"
  if ! mkdir "$lock_dir" 2>/dev/null; then
    local holder_pid stale_lock
    holder_pid="$(cat "$lock_dir/pid" 2>/dev/null || true)"
    if [[ "$holder_pid" =~ ^[0-9]+$ ]] && kill -0 "$holder_pid" 2>/dev/null; then
      return 0
    fi
    stale_lock="${lock_dir}.stale.$$"
    mv "$lock_dir" "$stale_lock" 2>/dev/null || return 0
    if ! mkdir "$lock_dir" 2>/dev/null; then
      mv "$stale_lock" "$lock_dir" 2>/dev/null || true
      return 0
    fi
    rm -rf -- "$stale_lock"
  fi
  printf '%s
' "$$" > "$lock_dir/pid"
  trap 'rm -f "$shared_state_dir/lock/pid" 2>/dev/null || true; rmdir "$shared_state_dir/lock" 2>/dev/null || true' EXIT
  [[ -f "$shared_state_dir/build-cache-check-epoch" ]] && last_check="$(<"$shared_state_dir/build-cache-check-epoch")"
  [[ "$last_check" =~ ^[0-9]+$ ]] || last_check=0
  (( now - last_check >= check_interval )) || return 0
  [[ "$dry_run" == 1 ]] || printf '%s\n' "$now" > "$shared_state_dir/build-cache-check-epoch"
  [[ -f "$shared_state_dir/build-cache-prune-epoch" ]] && last_prune="$(<"$shared_state_dir/build-cache-prune-epoch")"
  [[ "$last_prune" =~ ^[0-9]+$ ]] || last_prune=0
  (( now - last_prune >= prune_interval )) || return 0
  for state in \
    "$(runner_busy_state mykcs/basemodel basemodel-ci)" \
    "$(runner_busy_state mykcs/openevo-experiment openevo-mac-ci)"; do
    [[ "$state" == idle ]] || { log "build-cache prune skipped because a Mac CI runner is $state"; return 0; }
  done
  if [[ "$dry_run" == 1 ]]; then log "dry-run: would cap Docker build cache at $build_cache_max_used_space"; return 0; fi
  if run_with_timeout "$prune_timeout" docker builder prune --force --max-used-space "$build_cache_max_used_space" >/dev/null; then
    printf '%s\n' "$now" > "$shared_state_dir/build-cache-prune-epoch"
    log "Docker build cache capped at $build_cache_max_used_space"
  else
    log "warning: Docker build-cache prune failed or timed out"
  fi
}

orbctl status >/dev/null 2>&1 || exit 0
mkdir -p "$state_dir"
prune_old_container_backups
prune_old_bundle_backups
maybe_prune_build_cache
