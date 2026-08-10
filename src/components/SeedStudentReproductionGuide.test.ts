import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const guide = readFileSync(new URL('./SeedStudentReproductionGuide.astro', import.meta.url), 'utf8');
const zhPage = readFileSync(new URL('../pages/guide.astro', import.meta.url), 'utf8');
const enPage = readFileSync(new URL('../pages/en/guide.astro', import.meta.url), 'utf8');
const preflight = readFileSync(new URL('../../public/guides/seed-4x3090-preflight.sh', import.meta.url), 'utf8');
const stage1 = readFileSync(new URL('../../public/guides/seed-stage1-check.py', import.meta.url), 'utf8');

describe('SEED student reproduction mainline', () => {
  it('makes one bilingual experiment flow the primary guide', () => {
    expect(zhPage).toContain('<SeedStudentReproductionGuide locale="zh" />');
    expect(enPage).toContain('<SeedStudentReproductionGuide locale="en" />');
    for (const oldBlock of ['<AgentPrimer', '<SeedReproductionPath', '<SeedComputeTimeBudget', '<GuideDecisionChapters']) {
      expect(zhPage).not.toContain(oldBlock);
      expect(enPage).not.toContain(oldBlock);
    }
  });

  it('keeps the 4x3090-first finish line and evidence-based migration path', () => {
    for (const token of [
      '我们在这个 3090 上就全部做完了',
      'N_GPUS_PER_NODE=4',
      'EXPECTED_GPU_COUNT=8',
      'N_GPUS_PER_NODE=8',
      '8×A800 80GB',
      '8×A100 80GB',
      '只有四卡真的卡住',
    ]) expect(guide).toContain(token);
  });

  it('uses official small-run knobs and observable pass criteria', () => {
    for (const token of [
      'RUN_MODE=smoke',
      'NUM_TASKS=1',
      'ROLLOUTS_PER_TASK=1',
      'MAX_TASKS=1',
      'WEBSHOP_USE_SMALL=1',
      'DATA_PARALLEL_SIZE=4',
      'SKILL_BASE_URL=http://127.0.0.1:8000/v1',
      'DRY_RUN=true',
      'completed_rollouts == expected_rollouts',
      'parse_ok_skills',
      'sft_records',
    ]) expect(guide).toContain(token);
  });

  it('requires real training evidence before calling the method reproduced', () => {
    for (const token of [
      '至少 5 个 update',
      'NaN/Inf',
      'checkpoint 能保存并从断点恢复',
      'examples/grpo_trainer/run_alfworld.sh',
      'examples/grpo_trainer/run_webshop.sh',
      '150 policy updates',
      '72–144h',
    ]) expect(guide).toContain(token);
  });

  it('ships reusable machine and Stage-1 checkers', () => {
    for (const token of ['EXPECTED_GPU_COUNT="${EXPECTED_GPU_COUNT:-4}"', 'nvidia-smi topo -m', 'EXPERIMENT_COMMIT', 'sha256sum -c', 'READY:']) expect(preflight).toContain(token);
    for (const token of ['completed_rollouts', 'expected_rollouts', 'parse_ok_skills', 'sft_records', 'RESULT: PASS', 'RESULT: FAIL']) expect(stage1).toContain(token);
  });

  it('gives the student a repeatable Agent acceptance prompt', () => {
    expect(guide).toContain('通过 / 未通过 / 证据不足');
    expect(guide).toContain('下一条最小检查命令');
    expect(guide).toContain('不要直接跳到下一阶段');
  });
});
