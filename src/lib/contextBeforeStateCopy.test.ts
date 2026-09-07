import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const sourceRoot = new URL('../', import.meta.url);
const docsRoot = new URL('../../docs/agents/current/', import.meta.url);

const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const full = join(dir, name);
  if (name === 'node_modules' || name.includes('.test.')) return [];
  return statSync(full).isDirectory() ? walk(full) : [full];
});

const publicSource = walk(sourceRoot.pathname)
  .filter((file) => /\.(astro|tsx|ts|md|mdx)$/.test(file))
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');

const designSpec = readFileSync(new URL('website-design-spec.md', docsRoot), 'utf8');
const copyCases = readFileSync(new URL('website-copy-cases.md', docsRoot), 'utf8');

describe('reader context before relational status copy', () => {
  it('keeps confirmed context-free relational phrases out of public source', () => {
    const regressions = [
      '当前 corrected Stage 1 仍是共同起点',
      'The current corrected Stage 1 remains the shared starting point',
      '仍然是 8 张 GPU',
      '仍然是每卡 80GB',
      '仍然是 Ampere 数据中心卡',
      '当前 policy 继续通过同一个',
      '当前路线把同一轮 128 条证据',
      "03A · {t('已经跑过','EXISTING RUN')}",
      '后续资格状态已更新',
      '这套规则对 7B 至少能够继续学习',
      '本页主体仍记录 Mini Study 01',
      '当前实验状态必须从真正使用的工作分支继续读取',
    ];
    for (const phrase of regressions) expect(publicSource).not.toContain(phrase);
  });

  it('keeps current relationship wording and CASE-060 in canonical guidance', () => {
    expect(publicSource).toContain('后续 Harness 研究改变了 on-policy action contract，因此新版不再沿用旧 Stage 1，而是重新采集 Stage 1。');
    expect(publicSource).toContain('并行规模保持 8 张 GPU');
    expect(publicSource).toContain('每 128 次任务形成一轮共同证据');
    expect(designSpec).toContain('关系性结论需要先给最小参照物');
    expect(designSpec).toContain('CASE-060');
    expect(copyCases).toContain('CASE-060 — “共同 / 继续 / 仍然 / 后续”前先给参照物');
  });
});
