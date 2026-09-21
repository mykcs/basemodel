export type HplEnforcementKind = 'rendered-audit' | 'source-audit' | 'reader-contract' | 'browser-gate' | 'policy-test';

export type HplEnforcementRecord = {
  family: string;
  guards: Array<{ kind: HplEnforcementKind; path: string; note: string }>;
};

export const HPL_ENFORCEMENT_REGISTRY: HplEnforcementRecord[] = [
  { family: 'anticipatory-rebuttal', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'blocks defensive/negation-first section openings' },
    { kind: 'source-audit', path: 'scripts/audit-audience-copy.ts', note: 'flags negative-first public copy for review' },
  ]},
  { family: 'approved-prose-rewritten-into-jargon', guards: [
    { kind: 'source-audit', path: 'scripts/audit-audience-copy.ts', note: 'flags project shorthand and abstract packaging' },
    { kind: 'policy-test', path: 'src/lib/humanPreferenceLearning.test.ts', note: 'keeps accepted human-language preference retrievable' },
  ]},
  { family: 'attention-tax', guards: [
    { kind: 'reader-contract', path: 'tests/e2e/site-reader-contracts.spec.ts', note: 'enforces first-screen text and interaction budgets' },
    { kind: 'source-audit', path: 'scripts/audit-reader-contracts.ts', note: 'requires first-viewport goals for focus pages' },
  ]},
  { family: 'compressed-shorthand-heading', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'blocks numeric/internal shorthand in h1-h3' },
  ]},
  { family: 'cross-experiment-legend-relearning', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/seed-openevo-briefing.spec.ts', note: 'keeps repeated experiment evidence using shared Score/loss grammar' },
    { kind: 'browser-gate', path: 'tests/e2e/effective-state-gdr-lora.spec.ts', note: 'keeps new experiment evidence aligned with native W&B semantics' },
  ]},
  { family: 'defensive-negation-opening', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'blocks section openings that begin by rebutting an unasked claim' },
  ]},
  { family: 'engineering-as-science-highlight', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'blocks SHA/receipt/determinism headlines' },
    { kind: 'browser-gate', path: 'tests/e2e/content-first-study-design.spec.ts', note: 'keeps evidence details behind progressive disclosure' },
  ]},
  { family: 'external-reviewer-default-dependency', guards: [
    { kind: 'policy-test', path: 'src/lib/uiSafetyGate.test.ts', note: 'asserts external AI reviewers are not ordinary release blockers' },
  ]},
  { family: 'incomplete-scientific-decision-loop', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/stage2-256-research-journey.spec.ts', note: 'preserves design genealogy and diagnostic consequence on the negative-experiment path' },
    { kind: 'policy-test', path: 'src/lib/humanPreferenceBrief.test.ts', note: 'retrieves the full why/evidence/decision/next-step preference' },
  ]},
  { family: 'inconsistent-experiment-chart-grammar', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/seed-openevo-briefing.spec.ts', note: 'checks shared experiment Score/loss chart grammar' },
    { kind: 'browser-gate', path: 'tests/e2e/effective-state-gdr-lora.spec.ts', note: 'checks the newer experiment result surface uses the same evidence semantics' },
  ]},
  { family: 'internal-detail-promoted-to-primary-attention', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'blocks internal experiment IDs and engineering receipts in headings' },
    { kind: 'reader-contract', path: 'tests/e2e/site-reader-contracts.spec.ts', note: 'protects first-screen semantic priority' },
  ]},
  { family: 'jargon-memory-load', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'blocks centralized glossary surfaces and internal-ID headings' },
    { kind: 'source-audit', path: 'scripts/audit-audience-copy.ts', note: 'flags project terms that need local explanation' },
  ]},
  { family: 'mainline-rigor-tax', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'keeps SHA/hash/receipt/determinism out of public headings' },
    { kind: 'browser-gate', path: 'tests/e2e/content-first-study-design.spec.ts', note: 'keeps detailed rigor evidence in expandable evidence layers' },
  ]},
  { family: 'meaningless-english-eyebrow', guards: [
    { kind: 'source-audit', path: 'scripts/audit-audience-copy.ts', note: 'flags decorative static English eyebrow labels' },
  ]},
  { family: 'missing-progressive-disclosure', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/content-first-study-design.spec.ts', note: 'requires frozen identity/evidence details to remain expandable' },
    { kind: 'reader-contract', path: 'tests/e2e/site-reader-contracts.spec.ts', note: 'counts first-screen controls and treats closed details correctly' },
  ]},
  { family: 'mobile-fixed-canvas-overflow', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/research-explainer-layout.spec.ts', note: 'checks fixed research compositions across phone/tablet/desktop' },
    { kind: 'browser-gate', path: 'tests/e2e/ui-safety.spec.ts', note: 'blocks horizontal overflow and clipping' },
  ]},
  { family: 'numeric-shock-heading', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'blocks number-first shorthand headings such as 7<8 and model-label colon headings' },
  ]},
  { family: 'presenter-language', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'blocks presenter-style reading instructions in h1-h3' },
    { kind: 'source-audit', path: 'scripts/audit-audience-copy.ts', note: 'flags known presenter-heading patterns before build' },
  ]},
  { family: 'project-status-as-research-story', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'blocks status-management language in research headings' },
  ]},
  { family: 'reference-surface-imitation', guards: [
    { kind: 'policy-test', path: 'src/lib/humanThinkingWebExpressionContract.test.ts', note: 'keeps cognition-first expression contract distinct from surface imitation' },
    { kind: 'policy-test', path: 'src/lib/agentScenarioTriggerRegistry.test.ts', note: 'requires the hard family in HPL redesign triggers' },
  ]},
  { family: 'reviewer-evidence-class-conflation', guards: [
    { kind: 'policy-test', path: 'src/lib/uiSafetyGate.test.ts', note: 'asserts browser verification and independent reviewer evidence are different classes' },
  ]},
  { family: 'technical-detail-wrong-layer', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/content-first-study-design.spec.ts', note: 'keeps technical evidence below first-reader content' },
    { kind: 'reader-contract', path: 'tests/e2e/site-reader-contracts.spec.ts', note: 'enforces progressive disclosure and first-screen priority' },
  ]},
  { family: 'webification-language-regression', guards: [
    { kind: 'source-audit', path: 'scripts/audit-audience-copy.ts', note: 'blocks known abstract packaging and legacy webification phrases' },
    { kind: 'policy-test', path: 'src/lib/humanPreferenceLearning.test.ts', note: 'keeps approved natural prose as the learned preference' },
  ]},
  { family: 'fake-math-typesetting', guards: [
    { kind: 'source-audit', path: 'scripts/audit-public-math-rendering.ts', note: 'blocks code, handmade sub/sup, raw TeX, and serif fake formula renderers' },
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-public-math.mjs', note: 'checks built public HTML for fake-math patterns' },
    { kind: 'browser-gate', path: 'tests/e2e/sitewide-math-rendering.spec.ts', note: 'requires real KaTeX plus MathML on representative scientific pages' },
  ]},
  { family: 'locked-iframe-presented-as-interactive', guards: [
    { kind: 'rendered-audit', path: 'scripts/audit-rendered-hpl.mjs', note: 'rejects research iframes without explicit public-embed authorization' },
  ]},
  { family: 'detached-chart-explanation', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/effective-state-gdr-lora.spec.ts', note: 'requires each native W&B snapshot to carry its own nearby explanation and boundary' },
  ]},
  { family: 'redundant-page-native-chart', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/effective-state-gdr-lora.spec.ts', note: 'rejects the detached local metric guide and keeps the native W&B evidence surface canonical' },
  ]},
  { family: 'benchmark-number-without-measurement-context', guards: [
    { kind: 'reader-contract', path: 'tests/e2e/site-reader-contracts.spec.ts', note: 'requires benchmark result pages to expose measurement context in the intended reading path' },
    { kind: 'browser-gate', path: 'tests/e2e/effective-state-gdr-lora.spec.ts', note: 'checks Task Score, last-20 trajectory, and fixed-panel final context together' },
  ]},
  { family: 'fixed-panel-overread', guards: [
    { kind: 'reader-contract', path: 'tests/e2e/site-reader-contracts.spec.ts', note: 'keeps fixed-panel selection and narrow capability boundaries visible' },
    { kind: 'policy-test', path: 'src/lib/effectiveStateGdrLoraStudy.test.ts', note: 'keeps the same-panel final identity distinct from broader capability claims' },
  ]},
  { family: 'metric-without-reader-context', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/effective-state-gdr-lora.spec.ts', note: 'checks metric definitions and claim boundaries beside the corresponding evidence' },
  ]},
  { family: 'trajectory-final-evidence-conflation', guards: [
    { kind: 'policy-test', path: 'src/lib/seedOpenEvoProgressBriefing.test.ts', note: 'separates training Score, update loss, and frozen final evidence' },
    { kind: 'policy-test', path: 'src/lib/q17DirectApplyAnalysis.test.ts', note: 'keeps training, frozen final, and diagnostic D1 as distinct evidence layers' },
  ]},
  { family: 'final-score-without-training-dynamics', guards: [
    { kind: 'policy-test', path: 'src/lib/seedOpenEvoProgressBriefing.test.ts', note: 'requires long-run conclusions to retain training dynamics alongside the final measurement' },
  ]},
  { family: 'evidence-layer-conflation', guards: [
    { kind: 'policy-test', path: 'src/lib/seedOpenEvoProgressBriefing.test.ts', note: 'keeps training curves, loss observations, and frozen final in separate evidence roles' },
  ]},
  { family: 'evidence-hidden-behind-link', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/effective-state-gdr-lora.spec.ts', note: 'keeps important W&B-derived evidence visible in-page while preserving native links' },
  ]},
  { family: 'presentation-canvas-not-scaled-as-unit', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/site-reader-contracts.spec.ts', note: 'checks the full 16:9 briefing canvas scales to phone width as one composition' },
    { kind: 'browser-gate', path: 'tests/e2e/seed-openevo-briefing.spec.ts', note: 'checks fixed-slide geometry across desktop and phone' },
  ]},
  { family: 'unbounded-desktop-scaling', guards: [
    { kind: 'browser-gate', path: 'tests/e2e/site-reader-contracts.spec.ts', note: 'caps the desktop briefing canvas at the intended 1280 by 720 composition' },
  ]},
  { family: 'review-preview-not-visually-verified', guards: [
    { kind: 'policy-test', path: 'src/lib/vercelHostedUiGate.test.ts', note: 'keeps hosted review and final release verification as explicit, separate workflows' },
  ]},
];
