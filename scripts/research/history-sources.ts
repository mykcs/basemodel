import { z } from 'zod';
import { RESEARCH_EVIDENCE_CONTRACTS } from '../../src/data/researchEvidenceIndex';
import { rejectHistoryPrivateMaterial, type HistoryImportInput } from '../../src/lib/researchHistory';
import type { EvidenceContract } from '../../src/lib/researchEvidence';

const sourceBase = { repository: 'mykcs/basemodel', commit: '360eabb92e5feb9ccef6ae7785332f73f7620ee0' };
const directory = 'public/research/seed-openevo/evidence/';
export const HISTORY_SOURCES = {
  'beta-r200': { ...sourceBase, path: `${directory}bounded-beta-r200-round-series-20261001.json`, sha256: 'ed97e8d26fad52cdd4822fd6fb95414de30c916c16554ff415246140bddd1cde', capturedAt: '2026-10-01' },
  'threeway-loss': { ...sourceBase, path: `${directory}wandb-threeway/loss-vs-rollout.json`, sha256: 'd0c0079fc8878f60da9085af525ef80ec2e93aabbb0471e6bd663fcc52071608', capturedAt: '2026-09-20' },
  'threeway-window-score': { ...sourceBase, path: `${directory}wandb-threeway/task-score-20-round-mean.json`, sha256: 'f3edc302ab64ed50b378e23f112941bc26f79f2dd245d3a2615a27003297da93', capturedAt: '2026-09-20' },
} as const;
export type HistorySourceName = keyof typeof HISTORY_SOURCES;
export const isHistorySourceName = (value: string): value is HistorySourceName => Object.hasOwn(HISTORY_SOURCES, value);

const number = z.number();
const round = z.number().int().nonnegative();
const betaSchema = z.object({ rows: z.array(z.object({ round, task_score: number, training_loss: number.nullable(), exact_success_count: round })) });
const lossSchema = z.object({ rounds: z.literal(160), rollouts_per_round: z.literal(128), rows: z.array(z.object({ round, cumulative_rollouts: round, bounded_gdr_loss: number.nullable(), bounded_loss: number.nullable(), ordinary_openevo_loss: number.nullable() })) });
const windowSchema = z.object({ window_size_rounds: z.literal(20), rows: z.array(z.object({ start_round: round, end_round: round, ordinary: number, bounded: number, beta: number })) });
const seriesContract = (id: string, boundary: string): EvidenceContract => ({
  id, evaluationRole: 'training', taskPanelId: null, taskCount: null, trialCount: null,
  independentUnit: 'round', comparison: 'descriptive',
  fixed: ['existing published scalar projection'], varied: ['method, training round and model state'],
  scientificRefs: [], boundary,
});

