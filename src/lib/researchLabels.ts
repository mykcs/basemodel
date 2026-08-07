import { getMessages, type Locale } from '../i18n';
import { roleLabel, semanticStatusLabel, tierLabel } from './format';
import type { ResearchMode, UpdateMethod, AccessMode, EvidencePolicy } from '../stores/researchTask';

const modeKeys: Record<ResearchMode, 'strict' | 'method' | 'modern' | 'new'> = {
  strict: 'strict', method: 'method', modern: 'modern', new: 'new',
};

export function researchModeLabel(value: ResearchMode, locale?: Locale): string {
  const m = getMessages(locale);
  return m.research.modes[modeKeys[value]];
}

export function updateMethodLabel(value: UpdateMethod, locale?: Locale): string {
  const m = getMessages(locale);
  return m.research.updates[value];
}

export function accessModeLabel(value: AccessMode, locale?: Locale): string {
  const m = getMessages(locale);
  return m.research.accessModes[value];
}

export function evidencePolicyLabel(value: EvidencePolicy, locale?: Locale): string {
  const m = getMessages(locale);
  return m.research.evidencePolicies[value];
}

export { roleLabel, semanticStatusLabel, tierLabel };
