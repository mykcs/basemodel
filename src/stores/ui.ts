import { atom } from 'nanostores';

export const quickViewId = atom<string | null>(null);
export type MobileWorkspacePane = 'task' | 'candidates' | 'evidence' | 'compare';
export const mobileWorkspacePane = atom<MobileWorkspacePane>('candidates');

export function openQuickView(id: string) {
  quickViewId.set(id);
}

export function closeQuickView() {
  quickViewId.set(null);
}
