import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SD_LORA_BOUNDED_RECURRENCE_SOURCE } from '../data/sdLoraVrLineages';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const overview = read('../components/research/OpenEvoSdLoraHistorySkeleton.astro');
const context = read('../components/research/OpenEvoSdLoraAccelerationContext.astro');
const v2 = read('../components/research/OpenEvoSdLoraV2Outcome.astro');

describe('SD-LoRA conversation publication', () => {
  it('mounts the complete context only from the canonical overview owner', () => {
    expect(overview).toContain('OpenEvoSdLoraAccelerationContext');
    expect(context).toContain('一个越来越慢的更新，后来变成两条不同研究路线');
  });

  it('keeps the two acceleration estimands separate', () => {
    expect(context).toContain('不能拼成一条“2× 继续优化到 37×”的曲线');
    expect(context).toContain('SD-LoRA v2 · Stable Reduction');
    expect(context).toContain('SD-LoRA · Bounded Online Recurrence');
  });

  it('records the naming correction without merging treatment identities', () => {
    expect(context).toContain('共享父级改成中性的“SD-LoRA 加速”');
    expect(context).toContain('VR 可以帮助在历史讨论里找到工程加速线，但不是正式实验名称');
  });

  it('preserves the prospective rank-selection path instead of showing only the final PASS', () => {
    expect(context).toContain('Fast-SD-LoRA 在封存的 128 题历史开发面板通过“功能表现不劣于”的检查');
    expect(context).toContain('rank32 单点能过，但纵向到第155轮失败');
    expect(context).toContain('rank64 在第155轮也能过，但完整纵向在第149轮失败');
    expect(context).toContain('rank128 才通过完整四点纵向资格');
    expect(context).toContain('Q0 在第149轮(rank128) → 第150轮(rank128)');
    expect(context).toContain('随后 Q1 才执行第151轮到第159轮');
  });

  it('publishes the shared strict-equivalence ancestor and why the two Agents looked duplicated', () => {
    expect(context).toContain('为什么两个并发 Agent 一开始很容易被认为在做同一件事');
    expect(context).toContain('共同祖先：我们先试过“算法不变，只把它算快”');
    expect(context).toContain('严格等价 successor 搜索按预注册规则关闭');
    expect(context).toContain('它因此已经不是“把路线 A 再优化一点”');
  });

  it('publishes the branch-protection and future matched-comparison rules', () => {
    expect(context).toContain('两个 Agent 并发时，先守住各自结果，再统一解释关系');
    expect(context).toContain('共同索引只解释“它们是谁、彼此什么关系”');
    expect(context).toContain('共同起点、任务、seed、预算、runtime、测量方式和允许得出的 claim');
  });

  it('says directly on the v2 page that the 37x result belongs to another line', () => {
    expect(v2).toContain('约 37× 不是这个 v2 的结果');
    expect(v2).toContain('先看两条加速路线为什么不同');
  });

  it('preserves the bounded recurrence final provenance', () => {
    expect(SD_LORA_BOUNDED_RECURRENCE_SOURCE.finalAdapterSha256).toBe('2b65b71a4c822c8b2a6d4639d31a3289dc2267f9de8f0109c8c69bdd1821ad32');
    expect(SD_LORA_BOUNDED_RECURRENCE_SOURCE.finalCloseoutSha256).toBe('0a4be2489779712886b8c0557d4ca74d6000b2dc1d6b727dd56c355ed182cd79');
    expect(context).toContain('最终保护测试集访问次数为 0');
  });

  it('keeps historical admission and current recurrent writing as a third problem', () => {
    expect(context).toContain('44 个 SD-LoRA 候选更新，其中只有 7 个真正成为后续模型状态的一部分');
    expect(context).toContain('四轮配对资格实验已经全部封存，每臂 512 次任务尝试');
    expect(context).toContain('173 / 512 对 248 / 512');
  });
});
