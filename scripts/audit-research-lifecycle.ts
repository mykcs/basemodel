import fs from 'node:fs';
import path from 'node:path';
import { auditResearchContentLifecycle, RESEARCH_CONTENT_LIFECYCLE } from '../src/data/researchContentLifecycle';

const errors = auditResearchContentLifecycle();
const report = {
  generatedAt: new Date().toISOString(),
  records: RESEARCH_CONTENT_LIFECYCLE.map((item) => ({
    id: item.id,
    experimentStatus: item.experimentStatus,
    evidenceId: item.evidenceId,
    evidenceRole: item.evidenceRole,
    evidenceCompleteness: item.evidenceCompleteness,
    evidenceCapturedAt: item.evidenceCapturedAt,
    contentReviewedAt: item.contentReviewedAt,
    sitePublishedAt: item.sitePublishedAt,
    sitePublicationState: item.sitePublicationState,
    expectedRevision: item.expectedRevision,
    consumers: item.consumers,
  })),
  errors,
};
fs.mkdirSync(path.resolve('reports'), { recursive: true });
fs.writeFileSync(path.resolve('reports/research-content-lifecycle.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`[audit-research-lifecycle] records=${report.records.length} review-required=${errors.length}`);
if (errors.length) {
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log('[audit-research-lifecycle] PASS');
