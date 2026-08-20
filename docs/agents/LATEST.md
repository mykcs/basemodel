# Latest Agent handoff

Last updated: **2026-08-18**

Status: **Current `main` includes the 2026-08-15 semantic release integration (#144), the interactive research-explainer layer (#146), the verified public-safe Lab update (#148), and the final real-browser visual closeout (#147). Vercel is the only ordinary deployment provider: non-main work uses Vercel Preview and `main` uses Vercel Production.**

## Public-release security gate

The 2026-08-20 security closeout records `PUBLIC_RELEASE_GATE=PASS` for its exact audited snapshot: all tracked-tree, collaboration-surface, all-ref/history, and public-intent gates passed with zero unresolved real secrets. The repository remains **private** and no visibility change was made.

The PASS is snapshot-bound. Any later unscanned ref or collaboration-surface change returns the release decision to HOLD until the delta is scanned. The exact evidence and decision rules live in `current/public-release-security-gate.md`.

## Current release state

The current release line is no longer the 2026-08-12 eight-PR batch alone. The accepted mainline now also contains:

- **#144 — semantic release integration:** reconciles the newer product/mobile, OpenEvo model-choice, process-visualization, visual-identity, and model-catalog work into one current release ancestry rather than mechanically choosing whole branches;
- **#146 — interactive research explainer layer:** makes the SEED, OpenEvo, benchmark, loop, lab, and reproduction surfaces static-first Astro pages with focused React interaction islands and DOM-measured responsive relationships;
- **#148 — Lab:** publishes a beginner-facing, public-safe compute-environment overview from the dated 2026-08-16 read-only audit while preserving the distinction between visible resources, allocation/authorization, technical capability, and ownership;
- **#147 — final visual closeout:** fixes the remaining rendered geometry/copy/UI regressions, preserves #148 after semantic synchronization with current `main`, and completes the real Chromium release gate without weakening geometry, overflow, contrast, privacy, or deployment-budget contracts.

The earlier 2026-08-12 integration history remains useful ancestry and rationale, but it is not the complete current-release description anymore.

## Real Chromium release acceptance

The final #147 exact-head closeout passed the repository Gate/static build and the required real Chromium UI matrix on the combined tree that already contained the Lab work.

Accepted browser coverage included:

- 390×844, 768×1024, and 1440×1000 viewports;
- light and dark states;
- responsive connector endpoint geometry and unrelated-node crossing protection;
- overflow/clipping and UI-safety checks;
- reduced-motion behavior;
- light → dark → light theme switching.

The final combined visual gate reported **14 passed**. The Lab PR separately closed its focused **12 / 12** Chromium matrix before merge. These are exact-head release acceptance records; future UI changes must run the current task-relevant browser gate again rather than treating these historical passes as proof for a changed head.

## Current architecture authority

```text
GitHub `mykcs/basemodel` = source of truth

non-main branch / PR
  -> Vercel `basemodel-preview`
  -> npm run verify:deploy && npm run build
  -> protected Preview / exact-head review

main
  -> Vercel Production
  -> https://basemodel-preview.vercel.app
```

This is the current **Vercel Preview + Vercel Production** architecture. Read `current/hosting-architecture.md` and `current/deployment-policy.md` before hosting/release changes.

Historical Cloudflare material remains legacy-only. It does not re-enter the ordinary workflow merely because fallback files or snapshots still exist.

## Current product mission

```text
Base Model
-> SEED / OpenEvo
-> ALFWorld / WebShop
-> trajectories, scores and failures
-> defensible OpenEvo improvements
```

The mission hub and child routes own the first-principles reading path. Generic site orientation remains available on catalog/decision/evidence surfaces, while mission pages avoid redundant primers.

The current research site also uses interactive explainers as a primary learning layer where they make system state, data flow, evidence, or authority relationships easier to inspect. Static semantic content remains the baseline; interaction must add understanding rather than hide required meaning behind JavaScript.

## Lab boundary

`/lab/` and `/en/lab/` currently present a public-safe view of the laboratory GPU environment grounded in the dated **2026-08-16 21:43 Asia/Shanghai** read-only audit.

Preserve these distinctions:

- visible hardware/resources are not automatically allocated or personally owned resources;
- technical capability is not authorization;
- container root is not proof of physical-host root authority;
- no detected quota is not evidence of unlimited personal storage;
- stable machine facts and dated dynamic observations must remain visibly separate;
- canonical editable machine truth belongs in the private laboratory infrastructure repository; Base Model is a public presentation layer, not a second server inventory.

Do not publish server addresses, ports, hostnames, MACs, fingerprints, GPU UUIDs, credentials, tokens, environment variables, other-user identities, other-user command lines, or private workspace paths.

## Production identity

Current canonical Production target:

`https://basemodel-preview.vercel.app`

Vercel Preview is automatically `noindex` via `VERCEL_ENV=preview`. Production is indexable and must be verified after release. An independent custom domain remains a possible future improvement, but domain purchase requires explicit spending authorization.

## Ordinary workflow

1. read this handoff + current policy and scan `scenario-trigger-registry.md`;
2. inspect overlapping PRs and decide whether work is independent, stacked, superseded, or semantically conflicting;
3. finish one coherent change or explicit release head before the first provider-triggering push;
4. publish the branch as one atomic multi-file update whenever the tool allows it;
5. inspect the exact-head Vercel Preview, repository Gate/build logs, and real routes;
6. run the focused/cross-browser UI gate when the changed surface requires it;
7. batch evidence-driven fixes into at most one normal corrective push;
8. synchronize against current `main` only when it moved materially;
9. merge the accepted release to `main` once;
10. verify the Vercel Production deployment separately;
11. report Vercel trigger counts/status, final worker-PR disposition, and Production acceptance.

A clean Git merge, READY deployment badge, or old browser PASS does not by itself prove the changed combined product is accepted.

## Vercel build budget

Default target:

```text
one coherent branch or release head
-> one atomic multi-file push
-> one initial exact-head Preview
-> at most one corrective Preview after real inspection
-> one Production build per accepted release batch
```

A build is justified by a meaningful review checkpoint, not by every file write or thought iteration. When using GitHub APIs, prefer a checked-out worktree or one Git data API commit (`blob/tree/commit/ref`) over sequential Contents API writes.

`vercel.json` and the repository-owned build classifier are executable truth for current trigger behavior. Do not restore an older broad branch-deployment rule from historical PR text. The #147 integration specifically preserved the newer build-budget policy while combining the Lab and visual-closeout work.

## Vercel-first reporting

Ordinary completion reports should lead with:

```text
Repository Gate/build
Vercel deployment triggers: total / READY / ERROR / CANCELED / ignored when known
exact-head Preview acceptance
candidate PR disposition and merge commit
Vercel Production deployment and public verification
```

Do not add Cloudflare or another legacy provider to an ordinary report merely because historical configuration or an old snapshot still exists. Mention legacy hosting only when the task explicitly concerns retirement/rollback, the legacy surface changed, or live evidence shows unexpected activity.

## Legacy hosting note — conditional only

Cloudflare Pages is a frozen legacy rollback snapshot, not an ordinary deployment stage. Historical Cloudflare material and dormant fallback scripts remain conditional evidence only. A still-connected external integration may keep an existing skip prefix as a silent safeguard, but treat it **not as a normal deployment step or completion-report line**.

Load or report legacy hosting only for an explicit rollback/retirement task or when live evidence shows unexpected legacy activity.

## Agent reading order

1. `/AGENTS.md`
2. this file
3. `current/project-agent-operating-principles.md`
4. `current/scenario-trigger-registry.md`
5. `current/product-and-research-integrity.md`
6. `current/human-thinking-web-expression-contract.md`
7. `current/ui-design-principles.md`, `current/sitewide-visual-knowledge-architecture.md`, `current/ui-change-visual-acceptance-gate.md`, and `current/theme-contrast-contract.md` for UI work
8. `current/audience-centered-technical-copy.md` for user-visible copy/onboarding/status/bilingual work
9. task-relevant mission/data/model/lab policy
10. `current/hosting-architecture.md`
11. `current/deployment-policy.md`
12. `current/repository-map.md`
13. executable source/config/tests

History is evidence, not current policy. Older material must not restore a retired provider, obsolete product hierarchy, superseded visual outcome, or a previous machine snapshot as current truth.
