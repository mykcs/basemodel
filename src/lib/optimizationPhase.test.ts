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
      sources: Array<{ type: string; checked_at: string; supports?: string[]; evidence_note?: string }>;
    };

    expect(kimi.architecture).toMatchObject({
      total_parameters_b: 2800,
      active_parameters_b: 104,
      context_length: 1_048_576,
      expert_count: 896,
      active_experts_per_token: 16,
    });

    const modelCard = kimi.sources.find((source) => source.type === 'official_model_card');
    // Re-checked on 2026-08-25 by scripts/recheck-stale-models.ts; the
    // first-party source still resolves and the architecture block is
    // intact, so checked_at is bumped to that date while the supports
    // list and architecture numbers stay pinned to the original record.
    expect(modelCard?.checked_at).toBe('2026-08-25');
    expect(modelCard?.evidence_note).toContain('re-check 2026-08-25');
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

  it('hydrates lower-priority visual explorers only when they become visible', () => {
    const landscape = readSource('../pages/_bodies/landscape.astro');
    const families = readSource('../pages/_bodies/families-index.astro');

    expect(landscape).toContain('<LandscapePrototype client:visible');
    expect(landscape).not.toContain('<LandscapePrototype client:load');
    expect(families).toContain('<FamilyTimeline client:visible');
    expect(families).not.toContain('<FamilyTimeline client:load');
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

    expect(layout).toContain('<CompareTray client:idle labels={compareTrayLabels} locale={locale} />');
    expect(layout).not.toContain('<CompareTray client:load');
    expect(layout).not.toContain("getCollection('models')");
    expect(layout).not.toContain('modelNames={modelNames}');
    expect(tray).toContain('/model-data/${encodeURIComponent(id)}.json');
    expect(tray).toContain('ids.length === 0');
    expect(tray).not.toContain('modelNames: Record<string, string>;');
  });

  it('serializes narrow label slices into global layout islands instead of repeating the full locale tree', () => {
    const layout = readSource('../layouts/AppLayout.astro');
    const context = readSource('../components/workspace/ResearchContextBar.tsx');
    const quickView = readSource('../components/models/GlobalModelQuickView.tsx');
    const tray = readSource('../components/workspace/CompareTray.tsx');

    expect(layout).not.toContain('client:load m={m}');
    expect(layout).not.toContain('client:idle m={m}');
    expect(layout).toContain('labels={researchContextLabels}');
    expect(layout).toContain('labels={quickViewLabels}');
    expect(layout).toContain('labels={compareTrayLabels}');
    expect(context).not.toContain("import type { Messages }");
    expect(quickView).not.toContain("import type { Messages }");
    expect(tray).not.toContain("import type { Messages }");
  });

  it('mounts the global model quick view only on routes that can trigger it', () => {
    const layout = readSource('../layouts/AppLayout.astro');

    expect(layout).toContain("const globalQuickViewMounted = exactRoute('/families') || /^\\/papers\\/[^/]+\\/?$/.test(localeNeutralPath);");
    expect(layout).toContain('{globalQuickViewMounted && <GlobalModelQuickView client:idle');
    expect(layout).not.toContain('{!localQuickViewMounted && <GlobalModelQuickView');
  });

  it('keeps paper-detail hydration scoped to the paper instead of the full model catalog', () => {
    const page = readSource('../pages/_bodies/paper-detail.astro');

    expect(page).toContain('const paperRoleModelIds = new Set([');
    expect(page).toContain('const paperRoleModels = models.filter((model) => paperRoleModelIds.has(model.id));');
    expect(page).toContain('<PaperRoleDiagram client:visible paper={paper} models={paperRoleModels}');
    expect(page).not.toContain('<PaperRoleDiagram client:load paper={paper} models={models}');
  });

  it('does not retain obsolete ResearchTask compatibility helpers with divergent semantics', () => {
    const source = readSource('../stores/researchTask.ts');
    expect(source).not.toContain('export function filterCandidatesByTask');
    expect(source).not.toContain('export function taskBlockers');
  });
});
