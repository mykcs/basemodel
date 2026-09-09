# Conversation lessons closeout — BaseModel entrypoint

Status: **navigation-only compatibility entrypoint**
Local repository: `mykcs/basemodel`
Canonical protocol: `mykcs/openevo-experiment/docs/operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md`

This file intentionally does **not** copy the protocol body. The mutable closeout rules have one authority only: the current `main` version in `mykcs/openevo-experiment`.

When a BaseModel conversation invokes this path:

1. fetch and read the canonical protocol from `mykcs/openevo-experiment` at current `main`;
2. then use BaseModel root `AGENTS.md`, `docs/agents/README.md`, the scenario registry, and the task-owning current policy to choose BaseModel destinations;
3. update existing BaseModel owners/tests/history instead of creating duplicate rule sources;
4. keep temporary PR heads, Preview URLs, PIDs, ports, worktree paths, live provider state, and experiment progress out of standing policy;
5. report repository state literally: branch/commit/PR/`main` are different completion states.

This entrypoint does not authorize merge, deployment, experiment mutation, cleanup, deletion, or any other action forbidden by the canonical closeout protocol.
