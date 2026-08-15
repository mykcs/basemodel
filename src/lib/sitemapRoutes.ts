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
  '/research/seed-openevo/loops/',
  '/research/seed-openevo/results/',
] as const;

export const zhOnlyStaticPaths = ['/guide/today/'] as const;

export function toEnglishPath(path: string): string {
  return path === '/' ? '/en/' : `/en${path}`;
}
