# BaseModel Typography Migration — Phase 4 / Research Method Figures

Date: 2026-10-20. Stacked work: [#898](https://github.com/mykcs/basemodel/pull/898) on [#895](https://github.com/mykcs/basemodel/pull/895). This is a migration ledger, not an alternative typography authority.

## Reader-visible change

- Research method explanatory prose, stage headings, carrier descriptions, disclosure controls and mobile diagram explanations inherit existing `--type-*` semantic tokens.
- The mobile WebShop explanation no longer reintroduces its old 9.92px `@media` override.
- No copy, model identity, score, data source, experimental protocol, or research claim is changed.

## Geometric risks and documented exceptions

- Deliberately retain tiny fixed-coordinate connector text and the two narrow SEED interaction-channel labels (`.irx-seed-interaction-contract .irx-seed-exchange` at 0.5rem and 0.48rem) **as unresolved layout debt**, not as accepted readable prose. Those narrow fixed tracks require a separate diagram geometry redesign rather than blindly enlarging glyphs.
- Retain technical IDs in the existing mono stack, KaTeX/math glyphs unchanged.
- The parent `interactive-research-explainer.css` continues to own its established stronger prose-floor rules. Some source literals were previously overridden in the final cascade. Final acceptance checks browser-computed styles.
- Staged ownership avoids open #895's `site.css`/`tokens.css` and #806's `interactive-research-explainer-core.css`/research explainer component.

## Evidence to collect

- All generated static pages pass `npm run build` and `audit:typography`; compare literal-size inventory to previous 297-item exact-head baseline.
- `tests/e2e/typography-method-role-witness.spec.ts` examines rendered sizes, family, italic, clipping and horizontal overflow at 390 / 768 / 1440px, light / dark, including a restored 9px negative witness.
- Existing `tests/e2e/research-explainer-layout.spec.ts` remains authoritative for every-step geometry / connectors and the compact WebShop 440px height budget.
- CI success alone does not satisfy visual acceptance. Exact-head Preview screenshot inspection is still required before claiming full completion.

## Visual correction after cloud screenshot review

A cloud-browser screenshot at 390px showed the SEED action/observation lane squeezed into two small adjacent label columns even while browser audits were green. In the component-owned `@container irx (max-width:760px)` rules, the lanes now stack into two separately legible rows (12px technical label floor) without changing the desktop mechanism. A browser negative witness restores the two-column geometry and verifies that it is rejected.

The boundary explanation has its intended 15px `--type-body-small` effective size: the original selector tied with the later global `.irx p` cascade and only computed to 13px. A scoped selector now takes ownership without `!important`.
