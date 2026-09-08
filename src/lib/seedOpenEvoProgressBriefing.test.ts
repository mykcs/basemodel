import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const briefing = read('../components/research/SeedOpenEvoProgressBriefing.astro');
const nav = read('../components/research/SeedOpenEvoResearchNav.astro');
const zhPage = read('../pages/research/seed-openevo/study/briefing/index.astro');
const enPage = read('../pages/en/research/seed-openevo/study/briefing/index.astro');
const contracts = read('../data/siteReaderContracts.ts');
const sitemap = read('./sitemapRoutes.ts');

describe('SEED × OpenEVO progress briefing', () => {
  it('publishes a bilingual route and wires it into the study navigation', () => {
    expect(zhPage).toContain('SeedOpenEvoProgressBriefing');
    expect(enPage).toContain('SeedOpenEvoProgressBriefing');
    expect(nav).toContain("id: 'briefing'");
    expect(nav).toContain("p('/research/seed-openevo/study/briefing/')");
    expect(sitemap).toContain("'/research/seed-openevo/study/briefing/'");
  });

  it('registers the route in the reader attention contract', () => {
    expect(contracts).toContain("c('study-briefing'");
    expect(contracts).toContain("'.cover-thesis'");
    expect(briefing).toContain('data-briefing-primary');
    expect(briefing).toContain('class="cover-thesis"');
  });

  it('keeps the main scientific claim boundary in the first screen', () => {
    expect(briefing).toContain('7B 持续学习完整收口到 128 题最终测试');
    expect(briefing).toContain('Q17 的固定 GPU SD-LoRA 确定性问题');
    expect(briefing).toContain('“OpenEVO 已经胜过 SEED”');
  });

  it('pins the completed 7B closeout without promoting it to a SEED causal comparison', () => {
    expect(briefing).toContain('<dd>149</dd>');
    expect(briefing).toContain('<dd>19,072</dd>');
    expect(briefing).toContain('<dd>143</dd>');
    expect(briefing).toContain('<dd>49.33</dd>');
    expect(briefing).toContain('<dd>58 / 128</dd>');
    expect(briefing).toContain('89.7 是 SEED 论文参考数字');
  });

  it('shows the repaired paired measurement as directional rather than conclusive', () => {
    expect(briefing).toContain('128 / 128 semantic PASS');
    expect(briefing).toContain('Δ = +1.57');
    expect(briefing).toContain('95% CI = [−3.21, +6.31]');
    expect(briefing).toContain('不能宣称稳定提升');
  });

  it('keeps the current Q17 nondeterminism blocker and resume gate explicit', () => {
    expect(briefing).toContain("128 / 128 {t('逐字节一致'");
    expect(briefing).toContain('同一物理 GPU 仍出现不同权重');
    expect(briefing).toContain('108960ca15ea1142b6f42e4d1fd29c65407841da00eb72c182fc4a61c7b361de');
    expect(briefing).toContain('5f5fe2f855728981cc2e305f26d636e96a05f276bc1d29f059b007a2d43d0326');
    expect(briefing).toContain('相同 adapter SHA256');
    expect(briefing).toContain('scientific resume authority');
  });

  it('uses slide-like semantic structures instead of a generic card gallery', () => {
    expect(briefing.match(/<section id=/g)?.length).toBe(11);
    expect(briefing).toContain('<ol class="timeline">');
    expect(briefing).toContain('<figure class="pipeline"');
    expect(briefing).toContain('<table>');
    expect(briefing).not.toContain('grid-template-columns:repeat(4,minmax(0,1fr))');
  });
});
