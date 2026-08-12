import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const component = read('src/components/research/Seed3090PairedRunAudit.astro');
const zhRoute = read('src/pages/research/seed-openevo/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/results.astro');

describe('seed3090 paired-run audit', () => {
  it('makes external memory the sole treatment in one shared runner contract', () => {
    expect(component).toContain('external_memory_bytes');
    expect(component).toContain('Same runner and entrypoint');
    expect(component).toContain('同一 runner 与入口');
    expect(component).toContain('Canonical empty value');
    expect(component).toContain('SHA-bound read-only memory');
    expect(component).toContain('(task_id, rollout_seed)');
  });

  it('keeps score, provenance, reset, and sealing evidence together', () => {
    expect(component).toContain('(stage, task_id, rollout_seed, arm)');
    expect(component).toContain('raw model output');
    expect(component).toContain('parsed action · fallback flag');
    expect(component).toContain('fresh session · cart · history · KV state');
    expect(component).toContain('path · size · sha256');
    expect(component).toContain('remote verification attestation');
    expect(component).toContain('independent Mac attestation');
  });

  it('renders the fail-closed promotion decision without overstating efficacy', () => {
    expect(component).toContain('GPU_WORKLOAD_LAUNCHED=0');
    expect(component).toContain('8 episodes / 4 pairs');
    expect(component).toContain('PROMOTION_PASS');
    expect(component).toContain('NOT_ELIGIBLE');
    expect(component).toContain('QUALIFICATION_INVALID');
    expect(component).toContain('not an efficacy or significance claim');
    expect(component).toContain('does not show text memory is ineffective');
  });

  it('is bilingual, static, and follows the existing evidence gate on both result routes', () => {
    expect(component).toContain("import type { Locale } from '../../i18n'");
    expect(component).toContain('data-testid="seed3090-paired-run-audit"');
    expect(component).not.toContain('client:');

    for (const route of [zhRoute, enRoute]) {
      expect(route).toContain('Seed3090PairedRunAudit');
      expect(route).toContain('<Seed3090PairedRunAudit locale={locale} />');
      expect(route.indexOf('<Seed3090EvidenceGate locale={locale} />')).toBeLessThan(
        route.indexOf('<Seed3090PairedRunAudit locale={locale} />'),
      );
    }
  });
});
