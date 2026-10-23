import finalSource from '../../public/research/seed-openevo/evidence/bounded-effective-state-final-snapshot-20260918.json';
import trainingSource from '../../public/research/seed-openevo/evidence/bounded-beta-r200-round-series-20261001.json';
import {
  evidenceNumber, publishedEvidence, researchMetricCatalog, validateEvidenceRegistry,
  type EvidenceContract, type EvidencePoint, type EvidenceSnapshot,
} from '../lib/researchEvidence';
import type { ResearchMetricId } from '../lib/researchEvidenceSchema';

const sourceBase = { repository: 'mykcs/basemodel', commit: '360eabb92e5feb9ccef6ae7785332f73f7620ee0' };
const directory = 'public/research/seed-openevo/evidence/';
const finalArtifact = {
  ...sourceBase, path: `${directory}bounded-effective-state-final-snapshot-20260918.json`,
  sha256: '29771a71343fa1e99b6210bf843aea98a4f76f84988c469d2fc588d56ec302a0',
};
const trainingArtifact = {
  ...sourceBase, path: `${directory}bounded-beta-r200-round-series-20261001.json`,
  sha256: 'ed97e8d26fad52cdd4822fd6fb95414de30c916c16554ff415246140bddd1cde',
};
const finalContract: EvidenceContract = {
  id: 'webshop-frozen-128-20260918', evaluationRole: 'frozen_final',
  taskPanelId: finalSource.same_frozen_final_panel.selected_panel_digest,
  taskCount: 128, trialCount: 128, independentUnit: 'task', comparison: 'descriptive',
  fixed: ['same frozen 128-task panel'], varied: ['historical method/checkpoint lineage'],
  scientificRefs: [{ repository: finalSource.authority.repository, commit: finalSource.authority.main_commit, path: finalSource.authority.final_closeout_path }],
  boundary: finalSource.publication_boundary,
};
const trainingContract: EvidenceContract = {
  id: 'webshop-beta-r96-r199-20261001', evaluationRole: 'training',
  taskPanelId: null, taskCount: null, trialCount: null, independentUnit: 'round', comparison: 'none',
  fixed: ['Bounded Online Recurrence with beta gating; alpha fixed at 1'],
  varied: ['training round and evolving model state'], scientificRefs: [],
  boundary: `${trainingSource.claim_boundary} Unique task identities and the full scientific receipt locator are not present in this projection; they remain unknown.`,
};
const rankContract: EvidenceContract = {
  id: 'webshop-rank32-r152-r159-20260928', evaluationRole: 'development',
  taskPanelId: null, taskCount: null, trialCount: 1024, independentUnit: 'task-within-round', comparison: 'descriptive',
  fixed: ['reported continuation window R152-R159'], varied: ['persistent state rank32 versus historical rank128'],
  scientificRefs: [],
  boundary: 'The publication owner is PR 805. Its mirror is not integrated here. No final-panel evidence, causal comparison, or non-inferiority claim is created by this pending entry.',
};

