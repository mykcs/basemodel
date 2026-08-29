#!/usr/bin/env bash
set -euo pipefail

container="basemodel-ci-runner-v2"
runner_name="basemodel-macbook-container-v2"
legacy_container="basemodel-ci-runner"
legacy_runner_name="basemodel-macbook-container"
label="com.mykcs.basemodel-ci-runner"

printf 'Power: %s\n' "$(pmset -g batt | head -n 1 | sed 's/^[[:space:]]*//')"
printf 'Disk available: %s\n' "$(df -h "$HOME" | awk 'NR == 2 {print $4 " (" $5 " used)"}')"

if ! orbctl status >/dev/null 2>&1; then
  printf 'OrbStack: stopped\n'
  exit 1
fi
printf 'OrbStack: running\n'

if ! docker container inspect "$container" >/dev/null 2>&1; then
  if docker container inspect "$legacy_container" >/dev/null 2>&1; then
    container="$legacy_container"
    runner_name="$legacy_runner_name"
    printf 'Fallback: inspecting preserved legacy runner\n'
  else
    printf 'Container: missing\n'
    exit 1
  fi
fi

docker container inspect --format \
  'Container: {{.State.Status}} / health={{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}} / image={{.Config.Image}}' \
  "$container"
docker container inspect --format \
  'Limits: memory={{.HostConfig.Memory}} memory+swap={{.HostConfig.MemorySwap}} nano_cpus={{.HostConfig.NanoCpus}} pids={{.HostConfig.PidsLimit}} shm={{.HostConfig.ShmSize}} restart={{.HostConfig.RestartPolicy.Name}}' \
  "$container"
docker container inspect --format \
  'Isolation: privileged={{.HostConfig.Privileged}} cap_drop={{json .HostConfig.CapDrop}} security={{json .HostConfig.SecurityOpt}} mounts={{len .Mounts}} ports={{json .HostConfig.PortBindings}}' \
  "$container"

peak_bytes="$(docker exec "$container" sh -lc 'cat /sys/fs/cgroup/memory.peak 2>/dev/null || true')"
oom_kills="$(docker exec "$container" sh -lc "awk '\$1 == \"oom_kill\" {print \$2}' /sys/fs/cgroup/memory.events 2>/dev/null || true")"
printf 'Cgroup: memory_peak_bytes=%s oom_kill=%s\n' "${peak_bytes:-unknown}" "${oom_kills:-unknown}"

gh api repos/mykcs/basemodel/actions/runners \
  --jq ".runners[] | select(.name == \"$runner_name\") | \"GitHub: status=\\(.status) busy=\\(.busy) labels=\\([.labels[].name] | join(\",\"))\""
latest_version="$(gh api repos/actions/runner/releases/latest --jq '.tag_name')"
installed_version="$(docker exec "$container" /home/runner/actions-runner/bin/Runner.Listener --version 2>/dev/null || true)"
printf 'Runner release: installed=%s latest=%s\n' "${installed_version:-unknown}" "$latest_version"

if launchctl print "gui/$UID/$label" >/dev/null 2>&1; then
  printf 'LaunchAgent: loaded\n'
else
  printf 'LaunchAgent: not loaded\n'
  exit 1
fi
