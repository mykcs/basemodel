import { goldPairIdsForContract, preferenceIdsForContract, readerContractById } from './humanPreferenceLearning';
import type { HumanFeedbackPairId, HumanPreferenceId } from '../data/humanPreferenceModel';

export interface HumanPreferenceJudgeReceipt {
  schemaVersion: 1;
  contractId: string;
  exactHead: string;
  candidateUrl: string;
  reviewer: { kind: 'independent-agent' | 'human'; label: string };
  blindCompletedBeforePreferenceReveal: boolean;
  blind: {
    about: string;
    firstAttention: string;
    mostImportant: string;
    machineLike: string;
    terminologyFriction: string;
    competingCenters: string;
    hiddenBoundary: string;
    suggestedChange: string;
    readingDesireScore: number;
    readingDesireReason: string;
  };
  preferenceJudgments: Array<{
    preferenceId: HumanPreferenceId;
    verdict: 'pass' | 'intentional-exception' | 'fail';
    evidence: string;
    exceptionReason?: string;
  }>;
  pairJudgments: Array<{
    pairId: HumanFeedbackPairId;
    verdict: 'accepted-like' | 'mixed' | 'rejected-like';
    evidence: string;
  }>;
  scientificBoundary: { verdict: 'pass' | 'fail'; evidence: string };
  unresolvedConcerns: string[];
  finalVerdict: 'PASS' | 'FAIL';
  rationale: string;
}

const nonEmpty = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export function validateHumanPreferenceJudgeReceipt(input: unknown): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== 'object') return ['receipt must be an object'];
  const receipt = input as Partial<HumanPreferenceJudgeReceipt>;
  if (receipt.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (!nonEmpty(receipt.contractId) || !readerContractById(receipt.contractId!)) errors.push('contractId must reference a real Reader Contract');
  if (!/^[0-9a-f]{40}$/i.test(receipt.exactHead ?? '')) errors.push('exactHead must be a 40-character Git SHA');
  if (!/^https?:\/\//.test(receipt.candidateUrl ?? '')) errors.push('candidateUrl must be an http(s) URL');
  if (!receipt.reviewer || !['independent-agent', 'human'].includes(receipt.reviewer.kind) || !nonEmpty(receipt.reviewer.label)) {
    errors.push('reviewer must identify an independent-agent or human evaluator');
  }
  if (receipt.blindCompletedBeforePreferenceReveal !== true) errors.push('blind phase must be completed before preference/gold-pair reveal');

  const blind = receipt.blind;
  for (const key of ['about', 'firstAttention', 'mostImportant', 'machineLike', 'terminologyFriction', 'competingCenters', 'hiddenBoundary', 'suggestedChange', 'readingDesireReason'] as const) {
    if (!blind || !nonEmpty(blind[key])) errors.push(`blind.${key} is required`);
  }
  if (!blind || typeof blind.readingDesireScore !== 'number' || blind.readingDesireScore < 1 || blind.readingDesireScore > 5) {
    errors.push('blind.readingDesireScore must be between 1 and 5');
  }

  if (receipt.contractId && readerContractById(receipt.contractId)) {
    const requiredPreferences = new Set(preferenceIdsForContract(receipt.contractId));
    const providedPreferences = new Map((receipt.preferenceJudgments ?? []).map((item) => [item.preferenceId, item]));
    for (const preferenceId of requiredPreferences) if (!providedPreferences.has(preferenceId)) errors.push(`missing preference judgment: ${preferenceId}`);
    for (const item of receipt.preferenceJudgments ?? []) {
      if (!nonEmpty(item.evidence)) errors.push(`${item.preferenceId}: evidence is required`);
      if (item.verdict === 'intentional-exception' && !nonEmpty(item.exceptionReason)) errors.push(`${item.preferenceId}: intentional exception requires exceptionReason`);
    }

    const requiredPairs = new Set(goldPairIdsForContract(receipt.contractId));
    const providedPairs = new Map((receipt.pairJudgments ?? []).map((item) => [item.pairId, item]));
    for (const pairId of requiredPairs) if (!providedPairs.has(pairId)) errors.push(`missing gold-pair judgment: ${pairId}`);
    for (const item of receipt.pairJudgments ?? []) if (!nonEmpty(item.evidence)) errors.push(`${item.pairId}: evidence is required`);
  }

  if (!receipt.scientificBoundary || !nonEmpty(receipt.scientificBoundary.evidence)) errors.push('scientificBoundary evidence is required');
  if (!Array.isArray(receipt.unresolvedConcerns)) errors.push('unresolvedConcerns must be an array');
  if (!['PASS', 'FAIL'].includes(receipt.finalVerdict ?? '')) errors.push('finalVerdict must be PASS or FAIL');
  if (!nonEmpty(receipt.rationale)) errors.push('final rationale is required');

  if (receipt.finalVerdict === 'PASS') {
    if ((receipt.preferenceJudgments ?? []).some((item) => item.verdict === 'fail')) errors.push('PASS receipt cannot contain a failed preference judgment');
    if ((receipt.pairJudgments ?? []).some((item) => item.verdict === 'rejected-like')) errors.push('PASS receipt cannot be rejected-like against a Gold Pair');
    if (receipt.scientificBoundary?.verdict !== 'pass') errors.push('PASS receipt requires scientificBoundary=pass');
    if ((receipt.unresolvedConcerns ?? []).length) errors.push('PASS receipt cannot contain unresolvedConcerns');
  }
  return errors;
}
