# Isolated WebKit transport dock investigation (no writes to #898 or #806)

**Ownership:** This optional review branch starts from #898 at 6c6a8dde5ef5cf1338f222587f9e7548131d9159; it is not a replacement for [#898](https://github.com/mykcs/basemodel/pull/898) or [#806](https://github.com/mykcs/basemodel/pull/806). `src/styles/interactive-research-explainer-core.css` and the existing `research-explainer-layout.spec.ts` belong to open #806. Review the head and semantic contract of #806 before manually integrating anything.

## Browser-observed failure mechanism

At 390px in both Chromium and WebKit, before any deliberate action, hovering over the "Next step" button triggers the existing selector containing `:hover`/`:focus-within`; the transport changes from `position:sticky` to `position:fixed` while `data-transport-docked=false`. The SEED control's Y location jumps from approximately 623 to 748px; Next moves from approximately 640 to 754px, and the steps rail rises by about 123px. This movement is a real layout instability and is a plausible contributor to WebKit pointer-interception timeouts. **However, the baseline WebKit mobile-light suite passed once in the independent environment; the exact cause of the intermittently reported failing run is not proven.**

The app already owns an explicit React state `data-transport-docked` that is set by step/play actions and reset by Overview. This candidate limits the fixed position selector and its phone-width sizing to that explicit state alone. The control remains in normal layout on passive focus/hover, then docks immediately after an actual action. It also undocks immediately on reset, without requiring the pointer to move away first.

## Isolated validation and integration boundaries

- Code delta: exactly two occurrences of the scoped dock selector in `src/styles/interactive-research-explainer-core.css`, plus a comment. No new `!important`, token, global override layer, content, science, or experiment state.
- Experimental browser matrix on the starting UI: three routes (SEED/OpenEVO/WebShop) × 390/768/1440px × Chromium/WebKit, **18/18 PASS**.
- Inject the original hover-only behavior inside the browser test: the same acceptance predicate rejects it and accepts the restored state, **2/2 PASS** (Chromium/WebKit).
- Existing canonical test checks for the 390px mobile-light research-geometry suite and "transport stays local until explicit reader interaction": **4/4 PASS** across Chromium/WebKit on the experimental source.
- Repeat `npm run build`, `npm run verify:deploy`, and the focused cloud matrix on this exact review commit before treating it as validated. These earlier experimental results were produced in an isolated checkout based on #898's prior head `c5d0f4f3`; they do not automatically validate a new commit or the combined PR.
- The new standalone spec `tests/e2e/typography-transport-dock.spec.ts` does **not** modify `package.json` or the existing shared UI spec owned by #806. A future integration owner must wire it into the canonical acceptance suite (or transplant its assertions to the appropriate existing spec), without overwriting in-flight #806 tests.
- Do not merge this branch, cherry-pick into Codex's head, request Vercel Production, or declare the whole-site typography migration complete without explicit PR-owner integration and exact-head checks.
