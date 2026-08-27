import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const component = read('src/components/research/Seed3090EvidenceGate.astro');
const zhRoute = read('src/pages/research/seed-openevo/study/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/study/results.astro');

describe('seed3090 evidence gate archive', () => {
  it('keeps the August 12 mechanism, attribution, and efficacy methodology intact', () => {
    expect(component).toContain('data-claim={claim.id}');
    expect(component).toContain("id: 'mechanism'");
    expect(component).toContain("id: 'attribution'");
    expect(component).toContain("id: 'efficacy'");
    expect(component).toContain('gen0 与 gen1 的平均分都为 0.0');
    expect(component).toContain('Both gen0 and gen1 mean scores were 0.0');
    expect(component).toContain('不能声称 OpenEvo 提升 WebShop');
    expect(component).toContain('cannot claim that OpenEvo improves WebShop');
  });

  it('preserves the fail-closed qualification path and authoritative sources', () => {
    expect(component).toContain('indexes_1k');
    expect(component).toContain('GPU_WORKLOAD_LAUNCHED=0');
    expect(component).toContain('8 episode / 4 pair');
    expect(component).toContain('CURRENT_STATUS.md');
    expect(component).toContain('EXPERIMENT_PLAN.md');
    expect(component).toContain(
      'OPENEVO-SEED-WEBSHOP-COMPARISON-GATE-20260812.md',
    );
  });

  it('keeps the old component static without forcing archive content onto the Chinese results index', () => {
    expect(component).toContain("import type { Locale } from '../../i18n'");
    expect(component).toContain('data-testid="seed3090-evidence-gate"');
    expect(component).not.toContain('client:');

    expect(zhRoute).not.toContain('Seed3090EvidenceGate');
    expect(zhRoute).not.toContain('Seed3090PairedRunAudit');
    expect(zhRoute).toContain('SeedOpenEvoResearchPage');

    expect(enRoute).not.toContain('Seed3090EvidenceGate');
    expect(enRoute).not.toContain('Seed3090PairedRunAudit');
    expect(enRoute).toContain('SeedOpenEvoResearchPage');
  });
});
