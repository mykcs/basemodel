import { persistentAtom } from '@nanostores/persistent';

export const MAX_CANDIDATES = 12;

export function normalizeCandidateIds(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean))].slice(0, MAX_CANDIDATES)
    : [];
}

export const candidateIds = persistentAtom<string[]>('atlas-candidates', [], {
  encode: (value) => JSON.stringify(normalizeCandidateIds(value)),
  decode: (value) => {
    try {
      return normalizeCandidateIds(JSON.parse(value) as unknown);
    } catch {
      return [];
    }
  },
});

export function replaceCandidates(value: unknown) {
  candidateIds.set(normalizeCandidateIds(value));
}

export function addCandidate(id: string) {
  replaceCandidates([...candidateIds.get(), id]);
}

export function removeCandidate(id: string) {
  candidateIds.set(candidateIds.get().filter((x) => x !== id));
}

export function clearCandidates() {
  candidateIds.set([]);
}

export function isCandidate(id: string) {
  return candidateIds.get().includes(id);
}
