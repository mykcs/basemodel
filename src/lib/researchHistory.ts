import { z } from 'zod';
import {
  assertPublicationSafe, evidenceContractSchema, evidenceSnapshotSchema,
  researchMetricCatalog, validateEvidenceRegistry,
  type EvidencePoint, type EvidenceSnapshot, type ResearchMetricId,
} from './researchEvidenceSchema';

const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/);
const metricKey = z.string().regex(/^[a-zA-Z_][a-zA-Z0-9._/-]*$/).max(128);
const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
const integer = z.number().int().nonnegative().max(100_000_000);
const fieldSchema = z.strictObject({
  key: metricKey, series: id,
  metricId: evidenceSnapshotSchema.shape.metric.shape.id,
  sourceUnit: z.enum(['ratio', 'score-100', 'count', 'bytes', 'loss']),
});
const segmentSchema = z.strictObject({
  id, runId: id.nullable(), parentId: id.nullable(),
  stepOffset: integer, firstStep: integer, lastStep: integer,
  stepStride: z.number().int().positive(), expectedPages: z.number().int().positive(),
  expectedRows: z.number().int().positive().max(200_000),
});
const rowSchema = z.strictObject({
  step: integer, eventTime: evidenceSnapshotSchema.shape.eventTime,
  values: z.record(metricKey, z.number().nullable()),
});
export const historyImportSchema = z.strictObject({
  schema: z.literal('basemodel.history-import.v1'), lineageId: id,
  source: evidenceSnapshotSchema.shape.source,
  observedSha256: z.string().regex(/^[a-f0-9]{64}$/),
  capturedAt: evidenceSnapshotSchema.shape.capturedAt,
  frozen: z.literal(true), retrieval: z.literal('complete-export'),
  pageKind: z.enum(['local-partition', 'export-page']),
  publication: evidenceSnapshotSchema.shape.publication,
  contract: evidenceContractSchema,
  aggregation: evidenceSnapshotSchema.shape.aggregation,
  axis: z.enum(['round', 'optimizer-step', 'cumulative-rollout']), axisKey: metricKey,
  fields: z.array(fieldSchema).min(1).max(100),
  segments: z.array(segmentSchema).min(1).max(100),
  pages: z.array(z.strictObject({
    segmentId: id, runId: id.nullable(), ordinal: integer,
    rows: z.array(rowSchema).max(200_000),
  })).min(1).max(10_000),
});
export type HistoryImportInput = z.infer<typeof historyImportSchema>;
type Origin = { segmentId: string; runId: string | null; sourceStep: number; page: number; row: number; eventTime: string | null };
const credentialKey = /^(?:api[_-]?key|access[_-]?token|token|password|credential|authorization|cookie|hostname|username|private[_-]?key)$/i;

/** Select only explicitly approved scalars; never silently discard credential-like fields. */
export function rejectHistoryPrivateMaterial(value: unknown): void {
  assertPublicationSafe(value);
  const visit = (item: unknown): void => {
    if (item && typeof item === 'object') {
      for (const [key, child] of Object.entries(item)) {
        if (credentialKey.test(key)) throw new Error('Credential-like history field is forbidden');
        visit(child);
      }
    }
  };
  visit(value);
}

