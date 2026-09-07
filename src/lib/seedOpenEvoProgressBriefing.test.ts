import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const briefing = read('../components/research/SeedOpenEvoProgressBriefing.astro');
const zhPage = read('../pages/research/seed-openevo/study/briefing/index.astro');
const enPage = read('../pages/en/research/seed-openevo/study/briefing/index.astro');
const nav = read('../components/research/SeedOpenEvoResearchNav.astro');
const sitemap = read('./sitemapRoutes.ts');
const contracts = read('../data/siteReaderContracts.ts');

describe('SEED × OpenEVO progress briefing', () => {
  it('publishes one bilingual briefing route and links it from the study navigation', () => {
    expect(zhPage).toContain('SeedOpenEvoProgressBriefing');
    expect(enPage).toContain('SeedOpenEvoProgressBriefing');
    expect(sitemap).toContain("'/research/seed-openevo/study/briefing/'");
    expect(nav).toContain("p('/research/seed-openevo/study/briefing/')");
    expect(nav).toContain("'阶段汇报'");
  });

  it('keeps a teacher-first thesis and the main scientific boundary in the first viewport', () => {
    expect(briefing).toContain('data-briefing-primary');
    expect(briefing).toContain('结果为什么可信');
    expect(briefing).toContain('OpenEVO 已经胜过 SEED');
    expect(contracts).toContain("'study-briefing'");
    expect(contracts).toContain("'[data-briefing-primary]'");
  });

  it('pins the completed 7B closeout without promoting it to a SEED causal comparison', () => {
    expect(briefing).toContain('19,072');
    expect(briefing).toContain('143');
    expect(briefing).toContain('49.33');
    expect(briefing).toContain('58 / 128');
    expect(briefing).toContain('7 个 action-admissibility fail-closed');
    expect(briefing).toContain('它还不能证明');
    expect(briefing).toContain('不是这条 7B run 的本地配对对照');
  });

  it('shows the repaired paired measurement as directional rather than conclusive', () => {
    expect(briefing).toContain('128 / 128 semantic PASS');
    expect(briefing).toContain('parser-invalid = 0');
    expect(briefing).toContain('7.17');
    expect(briefing).toContain('8.74');
    expect(briefing).toContain('Δ = +1.57');
    expect(briefing).toContain('95% CI = [−3.21, +6.31]');
    expect(briefing).toContain('不能宣称稳定提升');
  });

  it('keeps the current Q17 nondeterminism blocker and resume gate explicit', () => {
    expect(briefing).toContain("128 / 128 {zh ? '逐字节一致'");
    expect(briefing).toContain('同一物理 GPU 仍出现不同权重');
    expect(briefing).toContain('108960ca15ea1142b6f42e4d1fd29c65407841da00eb72c182fc4a61c7b361de');
    expect(briefing).toContain('5f5fe2f855728981cc2e305f26d636e96a05f276bc1d29f059b007a2d43d0326');
    expect(briefing).toContain('PAUSED');
    expect(briefing).toContain('独立重复至少 2 次');
    expect(briefing).toContain('至少 3 个训练 seed');
  });

  it('uses semantic slide structures instead of generic card grids', () => {
    expect(briefing.match(/<section id=/g)?.length).toBe(11);
    expect(briefing).toContain('<ol class="timeline">');
    expect(briefing).toContain('<figure class="pipeline"');
    expect(briefing).toContain('<table>');
    expect(briefing).toContain('<dl class="quality-layers">');
    expect(briefing).toContain('data-ui-audit="surface"');
  });
});
