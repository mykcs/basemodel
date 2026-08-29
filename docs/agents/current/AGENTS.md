# Agent instructions for `docs/agents/current/`

These instructions supplement the repository-root `AGENTS.md` for this directory.

## Frozen experiment fact records

`minimax-h146-frozen-facts-2026-08-30.md` is an **immutable historical fact record**.

Agents MUST NOT edit, reformat, rename, delete, refresh prices inside, or silently correct this file in place.

If new evidence changes any recorded fact:

1. leave the frozen file byte-for-byte intact;
2. create a new dated superseding fact record;
3. name the predecessor and list old value → new value with evidence;
4. update living analysis and user-facing pages to point at the superseding record;
5. preserve the old record as historical evidence.

The companion `minimax-h146-teacher-intelligence-cost-analysis.md` is a living analysis and may evolve, but it must never overwrite the frozen record's measured H1.46 facts. Unknown current-model rankings/prices must remain unknown until first-party evidence or a controlled benchmark is available.
