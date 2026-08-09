import correctionsFile from '../content/corrections/papers.json';

type PaperLike = { id: string; checkpoint_url: unknown; reproducibility?: Record<string, unknown>; sources: Array<Record<string, unknown>> };
type PaperCorrection = { checkpoint_url?: string; reproducibility?: Record<string, unknown>; sources?: Array<Record<string, unknown>> };
const corrections = correctionsFile.corrections as Record<string, PaperCorrection>;

export function applyPaperCorrection<T extends PaperLike>(paper: T): T {
  const correction = corrections[paper.id];
  if (!correction) return paper;
  const sourceUrls = new Set(paper.sources.map((source) => String(source.url ?? '')));
  const additionalSources = (correction.sources ?? []).filter((source) => !sourceUrls.has(String(source.url ?? '')));
  return {
    ...paper,
    ...(correction.checkpoint_url ? { checkpoint_url: correction.checkpoint_url } : {}),
    reproducibility: { ...(paper.reproducibility ?? {}), ...(correction.reproducibility ?? {}) },
    sources: [...paper.sources, ...additionalSources],
  } as T;
}
