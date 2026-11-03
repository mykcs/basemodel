# WP-B2 — Qwen3B model reproducibility setup typography

Actual mounted production owner: `src/components/models/detail/SeedOpenEvoExperimentSetup.astro`, displayed only for `model.id === 'qwen2-5-3b-instruct'` by `src/pages/_bodies/model-detail.astro`; public route `/models/qwen2-5-3b-instruct/`.

Previous rendered component had seven hardcoded text size literals, including model-name meanings at ~11.5px, reproducibility definitions ~12px and scientific HTML table header ~10.9px. The actual reader question is what must be held fixed when reproducing the same SEED/OpenEVO experiment, not an unimportant axis label.

The actual CSS owner now gives model name labels 16px, field names/body 15px, HTML scientific table 15px, header 14px, H3 17px using **existing** typography tokens, normal/label weights instead of 750/800, and preserves the mobile local table scroller. No scientific model claim, protocol field, matrix cell, URL, date, experiment or source changed. No global patch, new token scale or `!important` added.

`tests/e2e/typography-product-tools.spec.ts` reuses the existing release Gate, adds 390/768/1440 × light/dark = 6 real browser states and one same-predicate 10px negative. Checks rendered content, full type, no document overflow, actual local table scrolling and viewport/component PNG + computed JSON.

Other parallel PRs' file inventories inspected; no overlap for this Astro owner. All acceptance remains **PENDING** until exact-head Node24 deterministic, Chromium CI shards, screenshot inspection and later WebKit/Review. No release, merging, Mac or GPU action.
