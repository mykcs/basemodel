import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readSource = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

describe('optimization-phase regressions', () => {
  it('keeps Kimi K3 architecture facts aligned with first-party evidence', () => {
    const kimi = JSON.parse(readSource('../content/models/kimi-k3.json')) as {
      architecture: {
        total_parameters_b: number;
        active_parameters_b: number;
        context_length: number;
        expert_count: number;
        active_experts_per_token: number;
      };
      sources: Array<{ type: string; checked_at: string; supports?: string[] }>;
    };

    expect(kimi.architecture).toMatchObject({
      total_parameters_b: 2800,
      active_parameters_b: 104,
      context_length: 1_048_576,
      expert_count: 896,
      active_experts_per_token: 16,
    });

    const modelCard = kimi.sources.find((source) => source.type === 'official_model_card');
    expect(modelCard?.checked_at).toBe('2026-08-09');
    expect(modelCard?.supports).toEqual(expect.arrayContaining([
      'architecture.total_parameters_b',
      'architecture.active_parameters_b',
      'architecture.context_length',
      'architecture.expert_count',
      'architecture.active_experts_per_token',
    ]));
  });

  it('never exposes storage enums directly in the Landscape learning view', () => {
    const source = readSource('../components/landscape/LandscapePrototype.tsx');
    expect(source).toContain('tierLabel(model.hardware.inference_tier, locale)');
    expect(source).toContain('statusLabel(model.data_status, locale)');
    expect(source).not.toContain('<dd>{model.data_status}</dd>');
  });

  it('keeps the papers page useful before hydration and avoids a static matrix island', () => {
    const explorer = readSource('../components/papers/PaperExplorer.tsx');
    const page = readSource('../pages/_bodies/papers-index.astro');

    expect(explorer).not.toContain('if (!hydrated) return null');
    expect(explorer).toContain('useState<FilterState>(emptyFilters)');
    expect(page).not.toContain('<PaperModelMatrix client:load');
    expect(page).toContain('<PaperModelMatrix papers={matrixPapers}');
  });

  it('renders the comparison picker as static HTML before client state restoration', () => {
    const source = readSource('../components/ModelComparison.tsx');
    expect(source).not.toContain("from '../lib/useHydrated'");
    expect(source).not.toContain('if (!hydrated) return null');
    expect(source).toContain('className="comparison-picker"');
    expect(source).toContain('initialSelection(models)');
  });

  it('renders the model catalog deterministically before restoring browser state', () => {
    const source = readSource('../components/ModelExplorer.tsx');
    expect(source).not.toContain('if (!hydrated) return null');
    expect(source).not.toContain("new URLSearchParams(typeof window === 'undefined'");
    expect(source).toContain('useState<ModelFilters>({})');
    expect(source).toContain('if (!urlStateReady) return;');
    expect(source).toContain('const activeCandidates = hydrated ? selectedCandidates : []');
    expect(source).toContain('const hasActiveTask = hydrated && hasMeaningfulResearchTask(task)');
  });

  it('defers the global compare tray and keeps the full catalog out of every page payload', () => {
    const layout = readSource('../layouts/AppLayout.astro');
    const tray = readSource('../components/workspace/CompareTray.tsx');

    expect(layout).toContain('<CompareTray client:idle m={m} locale={locale} />');
    expect(layout).not.toContain('<CompareTray client:load');
    expect(layout).not.toContain("getCollection('models')");
    expect(layout).not.toContain('modelNames={modelNames}');
    expect(tray).toContain('/model-data/${encodeURIComponent(id)}.json');
    expect(tray).toContain('ids.length === 0');
    expect(tray).not.toContain('modelNames: Record<string, string>;');
  });
});
