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
    expect((lobby.match(/data-map-choice=/g) || []).length).toBe(3);
    expect(lobby).toContain('data-map-choice="first-run"');
    expect(lobby).toContain('data-map-choice="redesign"');
    expect(lobby).toContain('data-map-choice="mechanism-1-0"');
    expect(lobby).not.toContain('data-map-choice="archive"');
    expect(lobby).toContain('<details class="map-lobby__archive">');
    expect(lobby).toContain('/capability-exploration/archive/');
    expect(lobby).toContain('打开完整实验档案');
    expect(lobby).toContain('Server/Kaggle');
    expect(archive).toContain('三张主地图只讲研究主剧情');
    expect(archive).toContain('Map one: first experiment');
    expect(archive).toContain('Map two: Redesigning OpenEvo');
    expect(archive).toContain('Map three: Mechanism-1.0');
    expect(zhIndex).toContain('OpenEvoCapabilityMapLobby');
    expect(enIndex).toContain('OpenEvoCapabilityMapLobby');
  });

  it('classifies Harness attempts as diagnostic evidence rather than continuation checkpoints', () => {
    expect(archive).toContain('Harness201 / G3 HOLD');
    expect(archive).toContain('33/128 invalid termination');
    expect(archive).toContain('不能在同一 lineage 热换 parser / interface 后从 round1 接着跑');
    expect(archive).toContain('它们回答“为什么改”，不是四条新科学路线');
  });

  it('keeps Server and Kaggle as execution metadata unless evidence proves a scientific difference', () => {
    expect(archive).toContain('SERVER / KAGGLE');
    expect(archive).toContain('执行位置属于 metadata');
    expect(archive).toContain('不画成科学分叉');
    expect(archive).toContain('Only parse_ok=true counts as complete');
    expect(archive).toContain('Retry-After');
  });

  it('collects long-run engineering repairs without promoting them to scientific branches', () => {
    for (const label of ['trainer source', 'restart validator', 'execution provenance', 'HF cold archive', 'GPU / lease / holder']) expect(archive).toContain(label);
    expect(archive).toContain('ENGINEERING PATCH LANE');
    expect(archive).toContain('不能因为调度方便就改变正式 task budget');
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
