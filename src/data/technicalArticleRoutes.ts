/** Article reading surfaces; directories, workbenches, slides and route migrations retain their own layouts.
 * This explicit inventory also drives rendered acceptance, so new article routes cannot silently miss the shared treatment. */
export const TECHNICAL_ARTICLE_ROUTES = [
  "/development/",
  "/methodology/",
  "/research/seed-openevo/flow/alfworld/",
  "/research/seed-openevo/flow/benchmarks/",
  "/research/seed-openevo/flow/loops/",
  "/research/seed-openevo/flow/openevo/",
  "/research/seed-openevo/flow/sd-lora/",
  "/research/seed-openevo/flow/seed/",
  "/research/seed-openevo/flow/webshop/",
  "/research/seed-openevo/recent-challenges/",
  "/research/seed-openevo/study/advisor-questions/",
  "/research/seed-openevo/study/briefing/technical-notes/",
  "/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/",
  "/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/",
  "/research/seed-openevo/study/capability-exploration/gdr-directapply/",
  "/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/",
  "/research/seed-openevo/study/capability-exploration/openevo-2-0/report/",
  "/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/",
  "/research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/",
  "/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/",
  "/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/",
  "/research/seed-openevo/study/capability-exploration/sd-lora-scaling/",
  "/research/seed-openevo/study/capability-exploration/stage1-learning-objectives/",
  "/research/seed-openevo/study/capability-exploration/stage1-previous/",
  "/research/seed-openevo/study/capability-exploration/stage2-7b-analysis/",
  "/research/seed-openevo/study/capability-exploration/stage2-ceiling/",
  "/research/seed-openevo/study/capability-exploration/text-memory/",
  "/research/seed-openevo/study/minimax-teacher/",
  "/research/seed-openevo/study/openevo-methods/",
  "/research/seed-openevo/study/parameter-memory-results/",
  "/research/seed-openevo/study/results/3b-minimax-analysis/",
  "/research/seed-openevo/study/results/3b-self-analysis/",
  "/research/seed-openevo/study/results/7b-minimax-analysis/",
  "/research/seed-openevo/study/results/7b-self-analysis/",
  "/research/seed-openevo/study/results/benchmark-first/",
  "/research/seed-openevo/study/results/current-conclusion/",
  "/research/seed-openevo/study/results/first-positive-transfer/",
  "/research/seed-openevo/study/results/four-arm-analysis/",
  "/research/seed-openevo/study/results/independent-replication/",
  "/research/seed-openevo/study/results/measurement-boundary/",
  "/research/seed-openevo/study/results/openevo-benchmark-design/",
  "/research/seed-openevo/study/results/second-generation/",
  "/research/seed-openevo/study/results/seed-faithful-benchmark/",
  "/research/seed-openevo/study/results/why-it-kept-failing/"
] as const;

/** Research entries keep their navigation/controls in a wider reading frame. */
export const READING_OVERVIEW_ROUTES = [
  "/research/seed-openevo/flow/",
  "/research/seed-openevo/flow/server/",
  "/research/seed-openevo/study/",
  "/research/seed-openevo/study/results/",
  "/research/seed-openevo/study/capability-exploration/",
  "/research/seed-openevo/study/capability-exploration/archive/",
  "/research/seed-openevo/study/capability-exploration/first-run/",
  "/research/seed-openevo/study/capability-exploration/mechanism-1-0/",
  "/research/seed-openevo/study/capability-exploration/openevo-2-0/",
  "/research/seed-openevo/study/capability-exploration/openevo-2-0/exploration/",
  "/research/seed-openevo/study/capability-exploration/stage1-evolution/",
  "/research/seed-openevo/study/capability-exploration/stage2-256-window/",
  "/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/",
  "/research/seed-openevo/study/capability-exploration/sd-lora-history/",
  "/research/seed-openevo/study/capability-exploration/sd-lora-present-function/",
  "/research/seed-openevo/study/capability-exploration/sd-lora-history-novelty/",
  "/research/seed-openevo/study/capability-exploration/sd-lora-future-learning/",
  "/guide/",
  "/guide/today/"
] as const;

export function isReadingOverviewRoute(pathname: string): boolean {
  const path = (pathname.split(/[?#]/, 1)[0] || '/').replace(/^\/en(?=\/|$)/, '').replace(/\/+$/, '') + '/';
  return (READING_OVERVIEW_ROUTES as readonly string[]).includes(path) || /^\/papers\/[^/]+\/$/.test(path);
}

export function isTechnicalArticleRoute(pathname: string): boolean {
  const path = (pathname.split(/[?#]/, 1)[0] || '/').replace(/^\/en(?=\/|$)/, '').replace(/\/+$/, '') + '/';
  return (TECHNICAL_ARTICLE_ROUTES as readonly string[]).includes(path) || isReadingOverviewRoute(path);
}
