import process from 'node:process';
import {
  buildBlindColdRead,
  buildPreferenceCompareRead,
  preferenceReviewContextForContract,
  readerContractById,
} from '../src/lib/humanPreferenceLearning';

const args = process.argv.slice(2);
const contractId = args.find((arg) => !arg.startsWith('--'))?.trim();
const phase = (args.find((arg) => arg.startsWith('--phase='))?.split('=', 2)[1] ?? 'blind') as 'blind' | 'compare' | 'receipt';
const url = args.find((arg) => arg.startsWith('--url='))?.split('=', 2)[1]?.trim();
if (!contractId) {
  console.error('Usage: npm run feedback:cold-read -- study --phase=blind [--url=https://...]');
  process.exit(1);
}
const contract = readerContractById(contractId);
if (!contract) {
  console.error(`Unknown reader contract: ${contractId}`);
  process.exit(1);
}

if (phase === 'blind') {
  console.log(buildBlindColdRead(contractId, url).join('\n'));
  process.exit(0);
}

if (phase === 'compare') {
  console.log(buildPreferenceCompareRead(contractId).join('\n'));
  process.exit(0);
}

if (phase === 'receipt') {
  const context = preferenceReviewContextForContract(contractId)!;
  const template = {
    schemaVersion: 1,
    contractId,
    exactHead: 'REPLACE_WITH_40_CHAR_GIT_SHA',
    candidateUrl: url || 'https://REPLACE_WITH_RENDERED_URL',
    reviewer: { kind: 'independent-agent', label: 'REPLACE_WITH_REVIEWER' },
    blindCompletedBeforePreferenceReveal: false,
    blind: {
      about: '',
      firstAttention: '',
      mostImportant: '',
      machineLike: '',
      terminologyFriction: '',
      competingCenters: '',
      hiddenBoundary: '',
      suggestedChange: '',
      readingDesireScore: 0,
      readingDesireReason: '',
    },
    preferenceJudgments: context.preferences.map((preference) => ({ preferenceId: preference.id, verdict: 'fail', evidence: '' })),
    pairJudgments: context.goldPairs.map((pair) => ({ pairId: pair.id, verdict: 'rejected-like', evidence: '' })),
    scientificBoundary: { verdict: 'fail', evidence: '' },
    unresolvedConcerns: ['REPLACE_OR_REMOVE'],
    finalVerdict: 'FAIL',
    rationale: '',
  };
  console.log(JSON.stringify(template, null, 2));
  process.exit(0);
}

console.error(`Unknown phase: ${phase}`);
process.exit(1);
