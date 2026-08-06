import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export type Theme = 'light' | 'dark' | 'system';

export const quickViewId = atom<string | null>(null);

export const themePreference = persistentAtom<Theme>('atlas-theme-pref', 'system', {
  encode: (v) => v,
  decode: (v) => (v === 'light' || v === 'dark' || v === 'system' ? v : 'system'),
});

export function openQuickView(id: string) {
  quickViewId.set(id);
}

export function closeQuickView() {
  quickViewId.set(null);
}

export function setThemePreference(theme: Theme) {
  themePreference.set(theme);
}
