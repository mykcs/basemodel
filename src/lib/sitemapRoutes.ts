export const bilingualStaticPaths = [
  '/',
  '/models/',
  '/families/',
  '/compare/',
  '/papers/',
  '/guide/',
  '/guide/openevo-webshop-alfworld/',
  '/landscape/',
  '/methodology/',
  '/workspace/',
  '/data-status/',
  '/lab/',
  '/research/seed-openevo/',
  '/research/seed-openevo/base-model/',
  '/research/seed-openevo/seed/',
  '/research/seed-openevo/openevo/',
  '/research/seed-openevo/experiment/',
  '/research/seed-openevo/benchmarks/',
  '/research/seed-openevo/webshop/',
  '/research/seed-openevo/alfworld/',
  '/research/seed-openevo/loops/',
  '/research/seed-openevo/results/',
] as const;

export const zhOnlyStaticPaths = [
  '/guide/today/',
  '/research/seed-openevo/results/webshop-training/',
  '/research/seed-openevo/results/seed-training/',
  '/research/seed-openevo/results/openevo-training/',
  '/research/seed-openevo/results/why-it-kept-failing/',
  '/research/seed-openevo/results/first-positive-transfer/',
  '/research/seed-openevo/results/independent-replication/',
  '/research/seed-openevo/results/second-generation/',
  '/research/seed-openevo/results/measurement-boundary/',
  '/research/seed-openevo/results/current-conclusion/',
  '/research/seed-openevo/results/benchmark-first/',
  '/research/seed-openevo/results/seed-faithful-benchmark/',
  '/research/seed-openevo/results/openevo-benchmark-design/',
] as const;

export function toEnglishPath(path: string): string {
  return path === '/' ? '/en/' : `/en${path}`;
}
