import {
  HUMAN_FEEDBACK_EVENTS,
  HUMAN_PREFERENCE_TRAJECTORIES,
  HUMAN_VISUAL_REFERENCE_SET,
  failureFamilySeverity,
  hardFailureFamilies,
  type HumanFeedbackEvent,
  type HumanPreferenceScopeV2,
  type HumanVisualReference,
  type PreferenceTrajectory,
} from '../data/humanPreferenceLearningHistory';
import type { HumanPreferenceScope } from '../data/humanPreferenceModel';
import {
  retrieveHumanPreferenceContext,
  preferenceReviewContextForContract,
  tokenizeHumanPreferenceQuery,
} from './humanPreferenceLearning';

export interface HumanPreferenceBriefInput {
  query: string;
  contractId?: string;
  scope?: HumanPreferenceScopeV2;
}

export interface HumanPreferenceBrief {
  query: string;
  contractId?: string;
  hardFailureFamilies: string[];
  events: HumanFeedbackEvent[];
  trajectories: PreferenceTrajectory[];
  visualReferences: HumanVisualReference[];
  learnedPreferences: ReturnType<typeof retrieveHumanPreferenceContext>['preferences'];
  goldPairs: ReturnType<typeof retrieveHumanPreferenceContext>['goldPairs'];
  antiOvergeneralization: string[];
  generationRules: string[];
}

const normalize = (value: string) => value.toLowerCase();

function relevanceScore(haystack: string, query: string): number {
  const normalized = normalize(haystack);
  return tokenizeHumanPreferenceQuery(query).reduce((score, token) => score + (normalized.includes(token) ? 2 : 0), 0);
}

function inferredScope(contractId?: string): HumanPreferenceScopeV2 | undefined {
  if (!contractId) return undefined;
  if (contractId === 'study-briefing') return 'briefing';
  if (contractId === 'study-results' || contractId.startsWith('result-')) return 'results';
  if (contractId.startsWith('capability-')) return 'research-ui';
  if (contractId.startsWith('study')) return 'research-ui';
  return 'all-public-ui';
}

