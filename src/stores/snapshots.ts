import { persistentAtom } from '@nanostores/persistent';
import type { AtlasModel } from '../lib/schemas';
import { normalizeResearchTask } from '../lib/researchTaskNormalization';
import { normalizeCandidateIds } from './candidates';
import { normalizeCompareIds } from './compare';
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

function normalizeClaimFingerprints(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).flatMap(([key, encoded]) => {
    if (typeof encoded !== 'string') return [];
    try {
      const parsed = JSON.parse(encoded) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return [];
      return [[key, encoded] as const];
    } catch {
      return [];
    }
  }));
}

export function normalizeDecisionSnapshot(value: unknown): DecisionSnapshot | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== 'string' || !item.id.trim()) return null;
  if (typeof item.createdAt !== 'string' || typeof item.memoMarkdown !== 'string') return null;
  return {
    id: item.id,
    createdAt: item.createdAt,
    task: normalizeResearchTask(item.task),
    candidateIds: normalizeCandidateIds(item.candidateIds),
    compareIds: normalizeCompareIds(item.compareIds),
    claimFingerprints: normalizeClaimFingerprints(item.claimFingerprints),
    memoMarkdown: item.memoMarkdown,
  };
}

export const decisionSnapshots = persistentAtom<DecisionSnapshot[]>('atlas-decision-snapshots', [], {
  encode: (value) => JSON.stringify(value.slice(0, MAX_SNAPSHOTS)),
  decode: (value) => {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed)
        ? parsed.flatMap((item) => {
            const snapshot = normalizeDecisionSnapshot(item);
            return snapshot ? [snapshot] : [];
          }).slice(0, MAX_SNAPSHOTS)
        : [];
    } catch {
      return [];
    }
  },
});

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
    try {
      const previous = JSON.parse(previousEncoded) as { value?: unknown };
      const next = JSON.parse(currentEncoded) as { value?: unknown; checkedAt?: string };
      return [{ key, previousValue: claimValue(previous.value), currentValue: claimValue(next.value), checkedAt: next.checkedAt ?? 'not_verified' }];
    } catch {
      return [];
    }
  });
}

export function saveDecisionSnapshot(snapshot: DecisionSnapshot) {
  const normalized = normalizeDecisionSnapshot(snapshot);
  if (!normalized) return;
  decisionSnapshots.set([normalized, ...decisionSnapshots.get().filter((item) => item.id !== normalized.id)].slice(0, MAX_SNAPSHOTS));
}
