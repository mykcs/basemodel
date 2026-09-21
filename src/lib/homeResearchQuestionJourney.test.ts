import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');

describe('BaseModel wish-aligned homepage research journey', () => {
  const home = read('src/pages/_bodies/home-v2.astro');
  const hero = read('src/components/research/SeedOpenEvoMissionHero.astro');
  const header = read('src/components/Header.astro');
  const contracts = read('src/data/siteReaderContracts.ts');

  it('opens with one concrete research question and two reader actions', () => {
    expect(hero).toContain('同一个 Base Model，换一种自我改进方法，真的会学得更好吗？');
    expect(hero).toContain('看目前发现');
    expect(hero).toContain('先理解这项研究');
  });

  it('orders the homepage as answer -> experiment progression -> next action', () => {
    const answer = home.indexOf('目前我们能说到哪里');
    const journey = home.indexOf('我们做过哪些尝试');
    const next = home.indexOf('现在想继续哪一步');
    expect(answer).toBeGreaterThan(-1);
    expect(journey).toBeGreaterThan(answer);
    expect(next).toBeGreaterThan(journey);
    expect(home).toContain('OPEN_EVO_EXPERIMENTS.map');
  });

  it('keeps scientific uncertainty visible on the home summary', () => {
    expect(home).toContain('统计范围仍然包含“没有差异”');
    expect(home).toContain('动态 α + 动态 β 还没有运行');
    expect(home).toContain('方法对方法公平比较还没有完成');
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
    expect(contracts).toContain('固定同一 Base Model 与任务后');
    expect(contracts).toContain('SEED 与 OpenEvo 方法对方法公平比较仍未完成');
  });
});
