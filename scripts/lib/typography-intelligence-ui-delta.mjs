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

/** Exact content or value-preserving source changes; historical observations stay historical.
 * All typography declarations remain reconciled against the sealed inventory.
 * Changed rendered surfaces require their separate cloud browser receipts. */
export const contentReorganizationProofs = {
  "src/components/research/Lyg2171ServerOverview.astro": {
    "currentSourceSha256": "a8ea8c54f131e4fadb486a36dd45ac7eb59cb5730edb6440e74ed58fb44fbea1",
    "priorSourceSha256": "57862a9badd1e5a6f45b1258b4a44b5c0ae97930201242754d45e17ee92745ef",
    "reason": "2026-11-25 website product rename: only two Chinese prompt references replace the former website brand with OpenEVO website repository. All SOP paths, read-only and deletion/visibility restrictions, English content, DOM and typography are exactly preserved. Historical visual proof is not current evidence."
  },
  "src/components/research/OpenEvoSuccessorExplorationMap.astro": {
    "currentSourceSha256": "2e119d53f2aa94e5c5d5b2c5458f8bf655f4f3c735c2e31dcca2304eac9518e2",
    "priorSourceSha256": "3734580d6d7e90bebaeee05f6cf4bc268b7c335544e073871366ed34179431eb",
    "reason": "2026-11-20 #1026 follow-up to FAILED exact-head de3f66e8 / Public PR CI 44627761650: full Chromium and WebKit job logs identify exploration orientation bottoms 662.78125 and 687.96875 at 1280x633, above the unchanged 635px maximum. Keep the five fields, all HTML/copy, and every font declaration byte-identical. At desktop widths restore the existing two-column title/lede composition and use shared panel/inline spacing via existing ResearchOrientation variables. No hiding, spacer or new type scale. Source reconstruction is deterministic evidence only; fresh exact-head browser geometry remains PENDING."
  },
  "src/components/research/ResearchOrientation.astro": {
      "currentSourceSha256": "1bef6d9663f0bb2328951d4f240f9f7298d2717b9ecaa5e18955e816b4db0d2d",
      "priorSourceSha256": "7b94cfba4517250cc796f295f1d1326816666aa85b639b074b2e37efb907c5c9",
      "reason": "2026-11-20 #1026 scope correction: candidate 9631bf67 was rejected by the existing mechanism-map isolation planner because the map used a :global descendant selector. Keep the planner restriction unchanged. The shared ResearchOrientation field owner now reads one inherited article-orientation-field-padding custom property with its exact former .72rem .8rem fallback. Only the mechanism map sets this local density to existing inline/heading rhythm roles. All other routes, source text and font declarations retain their prior inputs. Exact reversal reconstructs the former owner source; current-head full UI acceptance remains required."
  },
  "src/components/research/OpenEvoExperimentArchive.astro": {
      "currentSourceSha256": "6afaba2dc42be7b244d0124b715dd4b512a8bc69c52325680b54e55b64edebde",
      "priorSourceSha256": "6b6255604f778b9e8be82855e157b50f9295123d95854e21043426f9022027a7",
      "reason": "2026-11-20 #1026 first-screen correction: Public PR CI 44622799986 at candidate d4d93442 measured the archive h1 at y=532.53125 in a 1280x633 viewport. Align its existing grid cells at the start so the primary title is not pushed down by the longer adjacent explanation. No source text, font, data, or heading budget changes. Exact reversal tests preserve the preceding source bytes. Historical observations remain invalidated; the new candidate requires full Chromium/WebKit and the unchanged UX assertions."
  },
  "src/components/research/OpenEvoMechanismMap.astro": {
      "currentSourceSha256": "56586ca814ede71c2610f3803f3007952201b8020e8c585f0973223b52aa94c0",
      "priorSourceSha256": "4a40f9b7bb8f7448b855d911855142621af9497ec95239f1d380a41400bafc57",
      "reason": "2026-11-20 #1026 first-screen correction: Public PR CI 44622799986 at candidate d4d93442 measured the five-field orientation bottom at 668.1875 in a 1280x633 viewport in both Chromium and WebKit. Use the existing panel inset and inline field density at desktop widths; keep every visible field, existing typography and scientific boundary. The intermediate source 0505b2dd0158df55324eca5fbf169f9f90b404e4f9012016cac2e519f068d364 at candidate 9631bf67 failed the existing local-scope planner due to :global. The same field density now passes by inherited custom property to its shared ResearchOrientation owner; the local-scope gate remains intact. Exact reversal tests preserve the preceding source bytes. Historical observations remain invalidated; the new candidate requires full Chromium/WebKit and the unchanged UX assertions."
  },
  "src/components/research/OpenEvoGatedDeltaSdLoraExplainer.astro": {
      "currentSourceSha256": "75d1e82677781970178d8d4baee3601a703bee4693a1286260c3dba2f944cc95",
      "priorSourceSha256": "cb1a6e04c0bcd3e091be60090d7d1ee27259f607f174e43a98eefcab361cd5b7",
      "reason": "2026-11-20 #1026 first-screen correction: Public PR CI 44622799986 at candidate d4d93442 detected two competing phone first-screen headings against the unchanged budget of one. Use the shared section spacing for the derivation chapter following the introduction. This is a normal chapter boundary, with no artificial height, hidden content, or changed heading/font size. Exact reversal tests preserve the preceding source bytes. Historical observations remain invalidated; the new candidate requires full Chromium/WebKit and the unchanged UX assertions. Follow-up: this spacing-only candidate still FAILED in exact-head run 44627761650 (h2 y671.296875 at 390x844). The current candidate adds a genuine 44px history-link touch target without changing text, fonts or attention budgets; its browser result is still PENDING."
  },
  "src/styles/tokens.css": {
    "currentSourceSha256": "7e77b75eae21c33e0648f8dceeef449244bbc832e930957eccb0ba1403c78b73",
    "priorSourceSha256": "7ac2f8ef309ea4aa49e5491eb96bcc25b54c42251f6f6feacdcb62818ab60e88",
    "reason": "2026-11-20 #1026: add finite spacing aliases/relative rhythm consumed by every compiled CSS entry. Preserve every existing font, type-size, weight, leading and color value. Link the legacy type-reading-measure alias to the same reading width. The previously winning 68ch reading measure moves here from design-refinement.css; retire the stale 720px/72ch override chain. Source reconstruction tests retain the prior sealed bytes. Historical observations remain invalidated and fresh all-route Chromium/WebKit evidence is required."
  },
  "src/styles/visual-upgrade.css": {
    "currentSourceSha256": "97ad749c43b307aa98700074f0b59052a6a533cd61efddbb3d4047cd37e59329",
    "priorSourceSha256": "9296c259dc03812e084d9cb85637a9a457d0ffab4fdc7394c3c085d15ec77bd0",
    "reason": "2026-11-20 #1026: remove only the superseded 72ch reading-width declaration. tokens.css now owns the prior final 68ch measure. All remaining source bytes, scientific values and typography declarations are unchanged; retain the original proof and require current browser acceptance."
  },
  "src/styles/site.css": {
    "currentSourceSha256": "d3a6c68e2218ae6962232af5668e322fbd5f7a9840fb371e691033a0e1e65c08",
    "priorSourceSha256": "b87de801460715bfce262ddadef3ae65c09c47c957d48b4f59227d5f87b6d440",
    "reason": "2026-11-20 #1026: 87 existing margin/padding/gap declarations consume existing shared spacing tokens (91 references); add paragraph/list rhythm and reading measure, retire two shadowed shell widths, and bind ordinary strong/b to its existing weight token via one separately classified declaration. Reversing these exact changes reconstructs the sealed prior CSS byte for byte. The compiler separately normalizes ordinary spacing and reading measures; historical fonts and scientific declarations are not relabelled as new evidence. Current built-route CSS reachability and separate 440x956/1440x1000 Chromium/WebKit runtime evidence are required; historical screenshots are not reused."
  },
  "src/components/research/SeedOpenEvoResearchDetail.astro": {
    "currentSourceSha256": "c70c5287fda5be80b4e5ffd8e431721691e6f730a3021751e5e65d863cbf820e",
    "priorSourceSha256": "4229fbbf7a71bf9c8a603afea471628b8ca02bfb2bd57e2deb734bdbb7e9a67c",
    "reason": "The earlier sealed typography owner predates the 2026-10-09 reader-path and subsequent editorial-article integration. The new version preserves factual copy and all inherited font declarations while adding native learning anchors and preserving the newer WebShop breadcrumb/reading owner. Prior rendered observations remain historical; exact-head browser evidence is pending."
  },
  "src/components/DevelopmentWorkflowPage.astro": {
    "currentSourceSha256": "65f86f3141bd9abe86f93160d712f741c1913fccc50c65d789f873a73e7e468b",
    "priorSourceSha256": "63ded467e6c88a0b08479b47c55c6c6c681579e1e657d6442b76bb2610229b10",
    "reason": "Owner selected Vercel as the default manual release destination with Cloudflare Access protected as standby. Bilingual reader copy was updated without changing typography CSS declarations; previous /development/ screenshots are not current visual evidence. Exact-head browser and authenticated Production inspection are required. 2026-11-25 product rename: the immediately preceding exact source 415e4a9b8817c4e0611fe916f5e488bba922a0615e9661f8af687d1b7aabf3ff remains historical evidence. Only the six specified Chinese/English product-name substitutions changed the page; its style block, provider facts, route, and scientific boundaries are byte-identical outside those substitutions. Current source identity is a candidate, not a new visual observation. 2026-11-25 hosting rename: previous brand-only candidate dbd3b28769c4d5738636ec0850ec89b11e3a4a7fedcd99959f3bc537f3288aa3 remains the exact predecessor. Replace only the verified Production href with the new domain; both aliases serve the same protected project, original CSS/text and historical receipt remain unchanged. Current visual acceptance still requires exact-head browser evidence."
  },
  "src/pages/_bodies/home-v2.astro": {
    "currentSourceSha256": "6164770e676a543ae44ad96c138bed35018f9db4a3236ab79239874d4129fc9d",
    "priorSourceSha256": "a0bf9e23f420eb6dd25601c4ae19f7aff0dbf320f2ba12e65cf0f3ae24289faa",
    "reason": "Content directories reorganized and duplicate summaries removed; all classified typography declarations retained. The previously reviewed current source SHA was 41561fc6d4f6b72ed3f66615c078362f7a0b7f52e3773de3f2ea589c54214554. 2026-11-06: three existing Home evidence links now include their existing finding titles in bilingual accessible names, preserving visible copy, targets, scientific claims, all CSS/typography declarations, and existing route ownership. The exact new source identity is reviewed here after Cloudflare's first CI run correctly rejected the stale hash. 2026-11-06: the Home still has exactly three evidence links; correcting the third link's stale Results #next hash to the actual existing Results #next-steps section changes no rendered copy, typography, scientific claim or CSS ownership; the original source identity above remains an audit trail. Historical rendered text/geometry remains invalidated; fresh exact-head Chromium/WebKit and authenticated Production review are separate and still required. 2026-11-08: a separately reviewed Home-only dead-selector retirement removed four Astro-scoped class families and eight historical typography tuples, with a pinned before/after Git blob proof in reviewedHomeDeadTypographyRetirement. This current SHA-256 supersedes the previously reviewed 886d11c05461e135f7afc84251e076cd9d25ccff597fce64aaf829dd21e8e3bb for the current source only; the original prior-source identity and sealed historical ledger remain unchanged. The 2026-11-08 CSS reduction and reduced-motion interaction require new exact-head Chromium/WebKit screenshots and independent page acceptance, not reused historical observations. 2026-11-08 follow-up #1010: the Home four research destination rows gain scoped :hover and :focus-visible accent cues without changing scientific copy, any classified typography value or global CSS ownership. The previously reviewed 31a0147a8b10eef11a35391f03eb88cde846334f15612ebbe8093adb55293ecd is retained in this narrative; 9afad38fa71be292cb2e342e645c0ad777a9d7b5eabda191585bc5de8ec67749 is the exact current source SHA-256 independently rejected by both 2026-11-08 current-head verify:deploy jobs until this review. The previous #1009 Git blob retirement remains sealed in reviewedHomeDeadTypographyRetirement, and its exact follow-up source is recorded independently in reviewedHomeScopedLinkFocusContinuation. This candidate still requires new exact-head Chromium/WebKit screenshot, keyboard and both CI gates; no historical rendered evidence is promoted. 2026-11-10 #1020: separate Home-only answer-spacing review reduces only `.home-section.home-answer` top padding to 1rem; prior approved current SHA-256 9afad38fa71be292cb2e342e645c0ad777a9d7b5eabda191585bc5de8ec67749 remains a historical predecessor, while new exact source SHA-256 185aa31f0c5e400984a4193f7f6e0e5b969305e21110d2757ccb0120470851d3 matches the hosted CI's calculated source. All eight retired typography declarations, prior focus semantics and scientific content remain unchanged. The independently linked Git blob provenance is in reviewedHomeAnswerSpacingContinuation; new browser evidence and protected Production acceptance are still outstanding. 2026-11-10 #1023: the prior reviewed Home current-source SHA-256 185aa31f0c5e400984a4193f7f6e0e5b969305e21110d2757ccb0120470851d3 remains the predecessor, while 6164770e676a543ae44ad96c138bed35018f9db4a3236ab79239874d4129fc9d is the candidate exact-source SHA-256 reported by the hosted Cloudflare verification. Only the existing next-steps and reflection sections exchanged order after the three unchanged evidence answers; no scientific copy, links, privacy aliases, page CSS, or typography values changed. The independently reviewed Git blob lineage and section-order assertion are in reviewedHomeNextStepOrderContinuation; current-head browser screenshots and protected Production acceptance remain separate and pending."
  },
  "src/components/research/OpenEvoCapabilityMapLobby.astro": {
    "currentSourceSha256": "21584e442fe25685e6da1469de6cbb0154fbee488dc85b73162e52b25e7e4e40",
    "priorSourceSha256": "01d74f8b0111f8cf7d72792667c0ba57c718ba507a91d3df8bb021c1f980763e",
    "reason": "Content directories reorganized and duplicate summaries removed; all classified typography declarations retained. Historical rendered text/geometry is invalidated; current cloud browser evidence is required."
  },
  "src/components/research/OpenEvoExperimentIndex.astro": {
    "currentSourceSha256": "932f10b60cf92d534034feb198a65502384c2ad2cbf77897839214f7b96d98d7",
    "priorSourceSha256": "551d54025dc98b4dce4ffc89acb2ac5e30150d68e84837b7e56dd76d18f927da",
    "reason": "2026-11-02 owner privacy correction: remove the public URL to a private meeting RAW and replace it with a non-link disclosure. One markup line only; no CSS/typography declaration changed. 2026-11-20: the owner-approved OpenEVO stage report is linked from the study index with Chinese-only routing and a bilingual pointer; no original study content, experiment data, source privacy or typography declarations changed. Previous source identities and rendered observations remain historical; new exact-head desktop and phone browser checks are required."
  },
  "src/components/research/SeedOpenEvoResearchNav.astro": {
    "currentSourceSha256": "20083c9a182beaa07fc8cab0391e030a40ee6f82ef9a9578cccf72592e0f3c21",
    "priorSourceSha256": "3de89eb8b19d7194438899e0e6020ddc888b1fd088868a6aea8e7168f0049aac",
    "reason": "Content directories reorganized and duplicate summaries removed; all classified typography declarations retained. Historical rendered text/geometry is invalidated; current cloud browser evidence is required."
  },
  "src/components/research/OpenEvoWebShopResultsQuestions.astro": {
    "currentSourceSha256": "1cffafb2a4e02ede1461b3ea88056215e8de6e04e767a7a90c9dd6766993879a",
    "priorSourceSha256": "b0788bddb616822e5e40e9dc8667b31ef51d8191bc5a668f64c27a7af1bc851e",
    "reason": "2026-11-07 exact-source accessibility-only continuation from the current main Results component. The two existing measurement-audit articles are named by their visible strong labels and the six Q1-Q6 question articles by their unchanged visible H3 headings using unique IDs and aria-labelledby. Q7 stays a separate named section. No rendered research copy, experiment data, links, typography declarations, design tokens, or component structure changed. Historical visual observations are not adopted for this candidate; current exact-head Chromium and WebKit 440x956/1440x1000 both-theme keyboard and no-overflow checks plus independent screenshot review remain required before merge, and authenticated Production review is separate."
  },
  "src/pages/research/seed-openevo/study/results/[note].astro": {
    "currentSourceSha256": "d6633cdd26a1a81d3b97acd328e50ae76996332ff1f6ab9e2ec7a473f6ba302d",
    "priorSourceSha256": "dbbffb949d767a511308e5e89e997f6a7b334406e9cd94703c4491afc0dc9a06",
    "reason": "Move unchanged result-note metadata to its canonical shared module for page rendering and search. Historical rendered observations require fresh browser evidence."
  }
};
