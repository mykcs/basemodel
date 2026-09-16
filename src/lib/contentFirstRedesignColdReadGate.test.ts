import { describe, expect, it } from 'vitest';
import { goldPairIdsForContract, preferenceIdsForContract } from './humanPreferenceLearning';
import type { HumanPreferenceJudgeReceipt } from './humanPreferenceJudge';
import {
  CONTENT_FIRST_PILOTS,
  CONTENT_FIRST_VIEWPORTS,
  validateContentFirstColdReadBundle,
  type ContentFirstColdReadBundle,
  type ContentFirstColdReadReceipt,
} from '../../scripts/content-first-redesign-cold-read-gate';

const productHead = 'b'.repeat(40);

function receipt(
  contractId: string,
  candidateUrl: string,
  reviewViewport: ContentFirstColdReadReceipt['reviewViewport'],
  reviewer: HumanPreferenceJudgeReceipt['reviewer'] = { kind: 'independent-agent', label: 'external-cold-reader' },
): ContentFirstColdReadReceipt {
  return {
    schemaVersion: 1,
    contractId,
    exactHead: productHead,
    candidateUrl,
    reviewer,
    reviewViewport,
    blindCompletedBeforePreferenceReveal: true,
    blind: {
      about: 'A research page.',
      firstAttention: 'The primary object.',
      mostImportant: 'The main fact.',
      machineLike: 'No obvious presenter language.',
      terminologyFriction: 'Low.',
      competingCenters: 'One.',
      hiddenBoundary: 'Visible.',
      suggestedChange: 'None.',
      readingDesireScore: 4,
      readingDesireReason: 'The next step is clear.',
    },
    preferenceJudgments: preferenceIdsForContract(contractId).map((preferenceId) => ({
      preferenceId, verdict: 'pass', evidence: 'Visible evidence supports the preference.',
    })),
    pairJudgments: goldPairIdsForContract(contractId).map((pairId) => ({
      pairId, verdict: 'accepted-like', evidence: 'The candidate follows the accepted direction.',
    })),
    scientificBoundary: { verdict: 'pass', evidence: 'Claim-changing caveats remain visible.' },
    unresolvedConcerns: [],
    finalVerdict: 'PASS',
    rationale: 'Independent blind-first review passed.',
  };
}
function bundle(): ContentFirstColdReadBundle {
  return {
    productHead,
    receipts: Object.entries(CONTENT_FIRST_PILOTS).flatMap(([pilotId, pilot]) =>
      Object.entries(CONTENT_FIRST_VIEWPORTS).map(([device, viewport]) => ({
        pilotId: pilotId as keyof typeof CONTENT_FIRST_PILOTS,
        device: device as keyof typeof CONTENT_FIRST_VIEWPORTS,
        receipt: receipt(pilot.contractId, `https://review.example.test${pilot.pathname}`, viewport),
      })),
    ),
  };
}

describe('content-first redesign cold-read gate', () => {
  it('passes with all four pilots reviewed at both canonical viewports on one product head', () => {
    expect(validateContentFirstColdReadBundle(bundle())).toEqual([]);
  });

  it('fails closed when one device receipt is missing', () => {
    const value = bundle();
    value.receipts = value.receipts.filter((item) => !(item.pilotId === 'server' && item.device === 'phone'));
    expect(validateContentFirstColdReadBundle(value)).toContain('missing cold-read receipt: server:phone');
  });
  it('rejects stale receipts from a different product head', () => {
    const value = bundle();
    value.receipts[0]!.receipt.exactHead = 'c'.repeat(40);
    expect(validateContentFirstColdReadBundle(value)).toContain('flow:desktop: receipt exactHead does not match productHead');
  });

  it('rejects a receipt attached to the wrong pilot route', () => {
    const value = bundle();
    value.receipts[0]!.receipt.candidateUrl = 'https://review.example.test/research/seed-openevo/flow/server/';
    expect(validateContentFirstColdReadBundle(value)).toContain('flow:desktop: candidateUrl must target /research/seed-openevo/flow/');
  });

  it('rejects a device label that was not reviewed at its canonical viewport', () => {
    const value = bundle();
    value.receipts.find((item) => item.pilotId === 'q17' && item.device === 'phone')!.receipt.reviewViewport = { width: 1280, height: 633 };
    expect(validateContentFirstColdReadBundle(value)).toContain('q17:phone: reviewViewport must be 390x844');
  });

  it('keeps canonical reviewer semantics instead of inventing a human-only requirement', () => {
    const value = bundle();
    const target = value.receipts.find((item) => item.pilotId === 'flow' && item.device === 'desktop')!;
    target.receipt.reviewer = { kind: 'human', label: 'target-reader' };
    expect(validateContentFirstColdReadBundle(value)).toEqual([]);
  });
});
