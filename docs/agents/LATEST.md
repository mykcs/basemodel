# Latest Agent handoff

Last updated: **2026-08-10 02:12 +08:00**

Status: **The 2026-08-10 model-catalog audit is merged and its durable verification/evidence contract is now captured for future Agents; the SEED end-to-end guide remains current and GitHub -> Cloudflare Pages remains the steady-state architecture.**

This is the stable first-stop file for future coding Agents. Read it before historical migration notes.

## Current deployment state

- Source of truth: GitHub `mykcs/basemodel`.
- Hosting/build: Cloudflare Pages project `basemodel`.
- Production branch: `main`.
- Cloudflare build command: `npm run build:cloudflare`.
- Build output: `dist`.
- Cloudflare Root directory: repository root.
- GitHub Actions and GitHub Pages are intentionally retired.

## Agent reading order

1. `/AGENTS.md`
2. `docs/agents/LATEST.md`
3. `docs/agents/current/product-and-research-integrity.md`
4. `docs/agents/current/model-catalog-verification-policy.md`
5. `docs/agents/current/seed-guided-research-workflow.md`
6. `docs/agents/current/deployment-policy.md`
7. `docs/agents/current/repository-map.md`
8. `docs/agents/current/rendering-and-performance-policy.md`
9. `docs/agents/current/cloudflare-pages-deployment.md`
10. `package.json` and task-specific source files

The product/research-integrity document is required reading before broad UI, data-model, recommendation, evidence or framework changes. The model-catalog verification document is required reading before broad current-model/family audits, vendor-catalog refreshes or changes to model evidence semantics. The SEED workflow document is required reading before changing the onboarding/guide path, paper-to-model research journey, Workspace/Compare teaching flow or related URL contracts.

## Model catalog verification contract now captured in-repo

Durable model/family verification guidance is in:

`docs/agents/current/model-catalog-verification-policy.md`

The baseline audit was implemented through **PR #77 — `data: audit current model catalog as of 2026-08-10`**.

Final PR head:

`c6b968fdb8eee92b84a20b3361a39a5e1df8822f`

Cloudflare Pages reported **Deploy successful** for that exact Preview head.

PR #77 was squash-merged to `main` as:

`53e94579496cedfafa22c4cbdf6a4791e4971628`

Important interpretation for future Agents:

- “latest model” is not one scalar: latest hosted/API generation, latest open-weight generation, latest base checkpoint, latest specialized checkpoint and latest research-usable checkpoint can differ;
- family coverage and individual model files must both be audited because either side can be incomplete or stale;
- provider API slugs belong in `variants[].api_aliases` / model `access.api_model_ids`; family `current_api_model_ids` must use repository model IDs;
- an old API slug redirecting to a newer model does not mean the old model remains callable;
- downloadable weights do not automatically mean open source, unrestricted derivatives, commercial use or fine-tuning permission;
- concrete critical fields should have field-level `sources[].supports` evidence, not merely a page-level source list;
- unknown facts must not be replaced by guessed hardware tiers, runtime support, training support or product availability;
- production model data should use precise semantic states such as `not_reported`, `not_disclosed`, `not_published`, `not_applicable` or `unavailable` when appropriate;
- `npm run audit:semantic` intentionally rejects legacy `not_verified` values in production JSON; the 2026-08-10 audit hit this Gate and fixed the data rather than weakening the audit;
- future “today/latest/current/full family” requests require fresh first-party verification even if the 2026-08-10 baseline looked complete.

The 2026-08-10 baseline corrected or expanded Qwen, Gemini, Gemma, Claude, DeepSeek, Kimi, Meta Muse, Mistral, GPT and Grok coverage, and refreshed vendor catalog entrypoints. See the dedicated policy file for the exact durable lessons and baseline details.

Deployment evidence boundary: the session proved exact-head Cloudflare Preview success and the GitHub merge SHA. The available tools did not expose an authoritative Cloudflare Production-deployment-to-Git-SHA lookup. Do not cite a bare production HTTP 200 as independent proof that a particular Git SHA is live.

