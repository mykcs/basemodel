# Archived English site pages

This directory preserves the English Astro page-source tree while the active BaseModel development surface is Chinese-only.

- Archived from development baseline: `731d49ac27996a6d78fe8ba9f14ad8d249582969`
- Original path: `src/pages/en/`
- Archived path: `docs/archive/site-en/src/pages/en/`
- Original Git tree: `80e94b27f01aac35cadc18999d060e5521d3b84c`
- Archived Astro pages at capture time: 62

The English pages are **not deleted**. They are intentionally outside `src/pages` so Astro does not type-check or build them during the current Chinese-only development cycle.

While this archive is active, `/en/**` is not an independently maintained runtime surface. The deployment layer redirects old English URLs to their Chinese counterparts so existing links do not become dead ends.

## Restore English later

Do not reconstruct translations from old PRs. Restore this archived tree, then reactivate the locale contract in the same change:

```bash
git mv docs/archive/site-en/src/pages/en src/pages/en
```

Then restore the active English entries in `astro.config.mjs`, `src/lib/sitemapRoutes.ts`, language metadata/navigation, locale/browser acceptance, and remove the temporary `/en/**` redirects.

Before restoring, compare this archive against work created after the archive baseline so newer English drafts can be reconciled deliberately instead of silently reviving a stale runtime surface.
