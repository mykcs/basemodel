import { HUMAN_FEEDBACK_INGESTION_CLOSEOUTS } from '../src/data/humanFeedbackIngestionCloseouts';
import { aggregateHumanFeedbackIngestionCoverage, buildHumanPreferenceBriefForCloseout, validateHumanFeedbackIngestionCloseout } from '../src/lib/humanFeedbackIngestionCloseout';
import { renderHumanPreferenceBriefMarkdown } from '../src/lib/humanPreferenceBrief';

const requestedId = process.argv[2];
const records = requestedId
  ? HUMAN_FEEDBACK_INGESTION_CLOSEOUTS.filter((record) => record.id === requestedId)
  : HUMAN_FEEDBACK_INGESTION_CLOSEOUTS;
if (!records.length) {
  console.error(`Unknown closeout id: ${requestedId}`);
  process.exit(1);
}

let failed = false;
for (const record of records) {
  const result = validateHumanFeedbackIngestionCloseout(record);
  const lineageCoverage = aggregateHumanFeedbackIngestionCoverage(record);
  console.log(JSON.stringify({
    schema: record.schema === 'human-feedback-ingestion-closeout.v2'
      ? 'human-feedback-ingestion-closeout-receipt.v2'
      : 'human-feedback-ingestion-closeout-receipt.v1',
    id: record.id,
    sourceState: record.sourceWindow.finalVerdict ?? 'accepted',
    predecessorIngestionIds: record.predecessorIngestionIds ?? [],
    status: result.failures.length || lineageCoverage.failures.length ? 'FAIL' : 'PASS',
    coverage: { total: record.ledger.length, ...result.dispositionCounts },
    lineageCoverage: {
      ingestionIds: lineageCoverage.ingestionIds,
      total: lineageCoverage.totalSignals,
      ...lineageCoverage.dispositionCounts,
      failures: lineageCoverage.failures,
    },
    hardFamilies: result.hardFamilies,
    repeatedFamilies: result.repeatedFamilies,
    retrievedSignals: result.retrievedSignals,
    retrievedEventIds: result.retrievedEventIds,
    retrievedGoldPairIds: result.retrievedGoldPairIds,
    evaluationProof: record.evaluationProof,
    evaluationProofFailures: result.evaluationProofFailures,
    evaluationProofPassFailures: result.evaluationProofPassFailures,
    automationGap: record.automationGap,
    failures: result.failures,
  }, null, 2));
  if (process.env.HPL_CLOSEOUT_SHOW_BRIEF === '1') {
    const brief = buildHumanPreferenceBriefForCloseout(record);
    console.log('\n--- Future-task Preference Brief ---\n');
    console.log(renderHumanPreferenceBriefMarkdown(brief));
  }
  if (result.failures.length || lineageCoverage.failures.length) failed = true;
}
if (failed) process.exit(1);
