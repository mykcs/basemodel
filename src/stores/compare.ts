import { persistentAtom } from '@nanostores/persistent';
import { localePath, type Locale } from '../i18n';

export const MAX_COMPARE = 5;
const STORAGE_KEY = 'atlas-compare';

export function normalizeCompareIds(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean))].slice(0, MAX_COMPARE)
    : [];
}

export const compareIds = persistentAtom<string[]>(STORAGE_KEY, [], {
  encode(value) {
    return JSON.stringify(normalizeCompareIds(value));
  },
  decode(str) {
    try {
      return normalizeCompareIds(JSON.parse(str) as unknown);
    } catch {
      return [];
    }
  },
});

export function replaceCompare(value: unknown) {
  compareIds.set(normalizeCompareIds(value));
}

export function addToCompare(id: string) {
  replaceCompare([...compareIds.get(), id]);
}

export function removeFromCompare(id: string) {
  compareIds.set(compareIds.get().filter((x) => x !== id));
}

export function toggleCompare(id: string) {
  if (compareIds.get().includes(id)) {
    removeFromCompare(id);
  } else {
    addToCompare(id);
  }
}

export function clearCompare() {
  compareIds.set([]);
}

export function compareUrl(locale: Locale): string {
  const ids = compareIds.get();
  const path = localePath(locale, '/compare/');
  return ids.length ? `${path}?models=${encodeURIComponent(ids.join(','))}` : path;
}
