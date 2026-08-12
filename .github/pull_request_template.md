## Summary

Describe the problem, the intended outcome, and the affected routes/components.

## User-facing Page Expression Brief

Complete this section for any visible page, section, copy, navigation, comparison, explanation, visualization, or interaction change. Check “not user-facing” only when the change has no user-visible effect.

- [ ] This PR is not user-facing.

For user-facing work:

- **Reader and starting state:**
- **Page/section role in the whole-site journey:**
- **Target mental model and next action:**
- **Primary reading/action path:**
- **Secondary detail or diagnostics kept out of the mainline:**
- **Information-density plan (orientation / mainline / detail / on-demand):**
- **Semantic HTML / visualization form and why it matches the thought structure:**
- **Surrounding routes/sections checked for continuity:**

Reference: `docs/agents/current/human-thinking-web-expression-contract.md`.

## Evidence and integrity

- What claims or data changed?
- What sources/evidence support them?
- What remains unknown or out of scope?

## Validation

List the exact checks performed.

For UI-affecting work include, as applicable:

- `npm run verify:deploy`
- `npm run build`
- `npm run test:ui`
- `npm run test:ui:all`
- exact-head Vercel Preview inspection
- themes, viewports, locales, and interactive/expanded states reviewed

## Deployment boundary

State whether this is Preview-only or an intentional Production release. Do not treat Vercel READY as Production acceptance.
