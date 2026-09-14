# English site source archive

This snapshot temporarily removes English pages from BaseModel's active Astro development surface. It does **not** delete the English source.

- Frozen source commit: `9f7333f7e21744f6015dc1bcff1ee20d5acf3d20`
- Original active root: `src/pages/en/`
- Archived root: `docs/archive/site-en/src/pages/en/`
- Original tracked files: 63
- Archived files use an extra `.archive` suffix so Astro/TypeScript do not treat them as active source. File bytes are unchanged.

## Restore

1. Move `docs/archive/site-en/src/pages/en/` back to `src/pages/en/`.
2. Remove the trailing `.archive` suffix from every restored file.
3. Restore English in `astro.config.mjs`, `src/i18n/index.ts`, sitemap/locale routing, metadata, redirects, and acceptance tests.
4. Run the full deterministic and browser acceptance gates before treating English as active again.

`MANIFEST.tsv` records every original path and Git blob SHA so restoration can be verified byte-for-byte.
