import { z } from 'zod';

/** Publication projection contracts; never experiment execution authority. */
export const researchMetricCatalog = {
  taskScore: { unit: 'ratio', direction: 'higher', min: 0, max: 1 },
  exactSuccessCount: { unit: 'count', direction: 'higher', min: 0, max: null },
  exactSuccessRate: { unit: 'ratio', direction: 'higher', min: 0, max: 1 },
  trainingLoss: { unit: 'loss', direction: 'lower', min: 0, max: null },
  adapterBytes: { unit: 'bytes', direction: 'descriptive', min: 0, max: null },
} as const;
export type ResearchMetricId = keyof typeof researchMetricCatalog;
const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const revision = z.string().regex(/^[a-f0-9]{40}$/);
const count = z.number().int().positive().nullable();
const safePath = z.string().regex(/^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*$/)
  .refine((value) => !value.split('/').some((part) => part === '.' || part === '..'), 'Non-canonical path');
const role = z.enum(['training', 'development', 'validation', 'frozen_final']);
// Dates keep the precision actually present in the source; no invented midnight.
const sourceTime = z.union([z.iso.date(), z.iso.datetime({ offset: true })]);
export const evidenceSourceSchema = z.strictObject({
  repository: z.string().regex(/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/),
  commit: revision,
  path: safePath,
});
const publicationSchema = z.strictObject({
  approved: z.boolean(),
  approvedScope: z.enum(['existing-site-projection', 'explicit-release']).nullable(),
  basis: evidenceSourceSchema.nullable(),
  reason: z.string().min(1),
}).superRefine((value, ctx) => {
  if (value.approved !== (value.approvedScope !== null && value.basis !== null)) {
    ctx.addIssue({ code: 'custom', message: 'Approval, scope and basis must agree' });
  }
  if (!value.approved && (value.approvedScope !== null || value.basis !== null)) {
    ctx.addIssue({ code: 'custom', message: 'Blocked publication cannot carry an approval' });
  }
});

export const evidenceContractSchema = z.strictObject({
  id,
  evaluationRole: role,
  taskPanelId: z.string().min(1).nullable(),
  taskCount: count,
  trialCount: count,
  independentUnit: z.enum(['task', 'round', 'task-within-round']).nullable(),
  comparison: z.enum(['descriptive', 'paired', 'none']),
  fixed: z.array(z.string().min(1)),
  varied: z.array(z.string().min(1)),
  scientificRefs: z.array(evidenceSourceSchema),
  boundary: z.string().min(1),
}).superRefine((value, ctx) => {
  if (value.evaluationRole === 'frozen_final' &&
      (!sha256.safeParse(value.taskPanelId).success || value.taskCount === null || value.trialCount === null)) {
    ctx.addIssue({ code: 'custom', message: 'Frozen final requires a panel digest and explicit denominators' });
  }
  if (value.comparison === 'paired' && (value.independentUnit === null || value.scientificRefs.length === 0)) {
    ctx.addIssue({ code: 'custom', message: 'Paired analysis requires its scientific contract and sample unit' });
  }
});

export const evidencePointSchema = z.strictObject({
  series: id,
  position: z.number().int().nonnegative().nullable(),
  value: z.number().nullable(),
  precision: z.enum(['source', 'reported']),
  reportedDecimals: z.number().int().min(0).max(15).nullable(),
}).superRefine((value, ctx) => {
  if ((value.precision === 'reported') !== (value.reportedDecimals !== null)) {
    ctx.addIssue({ code: 'custom', message: 'Reported-only values require their original precision' });
  }
});

export const evidenceSnapshotSchema = z.strictObject({
  id,
  revision: z.union([sha256, z.literal('unavailable')]),
  source: evidenceSourceSchema.extend({ sha256: sha256.nullable() }),
  contractId: id,
  evaluationRole: role,
  metric: z.strictObject({
    id: z.enum(['taskScore', 'exactSuccessCount', 'exactSuccessRate', 'trainingLoss', 'adapterBytes']),
    unit: z.enum(['ratio', 'count', 'loss', 'bytes']),
    direction: z.enum(['higher', 'lower', 'descriptive']),
  }),
  aggregation: z.enum(['per-task-mean', 'per-round-mean', 'count', 'reported-scalar']),
  axis: z.enum(['none', 'round', 'optimizer-step', 'cumulative-rollout']),
  completeness: z.enum(['complete', 'partial', 'unavailable']),
  eventTime: sourceTime.nullable(),
  capturedAt: sourceTime,
  publication: publicationSchema,
  points: z.array(evidencePointSchema),
}).superRefine((value, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: 'custom', message });
  const metric = researchMetricCatalog[value.metric.id];
  if (metric.unit !== value.metric.unit || metric.direction !== value.metric.direction) issue('Metric unit/direction drift');
  if (value.completeness === 'unavailable') {
    if (value.points.length || value.publication.approved || value.revision !== 'unavailable' || value.source.sha256 !== null) {
      issue('Unavailable evidence cannot expose numbers, a verified hash or approval');
    }
  } else {
    if (!value.points.length || value.source.sha256 === null || value.revision !== value.source.sha256) {
      issue('Available evidence requires points and an exact source-byte revision');
    }
    if (value.completeness === 'complete' && value.points.some((point) => point.value === null)) issue('Complete evidence contains missing values');
  }
  if (!value.publication.approved && value.points.length) issue('Unapproved evidence cannot carry publishable values');
  if (value.evaluationRole === 'frozen_final' && value.axis !== 'none') issue('A training trajectory is not frozen-final evidence');
  const identities = new Set<string>();
  for (const point of value.points) {
    const key = `${point.series}:${point.position}`;
    if (identities.has(key)) issue('Duplicate series/position');
    identities.add(key);
    if ((value.axis === 'none') !== (point.position === null)) issue('Axis and point position disagree');
    if (point.value !== null) {
      if (point.value < metric.min || (metric.max !== null && point.value > metric.max)) issue('Metric outside its units');
      if ((metric.unit === 'count' || metric.unit === 'bytes') && !Number.isSafeInteger(point.value)) issue('Counts/bytes must be safe integers');
      if (point.precision === 'reported' && Number(point.value.toFixed(point.reportedDecimals!)) !== point.value) issue('Reported precision invents digits');
    }
  }
});