export function buildHumanPreferenceBrief(input: HumanPreferenceBriefInput): HumanPreferenceBrief {
  const scope = input.scope ?? inferredScope(input.contractId);
  const workflowCue = /preview|预览|build|构建|vercel|网页草稿|审阅|迭代|快速|等待/i.test(input.query);
  const retrievalScope: HumanPreferenceScope | undefined =
    scope === 'briefing-mobile' || scope === 'briefing-desktop' ? 'briefing' :
    scope === 'visual' ? undefined : scope;
  const retrieved = retrieveHumanPreferenceContext(input.query, input.contractId, 10, retrievalScope);
  const review = input.contractId ? preferenceReviewContextForContract(input.contractId) : undefined;

  const events = HUMAN_FEEDBACK_EVENTS
    .map((event) => {
      const scopeCompatible = !scope || event.scopes.includes(scope) || event.scopes.includes('all-public-ui') || (event.scopes.includes('workflow') && workflowCue);
      return {
        event,
        score: scopeCompatible
          ? (scope && event.scopes.includes(scope) ? 8 : 0) +
            relevanceScore(
              [event.ownerSignal, ...event.reasons, ...event.failureMechanisms, event.artifact].join(' '),
              input.query,
            )
          : 0,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.event.date.localeCompare(a.event.date))
    .slice(0, 14)
    .map(({ event }) => event);

  const eventVariantIds = new Set(events.map((event) => event.variantId));
  const trajectories = HUMAN_PREFERENCE_TRAJECTORIES.filter(
    (trajectory) =>
      (!scope || trajectory.scopes.includes(scope)) ||
      trajectory.variantIds.some((variantId) => eventVariantIds.has(variantId)),
  );

  const visualReferences = HUMAN_VISUAL_REFERENCE_SET.filter(
    (reference) => !scope || reference.scopes.includes(scope),
  );

  const antiOvergeneralization = [
    ...(review?.preferences.flatMap((preference) => preference.antiOvergeneralization) ?? []),
    ...retrieved.preferences.flatMap(({ preference }) => preference.antiOvergeneralization),
  ].filter((value, index, array) => array.indexOf(value) === index);

  const hard = hardFailureFamilies().filter((family) =>
    HUMAN_FEEDBACK_EVENTS.some((event) =>
      event.failureMechanisms.includes(family) &&
      (!scope || event.scopes.includes(scope) || event.scopes.includes('all-public-ui')),
    ),
  );
  const repeated = [...new Set(events.flatMap((event) => event.failureMechanisms))]
    .filter((family) => failureFamilySeverity(family) === 'repeated')
    .sort();

  const generationRules = [
    'Do not start from generic Agent aesthetics; treat this brief as generation context before the first substantial draft.',
    hard.length
      ? `Hard failure families must be explicitly checked before owner review: ${hard.join(', ')}.`
      : 'No hard failure family is currently activated for this task.',
    repeated.length
      ? `Repeated failure families deserve proactive sibling-surface scanning: ${repeated.join(', ')}.`
      : 'No repeated failure family was retrieved for this task.',
    visualReferences.some((reference) => reference.tier === 'silver')
      ? 'Silver visual references are directional evidence only; preserve what improved without treating them as approved templates.'
      : 'No Silver visual reference is available; do not invent a visual preference from generic taste.',
    visualReferences.some((reference) => reference.tier === 'golden')
      ? 'Golden visual references may be used as canonical visual anchors within their recorded scope.'
      : 'There is no Golden visual reference for this scope; do not claim an owner-approved template exists.',
    visualReferences.some((reference) => reference.tier === 'current-candidate')
      ? 'Current-candidate visual references are still under review; use them only as evidence of the live iteration state, never as accepted or Golden preference.'
      : 'No current-candidate visual is active for this scope.',
    'For material user-facing work, internally produce 2–3 candidates, rank them pairwise against this brief, and show the owner only the selected candidate.',
    'For visual work, every internal candidate needs a screenshot reference before pairwise ranking.',
    'After generation, run the existing blind cold read before revealing preference evidence, then run the preference comparison/judge.',
  ];

  return {
    query: input.query,
    contractId: input.contractId,
    hardFailureFamilies: hard,
    events,
    trajectories,
    visualReferences,
    learnedPreferences: retrieved.preferences,
    goldPairs: retrieved.goldPairs,
    antiOvergeneralization,
    generationRules,
  };
}

export function renderHumanPreferenceBriefMarkdown(brief: HumanPreferenceBrief): string {
  const lines: string[] = [
    '# Human Preference Brief',
    '',
    `Query: ${brief.query}`,
    brief.contractId ? `Reader Contract: ${brief.contractId}` : 'Reader Contract: none',
    '',
    '## Generation rules',
    ...brief.generationRules.map((rule) => `- ${rule}`),
    '',
    '## Hard failure families',
    ...(brief.hardFailureFamilies.length
      ? brief.hardFailureFamilies.map((family) => `- ${family}`)
      : ['- none']),
    '',
    '## Most relevant direct feedback events',
  ];

  for (const event of brief.events) {
    lines.push(`- ${event.id} · ${event.verdict} · ${event.variantId}`);
    lines.push(`  owner: ${event.ownerSignal}`);
    lines.push(`  mechanism: ${event.failureMechanisms.join(', ')}`);
  }

  lines.push('', '## Preference trajectories');
  if (!brief.trajectories.length) lines.push('- none');
  for (const trajectory of brief.trajectories) {
    lines.push(`- ${trajectory.id}: ${trajectory.note}`);
    for (const comparison of trajectory.comparisons) {
      lines.push(`  - ${comparison.betterVariantId} > ${comparison.worseVariantId}: ${comparison.reason}`);
    }
  }

  lines.push('', '## Visual references');
  if (!brief.visualReferences.length) lines.push('- none');
  for (const reference of brief.visualReferences) {
    const locator = [reference.repository && `repo=${reference.repository}`, reference.gitSha && `sha=${reference.gitSha}`, reference.pullRequest && `PR=#${reference.pullRequest}`, reference.route]
      .filter(Boolean)
      .join(' · ');
    lines.push(`- ${reference.tier.toUpperCase()} · ${reference.id} · ${locator || 'no locator'}`);
    lines.push(`  ${reference.ownerEvidence}`);
    lines.push(`  boundary: ${reference.note}`);
  }

  lines.push('', '## Retrieved Preference Model');
  for (const { preference } of brief.learnedPreferences) {
    lines.push(`- ${preference.id} ${preference.title}: ${preference.statement}`);
  }

  lines.push('', '## Retrieved Gold Pairs');
  for (const { pair } of brief.goldPairs) {
    lines.push(`- ${pair.id}`);
    lines.push(`  rejected: ${pair.rejected}`);
    lines.push(`  accepted: ${pair.accepted}`);
  }

  lines.push('', '## Anti-overgeneralization boundaries');
  for (const boundary of brief.antiOvergeneralization) lines.push(`- ${boundary}`);

  return lines.join('\n');
}

export interface CandidateVariantReceipt {
  id: string;
  hypothesis: string;
  attentionCenter: string;
  informationDensity: string;
  visualLanguage: string;
  screenshotRef: string;
  predictedFailureFamilies: string[];
}

export interface CandidateComparisonReceipt {
  winnerId: string;
  loserId: string;
  reason: string;
  evidence: string;
}

export interface HumanPreferenceCandidateReceipt {
  schema: 'human-preference-candidate-set.v2';
  contractId: string;
  task: string;
  exactGitSha: string;
  variants: CandidateVariantReceipt[];
  comparisons: CandidateComparisonReceipt[];
  selectedVariantId: string;
  hardFamiliesChecked: string[];
  ownerSawOnlySelectedCandidate: boolean;
}

export function candidateReceiptTemplate(contractId: string, task: string): HumanPreferenceCandidateReceipt {
  return {
    schema: 'human-preference-candidate-set.v2',
    contractId,
    task,
    exactGitSha: '<fill-exact-git-sha>',
    variants: ['A', 'B', 'C'].map((id) => ({
      id,
      hypothesis: '<what this candidate is trying to optimize>',
      attentionCenter: '<first visual/cognitive target>',
      informationDensity: '<why this amount is appropriate>',
      visualLanguage: '<layout/color/type rationale>',
      screenshotRef: '<required screenshot path/url>',
      predictedFailureFamilies: [],
    })),
    comparisons: [
      { winnerId: '<winner>', loserId: '<loser>', reason: '<preference reason>', evidence: '<visible evidence>' },
      { winnerId: '<winner>', loserId: '<loser>', reason: '<preference reason>', evidence: '<visible evidence>' },
    ],
    selectedVariantId: '<fill-selected-variant>',
    hardFamiliesChecked: hardFailureFamilies(),
    ownerSawOnlySelectedCandidate: true,
  };
}

export function verifyCandidateReceipt(receipt: HumanPreferenceCandidateReceipt): string[] {
  const failures: string[] = [];
  if (receipt.schema !== 'human-preference-candidate-set.v2') failures.push('wrong schema');
  if (!receipt.contractId.trim()) failures.push('missing contractId');
  if (!receipt.task.trim()) failures.push('missing task');
  if (!/^[0-9a-f]{40}$/i.test(receipt.exactGitSha)) failures.push('exactGitSha must be a 40-character Git SHA');
  if (receipt.variants.length < 2 || receipt.variants.length > 3) failures.push('candidate set must contain 2–3 variants');

  const ids = new Set<string>();
  for (const variant of receipt.variants) {
    if (!variant.id.trim()) failures.push('candidate id cannot be empty');
    if (ids.has(variant.id)) failures.push(`duplicate candidate id: ${variant.id}`);
    ids.add(variant.id);
    if (!variant.hypothesis.trim()) failures.push(`${variant.id}: missing hypothesis`);
    if (!variant.attentionCenter.trim()) failures.push(`${variant.id}: missing attentionCenter`);
    if (!variant.screenshotRef.trim() || variant.screenshotRef.includes('<required')) failures.push(`${variant.id}: missing screenshotRef`);
  }

  if (!ids.has(receipt.selectedVariantId)) failures.push('selectedVariantId does not name a candidate');
  for (const variant of receipt.variants) {
    if (variant.id === receipt.selectedVariantId) continue;
    const win = receipt.comparisons.find(
      (comparison) => comparison.winnerId === receipt.selectedVariantId && comparison.loserId === variant.id,
    );
    if (!win) failures.push(`selected candidate must beat ${variant.id} in a recorded pairwise comparison`);
    else if (!win.reason.trim() || !win.evidence.trim()) failures.push(`comparison against ${variant.id} needs reason and evidence`);
  }

  for (const hardFamily of hardFailureFamilies()) {
    if (!receipt.hardFamiliesChecked.includes(hardFamily)) failures.push(`hard failure family not checked: ${hardFamily}`);
  }
  if (!receipt.ownerSawOnlySelectedCandidate) failures.push('ownerSawOnlySelectedCandidate must be true');
  return failures;
}
