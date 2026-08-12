# Open PR semantic integration — 2026-08-12

## Purpose

Integrate the repository's eight open PRs into one reviewable Vercel release while resolving semantic conflicts instead of accepting the textual merge result blindly.

Integration base:

```text
main: eba207c4fb589d5f8e259b3c480af8e40a39519f
```

Candidate heads inspected:

| PR | Head | Intent | Final disposition |
|---|---|---|---|
| #64 | `2ee4f114706f2dfde78af439006bba47a3efaec7` | durable product vision | accepted as historical rationale; archived under `docs/agents/history/` so stale deployment assumptions cannot regain current authority |
| #69 | `19193e222539c54706cd8ce4fb033599fe6ebde9` | retained research-workbench context | accepted; context files retained and README link corrected to the current Vercel Production identity |
| #116 | `ff899a58a49ea95fa857bb7e64fd6c5cbdcc53ab` | incremental original-UI CSS refinement | ancestry/attribution accepted; competing CSS outcome superseded by #125/#128 because it targets the previous homepage and card hierarchy |
| #119 | `72f9cadb418023d1854518a4640eb8d675915e95` | same-day SEED lab runbook | accepted with a visible dated/scenario boundary; current device truth remains the fuhuo-owned profile consumed at `/lab/` |
| #121 | `c15b7ef3af53b333ee59e3024f98257c8b277b1b` | OpenEvo × WebShop / ALFWorld execution guide | accepted; its execution guide and reusable reproduction design rules remain |
| #125 | `879ddd6480ab0057e6c99f2f9e54c7b0493ed853` | sitewide visual knowledge architecture | accepted as current visual/theme/browser-safety authority |
| #128 | `d293f6a4eb474b8c35c199220acbd290c563b3a2` | SEED × OpenEvo mission-first product | accepted as the latest product/research mission and owner of duplicate mission/OpenEvo component versions |
| #129 | `f3fb2ca0b7117a3cc26ac8e2e4b28d7a876e2edc` | parallel Agent integration policy | accepted by reapplying its section onto the newer Vercel-first deployment policy from `main` |

## Conflict classes checked

### Textual/file conflicts

The stacked PR chain #121 → #125 → #128 changes shared components, tokens, layout and Agent docs. Their latest compatible versions were selected path by path rather than using an old branch as the whole final tree.

### Semantic/UI conflicts

PR #116 intentionally preserved the former product hierarchy. PR #128 intentionally replaces the first viewport with a concrete SEED × OpenEvo research mission, while #125 supplies the global learning/contrast/visual acceptance system. The latter design is newer and broader, so #116's CSS is not appended mechanically.

### Product/research conflicts

PR #128 owns the current mission and scientific boundaries. PR #121's execution guide remains a Run path inside that mission. The generic research decision system remains available instead of being erased.

### Device/lab conflicts

PR #119 describes an old Intel Mac as an optional dedicated bastion. The public personal-compute profile now records a MacBook Pro M4, iPhone, iPad and the physical-Ethernet-only 4×RTX 3090 server. Therefore the old-Mac guide is retained as a dated scenario, not current inventory truth.

### Deployment/provider conflicts

PR #64 and older stacked branches predate the current Vercel-only architecture. The final tree starts from current `main`; canonical/noindex/robots/sitemap, Vercel build-budget and personal-compute changes remain authoritative. PR #129 is layered onto that policy rather than replacing it.

### Generated/dependency conflicts

No dependency versions are changed by this release. `package.json` gains the focused/cross-browser UI commands from #125; the existing lockfile remains valid. The deterministic Gate and Vercel build decide final integration acceptance.

## Ancestry strategy

The integration commit uses current `main` plus every candidate PR head as parents. This preserves history and makes the final merge recognize the worker heads as incorporated, while the commit tree remains the intentionally resolved product state.

Do not squash away this ancestry when merging the integration PR. Use a normal merge to `main`.

## Acceptance evidence

Required before release:

1. exact-head Vercel Preview points to the integration commit;
2. `npm run verify:deploy` succeeds;
3. `npm run build` succeeds and generates the mission, reproduction, lab and current catalog routes;
4. Preview remains `noindex` and canonical/hreflang point to Production;
5. representative mission, reproduction, lab and legacy-runbook routes return successfully;
6. final `main` Vercel Production deployment is READY and the public canonical site is verified;
7. all worker PRs are shown as merged or explicitly closed as superseded by the integration release.
