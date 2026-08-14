import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const bridge = readFileSync(new URL('./AgentToSeedBridge.astro', import.meta.url), 'utf8');
const legacyGuide = readFileSync(new URL('./SeedStudentReproductionGuide.astro', import.meta.url), 'utf8');
const zhPage = readFileSync(new URL('../pages/guide.astro', import.meta.url), 'utf8');
const enPage = readFileSync(new URL('../pages/en/guide.astro', import.meta.url), 'utf8');
const preflight = readFileSync(new URL('../../public/guides/seed-4x3090-preflight.sh', import.meta.url), 'utf8');
const stage1 = readFileSync(new URL('../../public/guides/seed-stage1-check.py', import.meta.url), 'utf8');

describe('SEED student reproduction mainline', () => {
  it('starts with a compact bilingual Agent bridge and routes into the current experiment', () => {
    expect(zhPage).toContain('<AgentToSeedBridge locale="zh" />');
    expect(enPage).toContain('<AgentToSeedBridge locale="en" />');
    expect(zhPage).toContain('OpenEvo × WebShop');
    expect(enPage).toContain('OpenEvo × WebShop');
    expect(zhPage).not.toContain('<SeedStudentReproductionGuide locale="zh" />');
    expect(enPage).not.toContain('<SeedStudentReproductionGuide locale="en" />');
    for (const oldBlock of ['<AgentPrimer', '<SeedReproductionPath', '<SeedComputeTimeBudget', '<GuideDecisionChapters']) {
      expect(zhPage).not.toContain(oldBlock);
      expect(enPage).not.toContain(oldBlock);
    }
  });

  it('bridges familiar ML concepts into Agent runtime, training, RL, and SEED', () => {
    for (const token of ['Agent 运行与训练','Agent 运行循环','Agent 训练循环','Policy','Action','Trajectory','Reward','Advantage','GRPO','hindsight skill','OPD']) expect(bridge).toContain(token);
  });

  it('makes 5x5090 current while keeping RTX6 / 4x3090 historical', () => {
    for (const token of ['openevo-experiment','5×RTX5090','Phase H0','RTX6（4×RTX3090）']) expect(zhPage).toContain(token);
    for (const token of ['openevo-experiment','5×RTX5090','Phase H0','RTX6 (4×RTX3090)']) expect(enPage).toContain(token);
  });

  it('retains the old 4x3090 reproduction material as historical executable evidence', () => {
    for (const token of ['N_GPUS_PER_NODE=4','EXPECTED_GPU_COUNT=8','N_GPUS_PER_NODE=8','8×A800 80GB','8×A100 80GB']) expect(legacyGuide).toContain(token);
  });

  it('retains official small-run knobs in the historical reproduction material', () => {
    for (const token of ['RUN_MODE=smoke','NUM_TASKS=1','ROLLOUTS_PER_TASK=1','MAX_TASKS=1','WEBSHOP_USE_SMALL=1','DATA_PARALLEL_SIZE=4','SKILL_BASE_URL=http://127.0.0.1:8000/v1','DRY_RUN=true','completed_rollouts == expected_rollouts','parse_ok_skills','sft_records']) expect(legacyGuide).toContain(token);
  });

  it('retains real training evidence requirements for strict SEED reproduction', () => {
    for (const token of ['至少 5 个 update','NaN/Inf','checkpoint 能保存并从断点恢复','examples/grpo_trainer/run_alfworld.sh','examples/grpo_trainer/run_webshop.sh','150 policy updates','72–144h']) expect(legacyGuide).toContain(token);
  });

  it('ships reusable historical machine and Stage-1 checkers', () => {
    for (const token of ['EXPECTED_GPU_COUNT="${EXPECTED_GPU_COUNT:-4}"','nvidia-smi topo -m','EXPERIMENT_COMMIT','sha256sum -c','READY:']) expect(preflight).toContain(token);
    for (const token of ['completed_rollouts','expected_rollouts','parse_ok_skills','sft_records','RESULT: PASS','RESULT: FAIL']) expect(stage1).toContain(token);
  });
});
