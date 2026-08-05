import { getMessages, type Locale } from '../i18n';

// 存储枚举只在数据层使用；所有可见枚举都经过这里的 locale formatter。

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
  return (m.format.status as Record<string, string>)[status] ?? m.format.unknown;
}

export function tierLabel(tier: string, locale?: Locale): string {
  const m = getMessages(locale);
  return (m.format.tier as Record<string, string>)[tier] ?? m.format.unknown;
}

function mappedLabel(group: 'lifecycle' | 'sourceType' | 'architecture' | 'checkpoint' | 'specialization' | 'role' | 'category' | 'evolutionTarget', value: string, locale?: Locale): string {
  const m = getMessages(locale);
  return (m.format[group] as Record<string, string>)[value] ?? m.format.unknown;
}

export const lifecycleLabel = (value: string, locale?: Locale) => mappedLabel('lifecycle', value, locale);
export const sourceTypeLabel = (value: string, locale?: Locale) => mappedLabel('sourceType', value, locale);
export const architectureLabel = (value: string, locale?: Locale) => mappedLabel('architecture', value, locale);
export const checkpointLabel = (value: string, locale?: Locale) => mappedLabel('checkpoint', value, locale);
export const specializationLabel = (value: string, locale?: Locale) => mappedLabel('specialization', value, locale);
export const roleLabel = (value: string, locale?: Locale) => mappedLabel('role', value, locale);
export const categoryLabel = (value: string, locale?: Locale) => mappedLabel('category', value, locale);
export const evolutionTargetLabel = (value: string, locale?: Locale) => mappedLabel('evolutionTarget', value, locale);
export const taskLabel = (value: string, locale?: Locale) => {
  const m = getMessages(locale);
  return (m.selector.tasks as Record<string, string>)[value] ?? m.format.unknown;
};
export const modalityLabel = (value: string, locale?: Locale) => {
  const m = getMessages(locale);
  return (m.modalities as Record<string, string>)[value] ?? m.format.unknown;
};

export function parameterSummary(total: unknown, active: unknown, type: string, locale?: Locale): string {
  if (type === 'moe') {
    const totalText = displayUnknown(total, 'B', locale);
    const activeText = displayUnknown(active, 'B', locale);
    return locale === 'en' ? `${totalText} total / ${activeText} active` : `${totalText} 总计 / ${activeText} 激活`;
  }
  const value = displayUnknown(total, 'B', locale);
  return locale === 'en' ? `${value} parameters` : `${value} 参数`;
}
