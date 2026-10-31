/**
 * Additive review for the 2026-10-29 SEED × OpenEVO Intelligence UI,
 * updated after receiving the owner's original dark-mode screenshots.
 *
 * The 2026-10-22 source-disposition ledger is a sealed historical receipt.
 * Its 5,491 classified declarations and sampled observations must not be
 * silently re-labelled as present-day browser measurements. This manifest
 * records every removed and added typography declaration in the one changed
 * Astro owner, keeping the unaffected declarations reconciled.
 * Another source edit needs a new review; the fingerprint is deliberately
 * exact, and the browser acceptance lives in the PR's current-head CI.
 */
export const intelligenceTypographyDelta = {
  owner: 'src/components/research/SeedOpenEvoTrainingDesignOverview.astro',
  fromSourceFingerprint: '0014f5a457121be4df139ac936df5082d7a9aebb7b74d84e6951b0c63739a836',
  toSourceFingerprint: 'a01361fd7499a33456ebe156266b13697a128d58a609a6ba1f1416ffcf45c742',
  observationStatus: 'NOT_REOBSERVED_AFTER_SOURCE_CHANGE',
  visualStatus: 'PENDING_EXACT_HEAD_BROWSER_ACCEPTANCE',
  added: {
    ".intelligence-showcase": {
      role: "Scoped dark comparison canvas; uses the shared interface font",
      properties: {"font-family":"var(--font-interface)"},
    },
    ".intelligence-intro h3": {
      role: "Original-reference comparison headline",
      properties: {"font-size":"var(--type-section)","font-weight":"var(--type-weight-heading)","line-height":"var(--type-leading-heading)"},
    },
    ".intelligence-intro p": {
      role: "Original-reference explanatory subhead",
      properties: {"font-size":"clamp(var(--type-body),1.65vw,1.5rem)","line-height":"var(--type-leading-heading)"},
    },
    ".intelligence-intro__count": {
      role: "Count of stages and aligned operations",
      properties: {"font-size":"clamp(var(--type-body-small),1.5vw,1.4rem)","font-weight":"var(--type-weight-heading)","line-height":"1.35"},
    },
    ".intelligence-stage__number,.intelligence-stage__common": {
      role: "Stage identity and shared-paradigm badges",
      properties: {"font-size":"clamp(var(--type-body),1.5vw,1.5rem)","line-height":"1.3","font-weight":"var(--type-weight-medium)"},
    },
    ".intelligence-stage__header h4": {
      role: "Stage subject heading within the comparison canvas",
      properties: {"font-size":"var(--type-section)","font-weight":"var(--type-weight-heading)","line-height":"var(--type-leading-heading)"},
    },
    ".intelligence-stage__header p": {
      role: "Stage purpose in large reader-facing prose",
      properties: {"font-size":"clamp(var(--type-body),1.75vw,1.6rem)","line-height":"1.5"},
    },
    ".intelligence-row__axis": {
      role: "Paired operation sequence and relation axis",
      properties: {"font-size":"clamp(var(--type-body),1.5vw,1.45rem)","line-height":"1.4"},
    },
    ".intelligence-row__index": {
      role: "Aligned operation number and label",
      properties: {"font-weight":"var(--type-weight-medium)"},
    },
    ".intelligence-row__relation": {
      role: "Shared-versus-different relation badge",
      properties: {"font-size":"clamp(var(--type-body-small),1.4vw,1.35rem)","line-height":"1.35"},
    },
    ".intelligence-method__name": {
      role: "Framework identity in each comparison cell",
      properties: {"font-size":"clamp(var(--type-body),1.55vw,1.45rem)","line-height":"1.35","font-weight":"var(--type-weight-medium)","letter-spacing":"0"},
    },
    ".intelligence-method__action": {
      role: "Identical shared operation title for both frameworks",
      properties: {"font-size":"clamp(1.2rem,2vw,1.95rem)","font-weight":"var(--type-weight-heading)","line-height":"1.35"},
    },
    ".intelligence-method__vendor": {
      role: "Parenthetical replaceable teacher implementation",
      properties: {"font-size":"clamp(var(--type-body),1.75vw,1.6rem)","line-height":"1.4"},
    },
    ".intelligence-method__explanation": {
      role: "Per-framework explanation of implementation and evidence",
      properties: {"font-size":"clamp(var(--type-body),1.75vw,1.6rem)","font-weight":"var(--type-weight-normal,400)","line-height":"1.52"},
    },
    ".intelligence-method__technique": {
      role: "Technique label kept below the conceptual action",
      properties: {"font-size":"clamp(var(--type-body-small),1.2vw,1.15rem)","line-height":"1.45"},
    },
    ".intelligence-method__boundary": {
      role: "Symmetric Stage-2 absence-of-external-teacher boundary",
      properties: {"font-size":"clamp(var(--type-body-small),1.2vw,1.1rem)","line-height":"1.6"},
    },
    ".intelligence-sources": {
      role: "Source links supporting the comparison",
      properties: {"font-size":"var(--type-meta)","font-family":"var(--font-interface)","line-height":"var(--type-leading-body)"},
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
      currentSourceSha256: 'ed53ab3bc49083fc41ec3c4bee432ab20ee335be4d9a0f54adcdbc1f74e7c1e6',
      reason: 'Compact hero subject and two-stage explanatory copy changed; existing font declarations are unchanged, but older text samples are historical.',
      transitions: ['0ceeb21fc307655242b7', '1a732f92ce37d65e6188', '58a21fd1504b8bf2787c', '8029de0c2ab00374c931', 'cdc689fb99035347c410'],
    },
    'src/components/research/SeedOpenEvoResearchHub.astro': {
      currentSourceSha256: 'ab1a3ca61ee15c7d0b2195bf873381a5866760715a8f0628c628f3409a39edbc',
      reason: 'Method comparison moved ahead of the object map, section copy and two background color references changed; typography declarations are unchanged but old component snapshots no longer prove current output.',
      transitions: ['44b727d8d2f3175e76a3', 'a3a682b63a2ad821c8d3', 'bb1635d60ddf4f794948', 'c456cc9f9f70015ad0a2'],
    },
    'src/components/research/SeedOpenEvoTrainingDesignOverview.astro': {
      currentSourceSha256: 'b2e988db86c72d5399fa04b2c303c3dc21ddf68ccd185a02f061b3863325d993',
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

/** Exact content-only source changes; historical observations stay historical.
 * All typography declarations remain reconciled against the sealed inventory.
 * Changed rendered surfaces require their separate cloud browser receipts. */
export const contentReorganizationProofs = {
  "src/components/DevelopmentWorkflowPage.astro": {
    "currentSourceSha256": "63ded467e6c88a0b08479b47c55c6c6c681579e1e657d6442b76bb2610229b10",
    "priorSourceSha256": "3f632f3ce25508787dd2aa0799aa0de7345f70c2e8b3fea4dcfd149cfa7d2d0e",
    "reason": "Quota-aware Cloudflare-first and Vercel fallback explanations replace outdated human-facing CI text without changing sealed typography CSS declarations. Historical /development/ consumer screenshots are invalidated; exact-head browser geometry and authenticated release inspection are required."
  },
  "src/pages/_bodies/home-v2.astro": {
    "currentSourceSha256": "41561fc6d4f6b72ed3f66615c078362f7a0b7f52e3773de3f2ea589c54214554",
    "priorSourceSha256": "a0bf9e23f420eb6dd25601c4ae19f7aff0dbf320f2ba12e65cf0f3ae24289faa",
    "reason": "Content directories reorganized and duplicate summaries removed; all classified typography declarations retained. Historical rendered text/geometry is invalidated; current cloud browser evidence is required."
  },
  "src/components/research/OpenEvoCapabilityMapLobby.astro": {
    "currentSourceSha256": "21584e442fe25685e6da1469de6cbb0154fbee488dc85b73162e52b25e7e4e40",
    "priorSourceSha256": "01d74f8b0111f8cf7d72792667c0ba57c718ba507a91d3df8bb021c1f980763e",
    "reason": "Content directories reorganized and duplicate summaries removed; all classified typography declarations retained. Historical rendered text/geometry is invalidated; current cloud browser evidence is required."
  },
  "src/components/research/OpenEvoExperimentIndex.astro": {
    "currentSourceSha256": "551d54025dc98b4dce4ffc89acb2ac5e30150d68e84837b7e56dd76d18f927da",
    "priorSourceSha256": "455b90e842f5e920d52fb4ce012699243a83f3943e04a81130acf8fdcdb80e21",
    "reason": "Content directories reorganized and duplicate summaries removed; all classified typography declarations retained. Historical rendered text/geometry is invalidated; current cloud browser evidence is required."
  },
  "src/components/research/SeedOpenEvoResearchNav.astro": {
    "currentSourceSha256": "20083c9a182beaa07fc8cab0391e030a40ee6f82ef9a9578cccf72592e0f3c21",
    "priorSourceSha256": "3de89eb8b19d7194438899e0e6020ddc888b1fd088868a6aea8e7168f0049aac",
    "reason": "Content directories reorganized and duplicate summaries removed; all classified typography declarations retained. Historical rendered text/geometry is invalidated; current cloud browser evidence is required."
  },
  "src/pages/research/seed-openevo/study/results/[note].astro": {
    "currentSourceSha256": "d6633cdd26a1a81d3b97acd328e50ae76996332ff1f6ab9e2ec7a473f6ba302d",
    "priorSourceSha256": "dbbffb949d767a511308e5e89e997f6a7b334406e9cd94703c4491afc0dc9a06",
    "reason": "Move unchanged result-note metadata to its canonical shared module for page rendering and search. Historical rendered observations require fresh browser evidence."
  }
};
