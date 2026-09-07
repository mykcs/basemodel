import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const snap = read('../data/openEvoCeilingStage2Snapshot.ts');
const ceiling = read('../components/research/OpenEvoCeilingStrategy.astro');
const firstRun = read('../components/research/OpenEvoFirstRunMap.astro');
const archive = read('../components/research/OpenEvoExperimentArchive.astro');
const zhPage = read('../pages/research/seed-openevo/study/capability-exploration/stage2-ceiling/index.astro');
const enPage = read('../pages/en/research/seed-openevo/study/capability-exploration/stage2-ceiling/index.astro');

describe('Ceiling-1.0 7B final closeout', () => {
  it('keeps the historical 2026-08-31 snapshot and adds a separate final record', () => {
    expect(snap).toContain("observedAt: '2026-08-31 20:34 JST'");
    expect(snap).toContain("status: 'RUNNING', roundsComplete: 31");
    expect(snap).toContain('sevenBFinalCloseout');
    expect(snap).toContain('completedRounds: 149');
    expect(snap).toContain("completedRange: '0–148'");
    expect(snap).toContain('acceptedRollouts: 19_072');
    expect(snap).toContain('partialRound149Excluded: true');
    expect(snap).toContain('sdComponents: 143');
  });

  it('publishes the frozen 128-task final without dropping fail-closed rows from the denominator', () => {
    expect(snap).toContain('meanTaskScore: 49.326636904761905');
    expect(snap).toContain('exactSuccessCount: 58');
    expect(snap).toContain('exactSuccessPct: 45.3125');
    expect(snap).toContain('actionAdmissibilityFailures: 7');
    expect(snap).toContain('runtimeErrors: 0');
    expect(ceiling).toContain('128 道测试任务全部完成');
    expect(ceiling).toContain('平均分始终包含全部 128 题');
    expect(firstRun).toContain('58 / 128 完整成功');
  });

  it('keeps SEED paper numbers in a paper-reference claim domain', () => {
    expect(snap).toContain('seedPaperReference: { score: 89.7, successPct: 78.1 }');
    expect(ceiling).toContain('SEED · PAPER REFERENCE');
    expect(ceiling).toContain('40.37');
    expect(ceiling).toContain('32.79');
    expect(ceiling).toContain('不能把差值归因于学习方法本身');
    expect(firstRun).toContain('不冒充本地 paired reproduction');
  });

  it('shows parameter-analysis closeout without claiming compression was used in the final checkpoint', () => {
    expect(firstRun).toContain('update stable rank 16.55');
    expect(firstRun).toContain('95% energy rank 77');
    expect(firstRun).toContain('residual-energy 中位数 0.0597');
    expect(firstRun).toContain('K64');
    expect(firstRun).toContain('不属于 formal final checkpoint');
    expect(ceiling).toContain('formal 训练里始终没有启用 rank reduction / compression');
  });


  it('pins role-specific archive identities and preserves the current verification boundary', () => {
    expect(snap).not.toContain('archiveHead');
    expect(snap).toContain("status: 'CLOSED_ARCHIVED'");
    expect(snap).toContain("repository: 'miyuki17/openevo-ceiling1-v2-archive'");
    expect(snap).toContain("componentStoreRevision: '3266fa00db4df513b4f420dc7df7a042af9ec40a'");
    expect(snap).toContain("fullLineageRevision: 'f51bcfe315f08c6c2f7fe3b4677bcc2f8a3d2b55'");
    expect(snap).toContain("fullLineageSha256: '58cb13e8d12d66c7876ca30a356d9a2ef0d192493d23adf37cf89c6a02752266'");
    expect(snap).toContain("parameterAnalysisRevision: 'bfae0f84f137cc0022befe1300c84da9c1039873'");
    expect(snap).toContain("parameterAnalysisSha256: 'ecee4e5f36e3e5c3125dfcb71cb3f1e79751be9ed3a5fcd58f7d0b783e4f079c'");
    expect(snap).toContain("sourceCommit: 'fbb3d59d6a7cc7474374bf8991164dcf53c23eeb'");
    expect(snap).toContain("priorRemoteVerification: 'PASS'");
    expect(snap).toContain("currentFreshRead: 'TOOL_ERROR_INVALID_VALUE'");
    expect(ceiling).toContain('private / restricted research asset');
    expect(ceiling).toContain('the 2026-09-05 reread did not complete because of a tool-argument error');
    expect(firstRun).toContain('is not upgraded to a current fresh PASS');
    expect(archive).toContain('does not establish a successful re-verification');
  });

  it('updates both localized Ceiling page descriptions with the final 7B closeout', () => {
    expect(zhPage).toContain('49.33 分 / 45.31% 完整成功');
    expect(zhPage).toContain('149 个完整 round');
    expect(enPage).toContain('49.33 score / 45.31% exact success');
    expect(enPage).toContain('149 completed rounds');
  });
});

