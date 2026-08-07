import { persistentAtom } from '@nanostores/persistent';
import type { AtlasModel } from '../lib/schemas';
import type { ResearchTask } from './researchTask';

export interface DecisionSnapshot {
  id: string;
  createdAt: string;
  task: ResearchTask;
  candidateIds: string[];
  compareIds: string[];
  claimFingerprints: Record<string, string>;
  memoMarkdown: string;
}

export interface SnapshotClaimChange {
  key: string;
  previousValue: string;
  currentValue: string;
  checkedAt: string;
}

export const MAX_SNAPSHOTS = 20;
export const decisionSnapshots = persistentAtom<DecisionSnapshot[]>('atlas-decision-snapshots', [], {
  encode: (value) => JSON.stringify(value.slice(0, MAX_SNAPSHOTS)),
  decode: (value) => {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.filter(isSnapshot).slice(0, MAX_SNAPSHOTS) : [];
    } catch {
      return [];
    }
  },
});

function isSnapshot(value: unknown): value is DecisionSnapshot {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<DecisionSnapshot>;
  return typeof item.id === 'string' && typeof item.createdAt === 'string' && typeof item.memoMarkdown === 'string'
    && Array.isArray(item.candidateIds) && Array.isArray(item.compareIds)
    && Boolean(item.task) && typeof item.claimFingerprints === 'object';
}

function claimValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function latestCheckDate(model: AtlasModel): string {
  return model.sources.map((source) => source.checked_at).sort().at(-1) ?? 'not_verified';
}

/** A field-level snapshot keeps semantic states and never coerces unknowns. */
export function collectClaimFingerprints(models: AtlasModel[]): Record<string, string> {
  const fields: Array<[string, (model: AtlasModel) => unknown]> = [
    ['data_status', (model) => model.data_status],
    ['openness.weights_available', (model) => model.openness.weights_available],
    ['openness.finetuning_allowed', (model) => model.openness.finetuning_allowed],
    ['openness.derivative_release_allowed', (model) => model.openness.derivative_release_allowed],
    ['research.suitable_for_lora', (model) => model.research.suitable_for_lora],
    ['research.suitable_for_sft', (model) => model.research.suitable_for_sft],
    ['research.suitable_for_rl', (model) => model.research.suitable_for_rl],
    ['research.transformers_support', (model) => model.research.transformers_support],
    ['research.vllm_support', (model) => model.research.vllm_support],
    ['research.sglang_support', (model) => model.research.sglang_support],
    ['research.verl_recipe_available', (model) => model.research.verl_recipe_available],
    ['openness.license_name', (model) => model.openness.license_name],
  ];
  return Object.fromEntries(models.flatMap((model) => fields.map(([field, read]) => [
    `${model.id}:${field}`,
    JSON.stringify({ value: read(model), checkedAt: latestCheckDate(model) }),
  ] as const)));
}

export function snapshotChanges(snapshot: DecisionSnapshot, current: Record<string, string>): SnapshotClaimChange[] {
  return Object.entries(current).flatMap(([key, currentEncoded]) => {
    const previousEncoded = snapshot.claimFingerprints[key];
    if (!previousEncoded || previousEncoded === currentEncoded) return [];
    const previous = JSON.parse(previousEncoded) as { value?: unknown };
    const next = JSON.parse(currentEncoded) as { value?: unknown; checkedAt?: string };
    return [{ key, previousValue: claimValue(previous.value), currentValue: claimValue(next.value), checkedAt: next.checkedAt ?? 'not_verified' }];
  });
}

export function saveDecisionSnapshot(snapshot: DecisionSnapshot) {
  decisionSnapshots.set([snapshot, ...decisionSnapshots.get().filter((item) => item.id !== snapshot.id)].slice(0, MAX_SNAPSHOTS));
}
