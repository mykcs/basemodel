#!/usr/bin/env bash
set -Eeuo pipefail

source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
state_dir="${HOME}/Library/Application Support/BasemodelCI"
libexec_dir="$state_dir/libexec"
launch_agents_dir="${HOME}/Library/LaunchAgents"
label="com.mykcs.basemodel-ci-runner"
plist="$launch_agents_dir/$label.plist"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
candidate_dir="$state_dir/libexec.pending-$timestamp"
backup_libexec=""
backup_plist=""

restore_installation() {
  local exit_status=$?
  trap - ERR
  launchctl bootout "gui/$UID/$label" >/dev/null 2>&1 || true

  if [[ -d "$libexec_dir" ]]; then
    mv "$libexec_dir" "${libexec_dir}.failed-$timestamp"
  fi
  if [[ -n "$backup_libexec" ]] && [[ -d "$backup_libexec" ]]; then
    mv "$backup_libexec" "$libexec_dir"
  fi
  if [[ -f "$plist" ]]; then
    mv "$plist" "${plist}.failed-$timestamp"
  fi
  if [[ -n "$backup_plist" ]] && [[ -f "$backup_plist" ]]; then
    mv "$backup_plist" "$plist"
    launchctl bootstrap "gui/$UID" "$plist" >/dev/null 2>&1 || true
  fi

  echo 'LaunchAgent installation failed; the previous installation was restored when available.' >&2
  exit "$exit_status"
}

install -d -m 0755 "$state_dir" "$launch_agents_dir" "$candidate_dir"
for file in Dockerfile entrypoint.sh job-completed.sh mac-orbstack-start.sh mac-orbstack-stop.sh mac-orbstack-reconcile.sh mac-orbstack-doctor.sh; do
  cp "$source_dir/$file" "$candidate_dir/$file"
done
chmod 0755 "$candidate_dir"/*.sh
for script in "$candidate_dir"/*.sh; do
  bash -n "$script"
done

pending_plist="$(mktemp "$state_dir/$label.pending.XXXXXX.plist")"
plutil -create xml1 "$pending_plist"
plutil -insert Label -string "$label" "$pending_plist"
plutil -insert ProgramArguments -array "$pending_plist"
plutil -insert ProgramArguments -append -string "$libexec_dir/mac-orbstack-reconcile.sh" "$pending_plist"
plutil -insert RunAtLoad -bool true "$pending_plist"
plutil -insert StartInterval -integer 60 "$pending_plist"
plutil -insert ProcessType -string Background "$pending_plist"
plutil -insert LowPriorityIO -bool true "$pending_plist"
plutil -lint "$pending_plist"

trap restore_installation ERR
launchctl bootout "gui/$UID/$label" >/dev/null 2>&1 || true
if [[ -d "$libexec_dir" ]]; then
  backup_libexec="${libexec_dir}.backup-$timestamp"
  mv "$libexec_dir" "$backup_libexec"
fi
if [[ -f "$plist" ]]; then
  backup_plist="${plist}.backup-$timestamp"
  mv "$plist" "$backup_plist"
fi
mv "$candidate_dir" "$libexec_dir"
mv "$pending_plist" "$plist"
launchctl bootstrap "gui/$UID" "$plist"
launchctl kickstart -k "gui/$UID/$label"
trap - ERR

echo "Installed user LaunchAgent: $label"
echo "Stable runner bundle: $libexec_dir"
