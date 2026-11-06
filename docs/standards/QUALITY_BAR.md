# BaseModel Quality Bar

**Status:** quality-target index, not a competing executable policy. All exact thresholds remain in their current owners and tests.

**A named inspiration is not an approved quality rule.** The [Reference Library](REFERENCE_LIBRARY.md) records what the owner actually cited; the [Intake process](REFERENCE_INTAKE.md) requires source, intended lesson, real owner and acceptance evidence before turning any pattern into a durable requirement.

| Dimension | What must be true for the reader or researcher? | Authoritative owner |
| --- | --- | --- |
| **First-read comprehension** | The first screen orients a zero-context visitor to the main research question/result, relevant boundary and useful next step. Attention is scarce; no decorative card wall or blank-space workaround. | [Reader attention](../agents/current/site-reader-attention-contract.md), [web expression](../agents/current/human-thinking-web-expression-contract.md), [Wish](../wish/LATEST.md) |
| **Scientific integrity** | Names, tasks, models, checkpoints, panel/denominator, uncertainties, result and non-result states agree with the owning evidence. A historical or unrun entry does not become an improvement claim. | [Integrity](../agents/current/product-and-research-integrity.md), [result reading](../agents/current/research-result-reading-contract.md), original experiment authority |
| **Research publication** | Show the actual question, direct result, interpretation, limitations and source; make deep mechanism/setup accessible without blocking understanding. Equations and plots reduce cognitive work. | [Research presentation](../agents/current/research-site-presentation-contract.md), [research editorial](../agents/current/research-editorial-style.md) |
| **Visual and accessibility** | Restrained Research Editorial / Workbench identities; actual mobile/desktop layouts, light/dark, zoom and focus states remain legible without clipping or whole-page overflow. | [UI design](../agents/current/ui-design-principles.md), [theme](../agents/current/theme-contrast-contract.md), [visual acceptance](../agents/current/ui-change-visual-acceptance-gate.md) |
| **Engineering and security** | Astro remains reproducible and static-first; tests match real changed behavior; public release does not expose private artifacts or credentials. | [Engineering](../agents/current/website-engineering-standard.md), [release security](../agents/current/public-release-security-gate.md) |
| **Release truth** | Candidate source, exact-head required CI, exact-head Vercel, merge and Production are distinct proof steps. | [Hosting](../agents/current/hosting-architecture.md), [deployment](../agents/current/deployment-policy.md) |

## Definition of done (apply only matching gates)

**Source ready:** correct owner, coherent content, scientific claim backed by its original evidence, meaningful unknowns still visible.

**Repository accepted:** appropriate deterministic and browser checks for the exact candidate SHA, no hidden skipped checks. Tests are a proxy for observable correctness, not evidence that a newcomer understood the page.

**Provider accepted:** the required `public-ci-gate` and `Vercel` statuses are attached to the exact final PR head, as specified in the live release contract.

**Published and verified:** accepted merge and subsequent Production deployment identity/changed reader route are independently checked when publication was in scope.

**Not completed:** a successful local build alone; an old PR's green CI; a chart whose attractive design masks non-comparable data; missing evidence replaced by invented zeros; a docs navigation PR claiming that all 268+ site routes passed human review.

Use [ACCEPTANCE_MAP.md](ACCEPTANCE_MAP.md) for real tests and [OPEN_GAPS.md](OPEN_GAPS.md) to acknowledge incomplete evidence. Do not invent universal numeric standards or a second scoring engine.