## SEED guided research workflow now captured in-repo

Durable workflow guidance is in:

`docs/agents/current/seed-guided-research-workflow.md`

The underlying product change was merged through **PR #72 — `docs(guide): teach Basemodel end to end with SEED`** as squash commit:

`8130066f9bff2ea322647a2fd0e8cc81d87f2531`

Important interpretation for future Agents:

- the SEED work did **not** create every research feature from scratch;
- model/paper exploration, Quick View, Families/Landscape, Workspace, Compare, Decision Memo/snapshots, evidence/data-status, bilingual routes, theme and URL-shareable state largely already existed;
- the new value is the coherent bilingual walkthrough that connects those capabilities into a real paper-driven research decision process;
- the guide uses SEED as a worked example, not as a universal assumption for all papers;
- strict reproduction, method reproduction and modern rerun must remain separate;
- “newer model” must not be treated as an automatic paper-model replacement;
- downloadable/callable does not automatically mean reproducible;
- local projects/snapshots/share URLs are not account-backed cloud storage or team collaboration.

Canonical SEED workflow routes currently include:

```text
/papers/seed/
/models/qwen2-5-3b-instruct/
/models/?q=qwen2.5&rl=true&paperUse=true
/workspace/?v=2&mode=method&paper=seed&model=qwen2-5-3b-instruct&role=actor&roles=actor%2Canalyzer&update=rl&access=local&runtime=verl&open=1
/compare/?models=qwen2-5-3b-instruct,qwen3-1-7b&diff=1&impact=1
```

`src/components/GuideContent.test.ts` protects the core route/terminology contract. If these URLs or state contracts change, update the guide and test together.

Deployment evidence from the original SEED session has an explicit boundary: Cloudflare Preview successfully built a commit containing the tutorial component, and the final PR was merged to `main`; however the tools available during that session did not expose a direct Cloudflare Production-deployment-to-Git-SHA lookup. Do not cite the earlier Preview or a bare production HTTP 200 as independent proof of the exact final Production SHA.

## Product north star now captured in-repo

The durable contract is in:

`docs/agents/current/product-and-research-integrity.md`

Key rules:

- this project is a **research decision system**, not merely a model database or leaderboard;
- the core job is to narrow feasible model candidates for a concrete research task and produce an evidence-backed, reproducible selection rationale;
- strict reproduction, method reproduction and modern rerun are distinct modes and can yield different model recommendations;
- recommendation output should expose feasibility, research fit, comparability, reproducibility and evidence quality rather than hide everything behind one score;
- unknown does not mean false/zero/absent;
- open weights does not mean open source and must remain separate from license/derivative/commercial rights;
- release dates/model IDs must never be fabricated into reproducible model revisions;
- paper method summaries must not be synthesized from model-selection rationale;
- hardware catalog tiers, heuristic VRAM estimates and measured hardware results are separate evidence levels;
- Claim -> Evidence links are preferred over treating a page-level source list as proof for every field;
- active Research Task / candidate / compare state is cross-page product state;
- “done” means wired into a real user path and protected by acceptance tests, not merely that a component or helper file exists;
- account login, cross-device cloud save, team collaboration and other server-owned capabilities remain explicit external boundaries until real services exist.

Future Agents should update this contract only when the product/research methodology actually changes.

## V2 adversarial closeout

PR: **#67 — V2 adversarial closeout: finish remaining research-workbench gaps**

Merged to `main` as squash commit:

`ea97be21f0a3bc2babeb5c2a1d5f0bdc00f74e4b`

Final PR head:

`c39d4eeae06905839d01d018037131ca012d3770`

The exact final PR head received a successful Cloudflare Preview after the complete deterministic deployment gate was restored.

Durable fixes from that PR include:

