#!/usr/bin/env python3
import json
import sys
from pathlib import Path

REQUIRED_POSITIVE = ("completed_skills", "parse_ok_skills", "sft_records")


def check(path: Path) -> bool:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"FAIL {path}: cannot read progress.json ({exc})")
        return False

    completed = data.get("completed_rollouts")
    expected = data.get("expected_rollouts")
    problems = []

    if not isinstance(completed, (int, float)) or not isinstance(expected, (int, float)):
        problems.append("completed_rollouts / expected_rollouts missing")
    elif completed != expected or expected <= 0:
        problems.append(f"rollouts incomplete: {completed}/{expected}")

    for key in REQUIRED_POSITIVE:
        value = data.get(key)
        if not isinstance(value, (int, float)) or value <= 0:
            problems.append(f"{key} is not > 0 (got {value!r})")

    status = data.get("status")
    if status in {"failed", "error"}:
        problems.append(f"status={status}")

    if problems:
        print(f"FAIL {path}")
        for problem in problems:
            print(f"  - {problem}")
        return False

    print(f"PASS {path}")
    print(f"  rollouts={completed}/{expected}")
    for key in REQUIRED_POSITIVE:
        print(f"  {key}={data[key]}")
    return True


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: seed-stage1-check.py <progress.json> [progress.json ...]", file=sys.stderr)
        return 2

    paths = [Path(value) for value in sys.argv[1:]]
    ok = True
    for path in paths:
        if not path.exists():
            print(f"FAIL {path}: file not found")
            ok = False
            continue
        ok = check(path) and ok

    print("\nRESULT: PASS" if ok else "\nRESULT: FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
