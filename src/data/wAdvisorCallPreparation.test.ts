import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { W_ADVISOR_CALL_PREPARATION as prep } from './wAdvisorCallPreparation';

const pagePath = resolve('src/pages/research/seed-openevo/study/w-advisor-call/index.astro');
const renderedSource = readFileSync(pagePath, 'utf8');
const content = JSON.stringify(prep);

describe('W 老师沟通准备的公开源码边界', () => {
  it('只包含目标沟通对象，脱敏内容没有其他真实姓名', () => {
    // Build negative fixtures at runtime: no real name or encoded full name in the public source.
    const forbidden = [
      [0x9b4f, 0x8001, 0x5e08],
      [0x53f2, 0x8001, 0x5e08],
      [0x66f9, 0x8001, 0x5e08],
      [0x9a6c, 0x8001, 0x5e08],
      [0x5b59, 0x9662, 0x957f],
      [0x738b, 0x9510],
    ].map((codePoints) => String.fromCodePoint(...codePoints));
    forbidden.push(['wei', 'ying'].join('-') + '.net');
    for (const privateName of forbidden) {
      expect(content).not.toContain(privateName);
      expect(renderedSource).not.toContain(privateName);
    }
    expect(content).toContain('W 老师');
  });

  it('保持十二道追问、五种回应，并明确名额不等于接收', () => {
    expect(prep.questions).toHaveLength(12);
    expect(prep.questions.map(q => q.number)).toEqual(Array.from({length:12},(_,i)=>`Q${String(i+1).padStart(2,'0')}`));
    expect(new Set(prep.questions.map(q => q.id)).size).toBe(12);
    expect(prep.reactions).toHaveLength(5);
    expect(prep.schedule).toHaveLength(5);
    expect(prep.boundary).toContain('两个独立的问题');
    expect(prep.dateBoundary).toContain('不是最新一次通话的逐字记录');
    expect(prep.reactions.at(-1)?.confirms).toContain('明确拒绝');
  });

  it('复用参考页的真实排版 owner，不生成另一套像素样式', () => {
    for (const path of [
      'openevo-research-blogs.css',
      'research-article.css',
      'advisor-ten-approved-reader.css',
    ]) expect(renderedSource).toContain(path);
    expect(renderedSource).toContain('class="evo-blog evo-article evo-approved-reader wcall-report"');
    expect(renderedSource).toContain('OpenEvoQuestionIndex');
    expect(renderedSource).not.toMatch(/font-size\s*:\s*\d+(?:\.\d+)?(?:px|rem)/);
    expect(renderedSource).not.toMatch(/width\s*:\s*750\.4px/);
  });
});
