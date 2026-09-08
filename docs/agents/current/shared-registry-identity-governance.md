# Shared registry identity governance

Status: **CURRENT**

This policy owns durable identity allocation for manually numbered shared registries: case libraries, ADR/incident/rule IDs, numbered evidence records, and similar append-only indexes maintained by multiple branches or Agents.

## Core rule

A branch-local identifier is **provisional until integration**. `max + 1` on one branch is not a global allocator while another writer can advance the same registry.

Before assigning or publishing a durable ID:

1. read the exact current base and relevant overlapping PRs/branches;
2. distinguish the record's semantic identity from its provisional number;
3. inspect the combined candidate tree for duplicate IDs, duplicate explicit anchors, and references that still point at an old identity;
4. preserve every still-valid factual record when a collision exists;
5. renumber the later/coherent block and migrate its live references instead of deleting another writer's record or replaying a stale numbering scheme;
6. re-run the uniqueness check after `main` moves or another overlapping registry change lands.

If uniqueness is mechanically checkable, enforce it in the normal repository Gate. A prose warning is not enough for a failure class caused by concurrent integration.

## Historical truth and references

Do not rewrite old incident text merely to make today's numbering look tidy. Historical files may state the identifier that existed at the time, but they must mark it as historical when it no longer matches current authority. Current docs and executable references must resolve against the integrated current tree.

A merge conflict in a registry is not evidence that one record is obsolete. `ours`, `theirs`, a force-push, or taking an old branch wholesale is invalid unless semantic review proves the discarded material is genuinely superseded.

## What this rule does not govern

PR heads, temporary ports, current PIDs, current provider status, GPU occupancy, current round/percentage, and other short-lived state are not durable registry identities. Do not invent permanent IDs for transient state merely to make bookkeeping convenient.

## BaseModel use-site

`docs/agents/current/website-copy-cases.md` is currently protected by `src/lib/websiteCopyCaseIdGovernance.test.ts`. When that test reports a duplicate, resolve identity on the integrated candidate tree first; do not weaken the test or restore an older branch-local numbering plan.

For the incident that motivated this guard, see `docs/agents/history/2026-09-08-case-id-registry-collision-retrospective.md`.
