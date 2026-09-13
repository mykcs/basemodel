import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const detail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const core = read('../components/research/SeedOpenEvoResearchPageCore.astro');
const sdLoraHistory = read('../components/research/OpenEvoSdLoraHistorySkeleton.astro');
const vanillaSdLoraSlide = read('../components/research/OpenEvoVanillaSdLoraSlide.astro');
const alfworldZh = read('../pages/research/seed-openevo/flow/alfworld.astro');
const alfworldEn = read('../pages/en/research/seed-openevo/flow/alfworld.astro');

describe('sitewide normalization first repair batch', () => {
  it('introduces ALFWorld as a benchmark before mechanism details and aligns its reader contract', () => {
    expect(detail).toContain("title: t('ALFWorld 任务与评测', 'ALFWorld tasks and evaluation')");
    expect(detail).toContain('ALFWorld 是一个文本化具身任务 benchmark');
    expect(detail).toContain('these metrics are not interchangeable with WebShop normalized Score');
    expect(detail).not.toContain("title: t('ALFWorld 世界状态与任务成功'");

    const contract = SITE_READER_CONTRACTS.find((row) => row.id === 'flow-alfworld');
    expect(contract?.attentionMode).toBe('reference');
    expect(contract?.primaryTask).toContain('ALFWorld 是什么');
    expect(contract?.firstViewportGoal).toContain('文本化具身任务 benchmark');
    expect(contract?.mustStayVisible).toContain('WebShop normalized Score / exact Success');
    expect(contract?.firstViewportSelector).toBe('.plain-detail__header p');
  });

  it('keeps the benchmark overview title bilingual instead of leaking Chinese into English', () => {
    expect(detail).toContain("title: t('ALFWorld 与 WebShop', 'ALFWorld and WebShop')");
  });

  it('keeps benchmark section order while removing redundant hierarchy kickers', () => {
    const start = core.indexOf("{page === 'benchmarks'");
    const end = core.indexOf("{page === 'webshop'");
    const block = core.slice(start, end);
    expect(block).toContain('<span>01</span>');
    expect(block).toContain('<span>02</span>');
    expect(block).toContain('<span>03</span>');
    expect(block).toContain("t('交互与评测', 'Interaction and evaluation')");
    expect(block).toContain("t('结果与轨迹证据', 'Outcome and trajectory evidence')");
    expect(block).toContain("t('公平比较协议', 'Fair-comparison protocol')");
    expect(block).not.toContain("<small>{t('环境', 'Environments')}</small>");
    expect(block).not.toContain("<small>{t('证据', 'Evidence')}</small>");
    expect(block).not.toContain("<small>{t('对比', 'Comparison')}</small>");
  });

  it('removes only the redundant SD-LoRA overview eyebrow and preserves child sequence metadata', () => {
    expect(sdLoraHistory).not.toContain('SD-LoRA 专题总览');
    expect(sdLoraHistory).not.toContain('SD-LoRA SERIES OVERVIEW');
    expect(sdLoraHistory).toContain('!overview && <p class="series-page__eyebrow">');
    expect(sdLoraHistory).toContain('`${item!.number} / 07`');
  });

  it('keeps ALFWorld route metadata object-first in both locales', () => {
    expect(alfworldZh).toContain('title="ALFWorld 任务与评测"');
    expect(alfworldZh).toContain('文本化具身任务 benchmark');
    expect(alfworldEn).toContain('title="ALFWorld tasks and evaluation"');
    expect(alfworldEn).toContain('text-based embodied-task benchmark');
  });

  it('introduces SEED and OpenEvo as methods before internal mechanism jargon', () => {
    expect(detail).toContain("title: t('SEED 学习流程与参数更新', 'SEED learning flow and parameter updates')");
    expect(detail).toContain('SEED 是一种让 Agent 用自己的任务轨迹继续训练 policy 的方法');
    expect(detail).toContain("title: t('OpenEvo 跨任务演化流程', 'OpenEvo cross-task evolution flow')");
    expect(detail).toContain('OpenEvo 是一个让 Agent 在任务之间保留并验证学习结果的演化框架');

    const seed = SITE_READER_CONTRACTS.find((row) => row.id === 'flow-seed');
    const openevo = SITE_READER_CONTRACTS.find((row) => row.id === 'flow-openevo');
    expect(seed?.firstViewportGoal).toContain('SEED 是用任务轨迹继续训练 policy 的方法');
    expect(seed?.firstViewportSelector).toBe('.plain-detail__header p');
    expect(openevo?.firstViewportGoal).toContain('OpenEvo 是跨任务演化框架');
    expect(openevo?.mustStayVisible).toContain('任务内行为与任务后演化边界');
    expect(openevo?.firstViewportSelector).toBe('.plain-detail__header p');
  });

  it('explains Vanilla SD-LoRA flow directly without narrating the rejected card metaphor', () => {
    expect(vanillaSdLoraSlide).toContain('一轮更新沿着会回到下一轮任务的流程移动');
    expect(vanillaSdLoraSlide).toContain('One update follows a routed loop back into the next task round');
    expect(vanillaSdLoraSlide).not.toContain('四张卡片');
    expect(vanillaSdLoraSlide).not.toContain('four cards in a row');
  });


});
