import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  new URL('../pages/research/seed-openevo/study/parameter-memory-results/index.astro', import.meta.url),
  'utf8',
);

const introduction = source.match(/<p class="evo-article__lede" data-reader-purpose>([\s\S]*?)<\/p>/)?.[1] ?? '';
const visibleIntroduction = introduction.replace(/<[^>]*>/g, '');
const meetingProvenance = source.match(/<p class="evo-article__note" data-meeting-provenance>([\s\S]*?)<\/p>/)?.[1] ?? '';

describe('advisor-facing ten-question first viewport', () => {
  it('explains the reader task and answer before the historical meeting context', () => {
    expect(visibleIntroduction).toMatch(/^模型在模拟网店里练习购物/);
    expect(visibleIntroduction).toContain('已经测到什么、目前做到哪一步、下一步还缺什么');
    expect(visibleIntroduction).not.toContain('2026 年 9 月 22 日');
    // A source-first paragraph previously consumed most of the mobile first viewport.
    expect(Array.from(visibleIntroduction).length).toBeLessThan(230);
  });

  it('preserves accurate provenance and separates the later Q10', () => {
    expect(meetingProvenance).toContain('href={OPEN_EVO_ADVISOR_MEETING.rawHref}');
    expect(meetingProvenance).toContain('会议原始逐字记录（RAW）');
    expect(meetingProvenance).toContain('Q01–Q09');
    expect(meetingProvenance).toContain('独立复现问题 Q10 为会后新增');
    expect(meetingProvenance).toContain('不是L 学长当时逐字提出的十句话');
  });

  it('puts scientific findings and next decisions before the color legend', () => {
    const section = source.slice(
      source.indexOf('<section class="advisor-overview"'),
      source.indexOf('</section>', source.indexOf('<section class="advisor-overview"')),
    );
    expect(section).toContain('data-overview-count={tone}');
    expect(section.indexOf('data-advisor-priorities')).toBeLessThan(
      section.indexOf('advisor-overview__counts'),
    );
    expect(source.indexOf('data-meeting-provenance')).toBeGreaterThan(
      source.indexOf('data-advisor-priorities'),
    );
    expect(section).toContain('data-advisor-key-findings');
    expect(section).toContain('data-advisor-priorities');
    expect(section.indexOf('data-advisor-key-findings')).toBeLessThan(
      section.indexOf('advisor-overview__explanation'),
    );
    expect(section.indexOf('data-advisor-priorities')).toBeLessThan(
      section.indexOf('advisor-overview__explanation'),
    );
  });
});