/** Pure normalization: no filesystem, network, SDK login, source writes or missing-value interpolation. */
export function normalizeResearchHistory(raw: unknown) {
  rejectHistoryPrivateMaterial(raw);
  const input = historyImportSchema.parse(raw);
  if (!input.publication.approved) throw new Error('History publication is not approved');
  if (input.source.sha256 !== input.observedSha256) throw new Error('History source SHA-256 mismatch');
  if (input.contract.evaluationRole === 'frozen_final') throw new Error('History import cannot create a frozen final result');

  const fields = new Map(input.fields.map((field) => [field.key, field]));
  if (fields.size !== input.fields.length) throw new Error('Duplicate history field');
  const identities = new Set<string>();
  for (const field of input.fields) {
    if (credentialKey.test(field.key)) throw new Error('Credential-like history field is forbidden');
    const identity = `${field.series}:${field.metricId}`;
    if (identities.has(identity)) throw new Error('Duplicate series/metric mapping');
    identities.add(identity);
    const expected = researchMetricCatalog[field.metricId].unit;
    if (!(field.sourceUnit === expected || (field.sourceUnit === 'score-100' && expected === 'ratio'))) {
      throw new Error(`Unknown unit conversion: ${field.key}`);
    }
  }
  const segments = new Map(input.segments.map((segment) => [segment.id, segment]));
  if (segments.size !== input.segments.length) throw new Error('Duplicate continuation segment');
  for (const page of input.pages) if (!segments.has(page.segmentId)) throw new Error('Unknown page segment');

  const positions = new Set<number>();
  const observations = new Map<string, { value: number | null; origins: Origin[] }>();
  const segmentReceipts: { id: string; runId: string | null; parentId: string | null; rows: number; pages: number; firstStep: number; lastStep: number; stepOffset: number; stepStride: number }[] = [];
  let previous: string | null = null;
  let duplicateObservations = 0;
  for (const segment of input.segments) {
    if (segment.parentId !== previous) throw new Error('Unrelated run/segment cannot be joined by step alone');
    previous = segment.id;
    if (segment.lastStep < segment.firstStep || (segment.lastStep - segment.firstStep) % segment.stepStride !== 0) throw new Error('Invalid segment range');
    const width = (segment.lastStep - segment.firstStep) / segment.stepStride + 1;
    if ((positions.size + width) * fields.size > 200_000) throw new Error('History projection exceeds point budget');
    for (let step = segment.firstStep; step <= segment.lastStep; step += segment.stepStride) positions.add(step + segment.stepOffset);
    const pages = input.pages.filter((page) => page.segmentId === segment.id).sort((a, b) => a.ordinal - b.ordinal);
    if (pages.length !== segment.expectedPages || pages.some((page, ordinal) => page.ordinal !== ordinal)) throw new Error('Incomplete or duplicated history pages');
    const rowCount = pages.reduce((sum, page) => sum + page.rows.length, 0);
    if (rowCount !== segment.expectedRows) throw new Error('Incomplete history row count');
    for (const page of pages) {
      if (page.runId !== segment.runId) throw new Error('History page run identity mismatch');
      for (const [rowIndex, row] of page.rows.entries()) {
        if (row.step < segment.firstStep || row.step > segment.lastStep || (row.step - segment.firstStep) % segment.stepStride !== 0) throw new Error('History row is outside the declared step range');
        const position = row.step + segment.stepOffset;
        for (const [key, sourceValue] of Object.entries(row.values)) {
          const field = fields.get(key);
          if (!field) throw new Error(`Unapproved history field: ${key}`);
          const value = sourceValue === null ? null : field.sourceUnit === 'score-100' ? sourceValue / 100 : sourceValue;
          const identity = `${key}:${position}`;
          const origin: Origin = { segmentId: segment.id, runId: segment.runId, sourceStep: row.step, page: page.ordinal, row: rowIndex, eventTime: row.eventTime };
          const prior = observations.get(identity);
          if (prior) {
            if (prior.value !== value) throw new Error(`Conflicting history observation: ${input.lineageId}/${key}/${position}`);
            duplicateObservations += 1; prior.origins.push(origin);
          } else observations.set(identity, { value, origins: [origin] });
        }
      }
    }
    segmentReceipts.push({ id: segment.id, runId: segment.runId, parentId: segment.parentId, rows: rowCount, pages: pages.length, firstStep: segment.firstStep, lastStep: segment.lastStep, stepOffset: segment.stepOffset, stepStride: segment.stepStride });
  }
  const sortedPositions = [...positions].sort((a, b) => a - b);
  const byMetric = new Map<ResearchMetricId, EvidencePoint[]>();
  const fieldReceipts: { key: string; series: string; metricId: ResearchMetricId; positions: number; recorded: number; missing: number }[] = [];
  for (const field of input.fields) {
    const points = byMetric.get(field.metricId) ?? [];
    let missing = 0, recorded = 0;
    for (const position of sortedPositions) {
      const observation = observations.get(`${field.key}:${position}`);
      const value = observation?.value ?? null; // zero is a real observation
      if (observation) recorded += 1;
      if (value === null) missing += 1;
      points.push({ series: field.series, position, value, precision: 'source', reportedDecimals: null });
    }
    byMetric.set(field.metricId, points);
    fieldReceipts.push({ key: field.key, series: field.series, metricId: field.metricId, positions: sortedPositions.length, recorded, missing });
  }
  const snapshots: EvidenceSnapshot[] = [...byMetric.entries()].map(([metricId, points]): EvidenceSnapshot => {
    const { unit, direction } = researchMetricCatalog[metricId];
    return {
      id: `history-${input.lineageId}-${metricId}`, revision: input.observedSha256, source: input.source,
      contractId: input.contract.id, evaluationRole: input.contract.evaluationRole,
      metric: { id: metricId, unit, direction }, aggregation: metricId === 'exactSuccessCount' ? 'count' : input.aggregation, axis: input.axis,
      completeness: points.some((point) => point.value === null) ? 'partial' : 'complete',
      eventTime: null, capturedAt: input.capturedAt, publication: input.publication,
      points: points.sort((a, b) => compare(a.series, b.series) || a.position! - b.position!),
    };
  }).sort((a, b) => compare(a.id, b.id));
  const validated = validateEvidenceRegistry(snapshots, [input.contract]);
  return {
    schema: 'basemodel.normalized-history.v1' as const,
    lineageId: input.lineageId, source: input.source,
    ...validated,
    mapping: { axis: input.axis, sourceAxisKey: input.axisKey, fields: input.fields },
    receipt: {
      pageKind: input.pageKind,
      sourceRows: segmentReceipts.reduce((sum, item) => sum + item.rows, 0),
      pages: input.pages.length, duplicateObservations,
      segments: segmentReceipts, fields: fieldReceipts,
      scope: 'Declared frozen projection only; not a claim of complete original experiment history.',
      observations: [...observations.entries()].sort(([a], [b]) => compare(a, b)).map(([identity, item]) => ({ identity, origins: item.origins })),
    },
  };
}
export type NormalizedResearchHistory = ReturnType<typeof normalizeResearchHistory>;

/** Capture/import clocks are receipt metadata, not part of scientific content identity. */
export function historyScientificContent(result: NormalizedResearchHistory) {
  return {
    schema: result.schema, lineageId: result.lineageId, source: result.source,
    contracts: result.contracts, mapping: result.mapping,
    snapshots: result.snapshots.map((snapshot) => {
      const { capturedAt, ...scientific } = snapshot;
      void capturedAt;
      return scientific;
    }),
    receipt: result.receipt,
  };
}
