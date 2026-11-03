# WP-B: Model detail evidence + catalog freshness readability

Scope: BaseModel typography [PR #898](https://github.com/mykcs/basemodel/pull/898). Parent at the time of editing: `d599d5cc381d3fb930e882dd9b6e77287c01ac17`. This is the first focused **ordinary catalog/model-detail UI** batch after the refreshed ownership inventory; not a sitewide completion receipt.

## Actual user-facing fixes

- `src/components/models/detail/ModelResearchSummary.astro` is mounted by `src/pages/_bodies/model-detail.astro`, verified on route `/models/qwen3-8b/`. The 11.5px definition labels → 13px semantic meta, 13.8px actual values → 15px semantic table, 12.2px specialization summary → 14px caption, and H2 receives a 20px article-subsection role. Numeric/data values use normal interface rather than decorative super-bold; two-column grid gains minmax(0,1fr), the value text wraps long tokens without widening the document.
- `src/components/catalog/CatalogFreshnessNotice.astro` is mounted across `/models/`, `/models/qwen3-8b/`, `/compare/`, `/landscape/`, `/data-status/` and families. Its dated-evidence explanation was 12.8–13.1px ordinary text; it now has 15px readable prose, 16px title, 14px short evidence notes, 13px dates/sources, 15px substantive signal paragraphs. Removed the redundant compact 12.8px override so it cannot undo the semantic role. Existing scientific/provider dates/claims/source links unchanged.
- `tests/e2e/typography-product-tools.spec.ts`: actual mounted components and 390/768/1440 × light/dark computed type, geometry and screenshot witnesses (model detail 6 states, data-status 4 states). Two same-predicate negatives reintroduce 10px descriptions and assert rejection and restoration. Browser PNG+JSON evidence should be uploaded by existing Public PR CI and explicitly inspected.

## No conflict, no secondary system

Reviewed root and src instruction owners; no nested AGENTS in touched dirs. 49 open PRs inspected as ownership snapshot; neither consumer source file is in any other recorded open PR changed-file list; #806 changes other model/paper owners, #916 PaperModelMatrix separately. No added token scale, `!important`, global CSS patch or scientific-data modifications.

## Required acceptance not invented in advance

Before claiming PASS, require exact committed HEAD on GitHub and at least Node24 `verify:deploy` / build/audit, all Chromium shards, actual saved PNG/JSON computed style; WebKit must be tested separately on a capable runner. GitHub host can verify CI only **after** source commit; earlier green SHA does not transfer. Keep `Public CI`, WebKit, screenshot inspection and Vercel exact-head Review as separate facts. User-facing batch status until then: **IMPLEMENTED / PENDING EXACT-HEAD ACCEPTANCE**.
