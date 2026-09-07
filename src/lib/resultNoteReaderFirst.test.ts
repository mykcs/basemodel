import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const note = read('src/components/research/OpenEvoWebShopResultNote.astro');
const route = read('src/pages/research/seed-openevo/study/results/[note].astro');
const appendix = read('src/components/research/OpenEvoWebShopResultsAppendix.astro');

describe('result-note reader-first case-cluster follow-through', () => {
  it('uses stable result subjects instead of presenter questions or code-first identities', () => {
    for (const title of [
      '早期迁移实验的失败原因',
      '第一次可靠的新任务迁移',
      '新任务迁移的独立复现',
      '第二代连续学习的结果边界',
      '机制比较的测量边界',
      '当前结论与证据边界',
    ]) expect(note).toContain(`title: '${title}'`);

    for (const rejected of [
      '为什么我们前面一直没有得到可靠的“未参与训练的新任务”提升？',
      '第一次正结果：什么时候第一次看到可迁移收益？',
      '独立复现：换一批全新 WebShop 任务以后，提升还在吗？',
      '第二次连续写入：为什么还不能说“多代自进化”成立？',
      'H1.42：为什么修完测量器以后，机制比较仍然不能下结论？',
      '现在到底能下什么结论？什么还不能说？',
    ]) expect(note).not.toContain(rejected);
  });

  it('moves the centralized glossary behind the primary note body', () => {
    expect(note).toContain('<details class="note-glossary">');
    expect(note).toContain('<summary>术语参考（可选）</summary>');
    expect(note).toContain('正文第一次出现时会直接解释');
    expect(note.indexOf('<details class="note-glossary">')).toBeGreaterThan(note.indexOf("{note === 'current-conclusion'"));
    expect(note).not.toContain('<aside class="note-glossary"');
    expect(note).not.toContain('这组页面先统一 7 个词');
  });

  it('keeps experiment IDs in provenance instead of route titles', () => {
    for (const title of [
      "title: '第一次可靠的新任务迁移'",
      "title: '新任务迁移的独立复现'",
      "title: '第二代连续学习的结果边界'",
      "title: '机制比较的测量边界'",
      "title: 'OpenEVO WebShop 实验：当前结论与证据边界'",
    ]) expect(route).toContain(title);
    for (const rejected of [
      "title: 'H1.38B：第一次可靠的内部新任务迁移'",
      "title: 'H1.39：第一代内部迁移的独立复现'",
      "title: 'H1.40：第二代持续整合为什么没有通过门槛？'",
      "title: 'H1.41–H1.42：测量边界与不能下的结论'",
    ]) expect(route).not.toContain(rejected);
  });

  it('names appendix findings before their historical experiment IDs', () => {
    expect(appendix).toContain('第一次可靠的新任务迁移（历史实验 H1.38B）');
    expect(appendix).toContain('新任务迁移的独立复现（历史实验 H1.39）');
    expect(appendix).toContain('第二代持续整合的边界（历史实验 H1.40 / H1.41）');
    expect(appendix).toContain('测量校准笔记（历史实验 H1.42）');
    expect(appendix).not.toContain("title: t('H1.38B：第一次可靠正向迁移'");
  });
});
