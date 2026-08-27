import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const questions = read('../components/research/OpenEvoWebShopResultsQuestions.astro');
const wrapperAttribution = read('../components/research/OpenEvoActionWrapperAttribution.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');
const seedFigure = read('../components/research/SeedWebShopCanonicalFigure.astro');

describe('SEED WebShop reproduction and measurement boundaries', () => {
  it('keeps every Results question layered as answer -> professional explanation -> evidence', () => {
    expect(questions).toContain('class="conclusion"');
    expect(questions).toContain('class="professional-explanation"');
    expect(questions).toContain('专业解释：');
    expect(questions).toContain('展开实验依据');
    expect(questions.indexOf('class="professional-explanation"')).toBeLessThan(questions.indexOf('<details class="evidence-details"'));
  });

  it('explains why parser and task-identity audits consumed time without duplicating the technical wrapper trace', () => {
    expect(questions).toContain('为什么这里花了时间');
    expect(questions).toContain('模型做了动作，评测器有没有读对');
    expect(questions).toContain('SEED 给动作规定了外层标签 <action>...</action>');
    expect(questions).toContain('兼容性预检（compatibility preflight）');
    expect(questions).toContain('不是 SEED parser 有 bug，也不是 OpenEvo Prompt 要求 [action]');
    expect(questions).toContain('这个 0 说明测量接口失效，不能解释成模型能力为 0');
    expect(questions).toContain('128 题身份：我们和论文说的是同一场考试吗？');
    expect(wrapperAttribution).toContain('动作格式错误：<action>...</action> 被写成 [action]...');
    expect(wrapperAttribution).toContain('我们在用 WebShop 检验 OpenEvo 的参数更新能否让 Qwen2.5-7B-Instruct');
    expect(wrapperAttribution).toContain('PRIMARY-v1 是这条流程的一次正式评测，不是一次新的训练');
    expect(wrapperAttribution).toContain('但有些输出把外层 <action>...</action> 写成了 [action]...');
    expect(wrapperAttribution).toContain('wrapper-attribution__incident');
    expect(wrapperAttribution).toContain('wrapper-attribution__facts');
    expect(wrapperAttribution).toContain('128 × 2 = 256');
    expect(wrapperAttribution).toContain('<strong>16</strong>');
    expect(wrapperAttribution).toContain('条成功 rollout，覆盖 8 个任务 × 每个任务 2 条独立成功轨迹');
    expect(wrapperAttribution).toContain('每个增量最多 16 个 optimizer steps');
    expect(wrapperAttribution).toContain('累计 optimizer-step 上限是 ≤128');
    expect(wrapperAttribution).toContain('我们一步都没训练，BASE 就已经写出了 [action]');
    expect(wrapperAttribution).not.toContain('0 个 OpenEvo adapter 训练步即可看到');
    expect(wrapperAttribution).toContain('结论先行：这次 [action] 的起源不能归给 SD-LoRA 训练');
    expect(wrapperAttribution).toContain('raw_completion 仍然出现 [action] search[...]');
    expect(wrapperAttribution).toContain('我们的实验 harness 没有在正式 SEED 集成前处理这个已知漂移');
  });

  it('keeps the three distinct 128-task claims separate', () => {
    for (const copy of [questions, seedFigure, nextSteps]) {
      expect(copy).toContain('89.7 / 78.1%');
    }
    expect(seedFigure).toContain('VAL_DATA_SIZE=128');
    expect(seedFigure).toContain('每次验证是 128 个任务');
    expect(seedFigure).toContain('全新 evaluator 的第一次 validation');
    expect(seedFigure).toContain('论文 89.7 / 78.1% 背后的具体 128 题');
    expect(seedFigure).toContain('不能由公开信息唯一恢复');
    expect(questions).toContain('公开代码规定每次 validation 是 128 个任务');
    expect(questions).toContain('公开信息不能唯一确定');
    expect(nextSteps).toContain('公开代码“首次验证”，不是论文最终 128 题');
    expect(nextSteps).toContain('不是声称找回了论文 89.7 / 78.1% 当年使用的那 128 题');
  });

  it('points readers to the pinned released SEED code for both boundaries', () => {
    expect(seedFigure).toContain('examples/seed_trainer/_common/webshop.sh');
    expect(seedFigure).toContain('agent_system/environments/env_package/webshop/envs.py');
    expect(questions).toContain('agent_system/environments/env_package/webshop/projection.py');
    expect(questions).toContain('2cf2fadca3c5aba28da68e8e1405182ba8d90e6c');
  });

  it('keeps matched comparison separate from paper-number subtraction', () => {
    expect(seedFigure).toContain('不能把这个数字直接减去论文的 89.7 / 78.1%');
    expect(seedFigure).toContain('把 SEED 方法本身也重新放到同一套冻结任务');
    expect(nextSteps).toContain('只有路线 B 才能真正回答 OpenEvo vs SEED');
  });
});