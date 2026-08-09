import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { normalizeSourceUrl, stableSourceId } from './sourceIds.node';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

describe('V2 adversarial closeout invariants', () => {
  it('never fabricates model revisions from release dates', () => {
    const tools = read('src/components/models/detail/ModelDetailTools.tsx');
    expect(tools).toContain('reproducibility.model_revision');
    expect(tools).toContain('supports?.includes(MODEL_REVISION_FIELD)');
    expect(tools).toContain('Model revision is not pinned');
    expect(tools).not.toContain('model.id}@${model.release_date}');
  });

  it('keeps paper method summaries separate from model-selection rationale', () => {
    const explorer = read('src/components/papers/PaperExplorer.tsx');
    const detail = read('src/pages/_bodies/paper-detail.astro');
    expect(explorer).toContain('methodSummary');
    expect(explorer).toContain('methodPending');
    expect(explorer).toContain('researchScope');
    expect(explorer).not.toContain('model_selection?.[0]?.rationale');
    expect(detail).toContain('尚未保存经过证据核对的方法摘要');
  });

  it('keeps Quick View global without serializing every full model into the shell', () => {
    const layout = read('src/layouts/AppLayout.astro');
    const host = read('src/components/models/GlobalModelQuickView.tsx');
    const endpoint = read('src/pages/model-data/[id].json.ts');
    expect(layout).toContain('GlobalModelQuickView');
    expect(host).toContain('model-data/');
    expect(host).toContain('fetch(');
    expect(endpoint).toContain("getCollection('models')");
  });

  it('keeps model unknowns human-readable and research-oriented', () => {
    const detail = read('src/pages/_bodies/model-detail.astro');
    const unresolved = read('src/components/models/detail/UnresolvedFieldList.astro');
    expect(detail).toContain('UnresolvedFieldList');
    expect(detail).toContain('ModelDetailNav');
    expect(unresolved).toContain('fieldCatalog');
    expect(unresolved).toContain('Unknown does not mean');
  });

  it('keeps three reproduction-mode replacement verdicts', () => {
    const substitute = read('src/components/workspace/SubstituteLab.tsx');
    expect(substitute).toContain("['strict', 'method', 'modern']");
    expect(substitute).toContain('replacementVerdict');
    expect(substitute).toContain('replacement-mode-verdicts');
  });

  it('keeps a dedicated mobile comparison representation', () => {
    const compare = read('src/components/ModelComparison.tsx');
    const css = read('src/styles/v2-closeout.css');
    expect(compare).toContain('comparison-mobile-cards');
    expect(compare).toContain('comparison-desktop-table');
    expect(css).toContain('.comparison-mobile-cards { display: block');
  });

  it('derives source IDs deterministically from canonical URLs', () => {
    const left = 'https://EXAMPLE.com/models/foo/?b=2&a=1#section';
    const right = 'https://example.com/models/foo?a=1&b=2';
    expect(normalizeSourceUrl(left)).toBe(normalizeSourceUrl(right));
    expect(stableSourceId(left)).toBe(stableSourceId(right));
    expect(stableSourceId(left)).toMatch(/^src_[0-9a-f]{12}$/);
  });
});