const point = (series: string, value: number | null, position: number | null = null): EvidencePoint => ({
  series, value, position, precision: 'source', reportedDecimals: null,
});
function snapshot(
  id: string, metricId: ResearchMetricId, contract: EvidenceContract,
  source: typeof finalArtifact, capturedAt: string, points: EvidencePoint[],
  aggregation: EvidenceSnapshot['aggregation'], axis: EvidenceSnapshot['axis'],
): EvidenceSnapshot {
  const { unit, direction } = researchMetricCatalog[metricId];
  return {
    id, revision: source.sha256, source, contractId: contract.id, evaluationRole: contract.evaluationRole,
    metric: { id: metricId, unit, direction }, aggregation, axis,
    completeness: points.some((item) => item.value === null) ? 'partial' : 'complete',
    eventTime: null, capturedAt,
    publication: {
      approved: true, approvedScope: 'existing-site-projection',
      basis: { repository: source.repository, commit: source.commit, path: source.path },
      reason: 'Compatibility-only projection of this exact existing website snapshot. No new data or visibility authorization.',
    },
    points,
  };
}
const finalRows = finalSource.three_way_final;
const finalPoints = (field: keyof typeof finalRows.directapply) => Object.entries(finalRows).map(([series, row]) => point(series, row[field]));
const trainingPoints = (field: 'task_score' | 'training_loss' | 'exact_success_count') => trainingSource.rows.map((row) => point('bounded-beta', row[field], row.round));
const candidates: EvidenceSnapshot[] = [
  snapshot('bounded-final-task-score', 'taskScore', finalContract, finalArtifact, '2026-09-18', finalPoints('task_score'), 'per-task-mean', 'none'),
  snapshot('bounded-final-exact-count', 'exactSuccessCount', finalContract, finalArtifact, '2026-09-18', finalPoints('exact_success_count'), 'count', 'none'),
  snapshot('bounded-final-exact-rate', 'exactSuccessRate', finalContract, finalArtifact, '2026-09-18', finalPoints('exact_success_rate'), 'per-task-mean', 'none'),
  snapshot('beta-r200-task-score', 'taskScore', trainingContract, trainingArtifact, '2026-10-01', trainingPoints('task_score'), 'per-round-mean', 'round'),
  snapshot('beta-r200-loss', 'trainingLoss', trainingContract, trainingArtifact, '2026-10-01', trainingPoints('training_loss'), 'per-round-mean', 'round'),
  snapshot('beta-r200-exact-count', 'exactSuccessCount', trainingContract, trainingArtifact, '2026-10-01', trainingPoints('exact_success_count'), 'count', 'round'),
  {
    id: 'rank32-continuation-pending', revision: 'unavailable',
    source: { repository: 'mykcs/basemodel', commit: '43fa2cbb3998824333826e8542cebf8265842f17', path: `${directory}post-advisor-ab-final-20260928.json`, sha256: null },
    contractId: rankContract.id, evaluationRole: 'development',
    metric: { id: 'taskScore', unit: 'ratio', direction: 'higher' }, aggregation: 'per-task-mean', axis: 'none',
    completeness: 'unavailable', eventTime: null, capturedAt: '2026-10-02',
    publication: { approved: false, approvedScope: null, basis: null, reason: 'Await PR 805 integration and its pinned source/publication verification; no copied values.' },
    points: [],
  },
];
const registry = validateEvidenceRegistry(candidates, [finalContract, trainingContract, rankContract]);
export const RESEARCH_EVIDENCE = registry.snapshots;
export const RESEARCH_EVIDENCE_CONTRACTS = registry.contracts;
export const getResearchEvidence = (id: string) => publishedEvidence(RESEARCH_EVIDENCE, id);

/** Existing TS API preserved: table, summary and final panel now read the same JSON values. */
export function frozenFinalView() {
  const score = getResearchEvidence('bounded-final-task-score');
  const counts = getResearchEvidence('bounded-final-exact-count');
  const rates = getResearchEvidence('bounded-final-exact-rate');
  const row = (series: string) => ({
    score: evidenceNumber(score, series) * 100,
    exactCount: evidenceNumber(counts, series), exactRate: evidenceNumber(rates, series),
  });
  return {
    sameFrozenPanel: finalSource.same_frozen_final_panel.same_panel,
    panelContentSha256: finalSource.same_frozen_final_panel.panel_content_sha256,
    panelFileSha256: finalSource.same_frozen_final_panel.panel_file_sha256,
    panelDigest: finalSource.same_frozen_final_panel.selected_panel_digest,
    directApply: row('directapply'), off: row('bounded_off'), on: row('bounded_gdr_on'),
    boundary: 'DirectApply is a historical predecessor on the same frozen 128-task panel, not a third arm of the preregistered OFF-vs-ON treatment contrast',
  };
}

/** Handoff for freshness/content owners; no second background freshness service. */
export const RESEARCH_EVIDENCE_CONSUMERS = {
  'bounded-final-task-score': ['src/data/effectiveStateGdrLoraStudy.ts', 'src/components/research/OpenEvo1p7bSamePanelResults.astro', 'src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro'],
  'bounded-final-exact-count': ['src/data/effectiveStateGdrLoraStudy.ts', 'src/components/research/OpenEvo1p7bSamePanelResults.astro'],
  'bounded-final-exact-rate': ['src/data/effectiveStateGdrLoraStudy.ts'],
  'beta-r200-task-score': ['public/research/seed-openevo/evidence/bounded-beta-r200-task-score-r96-r199.svg'],
  'beta-r200-loss': ['public/research/seed-openevo/evidence/bounded-beta-r200-analysis-20261001.json'],
  'beta-r200-exact-count': ['public/research/seed-openevo/evidence/bounded-beta-r200-analysis-20261001.json'],
  'rank32-continuation-pending': [],
} as const;
