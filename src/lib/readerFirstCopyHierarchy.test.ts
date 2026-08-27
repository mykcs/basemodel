import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const srcRoot = fileURLToPath(new URL('../', import.meta.url));
const runtimeRoots = ['components', 'pages', 'layouts'].map((part) => join(srcRoot, part));
const allowedExtensions = new Set(['.astro', '.tsx', '.ts']);

const walk = (path: string): string[] => {
  if (statSync(path).isFile()) return [path];
  return readdirSync(path).flatMap((entry) => walk(join(path, entry)));
};

const runtimeCopyFiles = runtimeRoots
  .flatMap((root) => walk(root))
  .filter((file) => allowedExtensions.has(extname(file)))
  .filter((file) => !/\.(?:test|spec)\.(?:ts|tsx)$/.test(file))
  .filter((file) => !file.endsWith('/AGENTS.md'));

const visibleStageDirections = [
  { id: 'zh-first-time', pattern: /t\(\s*['"`]如果你第一次打开这一页[^'"`\n]{0,120}/g },
  { id: 'zh-page-first', pattern: /t\(\s*['"`]这一页先[^'"`\n]{0,120}/g },
  { id: 'zh-below', pattern: /t\(\s*['"`]下面我们(?:会|依次)[^'"`\n]{0,120}/g },
  { id: 'en-first-time', pattern: /If this is your first time on the page[^'"`\n]{0,120}/gi },
  { id: 'en-page-first', pattern: /This page starts in plain language and then layers[^'"`\n]{0,120}/gi },
  { id: 'en-analysis-below', pattern: /The analysis below asks[^'"`\n]{0,120}/gi },
] as const;

describe('reader-first public copy hierarchy', () => {
  it('does not choreograph the reader with zero-information stage directions', () => {
    const findings: string[] = [];
    for (const file of runtimeCopyFiles) {
      const source = readFileSync(file, 'utf8');
      for (const rule of visibleStageDirections) {
        rule.pattern.lastIndex = 0;
        for (const match of source.matchAll(rule.pattern)) {
          findings.push(`${file.replace(srcRoot, 'src/')}: ${rule.id}: ${match[0]}`);
        }
      }
    }
    expect(findings).toEqual([]);
  });

  it('keeps the Results hero inside the scientific subject instead of describing how to read the page', () => {
    const hero = readFileSync(join(srcRoot, 'components/research/OpenEvoWebShopResultsHero.astro'), 'utf8');
    expect(hero).toContain('我们在同一套 WebShop 任务上比较基础 Qwen2.5-7B-Instruct');
    expect(hero).not.toContain("<p class=\"lede\">{t(\n    '如果你知道实验室正在比较 OpenEvo、SEED 和 WebShop");
  });

  it('makes the action-wrapper incident concrete, prominent, and conclusion-first', () => {
    const incident = readFileSync(join(srcRoot, 'components/research/OpenEvoActionWrapperAttribution.astro'), 'utf8');
    expect(incident).toContain('动作格式错误：<action>...</action> 被写成 [action]...');
    expect(incident).toContain('wrapper-attribution__incident');
    expect(incident).toContain('但有些输出把外层 <action>...</action> 写成了 [action]...');
    expect(incident).toContain('wrapper-attribution__facts');
    expect(incident).toContain('128 × 2 = 256');
    expect(incident).toContain('<strong>16</strong>');
    expect(incident).toContain('条成功 rollout，覆盖 8 个任务 × 每个任务 2 条独立成功轨迹');
    expect(incident).toContain('累计 optimizer-step 上限是 ≤128');
    expect(incident).toContain('我们一步都没训练，BASE 就已经写出了 [action]');
    expect(incident).not.toContain('0 个 OpenEvo adapter 训练步即可看到');
    expect(incident).toContain('adapter_loaded=false');
    expect(incident).toContain('结论先行：这次 [action] 的起源不能归给 SD-LoRA 训练');
    expect(incident).toContain('wrapper-attribution__incident strong{color:var(--color-danger);font-weight:820}');
  });
});