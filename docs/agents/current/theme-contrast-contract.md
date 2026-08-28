# Theme and contrast contract

Status: current UI implementation and review contract
Audience: design agents, frontend agents, review agents

## Why this document exists

The first sitewide visual-knowledge Preview exposed a real theme bug: new cards used `var(--background, #fff)` even though the site did not define `--background`. In light mode the white fallback looked plausible. In dark mode the same cards stayed white while inheriting the dark theme's light text, producing nearly invisible content.

The lesson is broader than one missing variable: **a two-theme product must treat color pairing as a semantic system, not as isolated CSS declarations.**

## 0. Theme-state ownership and first-visit default

The site owns its theme state; the operating system does not silently choose the initial site theme.

Current behavior is:

```text
saved atlas-theme=dark
-> dark

saved atlas-theme=light
-> light

no saved atlas-theme
-> light

storage unavailable / unreadable
-> light
```

`prefers-color-scheme` may still be used for media-query behavior, browser/OS simulation, screenshots, or other platform-level presentation. It is **not** a substitute for an explicit saved site preference.

Therefore tests that need the site itself to render dark must model the real owner by writing `localStorage['atlas-theme'] = 'dark'` before page initialization. A test that only sets the browser/OS `colorScheme: 'dark'` must still expect the site to initialize light when no saved site preference exists.

The durable precedence is:

```text
explicit saved site choice
> product default light
```

The dated failure that established this boundary is recorded in [`../history/2026-08-28-pr-closeout-vercel-cost-and-light-theme-retrospective.md`](../history/2026-08-28-pr-closeout-vercel-cost-and-light-theme-retrospective.md). The historical case is rationale only; this section owns the current theme-state rule.

## 1. Use semantic theme pairs

Use the tokens defined in `src/styles/tokens.css`:

- page: `--bg` + `--ink`;
- card/surface: `--surface` + `--ink`;
- secondary surface: `--surface-muted` + `--ink` or `--muted`;
- filled action: `--accent-fill` + `--accent-on-fill`;
- border: `--border`;
- secondary text: `--muted`;
- focus / emphasis: `--accent-deep` or a transparent mix derived from it.

Do not invent a foreground or background color in a component when an existing semantic pair expresses the same role.

## 2. Never use an undefined variable with a light-only fallback

Forbidden pattern:

```css
background: var(--unknown-surface, #fff);
```

A missing custom property can remain visually hidden in light mode and fail catastrophically in dark mode.

If compatibility with an old component is necessary, define the compatibility alias centrally in `tokens.css`. The current legacy pair is:

```css
--background: var(--color-surface);
--foreground: var(--color-text);
```

New components should use `--surface`, `--bg`, `--ink`, and the accent pair directly rather than adding more aliases.

## 3. Contrast thresholds are blocking requirements

For both themes:

- ordinary text and small instructional text: at least `4.5:1`;
- large display text: at least `3:1`;
- primary text on page/surface: target `7:1` or higher;
- filled buttons and badges: their explicit on-fill token must reach at least `4.5:1`;
- focus outlines and state boundaries must remain visible against adjacent surfaces.

`src/lib/themeContrast.test.ts` verifies the core token pairs in both themes.

## 4. Do not create hierarchy by making essential text translucent

Small labels, captions, route metadata, evidence limitations, and troubleshooting explanations are still required information.

Avoid patterns such as:

```css
font-size: .65rem;
opacity: .4;
```

Opacity blends the text with whatever background happens to be behind it and can silently fail in one theme. Prefer:

```css
color: var(--muted);
```

Opacity remains acceptable for purely decorative marks that have a complete text equivalent, such as a non-essential arrow or animation trail.

## 5. Filled controls must use an explicit pair

Do not implement a button as:

```css
background: currentColor;
color: #fff;
```

`currentColor` changes with the inherited theme and may become almost identical to the foreground.

Use:

```css
background: var(--accent-fill);
color: var(--accent-on-fill);
```

The pair is intentionally different between light and dark themes.

## 6. Review both themes at real page density

A build passing is not visual acceptance. Review at least:

- home primer;
- Guide primer;
- a model index and model detail;
- papers index and paper detail;
- workspace;
- data status;
- methodology;
- OpenEvo reproduction guide;
- desktop and narrow mobile widths.

For each route, switch themes after the page has loaded and inspect:

1. headings and body text;
2. small labels and captions;
3. route cards and active states;
4. evidence ladder labels and limitations;
5. filled buttons;
6. focus states;
7. native `<details>` content;
8. table headers, borders, and code blocks.

The executable route/theme/viewport matrix now lives in `tests/e2e/ui-safety.spec.ts`; the broader scenario and completion contract lives in `ui-change-visual-acceptance-gate.md`.

## 7. Animation cannot carry contrast or meaning alone

Flow animation may reinforce direction, but the static route, numbering, arrows, and labels must remain understandable. The animated marker must use a theme token and disappear under `prefers-reduced-motion`.

## 8. Current implementation ownership

- theme bootstrap/default and persistence: `src/layouts/AppLayout.astro`;
- theme tokens: `src/styles/tokens.css`;
- sitewide visual grammar: `src/styles/knowledge-architecture.css`;
- sitewide primer: `src/components/visual/SiteRoutePrimer.astro`;
- OpenEvo visual primer: `src/components/OpenEvoSeedBenchmarksGuide.astro`;
- default-theme regression: `src/lib/defaultTheme.test.ts`;
- token regression test: `src/lib/themeContrast.test.ts`;
- browser theme/layout regression: `tests/e2e/ui-safety.spec.ts`;
- UI scenario policy: `docs/agents/current/ui-change-visual-acceptance-gate.md`.

When a new visual component is added, identify its semantic surface/text pair before styling it and opt the component into the browser audit with `data-ui-audit`. Do not wait for a dark-mode screenshot to reveal that the pair was undefined.
