import type { ResearchTask } from '../stores/researchTask';
import type { ResearchFit, ScoredModel } from './research/types';

export interface DecisionRecord {
  schemaVersion: 1;
  generatedAt: string;
  dataRevision: string;
  task: ResearchTask;
  candidates: Array<{ modelId: string; bucket: string; fit: ResearchFit }>;
  selectedCandidateIds: string[];
  compareIds: string[];
  unresolvedClaims: string[];
  sources: Array<{ url: string; type: string; checkedAt: string }>;
}

export function buildDecisionRecord(task: ResearchTask, scored: ScoredModel[], selectedCandidateIds: string[], compareIds: string[]): DecisionRecord {
  const chosen = scored.filter((entry) => selectedCandidateIds.includes(entry.model.id));
  const candidates = (chosen.length ? chosen : scored.filter((entry) => entry.candidateState !== 'blocked').slice(0, 5)).map((entry) => ({ modelId: entry.model.id, bucket: entry.bucket, fit: entry.fit }));
  const unresolvedClaims = [...new Set(scored.flatMap((entry) => entry.outcomes.filter((outcome) => outcome.state === 'unknown').flatMap((outcome) => outcome.fieldPaths)))];
  const sources = [...new Map(scored.flatMap((entry) => entry.model.sources).map((source) => [source.url, { url: source.url, type: source.type, checkedAt: source.checked_at }])).values()];
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    dataRevision: import.meta.env.PUBLIC_BUILD_SHA ?? 'development',
    task,
    candidates,
    selectedCandidateIds,
    compareIds,
    unresolvedClaims,
    sources,
  };
}

export function decisionRecordToJson(record: DecisionRecord): string {
  return JSON.stringify(record, null, 2);
}
