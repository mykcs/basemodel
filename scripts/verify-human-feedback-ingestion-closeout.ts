import process from 'node:process';
import { HUMAN_FEEDBACK_INGESTION_CLOSEOUTS } from '../src/data/humanFeedbackIngestionCloseouts';
import { validateHumanFeedbackIngestionCloseout } from '../src/lib/humanFeedbackIngestionCloseout';

const requestedId = process.argv[2];
const records = requestedId
  ? HUMAN_FEEDBACK_INGESTION_CLOSEOUTS.filter((record) => record.id === requestedId)
  : HUMAN_FEEDBACK_INGESTION_CLOSEOUTS;

if (!records.length) {
  console.error(`Unknown human-feedback ingestion closeout: ${requestedId}`);
  process.exit(2);
}

let failed = false;
for (const record of records) {
  const result = validateHumanFeedbackIngestionCloseout(record);
  const receipt = {
    schema: 'human-feedback-ingestion-closeout-receipt.v1',
    id: record.id,
    task: record.task,
    sourceWindow: record.sourceWindow,
    coverage: {
      candidateFeedbackTurns: record.ledger.length,
      dispositions: result.dispositionCounts,
    },
    hardFamilies: result.hardFamilies,
    repeatedFamilies: result.repeatedFamilies,
    visualTiers: {
      rejected: ['VISUAL-BRIEFING-DENSE-REJECTED', 'VISUAL-BRIEFING-OVERMINIMAL-REJECTED'],
      silver: [
        'VISUAL-BRIEFING-SOFT-SILVER',
        'VISUAL-BRIEFING-FIXED16-INTERMEDIATE-SILVER',
        'VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER',
      ],
      golden: [],
      currentCandidate: ['VISUAL-BRIEFING-TRAINING-DYNAMICS-CURRENT-CANDIDATE'],
    },
    retrievalProof: {
      query: record.futureTaskQuery,
      eventIds: result.retrievedEventIds,
      goldPairIds: result.retrievedGoldPairIds,
      signals: result.retrievedSignals,
    },
    evaluationProof: {
      targetHardFamily: record.evaluationProof.hardFamily,
      verifierFailures: result.evaluationProofFailures,
    },
    automationGap: record.automationGap,
    status: result.failures.length ? 'FAIL' : 'PASS',
    failures: result.failures,
  };
  console.log(JSON.stringify(receipt, null, 2));
  if (result.failures.length) failed = true;
}

if (failed) process.exit(1);
