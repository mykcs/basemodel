/**
 * Additive review for the 2026-10-29 SEED × OpenEVO Intelligence UI.
 *
 * The 2026-10-22 source-disposition ledger is a sealed historical receipt.
 * Its 5,491 classified declarations and sampled observations must not be
 * silently re-labelled as present-day browser measurements. This manifest
 * records every removed and added typography declaration in the one changed
 * Astro owner, keeping the unchanged 5,484 declarations fully reconciled.
 * A future source edit needs a new review; the fingerprint is deliberately
 * exact, and the browser acceptance lives in the PR's current-head CI.
 */
export const intelligenceTypographyDelta = {
  owner: 'src/components/research/SeedOpenEvoTrainingDesignOverview.astro',
  fromSourceFingerprint: '0014f5a457121be4df139ac936df5082d7a9aebb7b74d84e6951b0c63739a836',
  toSourceFingerprint: '24737efa7ee26ef1376e6ec096d71d442d8204e01be25275f1e66e4e89a818d2',
  observationStatus: 'NOT_REOBSERVED_AFTER_SOURCE_CHANGE',
  visualStatus: 'PENDING_EXACT_HEAD_BROWSER_ACCEPTANCE',
  added: {
    '.intelligence-intro__claim': {
      role: 'Stage-comparison thesis: readable body prose',
      properties: { 'font-size': 'var(--article-body-size,var(--type-body-small))', 'line-height': 'var(--type-leading-body)' },
    },
    '.intelligence-intro__legend span': {
      role: 'Comparison legend: short interface labels',
      properties: { 'font-size': 'var(--type-meta)', 'line-height': 'var(--type-leading-caption)' },
    },
    '.intelligence-stage__number': {
      role: 'Stage identity: interface marker',
      properties: { 'font-size': 'var(--type-body-small)', 'font-family': 'var(--font-interface)', 'font-weight': 'var(--type-weight-heading)' },
    },
    '.intelligence-stage__header h3': {
      role: 'Stage subject heading: responsive size within section hierarchy',
      properties: { 'font-size': 'clamp(1.2rem,2vw,1.65rem)', 'line-height': 'var(--type-leading-heading)' },
    },
    '.intelligence-stage__header p': {
      role: 'Stage purpose: explanatory prose',
      properties: { 'font-size': 'var(--type-body-small)', 'line-height': 'var(--type-leading-body)' },
    },
    '.intelligence-columns span': {
      role: 'Parallel framework column identities',
      properties: { 'font-size': 'var(--type-body-small)', 'font-family': 'var(--font-interface)', 'font-weight': 'var(--type-weight-heading)', 'letter-spacing': '.02em' },
    },
    '.intelligence-row__index': {
      role: 'Matched step number: short interface marker',
      properties: { 'font-size': 'var(--type-meta)', 'font-family': 'var(--font-interface)', 'font-weight': 'var(--type-weight-heading)' },
    },
    '.intelligence-row__axis-title': {
      role: 'Shared comparison-axis label',
      properties: { 'font-size': 'var(--type-body-small)', 'font-family': 'var(--font-interface)', 'font-weight': 'var(--type-weight-heading)' },
    },
    '.intelligence-row__relation': {
      role: 'Same-operation versus same-role qualification',
      properties: { 'font-size': 'var(--type-meta)', 'font-family': 'var(--font-interface)' },
    },
    '.intelligence-method__name': {
      role: 'Per-cell SEED or OpenEVO identity, retained on phones',
      properties: { 'font-size': 'var(--type-meta)', 'font-family': 'var(--font-interface)', 'font-weight': 'var(--type-weight-heading)', 'letter-spacing': '.05em' },
    },
    '.intelligence-method__action': {
      role: 'Identical headline action from one shared semantic source',
      properties: { 'font-size': 'var(--type-minor-heading)', 'line-height': 'var(--type-leading-heading)', 'font-weight': 'var(--type-weight-heading)' },
    },
    '.intelligence-method__vendor': {
      role: 'Replaceable concrete teacher vendor inside parentheses',
      properties: { 'font-weight': 'var(--type-weight-medium)' },
    },
    '.intelligence-method__technique': {
      role: 'Method-specific technical implementation tag',
      properties: { 'font-size': 'var(--type-meta)', 'font-weight': 'var(--type-weight-heading)', 'line-height': 'var(--type-leading-caption)' },
    },
    '.intelligence-method__explanation': {
      role: 'Method-specific implementation explanation',
      properties: { 'font-size': 'var(--type-body-small)', 'line-height': 'var(--type-leading-body)' },
    },
    '.intelligence-method__boundary': {
      role: 'Identical Stage-2 external-teacher exclusion on both sides',
      properties: { 'font-size': 'var(--type-meta)', 'line-height': 'var(--type-leading-body)' },
    },
    '.intelligence-stage__result': {
      role: 'Per-stage output of the method comparison',
      properties: { 'font-size': 'var(--type-body-small)', 'line-height': 'var(--type-leading-body)', 'font-weight': 'var(--type-weight-heading)' },
    },
    '.intelligence-sources': {
      role: 'Source attribution links',
      properties: { 'font-size': 'var(--type-meta)', 'font-family': 'var(--font-interface)', 'line-height': 'var(--type-leading-body)' },
    },
  },
  removed: {
    '.responsibility-flow li>span': { font: 'var(--type-weight-medium) var(--type-meta)/var(--type-leading-heading) var(--font-interface)' },
    '.responsibility-flow small': { 'font-size': 'var(--type-meta)' },
    '.responsibility-flow strong': { 'font-size': 'var(--type-figure-title)' },
    '.responsibility-flow p': { 'font-size': 'var(--article-body-size,.69rem)', 'line-height': 'var(--article-body-leading,1.45)' },
    '.stage2-bridge': { 'font-size': 'var(--type-body-small)', 'line-height': 'var(--type-leading-body)' },
  },
  removedReason: 'The former Stage-1-only card sequence and bridge were replaced by aligned, two-stage method comparisons; they no longer render.',
  changedOwnerProofs: {
    'src/components/research/SeedOpenEvoMissionHero.astro': {
      reason: 'Compact hero subject and two-stage explanatory copy changed; existing font declarations are unchanged, but older text samples are historical.',
      transitions: ['0ceeb21fc307655242b7', '1a732f92ce37d65e6188', '58a21fd1504b8bf2787c', '8029de0c2ab00374c931', 'cdc689fb99035347c410'],
    },
    'src/components/research/SeedOpenEvoResearchHub.astro': {
      reason: 'Method comparison moved ahead of the object map, section copy and two background color references changed; typography declarations are unchanged but old component snapshots no longer prove current output.',
      transitions: ['44b727d8d2f3175e76a3', 'a3a682b63a2ad821c8d3', 'bb1635d60ddf4f794948', 'c456cc9f9f70015ad0a2'],
    },
    'src/components/research/SeedOpenEvoTrainingDesignOverview.astro': {
      reason: 'Stage-1-only typography was replaced by the explicitly classified two-stage comparison declarations above.',
      transitions: ['37bd6e677ef57ecc4461', '741947e3fe960b60e49f'],
    },
  },
  invalidatedHistoricalTransitionIds: [
    '0ceeb21fc307655242b7', '1a732f92ce37d65e6188',
    '44b727d8d2f3175e76a3', '58a21fd1504b8bf2787c',
    '741947e3fe960b60e49f', '8029de0c2ab00374c931',
    'a3a682b63a2ad821c8d3', 'bb1635d60ddf4f794948',
    'c456cc9f9f70015ad0a2', 'cdc689fb99035347c410',
  ],
};
