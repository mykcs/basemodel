# Open acceptance gaps and owner worklines

**Snapshot checked 2026-10-15.** Items below reflect live PR metadata at that point, not a claim that an open PR failed its tests. Recheck statuses and the current `main` before acting. This file is a router, not a second planning authority.

| Current situation | Evidence / owner | Next required check |
| --- | --- | --- |
| **Design System v1 — open and awaiting owner acceptance** | Existing [PR #806](https://github.com/mykcs/basemodel/pull/806) owns the design system; its PR report states three reference pages are candidates and **none has been owner-accepted**. | Review that PR's actual exact-head UI evidence and design references. Do not duplicate its tokens/CSS or imply it is already Production. |
| **Searchable Starlight handbook — open, not Production** | [PR #860](https://github.com/mykcs/basemodel/pull/860) implements real handbook routes but lists outstanding exact-head provider/release checks. | Let #860 finish its own implementation and acceptance. Standards stays a GitHub index until intentionally linked into a published docs experience. |
| **OpenEVO three-blog first-screen gate — open** | [PR #855](https://github.com/mykcs/basemodel/pull/855) adds geometry checks; its PR description records that full hosted/browser acceptance was not established at the described head. | Recheck latest PR head, CI and reader evidence. Do not widen viewport budgets just to obtain PASS. |
| **Scientific table HTML / CSV / LaTeX parity — Draft** | [PR #827](https://github.com/mykcs/basemodel/pull/827) owns the narrow, evidence-preserving table implementation. | Do not create a duplicate TableBuilder; re-evaluate after that PR is approved and merged. |
| **Root README release diagram — documented drift** | The current [root README](../../README.md) says generic non-main PR → Vercel Preview / GitHub Actions retired, while current [hosting authority](../agents/current/hosting-architecture.md) requires Public PR CI and selectively triggered exact-head Vercel. | Make a separate small README correction against actual hosting/source; Standards must not become deployment policy. |
| **Universal human comprehension of site pages — not verified** | [Reader Contract](../agents/current/site-reader-attention-contract.md) and [UI visual gate](../agents/current/ui-change-visual-acceptance-gate.md) provide automated proxies, not a universal reader study. | Arrange task-specific cold reads for material public research pages; capture actual misunderstandings rather than asserting whole-site comprehension. |

## Closing an entry

Re-read current PR/source/provider evidence → deliver changes in the **existing owner** → perform real tests and independent review where needed → update or remove this row with an exact accepted reference. Unknown remains unknown.

**Out of scope here:** new Design CSS, Starlight installation, public Standards route, server/GPU operations, training experiments, fabricated scientific numbers, replacement of current Agent rules, new CI pipeline or quality score.
