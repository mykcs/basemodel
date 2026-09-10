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
  '/development/',
  '/lab/',
  '/research/seed-openevo/flow/',
  '/research/seed-openevo/flow/server/',
  '/research/seed-openevo/flow/base-model/',
  '/research/seed-openevo/flow/seed/',
  '/research/seed-openevo/flow/openevo/',
  '/research/seed-openevo/study/',
  '/research/seed-openevo/study/briefing/',
  '/research/seed-openevo/study/briefing/technical-notes/',
  '/research/seed-openevo/flow/benchmarks/',
  '/research/seed-openevo/flow/webshop/',
  '/research/seed-openevo/flow/alfworld/',
  '/research/seed-openevo/flow/loops/',
  '/research/seed-openevo/study/results/',
  '/research/seed-openevo/study/capability-exploration/',
  '/research/seed-openevo/study/capability-exploration/gdr-directapply/',
  '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/',
  '/research/seed-openevo/study/capability-exploration/stage1-previous/',
  '/research/seed-openevo/study/capability-exploration/stage2-256-window/',
  '/research/seed-openevo/study/capability-exploration/stage2-ceiling/',
  '/research/seed-openevo/study/capability-exploration/openevo-2-0/',
  '/research/seed-openevo/study/results/3b-self-analysis/',
  '/research/seed-openevo/study/results/7b-self-analysis/',
  '/research/seed-openevo/study/results/3b-minimax-analysis/',
  '/research/seed-openevo/study/results/7b-minimax-analysis/',
  '/research/seed-openevo/study/results/four-arm-analysis/',
] as const;

export const bilingualCompatibilityPaths = [
  '/research/seed-openevo/study/design/',
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
  '/research/seed-openevo/study/minimax-teacher/',
] as const;

export function toEnglishPath(path: string): string {
  return path === '/' ? '/en/' : `/en${path}`;
}

export type RouteLocale = 'zh' | 'en';

const bilingualRoutes = new Set<string>([...bilingualStaticPaths, ...bilingualCompatibilityPaths]);
const zhOnlyRoutes = new Set<string>(zhOnlyStaticPaths);
const bilingualDynamicRoute = /^\/(?:models|papers)\/[^/]+\/$/;

export function normalizeLocaleRoute(pathname: string): string {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || '/';
  const neutral = withoutQuery.replace(/^\/en(?=\/|$)/, '') || '/';
  return neutral === '/' ? '/' : `/${neutral.replace(/^\/+|\/+$/g, '')}/`;
}

export function availableLocalesForRoute(pathname: string): readonly RouteLocale[] {
  const route = normalizeLocaleRoute(pathname);
  if (bilingualRoutes.has(route) || bilingualDynamicRoute.test(route)) return ['zh', 'en'];
  if (zhOnlyRoutes.has(route)) return ['zh'];
  return [];
}

export function isLocaleRouteAvailable(pathname: string, locale: RouteLocale): boolean {
  return availableLocalesForRoute(pathname).includes(locale);
}

export function localizedRoute(pathname: string, locale: RouteLocale): string | null {
  const route = normalizeLocaleRoute(pathname);
  if (!isLocaleRouteAvailable(route, locale)) return null;
  return locale === 'en' ? toEnglishPath(route) : route;
}

export function sitemapStaticPaths(): string[] {
  return [...bilingualStaticPaths, ...zhOnlyStaticPaths, ...bilingualStaticPaths.map(toEnglishPath)];
}
