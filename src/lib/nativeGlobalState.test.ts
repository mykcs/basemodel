import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(resolve(import.meta.dirname, path), 'utf8');

describe('native global state bridge', () => {
  it('keeps native compare clear and mounted nanostore consumers on one event contract', () => {
    const tray = read('../components/workspace/CompareTray.astro');
    const store = read('../stores/compare.ts');

    expect(tray).toContain("localStorage.setItem('atlas-compare','[]')");
    expect(tray).toContain("window.dispatchEvent(new Event('atlas:compare-change'))");
    expect(store).toContain("export const COMPARE_CHANGE_EVENT = 'atlas:compare-change'");
    expect(store).toContain('window.addEventListener(COMPARE_CHANGE_EVENT');
    expect(store).toContain("localStorage.getItem(STORAGE_KEY)");
  });

  it('keeps native research-task clear and URL hydration synchronized with mounted store consumers', () => {
    const context = read('../components/workspace/ResearchContextBar.astro');
    const store = read('../stores/researchTask.ts');

    expect(context).toContain('decodeResearchTask(new URLSearchParams(window.location.search))');
    expect(context).toContain("localStorage.setItem('atlas-research-task'");
    expect(context).toContain("window.dispatchEvent(new Event('atlas:research-context-change'))");
    expect(store).toContain("window.addEventListener('atlas:research-context-change'");
    expect(store).toContain('localStorage.getItem(RESEARCH_TASK_STORAGE_KEY)');
  });
});
