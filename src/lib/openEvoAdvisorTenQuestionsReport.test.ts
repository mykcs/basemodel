import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  ADVISOR_QUESTIONS,
  ADVISOR_Q03_CUSTOM_PANEL,
  ADVISOR_Q04_CAPACITY,
  ADVISOR_Q05_FROZEN,
  ADVISOR_Q09_UPDATES,
  ADVISOR_RESEARCH_AS_OF,
} from '../data/openEvoAdvisorTenQuestions';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';

const read = (path: string) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
const pagePath = 'src/pages/research/seed-openevo/study/advisor-questions/index.astro';

describe('advisor ten-question scientific report', () => {
  it('preserves ten distinct research questions and the post-meeting Q10 attribution', () => {
    expect(ADVISOR_QUESTIONS).toHaveLength(10);
    expect(ADVISOR_QUESTIONS.map((q) => q.id)).toEqual(
      Array.from({ length: 10 }, (_, i) => 'q' + String(i + 1).padStart(2, '0')),
    );
    for (const q of ADVISOR_QUESTIONS) {
      expect(q.opening.length).toBeGreaterThan(12);
      expect(q.experiment.length).toBeGreaterThan(25);
      expect(q.finding.length).toBeGreaterThan(25);
      expect(q.interpretation.length).toBeGreaterThan(25);
      expect(q.unknown.length).toBeGreaterThan(25);
      expect(q.evidence.length).toBeGreaterThanOrEqual(1);
      for (const e of q.evidence) expect(e.href).toMatch(/^https:\/\/github\.com\/mykcs\//);
    }
    expect(ADVISOR_QUESTIONS.at(-1)?.unknown).toContain('会后');
    expect(ADVISOR_RESEARCH_AS_OF).toBe('2026-10-09');
  });

  it('keeps different evaluation scales, panels and missing results honest', () => {
    expect(ADVISOR_Q03_CUSTOM_PANEL.map((r) => r.score)).toEqual(['3.71', '6.43', '0.69', '6.62']);
    expect(ADVISOR_Q03_CUSTOM_PANEL.every((r) => r.exact === '0 / 64')).toBe(true);
    const q03 = ADVISOR_QUESTIONS.find((q) => q.id === 'q03')!;
    expect(q03.interpretation).toContain('数值可以统一');
    expect(q03.interpretation).toContain('不能直接排名');
    expect(q03.finding).toContain('87.10');
    expect(q03.unknown).toContain('正式 SFT 和 Stage2');
    const page = read(pagePath);
    expect(page).toContain('data-comparison-boundary="noncomparable"');
    expect(page).toContain('Q03 是改动过方法与交互协议的 64 题结果');
    expect(page).toContain('不能用“87.10 − 6.62”');
    expect(page).toContain('它仍应显示“未测”');
  });

  it('keeps the paper-comparison, capacity and update counts distinct', () => {
    expect(ADVISOR_Q04_CAPACITY.map((r) => r.score)).toEqual(['62.98', '61.19']);
    expect(ADVISOR_Q05_FROZEN.map((r) => r.score)).toEqual(['60.72', '45.98', '20.77']);
    expect(ADVISOR_Q09_UPDATES.map((r) => r.parametric)).toEqual([159, 158, 154]);
    const q02 = ADVISOR_QUESTIONS.find((q) => q.id === 'q02')!;
    expect(q02.unknown).toContain('状态冲突');
    expect(q02.unknown).toContain('3/6');
    const q07 = ADVISOR_QUESTIONS.find((q) => q.id === 'q07')!;
    expect(q07.finding).toContain('10.06');
    expect(q07.interpretation).toContain('因果');
    expect(ADVISOR_QUESTIONS.find((q) => q.id === 'q08')?.unknown).toContain('不能证明有遗忘');
    expect(ADVISOR_QUESTIONS.find((q) => q.id === 'q09')?.unknown).toContain('尚无可报告');
    expect(ADVISOR_QUESTIONS.find((q) => q.id === 'q10')?.evidenceState).toBe('unrun');
  });

  it('renders native HTML evidence, visible conclusions and optional details', () => {
    const page = read(pagePath);
    expect(page).toContain('data-reader-purpose');
    expect(page).toContain('data-result-stage="direct-result"');
    expect(page).toContain('data-result-stage="synthesis"');
    expect(page).toContain('data-report-question={question.id}');
    expect(page).toContain('<caption>');
    expect(page).toContain('<figcaption>');
    expect(page).toContain('tabindex="0"');
    expect(page).toContain('prefers-reduced-motion');
    expect(page).not.toContain('innerHTML');
    const index = read('src/components/research/OpenEvoExperimentIndex.astro');
    expect(index).toContain('data-advisor-report-link');
    expect(index).toContain('/research/seed-openevo/study/advisor-questions/');
    const contract = SITE_READER_CONTRACTS.find((r) => r.id === 'study-advisor-ten');
    expect(contract?.sourceRoute).toBe('/research/seed-openevo/study/advisor-questions/');
    expect(contract?.firstViewportSelector).toBe('.advisor-ten__lede');
    expect(contract?.mustStayVisible).toContain('Q03');
  });

  it('does not silently overwrite the original historical six-meeting-question record', () => {
    const index = read('src/components/research/OpenEvoExperimentIndex.astro');
    expect(index).toContain('当时精炼的六个问题');
    expect(index).toContain('OPEN_EVO_ADVISOR_MEETING.points');
  });
  it('keeps reader-question analysis internal and names visible sections directly', () => {
    const page = read(pagePath);
    expect(page).toContain('<h1>OpenEVO 实验汇报：十个研究问题</h1>');
    expect(page).toContain('<h2>十个问题</h2>');
    expect(page).not.toContain('训练了一百多轮，我们究竟证明了什么？');
    expect(page).not.toContain('十个问题，从哪里读起？');
    expect(page).not.toContain('目前最重要的三个判断');
    expect(page).not.toContain('max-width:20ch');
    expect(page).not.toContain('max-width:42ch');
    const footnotes = page.indexOf('class="advisor-ten__footnotes"');
    expect(footnotes).toBeGreaterThan(page.indexOf('id="closing-title"'));
    expect(page.indexOf('本文 WebShop Task Score 统一按满分 100 分展示')).toBeGreaterThan(footnotes);
    expect(page.indexOf('Q10 为会后延伸')).toBeGreaterThan(footnotes);
  });

});
