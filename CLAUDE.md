@AGENTS.md

# Claude Code-specific notes

The imported `AGENTS.md` is the provider-neutral repository contract. Keep this file as a thin Claude adapter rather than a second copy of Preview, Production, validation or collaboration policy.

For non-trivial work, follow the current paths routed from `AGENTS.md`, especially `docs/agents/LATEST.md`, the task-relevant files under `docs/agents/current/`, `package.json`, and `vercel.json`.

Claude-local/global helpers may be used when available, but they are not repository dependencies and remote Agents must not invent them.
