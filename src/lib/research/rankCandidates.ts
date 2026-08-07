import type { ScoredModel } from './types';

export function rankCandidates(candidates: ScoredModel[]): ScoredModel[] {
  return [...candidates].sort((left, right) => right.score - left.score || right.paperCount - left.paperCount || right.model.release_date.localeCompare(left.model.release_date));
}
