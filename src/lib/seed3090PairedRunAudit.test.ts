import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const component = read('src/components/research/Seed3090PairedRunAudit.astro');
const zhRoute = read('src/pages/research/seed-openevo/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/results.astro');

describe('seed3090 paired-run audit archive', () => {
  it('preserves external memory as the sole treatment in the historical shared-runner contract', () => {
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

  it('preserves the fail-closed promotion decision without making the Chinese results landing page its archive host', () => {
    expect(component).toContain('GPU_WORKLOAD_LAUNCHED=0');
    expect(component).toContain('8 episodes / 4 pairs');
    expect(component).toContain('PROMOTION_PASS');
    expect(component).toContain('NOT_ELIGIBLE');
    expect(component).toContain('QUALIFICATION_INVALID');
    expect(component).toContain('not an efficacy or significance claim');
    expect(component).toContain('does not show text memory is ineffective');

    expect(zhRoute).not.toContain('Seed3090PairedRunAudit');
    expect(zhRoute).not.toContain('Seed3090EvidenceGate');
    expect(zhRoute).toContain('SeedOpenEvoResearchPage');

    expect(enRoute).not.toContain('Seed3090PairedRunAudit');
    expect(enRoute).not.toContain('Seed3090EvidenceGate');
    expect(enRoute).toContain('SeedOpenEvoResearchPage');
  });
});
