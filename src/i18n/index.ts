import { zh, type Messages } from './zh';
import { en } from './en';

export type Locale = 'zh' | 'en';
export type { Messages };

export const locales: Locale[] = ['zh', 'en'];
export const defaultLocale: Locale = 'zh';

const dictionaries: Record<Locale, Messages> = { zh, en };

/** 取某 locale 的字典。Astro 端用 Astro.currentLocale, React 端由页面把 locale 作为 prop 传入。 */
export function getMessages(locale: string | undefined): Messages {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : defaultLocale];
}

export function isLocale(value: string | undefined): value is Locale {
  return value === 'zh' || value === 'en';
}

/** 规范化的 base (保证以 / 结尾)。 */
export function baseUrl(): string {
  const base = import.meta.env.BASE_URL;
  return base.endsWith('/') ? base : `${base}/`;
}

/** 某 locale 站内路径: zh 走根 (无前缀), en 走 /en/ 前缀。path 需以 / 开头且不含 base。 */
export function localePath(locale: Locale, path: string): string {
  const base = baseUrl();
  const clean = path.startsWith('/') ? path.slice(1) : path;
  // Astro emits the default static 404 page as /404.html, while the English
  // locale has a normal directory route at /en/404/.
  if (locale === 'zh' && (clean === '404' || clean === '404/')) return `${base}404.html`;
  return locale === 'en' ? `${base}en/${clean}` : `${base}${clean}`;
}

/** 把当前站内路径映射到另一 locale 的等价路径 (语言切换用)。传入不含 base 的 path, 如 /models/gpt-5/。 */
export function switchLocalePath(target: Locale, currentPathNoBase: string): string {
  let clean = currentPathNoBase.startsWith('/') ? currentPathNoBase : `/${currentPathNoBase}`;
  // 去掉已有 /en 前缀, 拿到 locale-中性路径。
  clean = clean.replace(/^\/en(\/|$)/, '/');
  return localePath(target, clean);
}

/** 从 URL pathname 推断 locale 并剥离 base, 返回 { locale, pathNoBase }。 */
export function parsePath(pathname: string): { locale: Locale; pathNoBase: string } {
  const base = baseUrl();
  let p = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '');
  const locale: Locale = p === 'en' || p.startsWith('en/') ? 'en' : 'zh';
  if (locale === 'en') p = p.replace(/^en(?:\/|$)/, '');
  return { locale, pathNoBase: p ? `/${p}` : '/' };
}
