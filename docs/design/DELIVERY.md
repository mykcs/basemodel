# BaseModel Design v1 delivery standard

This file defines when work may be called complete.

## 1. Completion levels

### A. Mechanically complete

All required source, semantic, responsive, accessibility, test and build checks pass.

This does **not** mean the owner has accepted the taste.

### B. Design-reference candidate

A page additionally passes the Design review below and is good enough to teach later pages.

### C. Owner-accepted reference

The owner has actually reviewed the real rendered page and accepted it as a reference.

Never promote B to C without a real owner signal.

Track these as separate evidence fields per route, not one label for the whole PR. Record the reviewed commit/rendered artifact, scope and owner's actual response for C. Approval of this plan, silence, CI green and an Agent's review do not establish C. A material later change to the accepted composition needs renewed acceptance; retain the previous acceptance as historical evidence.

Absence of C does not block A, B or subsequent authorized batches. B requires an explicit review pass of the real render and resolved checklist findings, not an unsupported statement that it looks good. Automated checks and Agent inspection do not establish measured human comprehension.

## 2. Page-level Definition of Done

A migrated reader-facing page must satisfy all of the following.

### Meaning
- [ ] scientific claims/numbers match the correct authority;
- [ ] incompatible panels are not visually ranked together;
- [ ] not-run / unknown / negative / historical states remain distinct;
- [ ] claim-changing caveats stay visible.

### Reader task
- [ ] route Reader Contract is current;
- [ ] the first viewport has one primary cognitive owner;
- [ ] a low-context reader can identify subject + strongest supported answer quickly;
- [ ] the next useful action/depth is clear.

### Narrative
- [ ] no configuration wall before the result unless setup itself is the page task;
- [ ] detail progresses from orientation to understanding to evidence to audit;
- [ ] headings say useful things rather than only naming sections;
- [ ] repeated explanation is removed.

### Visual hierarchy
- [ ] decisive content is visibly stronger than provenance/navigation;
- [ ] there is at least one intentional visual anchor when comparison/sequence/evidence benefits from it;
- [ ] card usage follows the card rule;
- [ ] the page has rhythm rather than equal-weight stacked boxes;
- [ ] decorative elements have a semantic reason.

### HTML
- [ ] relationships use appropriate semantic HTML where practical;
- [ ] exactly one page H1;
- [ ] controls have correct link/button semantics;
- [ ] figures/tables/captions are accessible and understandable;
- [ ] static explanatory content stays static-first.

### Mobile and responsive
- [ ] 390px phone layout is intentionally composed;
- [ ] 768px intermediate layout is usable;
- [ ] 1440px desktop layout uses space intentionally;
- [ ] no document-level horizontal overflow;
- [ ] no desktop-slide scaling trick;
- [ ] claim-changing caveats remain readable on phone.

### Theme/accessibility
- [ ] light/dark contrast follows current theme contract;
- [ ] keyboard/focus behavior is correct for interaction;
- [ ] reduced-motion behavior is respected where motion exists;
- [ ] no meaning depends on color alone.
- [ ] affected text/reading layouts survive 200% text enlargement and a 320 CSS-pixel reflow check; essential two-dimensional tables/figures may scroll locally with accessible labels, while the document itself stays within the viewport.

### Evidence depth
- [ ] exact provenance remains reachable;
- [ ] audit depth is visually subordinate unless provenance is the task;
- [ ] links point to the real authority/evidence rather than duplicated stale prose.

## 3. Program-level Definition of Done

Design v1 is complete only when:

1. `docs/design/` is discoverable from root Agent bootstrap;
2. the three reference pages are Design-reference candidates;
3. the owner-accepted subset is recorded honestly;
4. stable repeated patterns have been extracted only where justified;
5. every in-scope Phase 4 and Phase 5 route in the frozen inventory has been migrated or verified already conformant, with no unresolved blocking item;
6. shared/global CSS changes have browser coverage;
7. stale visual layers are reduced only after dependency/regression proof;
8. Design-specific automated guards exist where objective failure can be detected;
9. final exact-head repository checks and browser acceptance are green;
10. PR closeout distinguishes mechanical completion from subjective owner acceptance.

## 4. Required validation

Use the strongest existing repository checks appropriate to the changed surface.

Minimum for deployable design work:

```bash
npm run verify:deploy
npm run build
```

Use the existing `npm run preflight:ui:plan` / `npm run preflight:ui` wrapper and current risk classification from `ui-change-visual-acceptance-gate.md`. Do not repeat an equivalent full suite merely because several docs name it; preserve evidence for the actual scope/tree tested. Docs-only planning revisions need documentation/link/diff checks and the required repository CI, not fabricated browser or Preview acceptance.

Also run focused tests for touched contracts/components.

For shared/global/theme/layout/responsive changes, use the existing UI/browser policy and strongest applicable matrix, including `npm run test:ui:all` when the current engineering owner requires it.

For each reference page, collect real-browser evidence at:
- 390 x 844;
- 768 x 1024;
- 1440 x 1000.

Use all three in both light/dark themes for each reference and migrated route/template witness; additionally retain the existing 1280 x 633 Reader Contract gate. Inspect breakpoint transitions when composition changes. These design widths supplement, rather than replace, existing browser matrices and required WebKit coverage. Record actual locales and states tested; do not infer a full matrix from one screenshot. Include first viewport, the decisive evidence/boundary region and expanded audit or interaction state where applicable.

Bind evidence to the source tree, fresh build, browser/version, route, viewport/theme/state, command/result and accessible artifact location. A screenshot from old `dist/` is not current-head proof. Final evidence separately names the exact-head public CI run, Vercel deployment SHA/state and real Preview route sentinels. Login/interstitial screenshots do not count; temporary share credentials stay out of committed records.

The screenshot itself is not acceptance. Review it against the checklist above.

## 5. Design review questions

Before marking a page a Design-reference candidate, answer:

1. What is the first thing the eye sees, and is that the right thing?
2. Can the first screen be summarized in one sentence?
3. Is there an obvious reason to continue reading?
4. Does the next section answer the question created by the previous one?
5. Are the largest elements also the most important semantically?
6. Did any caveat become quieter than the claim it materially limits?
7. Is a card being used only because the layout felt empty?
8. Would removing color/decoration preserve the logic?
9. Does the phone version feel authored rather than collapsed?
10. Can a deep reader still reach the evidence and provenance?

## 6. Stop-ship failures

Do not ship a design change that:
- makes a claim stronger than its evidence;
- combines incompatible panels into an apparent ranking;
- introduces root horizontal overflow;
- hides a material caveat;
- replaces a usable mobile page with a scaled desktop composition;
- weakens an assertion/test merely to make the redesign pass;
- requires the owner to be the first dark-mode/phone/overflow tester.

## 7. Supporting rationale

These external references inform technique; they do not replace repository authority:

- [GOV.UK contribution criteria](https://design-system.service.gov.uk/community/contribution-criteria/) support proving usefulness, usability and reuse before promoting a pattern. BaseModel's three-reference/two-consumer rule is a local implementation choice.
- [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) and [Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) explain why named device widths alone do not cover enlarged-text reading. The checks above are targeted design checks, not a claim of a full accessibility audit.
