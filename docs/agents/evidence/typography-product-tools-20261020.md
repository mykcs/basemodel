# Typography Migration — Model Detail and Mobile Compare

Date: 2026-10-20. Owner: staged BaseModel [PR #898](https://github.com/mykcs/basemodel/pull/898) on [PR #895](https://github.com/mykcs/basemodel/pull/895).

## Intended reader benefit

The legacy `v2-closeout.css` owner contains several valid product-specific surfaces with divergent 11–14px size literals. This batch adopts existing `--type-meta`, `--type-body-small`, `--type-table`, `--type-minor-heading`, `--type-body` tokens for their actual roles: model detail navigation, unresolved-field explanations, research quick views, paper scope text, comparison verdicts, and the mobile Compare grouping/field/value hierarchy. No content or scientific data changes.

The comparison group heading (`h3`) should be 17px and its subordinate field heading (`h4`) 16px; the old 11.5px group heading below a 14.4px field heading inverted their semantic size hierarchy. Mobile comparison values should have a readable 15px table role and retain local wrapping.

## Exception and next action

The literal `font-size: 0 !important` belongs to the hidden `::marker` for an ordered-list replacement. It is **not reader text** and is intentionally retained to suppress a duplicate counter; removing this without addressing the layout would risk reintroducing an unwanted list number.

The new `tests/e2e/typography-product-tools.spec.ts` checks the actual calculated size and font family at 390/768/1440 in both themes, plus responsive Compare h3 ≥ h4, overflow and a forced 9px negative case. Browser and screenshot checks remain separately required. Do not claim entire site complete from this scoped migration.
