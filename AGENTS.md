# Repository Agent instructions

## Historical Codex dialogue archive

When prior product, deployment, or research-workbench decisions are relevant,
consult the private [basemodel dialogue archive](https://github.com/mykcs/Codex-Dialogue/tree/main/projects/basemodel).
It is historical evidence only and never overrides current task instructions,
executable repository truth, or live provider state.

This repository is frequently maintained by coding Agents through GitHub. This root `AGENTS.md` is the **unique repository-root Agent bootstrap authority** and the first repository file an Agent reads. Detailed topic policy belongs under `docs/agents/current/`; `docs/agents/README.md` is navigation-only and must not become a second mutable copy of Agent rules.

## Product wish authority

Before any user-facing product, copy, navigation, information-architecture, page-role, or major interaction decision, read [`docs/wish/LATEST.md`](docs/wish/LATEST.md).

- For homepage, navigation, information architecture, major route-role, interaction, or product-direction changes, also read [`docs/wish/DESIGN.md`](docs/wish/DESIGN.md).
- Do **not** read [`docs/wish/ARCHIVE.md`](docs/wish/ARCHIVE.md) by default. Use it only to trace why an older product intent differed or when the owner explicitly asks about historical intent.
- Shared Wish lifecycle/update rules are owned by https://github.com/mykcs/.agents/blob/main/docs/agents/WISH_PROTOCOL.md; [`docs/wish/README.md`](docs/wish/README.md) is a local navigation entrypoint only.
- Current owner instructions, scientific/factual authority, research-integrity rules, security boundaries, tests, and live provider truth outrank the wish. The wish decides what the product should become; it never rewrites sealed results or evidence.

`docs/wish/` is the high-level product-intent owner. Existing current policies such as `product-and-research-integrity.md`, the SEED × OpenEvo research mission, reader contracts, and UI/engineering standards keep their narrower responsibilities. Do not copy the wish text into those files or back into this root bootstrap.

## Current development direction

For implementation, read [`docs/dev/LATEST.md`](docs/dev/LATEST.md). For CI, hosting, runner, or release changes, also read [`docs/dev/DESIGN.md`](docs/dev/DESIGN.md), then the existing current owners routed by [`docs/dev/README.md`](docs/dev/README.md), executable configuration, and live provider state. Consult [`docs/dev/ARCHIVE.md`](docs/dev/ARCHIVE.md) only for a replaced direction. The shared lifecycle is owned by https://github.com/mykcs/.agents/blob/main/docs/agents/DEV_PROTOCOL.md; Dev explains choices without replacing `docs/agents/current/` or the required checks.

## Central website learning

For every user-facing website copy task, read the current shared human-expression standard before the first substantial draft:

- https://github.com/mykcs/.codex/blob/main/website-governance/HUMAN_EXPRESSION_STANDARD.md

When prior owner feedback or failure-family evidence matters, also read:

- https://github.com/mykcs/.agents/blob/main/docs/learning/shared/content/HUMAN_EXPRESSION.md

For BaseModel-specific research-archive roles, OpenEVO/SEED research framing, or returning-researcher context, also read the site-specific learned experience:

- https://github.com/mykcs/.agents/tree/main/docs/learning/projects/basemodel

This site-specific learning is evidence/interpretation only. Current BaseModel Wish, Reader Contracts, scientific authority, source, and tests remain the project-side truth.

For material design decisions, read the shared semantic web-expression / information-flow lens first:

- https://github.com/mykcs/myk-skills/blob/main/website-improve/references/human-thinking-web-expression.md

When prior owner feedback or design failure evidence matters, also read:

- https://github.com/mykcs/.agents/blob/main/docs/learning/shared/design/LEARNED_PREFERENCES.md

For material website-engineering work, read the current shared Engineering Standard first:

- https://github.com/mykcs/.codex/blob/main/website-governance/ENGINEERING_STANDARD.md

When prior engineering failures/evidence matter, also read:

- https://github.com/mykcs/.agents/blob/main/docs/learning/shared/engineering/LEARNED_PRACTICES.md
- https://github.com/mykcs/.agents/tree/main/docs/learning/projects/basemodel

Direct owner feedback and conversation closeout are centralized in `.agents/docs/learning`. BaseModel owns its current Wish, scientific/product authority, Reader Contracts, source audits, browser tests, and route-specific guards. It no longer owns a second dynamic preference model/retrieval engine. Central preference evidence never overrides scientific/factual/security truth.

## Fast start

After this root bootstrap, use progressive disclosure instead of loading every policy:

1. [`docs/agents/README.md`](docs/agents/README.md) — task router.
2. [`docs/agents/LATEST.md`](docs/agents/LATEST.md) — current handoff/state.
3. [`docs/agents/current/project-agent-operating-principles.md`](docs/agents/current/project-agent-operating-principles.md) — autonomy, tool and write-hygiene rules.
4. [`docs/agents/current/scenario-trigger-registry.md`](docs/agents/current/scenario-trigger-registry.md) — load only the matched scenario bundle.
5. For CI/hosting/release work, read [`docs/agents/current/hosting-architecture.md`](docs/agents/current/hosting-architecture.md) and [`docs/agents/current/deployment-policy.md`](docs/agents/current/deployment-policy.md).
6. Finish with the relevant source/config/tests and live provider or experiment truth.

### Pre-mutation guards

- If a compound command depends on Bash semantics, use `/bin/bash` explicitly before the first compound call.
- Before branch/PR work, read `current/branch-and-pr-conventions.md`, inspect overlapping PRs, and preserve unrelated work.
- Repeated corrections must resolve the real semantic owner/invariant before another compensating patch.
- Shared-server/GPU/storage actions remain governed by the current server/experiment authority; branch names never grant execution or cleanup permission.
- Current/latest scientific or provider claims require fresh evidence from their owning repository/provider.
- Private → public changes require `current/public-release-security-gate.md`; secrets and private infrastructure stay fail-closed.

## Knowledge precedence

Current owner instruction > live provider state for provider claims > executable repository/scientific authority > current project policy > `docs/agents/LATEST.md` > history. If prose disagrees with executable/live truth, repair the stale projection instead of adding another policy layer.

## Current product mission and deployment

BaseModel is a research decision system connecting Base Model → SEED/OpenEvo ‒ ALFWorld/WebShop → trajectories, scores, failures and defensible improvements. Preserve Learn / Run / Compare as distinct modes and keep each benchmark's metric semantics separate.

```text
ordinary PR
  -> required Public PR CI (`public-ci-gate`)
  -> deterministic validation + risk-based browser coverage

final current-base candidate
  -> `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>`
  -> exact-head Vercel provider gate

main
  -> Vercel Production
  -> https://basemodel-preview.vercel.app
```

**Vercel is the only ordinary deployment provider and required final-candidate authority.** Public GitHub-hosted Actions is the ordinary automatic PR preflight compute lane. CircleCI and the Mac/OrbStack runner are explicit manual fallbacks; historical Cloudflare material is legacy/rollback evidence, not a normal release stage.

Agent-control/docs-only changes are not website-production inputs. A provider `IGNORED`/`CANCELED` record is not publication evidence.

## Repository map

```text
src/                     production application/content/domain logic
public/                  production static assets
scripts/                 build/validation/audit helpers
tests/e2e/                browser regression tests
docs/wish/                current product intent
docs/dev/                 current development direction
docs/agents/README.md    task router
docs/agents/LATEST.md    current handoff
docs/agents/current/     current policies/runbooks
docs/agents/history/      historical evidence
vercel.json              provider contract
package.json             executable validation/build entrypoints
```

Generated output, archived fixtures and Agent scratch state are not production source.

## Validation and delivery

For ordinary deployable changes:

```bash
npm run verify:deploy
npm run build
```

For material UI/theme/layout/responsive/navigation changes, follow the UI acceptance policy and run the strongest relevant browser gate (`npm run test:ui`, or `npm run test:ui:all` for shared/global work).

Normal flow: read current owners → inspect overlapping work/executable truth → make one coherent change → validate → push one coherent PR update → request the persistent exact-head Vercel gate only for the final candidate → inspect Preview → merge once → verify Production separately. A clean merge, green status, or READY deployment alone does not prove combined-product acceptance.

## Vercel build-budget boundary

Vercel builds are finite resources. Ordinary working pushes should spend zero Vercel build compute; reuse the same PR for corrections, move the existing persistent final-gate ref only when the exact candidate is ready, and aim for one accepted Production build per release batch. Do not create noop/provider-wakeup commits or use provider-triggering refs as scratch space.

## Product / research invariants

- Unknown remains unknown; claims never exceed evidence.
- Strict reproduction, method reproduction and modern rerun are distinct.
- Open weights are not automatically open source or unrestricted licensing.
- Heuristic estimates, catalog tiers and measured hardware results are different evidence levels.
- Current/latest/full-family claims require current first-party verification.
- “Done” means wired into the real user path and protected by the required checks.
- Visuals must externalize useful structure/evidence/action, not exist as decoration.
- UI completion includes dark/light, responsive, overlap/clipping and changed-route browser acceptance.

## Stable technical constraints

Preserve Vercel Preview `noindex`, Production canonical/hreflang identity, repository Node/tooling targets, and the fail-closed Public Release Security Gate. Framework-major migrations and retired hosting/CI infrastructure require an explicit architecture decision.

## Startup-visible contract routes

- Every user-facing page treats `human-thinking-web-expression-contract.md` as **mandatory for every user-facing page**; also route material UI work through `ui-design-principles.md` and `sitewide-visual-knowledge-architecture.md`.
- Research publication/analysis work must keep `research-site-presentation-contract.md`, `site-reader-attention-contract.md`, and `research-result-reading-contract.md` directly discoverable from this root.
- For non-trivial work, scan scenario-trigger-registry; repeat-correction work uses `REPEAT-CORRECTION` and `project-agent-operating-principles.md#correction-to-action-witness`.
- **Provider writes are noun-bound at dispatch:** `open PR -> create_pull_request`; file/ref/branch mutation is not an acceptable substitute.
- **Before the first compound shell call**, select `/bin/bash` when Bash syntax is required; The requested shell is not execution proof, so verify the interpreter that actually launched.
- Multi-PR releases follow the `parallel/stacked integration policy`; Ordinary completion reports are **Vercel-first** and still separate source, exact-head acceptance, merge, and Production.
- LYG2171 public ownership has moved to fuhuo: public users go to https://fuhuo-20260419.vercel.app/docs/machines and https://fuhuo-20260419.vercel.app/docs/server-governance. BaseModel exposes only a generic public topology and must not receive new live LYG2171 facts.

## Collaboration and documentation

Use connected repository/provider evidence end to end; do not make the owner relay information the Agent can retrieve. Human intervention is for genuine authorization/2FA/CAPTCHA/billing boundaries, irreversible/high-risk actions, or subjective product decisions.

Update `docs/agents/LATEST.md` when current state changes, and update the single owning file under `docs/agents/current/` when architecture/validation/deployment/evidence semantics change. Keep detailed policy out of this root bootstrap.
