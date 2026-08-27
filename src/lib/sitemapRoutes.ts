export const bilingualStaticPaths = [
  '/',
  '/models/',
  '/families/',
  '/compare/',
  '/papers/',
  '/guide/',
  '/research/seed-openevo/study/run/',
  '/landscape/',
  '/methodology/',
  '/workspace/',
  '/data-status/',
  '/lab/',
  '/research/seed-openevo/flow/',
  '/research/seed-openevo/flow/base-model/',
  '/research/seed-openevo/flow/seed/',
  '/research/seed-openevo/flow/openevo/',
  '/research/seed-openevo/study/',
  '/research/seed-openevo/flow/benchmarks/',
  '/research/seed-openevo/flow/webshop/',
  '/research/seed-openevo/flow/alfworld/',
  '/research/seed-openevo/flow/loops/',
  '/research/seed-openevo/study/results/',
] as const;

export const zhOnlyStaticPaths = [
  '/guide/today/',
  '/research/seed-openevo/study/results/webshop-training/',
  '/research/seed-openevo/study/results/seed-training/',
  '/research/seed-openevo/study/results/openevo-training/',
  '/research/seed-openevo/study/results/why-it-kept-failing/',
  '/research/seed-openevo/study/results/first-positive-transfer/',
  '/research/seed-openevo/study/results/independent-replication/',
  '/research/seed-openevo/study/results/second-generation/',
  '/research/seed-openevo/study/results/measurement-boundary/',
  '/research/seed-openevo/study/results/current-conclusion/',
  '/research/seed-openevo/study/results/benchmark-first/',
  '/research/seed-openevo/study/results/seed-faithful-benchmark/',
  '/research/seed-openevo/study/results/openevo-benchmark-design/',
] as const;

export function toEnglishPath(path: string): string {
  return path === '/' ? '/en/' : `/en${path}`;
}
