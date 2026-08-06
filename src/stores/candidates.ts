import { atom } from 'nanostores';

export const candidateIds = atom<string[]>([]);

export function addCandidate(id: string) {
  candidateIds.set([...new Set([...candidateIds.get(), id])]);
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
