import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const archive = read('../components/research/OpenEvoExperimentArchive.astro');
const lobby = read('../components/research/OpenEvoCapabilityMapLobby.astro');
const firstRun = read('../components/research/OpenEvoFirstRunMap.astro');
const redesign = read('../components/research/OpenEvoRedesignMap.astro');
const successorExploration = read('../components/research/OpenEvoSuccessorExplorationMap.astro');
const successorReport = read('../components/research/OpenEvoSuccessorReport.astro');
const zh = read('../pages/research/seed-openevo/study/capability-exploration/archive/index.astro');
const en = read('../pages/en/research/seed-openevo/study/capability-exploration/archive/index.astro');
const zhIndex = read('../pages/research/seed-openevo/study/capability-exploration/index.astro');
const enIndex = read('../pages/en/research/seed-openevo/study/capability-exploration/index.astro');

describe('OpenEvo experiment archive', () => {
  it('keeps exactly three primary maps and demotes the archive from top-level route choice', () => {
    const mapChoices = [...lobby.matchAll(/mapChoice: '(first-run|redesign|mechanism-1-0)'/g)].map((match) => match[1]);
    expect(new Set(mapChoices)).toEqual(new Set(['first-run', 'redesign', 'mechanism-1-0']));
    expect(lobby).not.toContain("mapChoice: 'archive'");
    expect(lobby).toContain('ResearchDepth');
    expect(lobby).toContain('/capability-exploration/archive/');
    expect(lobby).toContain('打开完整实验档案');
    expect(archive).toContain('记录覆盖第一轮能力探索、新一轮学习设计及参数机制实验');
    expect(archive).toContain('Map one: first experiment');
    expect(archive).toContain('Map two: Redesigning OpenEvo');
    expect(archive).toContain('Map three: Mechanism-1.0');
    expect(zhIndex).toContain('OpenEvoCapabilityMapLobby');
    expect(enIndex).toContain('OpenEvoCapabilityMapLobby');
  });

  it('classifies Harness attempts as diagnostic evidence rather than continuation checkpoints', () => {
    expect(archive).toContain('Harness201 的第四次检查');
    expect(archive).toContain('128 次尝试中有 33 次无效动作终止');
    expect(archive).toContain('不能更换接口后把下一轮接到同一条旧记录上');
    expect(archive).toContain('重复排查同一故障不等于增加了四组独立的方法比较');
  });

  it('keeps Server and Kaggle as execution metadata unless evidence proves a scientific difference', () => {
    expect(archive).toContain('SERVER / KAGGLE');
    expect(archive).toContain('服务器和 Kaggle 记录分析在哪里运行');
    expect(archive).toContain('仅仅运行位置不同，不足以判断使用了不同的学习方法');
    expect(archive).toContain('分析返回且格式检查通过才算完成（parse_ok=true）');
    expect(archive).toContain('服务限流（429）时按等待时间重试');
  });

  it('collects long-run engineering repairs without promoting them to scientific branches', () => {
    for (const label of ['训练代码来源', '恢复状态核对', '执行版本记录', 'Hugging Face 归档', 'GPU 分配与占用']) expect(archive).toContain(label);
    expect(archive).toContain('RUNTIME MAINTENANCE');
    expect(archive).toContain('不能改变正式任务预算、模型状态或实验判定条件');
  });

  it('retains links and bilingual files for historical deep routes', () => {
    for (const route of [
      '/capability-exploration/stage1-previous/',
      '/capability-exploration/stage2-256-window/',
      '/capability-exploration/stage2-ceiling/',
      '/study/results/3b-minimax-analysis/',
      '/study/results/7b-minimax-analysis/',
      '/study/results/four-arm-analysis/',
    ]) expect(archive).toContain(route);

    for (const relative of [
      '../pages/research/seed-openevo/study/capability-exploration/stage1-previous/index.astro',
      '../pages/research/seed-openevo/study/capability-exploration/stage2-256-window/index.astro',
      '../pages/research/seed-openevo/study/capability-exploration/stage2-ceiling/index.astro',
      '../pages/en/research/seed-openevo/study/capability-exploration/stage1-previous/index.astro',
      '../pages/en/research/seed-openevo/study/capability-exploration/stage2-256-window/index.astro',
      '../pages/en/research/seed-openevo/study/capability-exploration/stage2-ceiling/index.astro',
    ]) expect(() => read(relative)).not.toThrow();
  });

  it('keeps the archive reachable from the historical map and both successor readings', () => {
    expect(firstRun).toContain('links.archive');
    expect(firstRun).toContain('打开完整实验档案');
    expect(successorExploration).toContain('links.archive');
    expect(successorExploration).toContain('打开完整实验档案');
    expect(successorReport).toContain('links.archive');
    expect(successorReport).toContain('完整实验档案');
    expect(redesign).toContain('data-successor-mode="exploration"');
    expect(redesign).toContain('data-successor-mode="report"');
  });

  it('mounts a shared bilingual archive route', () => {
    expect(zh).toContain('OpenEvoExperimentArchive');
    expect(en).toContain('OpenEvoExperimentArchive');
  });
});