/** These adapters consume already-published snapshots, not private W&B files or live API results. */
export function prepareHistoryInput(name: HistorySourceName, text: string, observedSha256: string): HistoryImportInput {
  const raw: unknown = JSON.parse(text);
  rejectHistoryPrivateMaterial(raw);
  const definition = HISTORY_SOURCES[name];
  if (!definition) throw new Error('Unknown approved history source');
  const { capturedAt, ...source } = definition;
  const common = {
    schema: 'basemodel.history-import.v1' as const, lineageId: name,
    source, observedSha256, capturedAt, frozen: true as const, retrieval: 'complete-export' as const, pageKind: 'local-partition' as const,
    publication: {
      approved: true, approvedScope: 'existing-site-projection' as const,
      basis: { repository: source.repository, commit: source.commit, path: source.path },
      reason: 'Reformat this exact existing scalar projection only. No original-run mutation or new public W&B authorization.',
    },
  };
  if (name === 'beta-r200') {
    const parsed = betaSchema.parse(raw);
    const contract = RESEARCH_EVIDENCE_CONTRACTS.find((item) => item.id === 'webshop-beta-r96-r199-20261001');
    if (!contract) throw new Error('D01 beta contract is missing');
    const rows = parsed.rows.map((row) => ({ step: row.round, eventTime: null, values: { task_score: row.task_score, training_loss: row.training_loss, exact_success_count: row.exact_success_count } }));
    return {
      ...common, contract, aggregation: 'per-round-mean', axis: 'round', axisKey: 'round',
      fields: [
        { key: 'task_score', series: 'bounded-beta', metricId: 'taskScore', sourceUnit: 'ratio' },
        { key: 'training_loss', series: 'bounded-beta', metricId: 'trainingLoss', sourceUnit: 'loss' },
        { key: 'exact_success_count', series: 'bounded-beta', metricId: 'exactSuccessCount', sourceUnit: 'count' },
      ],
      // Segment names describe published ranges. Original runtime run IDs are absent, not guessed.
      segments: [
        { id: 'historical', runId: null, parentId: null, stepOffset: 0, firstStep: 96, lastStep: 159, stepStride: 1, expectedPages: 1, expectedRows: 64 },
        { id: 'extension', runId: null, parentId: 'historical', stepOffset: 0, firstStep: 160, lastStep: 199, stepStride: 1, expectedPages: 1, expectedRows: 40 },
      ],
      pages: [
        { segmentId: 'historical', runId: null, ordinal: 0, rows: rows.filter((row) => row.step < 160) },
        { segmentId: 'extension', runId: null, ordinal: 0, rows: rows.filter((row) => row.step >= 160) },
      ],
    };
  }
  if (name === 'threeway-loss') {
    const parsed = lossSchema.parse(raw);
    if (parsed.rows.some((row) => row.cumulative_rollouts !== (row.round + 1) * 128)) throw new Error('Loss source round/rollout axes disagree');
    return {
      ...common, contract: seriesContract('webshop-threeway-loss-20260920', 'Training loss only; unavailable updates remain null; lower loss is not final task capability.'),
      aggregation: 'per-round-mean', axis: 'cumulative-rollout', axisKey: 'cumulative_rollouts',
      fields: [
        { key: 'ordinary_openevo_loss', series: 'ordinary', metricId: 'trainingLoss', sourceUnit: 'loss' },
        { key: 'bounded_loss', series: 'bounded', metricId: 'trainingLoss', sourceUnit: 'loss' },
        { key: 'bounded_gdr_loss', series: 'beta', metricId: 'trainingLoss', sourceUnit: 'loss' },
      ],
      segments: [{ id: 'published', runId: null, parentId: null, stepOffset: 0, firstStep: 128, lastStep: 20480, stepStride: 128, expectedPages: 1, expectedRows: 160 }],
      pages: [{ segmentId: 'published', runId: null, ordinal: 0, rows: parsed.rows.map((row) => ({ step: row.cumulative_rollouts, eventTime: null, values: { ordinary_openevo_loss: row.ordinary_openevo_loss, bounded_loss: row.bounded_loss, bounded_gdr_loss: row.bounded_gdr_loss } })) }],
    };
  }
  const parsed = windowSchema.parse(raw);
  if (parsed.rows.some((row) => row.end_round - row.start_round !== 19)) throw new Error('Window source is not a 20-round aggregate');
  return {
    ...common, contract: seriesContract('webshop-threeway-window-score-20260920', 'Non-overlapping 20-round training means, positioned at each window end; not per-round raw points or same-panel final results. Source units are score/100, explicitly divided by 100 for D01 ratio values.'),
    aggregation: 'reported-scalar', axis: 'round', axisKey: 'end_round',
    fields: [
      { key: 'ordinary', series: 'ordinary', metricId: 'taskScore', sourceUnit: 'score-100' },
      { key: 'bounded', series: 'bounded', metricId: 'taskScore', sourceUnit: 'score-100' },
      { key: 'beta', series: 'beta', metricId: 'taskScore', sourceUnit: 'score-100' },
    ],
    segments: [{ id: 'published', runId: null, parentId: null, stepOffset: 0, firstStep: 19, lastStep: 159, stepStride: 20, expectedPages: 1, expectedRows: 8 }],
    pages: [{ segmentId: 'published', runId: null, ordinal: 0, rows: parsed.rows.map((row) => ({ step: row.end_round, eventTime: null, values: { ordinary: row.ordinary, bounded: row.bounded, beta: row.beta } })) }],
  };
}