export type EvidenceContract = z.infer<typeof evidenceContractSchema>;
export type EvidenceSnapshot = z.infer<typeof evidenceSnapshotSchema>;
export type EvidencePoint = z.infer<typeof evidencePointSchema>;
export type EvidenceSource = z.infer<typeof evidenceSourceSchema>;

// These are narrow publication guards, not a substitute for a repository secret scanner.
const privateMaterial = /(?:file:\/\/|(?:\/Users\/|\/home\/|\/data\/home\/)|(?:https?:\/\/)(?:localhost|127\.|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)|(?:[?&](?:token|access_token|auth|password|x-vercel-protection-bypass|share|nw)=)|-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{12,})/i;
export function assertPublicationSafe(value: unknown): void {
  if (privateMaterial.test(JSON.stringify(value))) throw new Error('Private or temporary-access material in evidence metadata');
}

export function validateEvidenceRegistry(snapshots: readonly unknown[], contracts: readonly unknown[]) {
  const parsedContracts = contracts.map((value) => evidenceContractSchema.parse(value));
  const parsedSnapshots = snapshots.map((value) => evidenceSnapshotSchema.parse(value));
  const contractMap = new Map<string, EvidenceContract>();
  for (const contract of parsedContracts) {
    assertPublicationSafe(contract);
    if (contractMap.has(contract.id)) throw new Error(`Duplicate contract id: ${contract.id}`);
    contractMap.set(contract.id, contract);
  }
  const ids = new Set<string>();
  for (const snapshot of parsedSnapshots) {
    assertPublicationSafe(snapshot);
    if (ids.has(snapshot.id)) throw new Error(`Duplicate evidence id: ${snapshot.id}`);
    ids.add(snapshot.id);
    const contract = contractMap.get(snapshot.contractId);
    if (!contract) throw new Error(`Unknown comparison contract: ${snapshot.contractId}`);
    if (contract.evaluationRole !== snapshot.evaluationRole) throw new Error(`Evaluation role mismatch: ${snapshot.id}`);
    if (snapshot.metric.id === 'trainingLoss' && snapshot.evaluationRole === 'frozen_final') throw new Error('Training loss is not a final task metric');
    if (snapshot.metric.id === 'exactSuccessCount' && snapshot.axis === 'none' && contract.trialCount !== null &&
        snapshot.points.some((point) => point.value !== null && point.value > contract.trialCount!)) {
      throw new Error('Success count exceeds trial denominator');
    }
  }
  return { snapshots: parsedSnapshots, contracts: parsedContracts };
}

export function publishedEvidence(snapshots: readonly EvidenceSnapshot[], evidenceId: string): EvidenceSnapshot {
  const found = snapshots.find((item) => item.id === evidenceId);
  if (!found) throw new Error(`Unknown evidence id: ${evidenceId}`);
  const snapshot = evidenceSnapshotSchema.parse(found);
  assertPublicationSafe(snapshot);
  if (!snapshot.publication.approved || snapshot.completeness === 'unavailable') throw new Error(`Evidence publication blocked: ${evidenceId}`);
  return snapshot;
}

export function evidenceNumber(snapshot: EvidenceSnapshot, series: string, position: number | null = null): number {
  const point = snapshot.points.find((item) => item.series === series && item.position === position);
  if (!point || point.value === null) throw new Error(`Missing evidence value: ${snapshot.id}/${series}/${position}`);
  return point.value;
}

/** Display is derived, never persisted back over source precision or units. */
export function formatEvidencePoint(point: EvidencePoint, decimals = 2, scale: 1 | 100 = 1): string {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 15) throw new Error('Invalid display precision');
  if (point.value === null) return '未知';
  const available = point.reportedDecimals === null ? decimals : Math.max(0, point.reportedDecimals - (scale === 100 ? 2 : 0));
  return (point.value * scale).toFixed(Math.min(decimals, available));
}