- no fabricated `model.id@release_date` revision values;
- real prefilled data-issue reporting flow;
- paper method-summary vs model-selection-rationale boundary;
- benchmark/checkpoint paper filters;
- global AppLayout-level model Quick View with on-demand model JSON;
- human-readable unresolved model facts and research impact;
- sticky model-detail research navigation;
- paper/family model linking and Quick View;
- corrected historical paper-adoption semantics;
- simultaneous strict/method/modern replacement verdicts;
- dedicated mobile comparison cards;
- hardware-tier vs heuristic-estimate wording;
- deterministic source-ID normalization shared by ingestion/migration;
- additional Vitest, Playwright and adversarial V2 regression coverage.

## Current deployment-blocking gate

`npm run verify:deploy` currently runs deterministic repository-local checks including:

```text
npm run check
npm run validate
npm run audit:semantic
npm run audit:claims
npm run audit:freshness
npm test
npm run audit:v2
npm run audit:v2:adversarial
```

Then `npm run build:cloudflare` performs the Astro production build.

The V2 audits are now deployment blockers because they protect false-complete/research-integrity invariants. Keep `package.json`, `src/lib/deploymentArchitecture.test.ts`, deployment docs and audit scripts synchronized if this contract changes.

Full Chromium/WebKit Playwright remains on-demand; do not add browser downloads or third-party network probes to every Pages build without a deliberate reliability/cost decision.

## Current repository layout

```text
src/                         production application/content/domain logic
public/                      production static assets
scripts/                     build, validation, audit and maintenance tooling
tests/e2e/                   Playwright browser regression tests
tests/fixtures/demo-archive/ non-production demo fixtures
docs/agents/current/         authoritative current Agent policy/product/runbooks/maps
docs/agents/history/         migration and superseded architecture records
docs/agents/README.md        Agent documentation index
docs/agents/LATEST.md        fixed latest handoff
```

The production Astro root, `src/`, `public/`, `scripts/`, dependency manifests and build configuration are deliberately kept in their conventional locations.

## Cloudflare Build Watch Paths — last confirmed state

The repository owner saved these settings in the Cloudflare dashboard and read them back successfully on **2026-08-09**:

```text
Include:
*

Exclude:
docs/*
AGENTS.md
README.md
.github/*
reports/*
tests/e2e/*
tests/fixtures/*
playwright.config.ts
```

Do not exclude production source, `public/*`, `scripts/*`, dependency manifests, Astro/TypeScript configuration or `.node-version`.

Because Agent documentation is excluded, documentation-only updates normally should not consume a Pages build. Do not create probe/no-op runtime files merely to test this behavior.

## Repository re-layout is closed

PR #57 completed the organizational migration:

- `e2e/*` -> `tests/e2e/*`;
- Playwright `testDir` -> `./tests/e2e`;
- `demo-archive/*` -> `tests/fixtures/demo-archive/*`;
- current Agent docs -> `docs/agents/current/`;
- dated/retired/migration Agent docs -> `docs/agents/history/`.

There is no pending repository-layout or Build Watch cleanup.

## Steady-state change flow

For normal deployment-sensitive work:

```text
one logical task
-> batched intermediate work (skip deployment when appropriate)
-> one meaningful exact-head Preview
-> merge
-> one Production build
```

For docs-only changes under current Build Watch exclusions:

```text
focused branch/PR
-> inspect diff and links
-> merge without manufacturing a runtime change merely to force Preview
```

## Current external boundaries

Do not mark these as complete without real external capabilities/evidence:

- cross-device cloud project storage;
- account/OAuth identity;
- team permissions/realtime collaboration;
- server-side notifications/personalized APIs;
- paper hardware measurements, author intent, benchmark conditions or other facts that reliable sources do not provide;
- exhaustive current-world fact verification that requires new external evidence.

LocalStorage, static JSON, inferred metadata or UI labels are not substitutes for those capabilities/facts.

## Historical context

Completed migration/incident records live under `docs/agents/history/`. They are evidence, not current operating policy. Current rules live under `docs/agents/current/`, `/AGENTS.md` and this fixed handoff file.
