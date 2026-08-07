import type { Bucket, ScoredModel } from './types';

export function bucketize(scored: ScoredModel[]): Record<Bucket, ScoredModel[]> {
  return {
    baseline: scored.filter((item) => item.bucket === 'baseline' && item.candidateState !== 'blocked' && item.candidateState !== 'needs_verification'),
    modern: scored.filter((item) => item.bucket === 'modern' && item.candidateState !== 'blocked' && item.candidateState !== 'needs_verification'),
    resource: scored.filter((item) => item.bucket === 'resource' && item.candidateState !== 'blocked' && item.candidateState !== 'needs_verification'),
  };
}
