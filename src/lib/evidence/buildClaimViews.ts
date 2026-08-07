import type { AtlasModel, AtlasPaper } from '../schemas';
import { fieldCatalog, fieldLabel } from '../fieldCatalog';

export type EvidenceLevel = 'official' | 'paper' | 'secondary' | 'unsupported';
export interface ClaimView {
  fieldPath: string;
  label: string;
  value: unknown;
  sources: Array<AtlasModel['sources'][number] | AtlasPaper['sources'][number]>;
  evidenceLevel: EvidenceLevel;
  checkedAt?: string;
}

function valueAt(item: AtlasModel | AtlasPaper, fieldPath: string): unknown {
  return fieldPath.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[segment];
  }, item);
}

function levelFor(sourceType: string): EvidenceLevel {
  if (sourceType.startsWith('official_') || sourceType === 'official_code') return 'official';
  if (sourceType === 'paper' || sourceType === 'technical_report' || sourceType === 'code') return 'paper';
  if (sourceType === 'benchmark' || sourceType === 'third_party_runtime' || sourceType === 'demo_record') return 'secondary';
  return 'unsupported';
}

export function buildClaimViews(item: AtlasModel | AtlasPaper, locale: 'zh' | 'en' = 'zh'): ClaimView[] {
  const claims = new Map<string, ClaimView>();
  for (const source of item.sources) {
    for (const fieldPath of source.supports ?? []) {
      const catalog = fieldCatalog[fieldPath];
      if (!catalog) continue;
      const value = valueAt(item, fieldPath);
      if (value === undefined) continue;
      const existing = claims.get(fieldPath);
      if (existing) {
        existing.sources.push(source);
        if (existing.evidenceLevel === 'secondary' && levelFor(source.type) === 'official') existing.evidenceLevel = 'official';
        if (source.checked_at > (existing.checkedAt ?? '')) existing.checkedAt = source.checked_at;
      } else {
        claims.set(fieldPath, { fieldPath, label: fieldLabel(fieldPath, locale), value, sources: [source], evidenceLevel: levelFor(source.type), checkedAt: source.checked_at });
      }
    }
  }
  return [...claims.values()].sort((left, right) => left.label.localeCompare(right.label, locale === 'zh' ? 'zh-CN' : 'en'));
}
