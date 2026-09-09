import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';
import {
  HUMAN_FEEDBACK_PRECEDENTS,
  READER_CONTRACT_PRECEDENTS,
  type HumanFeedbackCaseId,
} from '../data/humanFeedbackPrecedents';
import {
  HUMAN_FEEDBACK_GOLD_PAIRS,
  HUMAN_PREFERENCE_MODEL,
  type HumanFeedbackGoldPair,
  type HumanFeedbackPairId,
  type HumanPreferenceDimension,
  type HumanPreferenceId,
  type HumanPreferenceScope,
} from '../data/humanPreferenceModel';

const commonCjkNgrams = new Set([
  '我们', '这个', '可以', '不要', '一个', '然后', '就是', '如果', '已经', '现在', '这里', '还是', '进行',
]);

export const tokenizeHumanPreferenceQuery = (value: string) => {
  const segments = value
    .toLowerCase()
    .split(/[\s,，。/|:：;；()（）\[\]【】→]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
  const tokens = new Set<string>(segments);
  for (const segment of segments) {
    for (const run of segment.match(/[\p{Script=Han}]{2,}/gu) ?? []) {
      for (const width of [2, 3, 4]) {
        if (run.length < width) continue;
        for (let index = 0; index <= run.length - width; index += 1) {
          const gram = run.slice(index, index + width);
          if (width === 2 && commonCjkNgrams.has(gram)) continue;
          tokens.add(gram);
        }
      }
    }
  }
  return [...tokens];
};

const containsAny = (haystack: string, tokens: string[]) => tokens.some((token) => haystack.includes(token));

export interface HumanPreferenceRetrievalResult {
  query: string;
  contractId?: string;
  cases: Array<{ precedent: (typeof HUMAN_FEEDBACK_PRECEDENTS)[number]; score: number }>;
  preferences: Array<{ preference: HumanPreferenceDimension; score: number }>;
  goldPairs: Array<{ pair: HumanFeedbackGoldPair; score: number }>;
}

export function retrieveHumanPreferenceContext(
  query: string,
  contractId?: string,
  limit = 8,
): HumanPreferenceRetrievalResult {
  const normalized = query.toLowerCase();
  const tokens = tokenizeHumanPreferenceQuery(query);
  const boundCases = new Set<HumanFeedbackCaseId>(
    (contractId ? READER_CONTRACT_PRECEDENTS[contractId] : []) as HumanFeedbackCaseId[],
  );

  const cases = HUMAN_FEEDBACK_PRECEDENTS.map((precedent) => {
    const fields = [precedent.title, precedent.principle, ...precedent.tags, ...precedent.antiPatterns, ...precedent.positiveSignals];
    const haystack = fields.join(' ').toLowerCase();
    let score = boundCases.has(precedent.id) ? 10 : 0;
    if (normalized.includes(precedent.id.toLowerCase())) score += 30;
    for (const tag of precedent.tags) if (normalized.includes(tag.toLowerCase())) score += 8;
    for (const token of tokens) if (haystack.includes(token)) score += 2;
    return { precedent, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.precedent.id.localeCompare(b.precedent.id))
    .slice(0, limit);

  const rankedCaseIds = new Set(cases.map(({ precedent }) => precedent.id));
  const preferences = HUMAN_PREFERENCE_MODEL.map((preference) => {
    const haystack = [preference.title, preference.statement, ...preference.retrievalTags, ...preference.antiOvergeneralization]
      .join(' ')
      .toLowerCase();
    const explicitWorkflowCue = containsAny(normalized, ['反馈', '案例', '学习', 'judge', 'cold read', 'gold pair', 'preference model']);
    if (preference.activation === 'explicit-cues' && !explicitWorkflowCue) return { preference, score: 0 };
    let score = preference.priority;
    if (preference.scopes.includes('workflow') && explicitWorkflowCue) score += 12;
    for (const tag of preference.retrievalTags) if (normalized.includes(tag.toLowerCase())) score += 8;
    for (const token of tokens) if (haystack.includes(token)) score += 2;
    for (const caseId of preference.supportingCaseIds) {
      if (rankedCaseIds.has(caseId)) score += 6;
      if (boundCases.has(caseId)) score += 4;
    }
    return { preference, score };
  })
    .filter(({ score }) => score > 4)
    .sort((a, b) => b.score - a.score || b.preference.priority - a.preference.priority)
    .slice(0, Math.min(limit, 10));

  const preferenceIds = new Set(preferences.map(({ preference }) => preference.id));
  const preferenceById = new Map(HUMAN_PREFERENCE_MODEL.map((preference) => [preference.id, preference]));
  const goldPairs = HUMAN_FEEDBACK_GOLD_PAIRS.map((pair) => {
    let score = rankedCaseIds.has(pair.caseId) ? 10 : boundCases.has(pair.caseId) ? 7 : 0;
    for (const preferenceId of pair.preferenceIds) {
      if (preferenceIds.has(preferenceId)) score += 6;
      const preference = preferenceById.get(preferenceId);
      for (const tag of preference?.retrievalTags ?? []) {
        if (normalized.includes(tag.toLowerCase())) score += 8;
      }
    }
    const haystack = [pair.rejected, pair.accepted, pair.reason, ...pair.failureMechanisms].join(' ').toLowerCase();
    for (const token of tokens) if (haystack.includes(token)) score += 2;
    return { pair, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.pair.id.localeCompare(b.pair.id))
    .slice(0, Math.min(limit, 10));

  return { query, contractId, cases, preferences, goldPairs };
}

export function preferenceScopesForContract(contractId: string): HumanPreferenceScope[] {
  const contract = readerContractById(contractId);
  if (!contract) return [];
  const scopes = new Set<HumanPreferenceScope>(['all-public-ui']);
  if (contract.sourceRoute.startsWith('/research/')) {
    scopes.add('research-ui');
    scopes.add('research-copy');
  }
  if (contractId === 'study') scopes.add('study');
  if (contractId === 'study-run') scopes.add('run');
  if (contractId === 'study-briefing') scopes.add('briefing');
  if (contractId === 'study-results' || contractId.startsWith('result-')) scopes.add('results');
  if (contractId.startsWith('capability-')) scopes.add('capability');
  return [...scopes];
}

export function preferenceIdsForContract(contractId: string): HumanPreferenceId[] {
  const caseIds = new Set((READER_CONTRACT_PRECEDENTS[contractId] ?? []) as HumanFeedbackCaseId[]);
  const scopes = new Set(preferenceScopesForContract(contractId));
  return HUMAN_PREFERENCE_MODEL
    .filter((preference) => preference.activation !== 'explicit-cues')
    .filter((preference) =>
      preference.scopes.some((scope) => scopes.has(scope)) ||
      preference.supportingCaseIds.some((caseId) => caseIds.has(caseId)),
    )
    .map((preference) => preference.id);
}

export function goldPairIdsForContract(contractId: string): HumanFeedbackPairId[] {
  const caseIds = new Set((READER_CONTRACT_PRECEDENTS[contractId] ?? []) as HumanFeedbackCaseId[]);
  const scopes = new Set(preferenceScopesForContract(contractId));
  const preferenceIds = new Set(preferenceIdsForContract(contractId));
  return HUMAN_FEEDBACK_GOLD_PAIRS
    .filter((pair) => pair.preferenceIds.some((preferenceId) => preferenceIds.has(preferenceId)))
    .filter((pair) => caseIds.has(pair.caseId) || pair.scopes.some((scope) => scopes.has(scope)))
    .map((pair) => pair.id);
}

export function readerContractById(contractId: string) {
  return SITE_READER_CONTRACTS.find((contract) => contract.id === contractId);
}


export function preferenceReviewContextForContract(contractId: string) {
  const contract = readerContractById(contractId);
  if (!contract) return undefined;
  const preferenceIds = new Set(preferenceIdsForContract(contractId));
  const pairIds = new Set(goldPairIdsForContract(contractId));
  return {
    contract,
    preferences: HUMAN_PREFERENCE_MODEL.filter((item) => preferenceIds.has(item.id)),
    goldPairs: HUMAN_FEEDBACK_GOLD_PAIRS.filter((item) => pairIds.has(item.id)),
  };
}

export function buildBlindColdRead(contractId: string, candidateUrl?: string): string[] {
  const contract = readerContractById(contractId);
  if (!contract) throw new Error(`Unknown reader contract: ${contractId}`);
  const url = candidateUrl || contract.samplePath;
  return [
    `# Phase A · zero-context cold read · ${url}`,
    'Do not read the implementation, PR description, Reader Contract, case library, Preference Model, or Gold Pairs first.',
    'Look only at the rendered page. Answer from what the page itself communicates.',
    '',
    '1. In 5–10 seconds, what is this page about?',
    '2. What did your attention land on first?',
    '3. What is the one most important fact, result, or next action?',
    '4. Which sentence, heading, card, bold phrase, or label feels most machine-written or presenter-like? Why?',
    '5. Did any terminology force you to leave the reading path or reconstruct missing context?',
    '6. Are two or more visual centers competing for equal attention? Name them.',
    '7. Is any caveat or safety/scientific boundary hidden so deeply that the visible claim becomes misleading?',
    '8. What would you remove, rename, or move one layer down while preserving the meaning?',
    '9. How much do you want to continue reading, from 1–5? Give the reason, not just the number.',
    '',
    'Save these answers before running Phase B. Phase B intentionally reveals the historical preference evidence.',
  ];
}

export function buildPreferenceCompareRead(contractId: string): string[] {
  const context = preferenceReviewContextForContract(contractId);
  if (!context) throw new Error(`Unknown reader contract: ${contractId}`);
  const { contract, preferences, goldPairs } = context;
  const lines = [
    `# Phase B · preference comparison · ${contract.id}`,
    'Only run this after Phase A answers have been saved.',
    `Intended audience: ${contract.audience}`,
    `Primary task: ${contract.primaryTask}`,
    `First viewport goal: ${contract.firstViewportGoal}`,
    `Must stay visible: ${contract.mustStayVisible}`,
    `Next step: ${contract.nextStep}`,
    '',
    'Compare the candidate against these learned preferences:',
  ];
  for (const preference of preferences) {
    lines.push(`- ${preference.id} ${preference.title}: ${preference.statement}`);
    lines.push(`  boundary: ${preference.antiOvergeneralization.join(' / ')}`);
  }
  lines.push('', 'Pairwise historical preference checks:');
  for (const pair of goldPairs) {
    lines.push(`- ${pair.id}`);
    lines.push(`  rejected: ${pair.rejected}`);
    lines.push(`  accepted: ${pair.accepted}`);
    lines.push(`  mechanism: ${pair.failureMechanisms.join(', ')}`);
  }
  lines.push(
    '',
    'For every preference, mark pass / intentional-exception / fail with visible evidence.',
    'For every Gold Pair, mark accepted-like / mixed / rejected-like with visible evidence.',
    'A PASS cannot hide a claim-changing scientific boundary, contain a failed preference, or look rejected-like against a required Gold Pair.',
  );
  return lines;
}
