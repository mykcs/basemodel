import { getMessages, type Locale } from '../i18n';

// 枚举值 → 展示文案, 按 locale 取字典。默认 zh 保持向后兼容 (旧调用不传 locale)。
// 专业名词 (MoE/Dense/Checkpoint/API only 等) 不在此处翻译 —— 它们本就是英文。

export function displayUnknown(value: unknown, suffix = '', locale?: Locale): string {
  const m = getMessages(locale);
  if (value === null || value === undefined || value === 'unknown') return m.format.unknown;
  if (typeof value === 'boolean') return value ? m.format.yes : m.format.no;
  return `${value}${suffix}`;
}

export function displayBoolean(value: boolean | 'unknown', locale?: Locale): string {
  const m = getMessages(locale);
  return value === 'unknown' ? m.format.unknown : value ? m.format.yes : m.format.no;
}

export function statusLabel(status: string, locale?: Locale): string {
  const m = getMessages(locale);
  return (m.format.status as Record<string, string>)[status] ?? status;
}

export function tierLabel(tier: string, locale?: Locale): string {
  const m = getMessages(locale);
  return (m.format.tier as Record<string, string>)[tier] ?? tier;
}
