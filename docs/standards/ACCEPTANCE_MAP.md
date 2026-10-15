# Quality → canonical owner → executable acceptance

This map points to existing checks; it does not create new CI or duplicate the current rules.

| Quality question | Single semantic owner | Actual executable witness | Remaining human/provider check |
| --- | --- | --- | --- |
| First viewport communicates one meaningful task? | [site-reader-attention-contract](../agents/current/site-reader-attention-contract.md) | [contracts](../../src/data/siteReaderContracts.ts), [audit](../../scripts/audit-reader-contracts.ts), [browser spec](../../tests/e2e/site-reader-contracts.spec.ts); `npm run audit:reader-contracts` | Zero-context review of rendered content; budget numbers are regression alarms, not comprehension scores. |
| Research results have the right source, panel and uncertainty? | [product-and-research-integrity](../agents/current/product-and-research-integrity.md) and [research-result-reading-contract](../agents/current/research-result-reading-contract.md) | `npm run audit:claims`, `npm run validate`, route-specific scientific source/receipt assertions | Recheck the original Experiment authority and meaningful omissions. Automated audit cannot invent missing experiments. |
| Research presentation is legible and evidence-first? | [research-site-presentation-contract](../agents/current/research-site-presentation-contract.md), [Human Expression Standard](https://github.com/mykcs/.agents/blob/main/docs/agents/HUMAN_EXPRESSION_STANDARD.md) | `npm run audit:copy:strict`, `npm run build` (rendered audits), relevant Reader Contract/browser checks | Cold read: does the visible page explain its result and caveats? |
| Visual appearance and interaction survive real responsive/theme conditions? | [ui-design-principles](../agents/current/ui-design-principles.md), [theme contrast](../agents/current/theme-contrast-contract.md), [UI visual gate](../agents/current/ui-change-visual-acceptance-gate.md) | `npm run audit:css`, `npm run preflight:ui`, scoped `npm run test:ui` or `npm run test:ui:all`; [theme tokens](../../src/styles/tokens.css) | Inspect changed real pages on relevant desktop/mobile sizes, dark/light, keyboard focus and zoom, without whole-page overflow. |
| Repository build and security gates pass? | [website-engineering-standard](../agents/current/website-engineering-standard.md), [public-release-security-gate](../agents/current/public-release-security-gate.md) | `npm run verify:deploy` and `npm run build`, with the current definitions in [package.json](../../package.json) | Exact changed-source hash, review any excluded checks, fail closed on privacy/security. |
| Is PR actually eligible for deployment and was it published? | [hosting-architecture](../agents/current/hosting-architecture.md), [deployment-policy](../agents/current/deployment-policy.md) | [Public PR CI](../../.github/workflows/public-pr-ci.yml), `public-ci-gate`, [Vercel gate helper](../../scripts/request-vercel-final-gate.mjs) **only after** CI passes | Same-SHA Vercel status, protected merge, then separate Production identity and affected-page verification. |

## Routing without parallel governance

1. Root [AGENTS.md](../../AGENTS.md) → matched `docs/agents/current/` owner → source/experiment authority → executable check.
2. Run only relevant commands, then the final-stage exact-head checks. Documentation-only changes should not claim UI/browser acceptance they never exercised.
3. **Do not copy thresholds here**; when code or owners move, update this link map. New tests belong to the true source/script/test owner.
4. Report each status precisely: **PASSED**, **FAILED**, **NOT RUN**, **BLOCKED**, or **NEEDS HUMAN REVIEW**. A link to a test is not proof it ran.
