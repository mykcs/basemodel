import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Preview-trigger marker: no runtime behavior change.
const workflow = readFileSync(new URL('./SeedOfflineLabWorkflow.astro', import.meta.url), 'utf8');
const zhGuide = readFileSync(new URL('../pages/guide.astro', import.meta.url), 'utf8');
const enGuide = readFileSync(new URL('../pages/en/guide.astro', import.meta.url), 'utf8');

describe('SEED offline four-GPU lab workflow', () => {
  it('is wired into both language guide routes', () => {
    expect(zhGuide).toContain('SeedOfflineLabWorkflow');
    expect(zhGuide).toContain('<SeedOfflineLabWorkflow locale="zh" />');
    expect(enGuide).toContain('SeedOfflineLabWorkflow');
    expect(enGuide).toContain('<SeedOfflineLabWorkflow locale="en" />');
  });

  it('preserves code provenance and offline artifact verification', () => {
    for (const token of [
      'EXPERIMENT_COMMIT',
      'SHA256SUMS.txt',
      'SFTP',
      'HF_HUB_OFFLINE=1',
      'TRANSFORMERS_OFFLINE=1',
      'WANDB_MODE=offline',
      '/srv/seed/',
    ]) {
      expect(workflow).toContain(token);
    }
  });

  it('covers the real SEED four-GPU overrides and Stage-1 analyzer boundary', () => {
    expect(workflow).toContain('RUN_MODE=smoke');
    expect(workflow).toContain('DATA_PARALLEL_SIZE=4');
    expect(workflow).toContain('SKILL_BASE_URL');
    expect(workflow).toContain('train_sft.sh');
    expect(workflow).toContain('N_GPUS_PER_NODE=4');
    expect(workflow).toContain('DRY_RUN=true');
    expect(workflow).toContain('TOTAL_EPOCHS=10');
  });

  it('keeps hardware topology and result-validation evidence explicit', () => {
    expect(workflow).toContain('nvidia-smi topo -m');
    expect(workflow).toContain('GRPO');
    expect(workflow).toContain('8×A800');
    expect(workflow).toContain('method reproduction');
  });
});
