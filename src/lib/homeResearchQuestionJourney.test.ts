import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');

describe('BaseModel wish-aligned homepage research journey', () => {
  const home = read('src/pages/_bodies/home-v2.astro');
  const hero = read('src/components/research/SeedOpenEvoMissionHero.astro');
  const header = read('src/components/Header.astro');
  const contracts = read('src/data/siteReaderContracts.ts');

  it('opens with one research question and a single primary CTA; Flow remains a later task destination', () => {
    expect(hero).toContain('同一个 Base Model，换一种自我改进方法，真的会学得更好吗？');
    expect(hero).toContain('看目前发现');
    expect(hero).not.toContain("t('先理解这项研究','Understand the study first')");
    expect(home).toContain("title: t('理解研究', 'Understand the study')");
    expect(home).toContain("href: p('/research/seed-openevo/flow/')");
  });

  it('keeps the full chronology in Study and the home focused on answers and next actions', () => {
    const answer = home.indexOf('目前我们能说到哪里');
    const next = home.indexOf('现在想继续哪一步');
    expect(answer).toBeGreaterThan(-1);
    expect(next).toBeGreaterThan(answer);
    expect(home).not.toContain('OPEN_EVO_EXPERIMENTS.map');
    expect(home).toContain("'/research/seed-openevo/study/'");
  });

  it('keeps scientific uncertainty visible on the home summary', () => {
    expect(home).toContain('统计范围仍然包含“没有差异”');
    expect(home).toContain('动态 α + 动态 β 还没有运行');
    expect(home).toContain('方法对方法公平比较还没有完成');
  });

  it('distinguishes the 3B comparison design from separately measured 7B and 1.7B findings in both languages', () => {
    expect(hero).toContain('这里以 Qwen2.5-3B-Instruct 说明对照设计');
    expect(hero).toContain('下方 7B 与 1.7B 来自另外的实验');
    expect(hero).toContain('完整的方法对方法比较仍未完成');
    expect(hero).toContain('The 7B and 1.7B findings below belong to separate experiments');
    expect(home).toContain('7B 同题测量还没有证明可靠优势');
    expect(home).toContain('三组 1.7B 最终模型已经能在同一冻结题集上并排看');
    expect(contracts).toContain('明确 3B 属对照设计、7B 和 1.7B 属其他实测');
  });

  it('uses reader tasks rather than feature names in the global research navigation', () => {
    expect(header).toContain("label: t('理解研究', 'Understand')");
    expect(header).toContain("label: t('实验与结果', 'Experiments')");
    expect(header).toContain("label: t('复现实验', 'Reproduce')");
    expect(header).not.toContain("label: t('流程理解图', 'Flow map')");
    expect(header).not.toContain("label: t('实验目录', 'Experiment index')");
  });

  it('updates the executable home reader contract before the HTML change ships', () => {
    expect(contracts).toContain("'home', '/', '/', 'narrative'");
    expect(contracts).toContain('公平比较要固定同一 Base Model 与任务');
    expect(contracts).toContain('SEED 与 OpenEvo 方法对方法公平比较仍未完成');
  });
});
