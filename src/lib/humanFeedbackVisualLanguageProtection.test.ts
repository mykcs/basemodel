import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const detail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const missionHero = read('../components/research/SeedOpenEvoMissionHero.astro');
const server = read('../components/research/Lyg2171ServerOverview.astro');
const resultsHero = read('../components/research/OpenEvoWebShopResultsHero.astro');
const resultsQuestions = read('../components/research/OpenEvoWebShopResultsQuestions.astro');
const explainer = read('../components/research/InteractiveResearchExplainer.tsx');
const gdr = read('../components/research/OpenEvoGdrDirectApplyExplainer.astro');
const ceiling = read('../components/research/OpenEvoCeilingStrategy.astro');
const harness2 = read('../components/research/OpenEvoHarness2MiniStudy.astro');
const legacyStage1 = read('../components/research/OpenEvoLegacyStage1Archive.astro');
const legacyStage2 = read('../components/research/OpenEvoLegacyStage2Archive.astro');
const analysisIndex = read('../components/research/OpenEvoExperimentAnalysisPlanIndex.astro');
const analysisPlan = read('../components/research/OpenEvoExperimentAnalysisPlan.astro');
const resultsScaffold = read('../components/research/OpenEvoExperimentResultsScaffold.astro');
const benchmarkNote = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');

describe('2026-09-07 human-feedback visual language protection', () => {
  it('does not regenerate generic eyebrow labels above self-explanatory headings', () => {
    for (const phrase of ['实验模型', '实验环境', "eyebrow: t('方法'", "eyebrow: t('比较'"]) {
      expect(detail).not.toContain(phrase);
    }
    expect(missionHero).not.toContain('mission-hero__eyebrow">SEED × OpenEvo');
    expect(server).not.toContain('OpenEvo / WebShop · 实验服务器');
    expect(resultsHero).not.toContain('研究结果 · RESEARCH FINDINGS');
    expect(resultsQuestions).not.toContain('七个问题 · SEVEN QUESTIONS');
    expect(resultsQuestions).not.toContain('WHY THIS TOOK TIME');
  });

  it('keeps figure identities from becoming decorative bilingual labels', () => {
    expect(explainer).not.toContain('FIGURE 04 · SEED × WEBSHOP');
    expect(explainer).not.toContain('FIGURE 05 · OPENEVO × WEBSHOP');
    expect(explainer).not.toContain("eyebrow: 'SEED × OPENEVO'");
    expect(analysisIndex).not.toContain('OPENEVO CAPABILITY EXPLORATION · FIVE PAGES');
  });

  it('removes ambient motion that adds no mechanism or state information', () => {
    expect(gdr).not.toContain('animation:gdr-pulse');
    expect(gdr).not.toContain('@keyframes gdr-pulse');
    expect(gdr).not.toContain('先记住这一句');
    expect(gdr).not.toContain('OPENEVO × WEBSHOP · GDR → DIRECTAPPLY');
  });

  it('keeps the GDR decision page answer-first while preserving the scientific boundary', () => {
    expect(gdr).toContain('class="gdr-primary"');
    expect(gdr).toContain('44 个候选被训练，7 个进入后续模型。');
    expect(gdr).toContain('这解释了更新次数，但还不能证明最终性能。');
    expect(gdr).toContain('No-GDR 只移除短期 task-score 放行规则');
    expect(gdr).toContain('工程与数据安全合同仍保留');
    expect(gdr).toContain('GDR / SD-LoRA 术语与完整计数');
    expect(gdr).not.toContain('class="gdr-lede"');
    expect(gdr).not.toContain('class="gdr-answer"');
    expect(gdr.indexOf('class="gdr-primary"')).toBeLessThan(gdr.indexOf('data-testid="gdr-44-to-7-funnel"'));
    expect(gdr.indexOf('data-testid="gdr-44-to-7-funnel"')).toBeLessThan(gdr.indexOf('GDR / SD-LoRA 术语与完整计数'));
  });

  it('folds generic section categories into the actual heading', () => {
    for (const phrase of ['Ceiling-1.0 想回答什么', 'Stage 1 留给下一阶段什么', 'Stage 2 怎么跑', '四类状态什么时候可以改', '当时跑到哪里']) {
      expect(ceiling).not.toContain(phrase);
    }
    expect(ceiling).not.toContain("class=\"kicker\">{t('后续 successor'");
    for (const phrase of ['研究问题', '配对结果', '诊断证据', '实验决定']) {
      expect(harness2).not.toContain(`class=\"kicker\">{t(\"${phrase}`);
    }
    expect(harness2).toContain('加入经验提示，会让无效动作变多吗？');
    expect(harness2).toContain('Harness 2.0.1 后续接口修订的历史计划');
    expect(legacyStage1).not.toContain('旧产物在哪里');
    expect(legacyStage1).not.toContain('REUSE BOUNDARY');
    expect(legacyStage2).not.toContain('WHY ZERO UPDATES');
    expect(legacyStage2).not.toContain('FOUR HISTORICAL RESULTS');
    for (const phrase of ['COMPUTE', 'HISTORICAL STAGE-2 UPDATE RULE', 'KEY METRICS', 'CHECKPOINT EVALUATION', 'FROM TRAINING TO FINAL RESULT', 'FILL-IN RULES']) {
      expect(resultsScaffold).not.toContain(`>${phrase}<`);
    }
    for (const phrase of ['STAGE 1 DESIGN FORK', 'SERVER FACT SNAPSHOT', 'WITHIN EACH ARM', 'ANALYSIS ORDER', 'STOPPING RULE']) {
      expect(analysisPlan).not.toContain(phrase);
    }
    expect(resultsScaffold).toContain('六个预先固定的组间比较槽位');
    expect(benchmarkNote).not.toContain('01 · 已经知道什么');
    expect(benchmarkNote).not.toContain('04 · 评分');
    expect(benchmarkNote).toContain('class="section-number" aria-hidden="true">01</p>');
  });

  it('preserves labels that carry real status, date, version, or evidence identity', () => {
    expect(ceiling).toContain('7B 最终封存 · 2026-09-04');
    expect(ceiling).toContain('第一版 Stage 2');
    expect(ceiling).toContain('第二版 Ceiling-1.0');
    expect(harness2).toContain('购物接口检查 · Mini Study 01');
    expect(harness2).toContain('2.0.1 后续检查 · 历史记录');
    expect(legacyStage2).toContain('SUPERSEDED METHOD-CONTROL · 2026-08-30');
    expect(resultsScaffold).toContain('历史单实验 · 74.58% 时主动停止');
    expect(resultsScaffold).not.toContain("t('OpenEvo 基础能力探索实验', 'OPENEVO CAPABILITY EXPLORATION')");
    expect(analysisPlan).toContain('服务器快照 · 2026-08-29 20:06 UTC+8');
  });
});
