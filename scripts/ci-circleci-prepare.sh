#!/usr/bin/env bash
set -euo pipefail

event=""
base=""
head=""
out="${CI_RANGE_ENV_FILE:-/tmp/basemodel-ci-range.env}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --event) event="${2:-}"; shift 2 ;;
    --base) base="${2:-}"; shift 2 ;;
    --head) head="${2:-}"; shift 2 ;;
    --output) out="${2:-}"; shift 2 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

if [[ -z "$event" ]]; then
  echo "--event is required" >&2
  exit 2
fi

root="$(git rev-parse --show-toplevel)"
cd "$root"

ensure_commit() {
  local sha="$1"
  git cat-file -e "${sha}^{commit}" 2>/dev/null && return 0
  git fetch --no-tags --depth=1 origin "$sha"
  git cat-file -e "${sha}^{commit}" 2>/dev/null
}

source_head=""
tested_head=""
logical_event=""

case "$event" in
  pull_request)
    if [[ -z "$base" || -z "$head" ]]; then
      echo "pull_request requires --base and --head" >&2
      exit 2
    fi
    ensure_commit "$base"
    ensure_commit "$head"
    source_head="$head"
    git checkout --detach "$base"
    git -c user.name='CircleCI Merge Candidate' -c user.email='ci@invalid.local' \
      merge --no-ff --no-edit "$head"
    tested_head="$(git rev-parse HEAD)"
    logical_event="pull_request"
    ;;
  push)
    head="${head:-$(git rev-parse HEAD)}"
    ensure_commit "$head"
    git checkout --detach "$head"
    source_head="$head"
    if [[ -z "$base" ]]; then
      base="$(git rev-parse "${head}^" 2>/dev/null || true)"
    fi
    if [[ -z "$base" ]]; then
      echo "push comparison base could not be resolved" >&2
      exit 1
    fi
    ensure_commit "$base"
    tested_head="$head"
    logical_event="push"
    ;;
  api|workflow_dispatch)
    head="${head:-$(git rev-parse HEAD)}"
    ensure_commit "$head"
    git checkout --detach "$head"
    source_head="$head"
    git fetch --no-tags origin main
    base="$(git merge-base origin/main "$head")"
    tested_head="$head"
    logical_event="workflow_dispatch"
    ;;
  *)
    echo "unsupported event: $event" >&2
    exit 2
    ;;
esac

if [[ -n "$(git status --porcelain)" ]]; then
  echo "tested tree is unexpectedly dirty" >&2
  git status --short >&2
  exit 1
fi

mkdir -p "$(dirname "$out")"
cat > "$out" <<EOF
CI_LOGICAL_EVENT=$logical_event
CI_BASE_SHA=$base
CI_HEAD_SHA=$tested_head
CI_SOURCE_HEAD_SHA=$source_head
EOF

printf '[ci-circleci-prepare] event=%s base=%s source_head=%s tested_head=%s\n' \
  "$logical_event" "$base" "$source_head" "$tested_head"
