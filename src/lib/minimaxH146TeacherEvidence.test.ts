import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const facts = read('docs/agents/current/minimax-h146-frozen-facts-2026-08-30.md');
const localAgents = read('docs/agents/current/AGENTS.md');
const analysis = read('docs/agents/current/minimax-h146-teacher-intelligence-cost-analysis.md');
const page = read('src/pages/research/seed-openevo/study/minimax-teacher/index.astro');
const selector = read('src/components/research/OpenEvoExperimentSelector.astro');

describe('H1.46 MiniMax teacher evidence boundary', () => {
  it('pins the frozen fact record byte-for-byte', () => {
    const digest = createHash('sha256').update(facts).digest('hex');
    expect(digest).toBe('94f90d73e77919e26214b241ba1b291c650078018b47c68242ab1220dc5dd720');
  });

  it('keeps the dated fact record explicitly immutable in place', () => {
    expect(facts).toContain('FROZEN FACT RECORD / DO NOT EDIT IN PLACE');
    expect(facts).toContain('Future Agents MUST NOT rewrite');
    expect(facts).toContain('create a new dated superseding fact record');
    expect(localAgents).toContain('immutable historical fact record');
    expect(localAgents).toContain('leave the frozen file byte-for-byte intact');
  });

  it('locks the measured primary and account-window quantities', () => {
    for (const value of [
      '7,602,416',
      '6,411,142',
      '14,013,558',
      '27,663,133',
      '13,173,879',
      '27,187,437',
      '¥37.98',
      '$5.65',
      '¥67.83',
      '$10.08',
    ]) {
      expect(facts).toContain(value);
    }
  });

  it('keeps intelligence and efficiency as different scientific questions', () => {
    expect(analysis).toContain('WHTB — WebShop Hindsight Teacher Bench');
    expect(analysis).toContain('Do **not** fold money into an “intelligence” score');
    expect(analysis).toContain('same semantic workload, not same raw token count');
    expect(analysis).toContain('128 frozen trajectories total');
  });

  it('makes the user-facing page answer the benchmark question before the cost accounting', () => {
    const benchmark = page.indexOf('最适合这里的 benchmark');
    const resources = page.indexOf('WHAT WE ACTUALLY SPENT');
    expect(benchmark).toBeGreaterThanOrEqual(0);
    expect(resources).toBeGreaterThan(benchmark);
    expect(page).toContain('WHTB · WebShop Hindsight Teacher Bench');
    expect(page).toContain('待同轨迹 WHTB 实测');
    expect(page).toContain('14.01M');
    expect(page).toContain('≤ ¥37.98 ≈ $5.65');
  });

  it('links the MiniMax branch of the experiment selector to the audit page', () => {
    expect(selector).toContain('/research/seed-openevo/study/minimax-teacher/');
    expect(selector).toContain('教师能力、Token 与 API 成本');
  });

  it('does not fabricate a current cross-provider intelligence ranking', () => {
    expect(page).toContain('本页不填未经当前一手来源固定的分数/价格');
    expect(page).toContain('纵向位置不是能力排名');
    expect(page).not.toContain('MiniMax-M3 比 GLM-5.2 更聪明');
    expect(page).not.toContain('Kimi K3 比 MiniMax-M3 更聪明');
  });
});
