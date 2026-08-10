import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const guide = readFileSync(new URL('./SeedStudentReproductionGuide.astro', import.meta.url), 'utf8');
const zhPage = readFileSync(new URL('../pages/guide.astro', import.meta.url), 'utf8');
const enPage = readFileSync(new URL('../pages/en/guide.astro', import.meta.url), 'utf8');
const preflight = readFileSync(new URL('../../public/guides/seed-4x3090-preflight.sh', import.meta.url), 'utf8');

describe('SEED student reproduction mainline', () => {
  it('makes one bilingual guide component the primary page flow', () => {
    expect(zhPage).toContain('<SeedStudentReproductionGuide locale="zh" />');
    expect(enPage).toContain('<SeedStudentReproductionGuide locale="en" />');
    for (const oldBlock of ['<AgentPrimer', '<SeedReproductionPath', '<SeedComputeTimeBudget', '<SeedOwnedComputePath', '<SeedOfflineLabWorkflow']) {
      expect(zhPage).not.toContain(oldBlock);
      expect(enPage).not.toContain(oldBlock);
    }
  });

  it('preserves the 3090-first completion and eight-GPU migration contract', () => {
    for (const token of [
      '我们在这个 3090 上就全部做完了',
      'N_GPUS_PER_NODE=4',
      'N_GPUS_PER_NODE=8',
      'EXPECTED_GPU_COUNT=8',
      '8×A800',
      '8×A100',
    ]) expect(guide).toContain(token);
  });

  it('uses real small-run knobs and observable Stage-1 progress', () => {
    for (const token of [
      'RUN_MODE=smoke',
      'NUM_TASKS=1',
      'ROLLOUTS_PER_TASK=1',
      'MAX_TASKS=1',
      'DRY_RUN=true',
      'progress.json',
      'completed_rollouts',
      'parse_ok_skills',
      'sft_records',
    ]) expect(guide).toContain(token);
  });

  it('keeps paper references separate from beginner pass conditions', () => {
    for (const token of ['180×8', '150 policy updates', '91.8', '88.5', '78.9', '72–144h']) {
      expect(guide).toContain(token);
    }
  });

  it('ships a reusable hardware-neutral preflight script', () => {
    for (const token of ['EXPECTED_GPU_COUNT="${EXPECTED_GPU_COUNT:-4}"', 'nvidia-smi topo -m', 'EXPERIMENT_COMMIT', 'sha256sum -c', 'ALFWORLD_DATA', 'WEBSHOP_ROOT', 'READY:']) {
      expect(preflight).toContain(token);
    }
  });
});
