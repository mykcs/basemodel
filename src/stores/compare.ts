import { persistentAtom } from '@nanostores/persistent';
import { localePath, type Locale } from '../i18n';

const MAX_COMPARE = 5;
const STORAGE_KEY = 'atlas-compare';

export const compareIds = persistentAtom<string[]>(STORAGE_KEY, [], {
  encode(value) {
    return JSON.stringify(value);
  },
  decode(str) {
    try {
      const parsed = JSON.parse(str) as string[];
      return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
    } catch {
      return [];
    }
  },
});

export function addToCompare(id: string) {
  compareIds.set([...new Set([...compareIds.get(), id])].slice(0, MAX_COMPARE));
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
