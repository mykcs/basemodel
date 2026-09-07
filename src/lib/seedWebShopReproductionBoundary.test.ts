import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const questions = read('../components/research/OpenEvoWebShopResultsQuestions.astro');
const protocol = read('../components/research/OpenEvoWebShopResultsProtocol.astro');
const currentQ7 = read('../components/research/OpenEvoWebShopCurrentQ7.astro');
const wrapperAttribution = read('../components/research/OpenEvoActionWrapperAttribution.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');
const seedFigure = read('../components/research/SeedWebShopCanonicalFigure.astro');

describe('SEED WebShop reproduction and measurement boundaries', () => {
  it('keeps every Results question readable in-line before optional experiment evidence', () => {
    expect(questions).toContain('class="conclusion"');
    expect(questions).toContain('class="supporting-context"');
    expect(questions).not.toContain('class="professional-explanation"');
    expect(questions).not.toContain('专业解释：');
    expect(questions).toContain('展开实验依据');
    expect(questions.indexOf('class="supporting-context"')).toBeLessThan(questions.indexOf('<details class="evidence-details"'));
  });

  it('explains action-reading and task-identity audits without adding another jargon layer', () => {
    expect(questions).toContain('评测有效性');
    expect(questions).toContain('动作读取与任务身份');
    expect(questions).toContain('SEED 规定动作要放在 <action>...</action> 里面');
    expect(questions).toContain('没有拿真实模型输出检查“评测程序能不能正确读懂”');
    expect(questions).toContain('问题不在 SEED 的动作读取代码违反了自己的规则');
    expect(questions).toContain('这个 0 说明动作读取接口失效，不能解释成模型能力为 0');
    expect(questions).toContain('② 128 个任务的身份');
    expect(wrapperAttribution).toContain('动作格式错误：<action>...</action> 被写成 [action]...');
    expect(wrapperAttribution).toContain('我们在用 WebShop 检验 OpenEvo 的参数更新能否让 Qwen2.5-7B-Instruct');
    expect(wrapperAttribution).toContain('两边都从官方 Qwen2.5-7B-Instruct 起步');
    expect(wrapperAttribution).toContain('到了 PRIMARY-v1，这两个状态都已经确定，评测现场不再继续训练');
    expect(wrapperAttribution).toContain('但有些输出把外层 <action>...</action> 写成了 [action]...');
    expect(wrapperAttribution).toContain('责任在我们的实验集成层');
    expect(wrapperAttribution).toContain('H1.36 已经见过，也修过一次');
    expect(wrapperAttribution).toContain('模型触发了问题，但把已知问题带进正式评测，是我们的责任');
    expect(wrapperAttribution).toContain('wrapper-attribution__incident');
    expect(wrapperAttribution).toContain('wrapper-attribution__facts');
    expect(wrapperAttribution).toContain('Qwen2.5-7B-Instruct（7B，不是 3B）');
    expect(wrapperAttribution).toContain('这里的 BASE 只是“未加载 OpenEvo adapter”的实验臂名，不是 Qwen 的 Base checkpoint');
    expect(wrapperAttribution).toContain('它是 Qwen 官方已经训练好的 Instruct checkpoint');
    expect(wrapperAttribution).toContain('我们没有再用 OpenEvo 对它做参数训练');
    expect(wrapperAttribution).toContain('同一个 7B Instruct + H1.38B final SD-LoRA');
    expect(wrapperAttribution).toContain('公开 checkpoint 只包含 adapter，不是另一份完整 7B 权重');
    expect(wrapperAttribution).toContain('miyuki17/openevo-qwen25-7b-webshop-sd-lora/tree/7c836f259f32e6775f02f90e6a9880e8ef82f40c');
    expect(wrapperAttribution).toContain('128 × 2 = 256');
    expect(wrapperAttribution).toContain('评测时两边参数都不再更新');
    expect(wrapperAttribution).not.toContain('两边都是冻结模型');
    expect(wrapperAttribution).toContain('16 条成功 rollout，覆盖 8 个任务 × 每个任务 2 条独立成功轨迹');
    expect(wrapperAttribution).toContain('每个增量最多 16 个 optimizer steps');
    expect(wrapperAttribution).toContain('累计 optimizer-step 上限 ≤128');
    expect(wrapperAttribution).toContain('我们一步都没训练，BASE 就已经写出了 [action]');
    expect(wrapperAttribution).not.toContain('0 个 OpenEvo adapter 训练步即可看到');
    expect(wrapperAttribution).not.toContain('结论先行：这次 [action] 的起源不能归给 SD-LoRA 训练');
    expect(wrapperAttribution).toContain('adapter_loaded=false');
    expect(wrapperAttribution).toContain('step 0 写出 [action] search[...]');
    expect(wrapperAttribution).toContain('这次事故留下的经验');
    expect(wrapperAttribution).toContain('对模型训练');
    expect(wrapperAttribution).toContain('任务分数、command 是否合法、wrapper 是否合规分开记录');
    expect(wrapperAttribution).toContain('对下一步实验');
    expect(wrapperAttribution).toContain('模型输出 → parser → 环境动作');
    expect(wrapperAttribution).toContain('parser 如果改动，要把它当成执行语义变化并重跑相关评测');
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
    expect(protocol).toContain('VAL_DATA_SIZE=128');
    expect(protocol).toContain('SEED 公共代码任务语义审计');
    expect(currentQ7).toContain('公开信息仍不足以证明它就是论文 89.7 / 78.1% 背后的最终 128 题');
    expect(nextSteps).toContain('这个面板不是论文最终 128 题');
    expect(nextSteps).toContain('不能当作论文 89.7 / 78.1% 的精确复现');
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
    expect(seedFigure).toContain('才能把方法差异与评测口径差异分开');
    expect(seedFigure).not.toContain('最干净的做法');
    expect(nextSteps).toContain('只有后一个实验才能直接回答 OpenEvo 与 SEED 的公平比较');
  });
});