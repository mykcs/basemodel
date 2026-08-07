import { persistentAtom } from '@nanostores/persistent';

export const MAX_CANDIDATES = 12;

export const candidateIds = persistentAtom<string[]>('atlas-candidates', [], {
  encode: (value) => JSON.stringify(value.slice(0, MAX_CANDIDATES)),
  decode: (value) => {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string').slice(0, MAX_CANDIDATES) : [];
    } catch {
      return [];
    }
  },
});

export function addCandidate(id: string) {
  candidateIds.set([...new Set([...candidateIds.get(), id])].slice(0, MAX_CANDIDATES));
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
