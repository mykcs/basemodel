# User-facing source rules

Scope: every file under `src/`.

This directory owns production pages, UI, navigation, i18n, routes, and feature code. A change that alters what a person sees is never “UI only” or “feature only”: it also requires a language pass.

Before changing user-facing source, read:

- `../docs/agents/current/human-thinking-web-expression-contract.md`
- `../docs/agents/current/audience-centered-technical-copy.md`
- `../docs/agents/current/ui-design-principles.md`
- `../docs/agents/current/ui-change-visual-acceptance-gate.md`

## Non-negotiable language rule

**Concrete action before abstract framing.** On the first screen, in section headings, cards, navigation, and primary actions, state what a person or tool does to a concrete object before explaining the research abstraction.

Canonical pattern:

```text
actor or tool + concrete action + concrete object + optional result
```

Preferred verbs include `复现`, `运行`, `比较`, `查看`, `保存`, `筛选`, `核对`, `Reproduce`, `Run`, `Compare`, `View`, `Save`, `Filter`, and `Check`.

Canonical Chinese example:

> 用 OpenEvo 复现 SEED 的 ALFWorld 与 WebShop 实验

Canonical English example:

> Reproduce SEED’s ALFWorld and WebShop experiments with OpenEvo

Abstract research packaging must not carry a first screen by itself. Labels about missions, mainlines, maps, evidence, causality, or framework improvement are secondary explanation after the concrete action and object are clear.

## Every feature and UI change must check copy

Even when the request is primarily code, layout, animation, navigation, responsive behavior, or a new feature:

1. read the visible headings, labels, buttons, callouts, empty/error/status states introduced or moved by the change;
2. make the first sentence understandable without repository history or the originating chat;
3. explain precise technical terms at first use, then keep using the precise term consistently;
4. make buttons predict the next screen or action;
5. preserve Chinese/English meaning rather than translating jargon literally;
6. keep safety and research-integrity warnings direct, but only after the protected object and consequence are clear;
7. review adjacent shared copy when a shared component changes, because one abstract label can propagate sitewide.

## Acceptance

Before publishing a user-facing source change, run the repository-owned copy audit and the relevant validation/browser checks. `npm run verify:deploy` includes the strict copy invariants and unit tests; UI work also follows the browser acceptance gate.

Detailed policy remains in the current documents above. This file is the directory-level trigger so future Agents cannot miss the rule when adding a feature or changing UI under `src/`.
