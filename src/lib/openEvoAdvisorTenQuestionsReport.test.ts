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
const reportPath = 'docs/reports/2026-10-10-advisor-ten-iclr-style.md';
const sectionIds = [
  'paper-introduction', 'paper-related-work', 'paper-method',
  'paper-experiments', 'paper-results', 'paper-ablations',
  'paper-visualization', 'paper-discussion', 'paper-conclusion',
];

describe('advisor ten-question paper-structured scientific report', () => {
  it('keeps all original scientific questions and post-meeting Q10 attribution', () => {
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

  it('preserves sealed scores, panel identities, and unrun boundaries', () => {
    expect(ADVISOR_Q03_CUSTOM_PANEL.map((r) => r.score)).toEqual(['3.71', '6.43', '0.69', '6.62']);
    expect(ADVISOR_Q03_CUSTOM_PANEL.every((r) => r.exact === '0 / 64')).toBe(true);
    expect(ADVISOR_Q04_CAPACITY.map((r) => r.score)).toEqual(['62.98', '61.19']);
    expect(ADVISOR_Q05_FROZEN.map((r) => r.score)).toEqual(['60.72', '45.98', '20.77']);
    expect(ADVISOR_Q09_UPDATES.map((r) => r.parametric)).toEqual([159, 158, 154]);

    const q03 = ADVISOR_QUESTIONS.find((q) => q.id === 'q03')!;
    expect(q03.interpretation).toContain('不能直接排名');
    expect(q03.finding).toContain('87.10');
    expect(q03.unknown).toContain('正式 SFT 和 Stage2');

    const q02 = ADVISOR_QUESTIONS.find((q) => q.id === 'q02')!;
    expect(q02.finding).toContain('六个固定训练格的训练 summary 均为 PASS');
    expect(q02.unknown).toContain('统一固定开发题评测');
    expect(q02.evidence[0]?.href).toContain('issuecomment-5976961612');

    expect(ADVISOR_QUESTIONS.find((q) => q.id === 'q08')?.unknown).toContain('不能证明有遗忘');
    expect(ADVISOR_QUESTIONS.find((q) => q.id === 'q09')?.unknown).toContain('尚无可报告');
    expect(ADVISOR_QUESTIONS.find((q) => q.id === 'q10')?.evidenceState).toBe('unrun');
  });

  it('uses a real academic section hierarchy rather than ten parallel body chapters', () => {
    const page = read(pagePath);
    const md = read(reportPath);
    expect(page).toContain('<h1>长期参数记忆的效率与能力权衡</h1>');
    expect(page).toContain('data-paper-report');
    for (const id of sectionIds) expect(page).toContain('id="' + id + '"');
    const positions = sectionIds.map((id) => page.indexOf('id="' + id + '"'));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(positions.every((n) => n > 0)).toBe(true);
    expect(page.indexOf('id="paper-appendix"')).toBeGreaterThan(page.indexOf('id="paper-conclusion"'));
    expect(page).toContain('data-report-question={question.id}');
    expect(page).not.toContain('const chapters =');
    for (const h of [
      '## 1 Introduction', '## 2 Related Work', '## 3 Method',
      '## 4 Experimental Setup', '## 5 Main Results', '## 6 Ablation Studies',
      '## 7 Visualization', '## 8 Discussion', '## 9 Conclusion',
    ]) expect(md).toContain(h);
    expect(md.indexOf('## Appendix A')).toBeGreaterThan(md.indexOf('## References'));
    // A research title and abstract must not be separated by self-describing metadata.
    expect(md.split('## Abstract｜摘要')[0]?.trim()).toBe(
      '# 长期参数记忆的效率与能力权衡：OpenEVO 在 WebShop 上的实证研究',
    );
  });

  it('does not confuse frozen final results, capacity-screen, Q03, and paper SEED', () => {
    const page = read(pagePath);
    const md = read(reportPath);
    expect(page).toContain('data-comparison-boundary="noncomparable"');
    expect(page).toContain('不能直接排名或归因');
    expect(page).toContain('正式 SFT / Stage2 能力结果为<strong>未测</strong>');
    expect(page).toContain('第 152–159');
    expect(page).toContain('1,024 次');
    expect(page).toContain('普通 OpenEVO 是较早前序实验');
    expect(page).toContain('31.09 → 2.02 h');
    expect(page).toContain('74.78 → 56.25 h');
    expect(md).toContain('Q03 自定义 64 题');
    expect(md).toContain('rank32');
    expect(md).toContain('未测');
    expect(md).toContain('15.36×');
  });

  it('places genuine figures by evidence role and keeps meeting source attribution', () => {
    const page = read(pagePath);
    const plots = read('src/components/research/AdvisorTenEvidenceVisual.astro');
    for (const variant of ['q01', 'q02', 'q03', 'q04', 'q07']) {
      expect(page).toContain('variant="' + variant + '"');
    }
    expect(page).toContain('data-paper-figure="full-trajectory"');
    expect(page).toContain('wandb-threeway/task-score.svg');
    expect(page).toContain('data-paper-figure="method"');
    expect(page).toContain('data-report-figure="q09-update-counts"');
    expect(page).toContain('OPEN_EVO_ADVISOR_MEETING.points');
    expect(page).toContain('OPEN_EVO_ADVISOR_MEETING.sourceHref');
    expect(plots).toContain('ADVISOR_Q03_CUSTOM_PANEL.map');
    expect(plots).toContain('points={points}');
    expect(plots).toContain('中间轮次未测');
    expect(plots).toContain('aria-pressed');
    expect(plots).toContain('effectX(-15.02)');

    const originalMeeting = read('src/components/research/OpenEvoExperimentIndex.astro');
    expect(originalMeeting).toContain('当时精炼的六个问题');
    expect(originalMeeting).toContain('OPEN_EVO_ADVISOR_MEETING.points');
  });

  it('protects HTML semantics and puts evidence dates near sources without redundant chrome', () => {
    const page = read(pagePath);
    expect(page).toContain('data-reader-purpose');
    expect(page).toContain('data-result-stage="direct-result"');
    expect(page).toContain('data-result-stage="synthesis"');
    expect(page).not.toContain('class="advisor-ten__footnotes"');
    expect(page).not.toContain('class="advisor-ten__eyebrow"');
    expect(page).not.toContain('class="advisor-ten__paper-label"');
    expect(page).not.toContain('class="paper-hero-note"');
    expect(page).toContain('研究证据核对日期：');
    expect(page).toContain('datetime={ADVISOR_RESEARCH_AS_OF}');
    expect(page).toContain('Task Score 以满分 100');
    expect(page).toContain('<caption>');
    expect(page).toContain('<figcaption>');
    expect(page).toContain('tabindex="0"');
    expect(page).toContain('prefers-reduced-motion');
    expect(page).not.toContain('innerHTML');
    const contract = SITE_READER_CONTRACTS.find((r) => r.id === 'study-advisor-ten');
    expect(contract?.sourceRoute).toBe('/research/seed-openevo/study/advisor-questions/');
    expect(contract?.firstViewportSelector).toBe('.advisor-ten__lede');
    expect(contract?.mustStayVisible).toContain('Q03');
    expect(contract?.firstViewportGoal).toContain('论文式');
  });
});
