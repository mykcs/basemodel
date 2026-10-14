import { z } from 'zod';

const hash = z.string().regex(/^[a-f0-9]{64}$/);
const role = z.enum(['new-reader', 'lab-colleague', 'returning-reader']);
const answer = z.strictObject({ response: z.string().trim().min(1), correct: z.boolean() });
const result = z.strictObject({
  question: answer, result: answer, limitations: answer, nextStep: answer, evidence: answer,
  elapsedSeconds: z.number().positive(),
  criticalMisread: z.strictObject({ trainingAsFinal: z.boolean(), differentPanelsAsPaired: z.boolean(), unknownAsZero: z.boolean() }),
});
export const readingTrialSchema = z.strictObject({
  participantId: z.string().regex(/^reader-[a-z0-9-]{1,32}$/),
  reviewerKind: z.enum(['human', 'agent']), role,
  baselineInput: hash, candidateInput: hash,
  order: z.enum(['baseline-first', 'candidate-first']),
  resultRecord: z.string().regex(/^docs\/[a-zA-Z0-9_./-]+\.md$/).refine((value) => !value.includes('..')),
  resultRecordSha256: hash,
  stewardVerified: z.boolean(),
  baseline: result, candidate: result,
});
export type ReadingTrial = z.infer<typeof readingTrialSchema>;

/** Evaluates recorded evidence; the steward must actually verify human provenance. */
export function evaluateReadingTrials(raw: readonly unknown[], identity: { baselineInput: string; candidateInput: string }) {
  hash.parse(identity.baselineInput); hash.parse(identity.candidateInput);
  if (identity.baselineInput === identity.candidateInput) throw new Error('Baseline and candidate must differ');
  const trials = raw.map((trial) => readingTrialSchema.parse(trial));
  const seen = new Set<string>();
  for (const trial of trials) {
    if (seen.has(trial.participantId)) throw new Error('Duplicate participant');
    seen.add(trial.participantId);
    if (trial.baselineInput !== identity.baselineInput || trial.candidateInput !== identity.candidateInput) {
      throw new Error('Reading receipt belongs to a different candidate or baseline');
    }
  }
  const verified = trials.filter((trial) => trial.reviewerKind === 'human' && trial.stewardVerified);
  const roles = ['new-reader', 'lab-colleague', 'returning-reader'] as const;
  const missingRoles = roles.filter((kind) => !verified.some((trial) => trial.role === kind));
  const eligible = (trial: ReadingTrial) => {
    const score = ['question', 'result', 'limitations', 'nextStep', 'evidence'] as const;
    return score.filter((key) => trial.candidate[key].correct).length >= 4 &&
      !Object.values(trial.candidate.criticalMisread).some(Boolean);
  };
  const failures = verified.filter((trial) => !eligible(trial)).map((trial) => trial.participantId);
  const orderDifference = Math.abs(verified.filter((trial) => trial.order === 'baseline-first').length - verified.filter((trial) => trial.order === 'candidate-first').length);
  return {
    status: failures.length ? 'comprehension-failed' : missingRoles.length || orderDifference > 1 ? 'reader_evaluation_pending' : 'small-sample-reading-complete',
    verifiedHumans: verified.length, agentTrials: trials.filter((trial) => trial.reviewerKind === 'agent').length,
    missingRoles, failures, orderBalanced: orderDifference <= 1,
    provesStatisticalImprovement: false, ownerApproval: 'not-assessed', production: 'not-assessed',
  };
}
