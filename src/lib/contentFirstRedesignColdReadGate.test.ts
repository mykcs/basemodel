import { describe, expect, it } from 'vitest';
import { goldPairIdsForContract, preferenceIdsForContract } from './humanPreferenceLearning';
import type { HumanPreferenceJudgeReceipt } from './humanPreferenceJudge';
import {
  CONTENT_FIRST_PILOTS,
  validateContentFirstColdReadBundle,
  type ContentFirstColdReadBundle,
} from './contentFirstRedesignColdReadGate';

const head = 'b'.repeat(40);

function receipt(contractId: string, reviewer: HumanPreferenceJudgeReceipt['reviewer'] = { kind: 'human', label: 'reader-1' }): HumanPreferenceJudgeReceipt {
  return {
    schemaVersion: 1,
    contractId,
    exactHead: head,
    candidateUrl: 'https://review.example.test/route',
    reviewer,
    blindCompletedBeforePreferenceReveal: true,
    blind: {
      about: 'A research page.', firstAttention: 'The primary object.', mostImportant: 'The main fact.',
      machineLike: 'No.', terminologyFriction: 'Low.', competingCenters: 'One.', hiddenBoundary: 'Visible.',
      suggestedChange: 'None.', readingDesireScore: 4, readingDesireReason: 'The next step is clear.',
    },
    preferenceJudgments: preferenceIdsForContract(contractId).map((preferenceId) => ({ preferenceId, verdict: 'pass', evidence: 'Visible.' })),
    pairJudgments: goldPairIdsForContract(contractId).map((pairId) => ({ pairId, verdict: 'accepted-like', evidence: 'Accepted direction.' })),
    scientificBoundary: { verdict: 'pass', evidence: 'Claim boundary visible.' },
    unresolvedConcerns: [],
    finalVerdict: 'PASS',
    rationale: 'Independent blind-first review passed.',
  };
}

function bundle(): ContentFirstColdReadBundle {
  return {
    exactHead: head,
    receipts: Object.entries(CONTENT_FIRST_PILOTS).flatMap(([pilotId, contractId]) =>
      (['desktop', 'phone'] as const).map((device) => ({
        pilotId: pilotId as keyof typeof CONTENT_FIRST_PILOTS,
        device,
        receipt: receipt(contractId),
      })),
    ),
  };
}
describe('content-first redesign cold-read gate', () => {
  it('passes only when every pilot has human desktop and phone receipts on the same exact head', () => {
    expect(validateContentFirstColdReadBundle(bundle())).toEqual([]);
  });

  it('fails closed when one device receipt is missing', () => {
    const value = bundle();
    value.receipts = value.receipts.filter((item) => !(item.pilotId === 'server' && item.device === 'phone'));
    expect(validateContentFirstColdReadBundle(value)).toContain('missing cold-read receipt: server:phone');
  });

  it('does not let an independent-agent receipt satisfy the human Phase C exit', () => {
    const value = bundle();
    const target = value.receipts.find((item) => item.pilotId === 'flow' && item.device === 'desktop')!;
    target.receipt = receipt('flow', { kind: 'independent-agent', label: 'agent-reader' });
    expect(validateContentFirstColdReadBundle(value)).toContain('flow:desktop: Phase C requires a real human cold-read receipt');
  });

  it('rejects stale receipts from a different product head', () => {
    const value = bundle();
    value.receipts[0]!.receipt.exactHead = 'c'.repeat(40);
    expect(validateContentFirstColdReadBundle(value)).toContain('flow:desktop: receipt exactHead does not match bundle exactHead');
  });
});
