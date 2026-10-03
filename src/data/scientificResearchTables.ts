import postAdvisor from '../../public/research/seed-openevo/evidence/post-advisor-ab-final-20260928.json';
import { EFFECTIVE_STATE_GDR_LORA_STUDY as study } from './effectiveStateGdrLoraStudy';
import { OPEN_EVO_DIRECT_APPLY_LIVE_DYNAMICS as directApplyDynamics } from './openEvoDirectApplyLiveDynamics';
import { validateScientificTableView, type ScientificTableView } from '../lib/scientificTable';

const mean = (rows: readonly { score: number }[]) => rows.reduce((sum, row) => sum + row.score, 0) / rows.length;
const sealed = study.formalResult.status === 'sealed' ? study.formalResult : null;
if (!sealed) throw new Error('Scientific Final table requires sealed Bounded/β formal result');

const localFinalNames = {
  directApply: '普通 OpenEVO / DirectApply',
  bounded: 'OpenEVO + Bounded Online Recurrence',
  beta: 'OpenEVO + Bounded + β-gating（α 固定为 1）',
  dynamicAlphaBeta: 'OpenEVO + Bounded + dynamic α + dynamic β（未运行）',
} as const;

export const RANK32_CAPACITY_TABLE = validateScientificTableView({
  id: 'rank32-capacity',
  caption: 'rank128 与 rank32：R152–R159 matched continuation 容量对照',
  comparisonId: 'post-advisor-rank32-r152-r159',
  rowHeaderLabel: '指标',
  columns: [
    { key: 'unit', label: '单位', align: 'left' },
    { key: 'rank128', label: 'rank128', align: 'right' },
    { key: 'rank32', label: 'rank32', align: 'right' },
  ],
  rows: [
    {
      id: 'mean-task-score',
      label: 'R152–R159 平均 Task Score',
      cells: {
        unit: { raw: 'ratio' },
        rank128: { raw: postAdvisor.B.rank128.mean_task_score, display: postAdvisor.B.rank128.mean_task_score.toFixed(4) },
        rank32: { raw: postAdvisor.B.rank32.mean_task_score, display: postAdvisor.B.rank32.mean_task_score.toFixed(4) },
      },
    },
    {
      id: 'exact-success',
      label: 'Exact Success',
      cells: {
        unit: { raw: `count / ${postAdvisor.B.paired_attempts}` },
        rank128: { raw: postAdvisor.B.rank128.exact_success_count },
        rank32: { raw: postAdvisor.B.rank32.exact_success_count },
      },
    },
    {
      id: 'persistent-payload',
      label: '持久参数 payload',
      cells: {
        unit: { raw: 'bytes' },
        rank128: { raw: postAdvisor.B.rank128.final_adapter_bytes, display: postAdvisor.B.rank128.final_adapter_bytes.toLocaleString('en-US') },
        rank32: { raw: postAdvisor.B.rank32.final_adapter_bytes, display: postAdvisor.B.rank32.final_adapter_bytes.toLocaleString('en-US') },
      },
    },
  ],
  notes: [
    `同一 R152–R159 task / seed schedule，共 ${postAdvisor.B.paired_attempts} 个 matched rollouts；这是 development/prospective continuation，不是 final-panel 证据。`,
    `rank32 − rank128 Task Score 差为 ${postAdvisor.B.rank32_minus_rank128.mean_task_score.toFixed(4)}；95% CI [${postAdvisor.B.rank32_minus_rank128.mean_task_score_bootstrap95[0].toFixed(4)}, ${postAdvisor.B.rank32_minus_rank128.mean_task_score_bootstrap95[1].toFixed(4)}]。区间跨 0 不能写成等价或严格 non-inferior。`,
    '后验 effective rank 很低不等于更低 rank 已经通过训练/能力保持验证；下一步仍应看预先定义的容量 sweep。',
  ],
  sourceIds: [
    `${postAdvisor.source.repository}#PR-${postAdvisor.source.pull_request}`,
    postAdvisor.source.final_summary_path,
  ],
  exportBasePath: '/research/seed-openevo/exports/rank32-capacity',
} satisfies ScientificTableView);

const directApplyLast20 = mean(directApplyDynamics.score.slice(-20));
const boundedLast20 = mean(sealed.trajectory.off.slice(-20));
const betaLast20 = mean(sealed.trajectory.on.slice(-20));

export const SAME_PANEL_FINAL_TABLE = validateScientificTableView({
  id: 'same-panel-final',
  caption: '三条已完成 OpenEVO 路线：训练后期描述与同一冻结 128 题 Final',
  comparisonId: 'bounded-effective-state-same-panel-final',
  rowHeaderLabel: '实验',
  columns: [
    { key: 'bounded', label: 'Bounded', align: 'center' },
    { key: 'beta', label: '动态 β', align: 'center' },
    { key: 'alpha', label: '动态 α', align: 'center' },
    { key: 'lateScore', label: '最后 20 轮平均 Task Score', unit: '/100', align: 'right' },
    { key: 'finalScore', label: '冻结 Final Task Score', unit: '/100', align: 'right' },
    { key: 'exact', label: '完整做对', unit: 'count / 128', align: 'right' },
  ],
  rows: [
    {
      id: 'directapply',
      label: localFinalNames.directApply,
      group: '同一冻结 128 题：已完成模型',
      cells: {
        bounded: { raw: false },
        beta: { raw: false },
        alpha: { raw: false },
        lateScore: { raw: directApplyLast20, display: directApplyLast20.toFixed(2) },
        finalScore: { raw: study.threeWayFinal.directApply.score, display: study.threeWayFinal.directApply.score.toFixed(2) },
        exact: { raw: study.threeWayFinal.directApply.exactCount },
      },
    },
    {
      id: 'bounded',
      label: localFinalNames.bounded,
      group: '同一冻结 128 题：已完成模型',
      cells: {
        bounded: { raw: true },
        beta: { raw: false },
        alpha: { raw: false },
        lateScore: { raw: boundedLast20, display: boundedLast20.toFixed(2) },
        finalScore: { raw: study.threeWayFinal.off.score, display: study.threeWayFinal.off.score.toFixed(2) },
        exact: { raw: study.threeWayFinal.off.exactCount },
      },
    },
    {
      id: 'beta',
      label: localFinalNames.beta,
      group: '同一冻结 128 题：已完成模型',
      cells: {
        bounded: { raw: true },
        beta: { raw: true },
        alpha: { raw: false },
        lateScore: { raw: betaLast20, display: betaLast20.toFixed(2) },
        finalScore: { raw: study.threeWayFinal.on.score, display: study.threeWayFinal.on.score.toFixed(2) },
        exact: { raw: study.threeWayFinal.on.exactCount },
      },
    },
    {
      id: 'dynamic-alpha-beta',
      label: localFinalNames.dynamicAlphaBeta,
      group: '方法空间：尚未运行',
      cells: {
        bounded: { raw: true },
        beta: { raw: true },
        alpha: { raw: true },
        lateScore: { raw: null },
        finalScore: { raw: null },
        exact: { raw: null },
      },
    },
  ],
  notes: [
    '最后 20 轮平均来自每轮变化的训练任务，只描述训练后期典型水平，不是固定题考试。',
    '三条已完成模型使用同一个冻结 128 题 Final；其中 DirectApply 是更早独立完成的历史前驱，真正属于同一次预注册 matched campaign 的是 Bounded 与 β-gating 两组。',
    'dynamic α + dynamic β 尚未运行，因此保持缺失值；缺失不是 0，也不参与统计比较。',
    'SEED 论文使用自己的 128 个 validation tasks；由于任务 panel 不同，它只作为外部参考，不放进这张同题表里制造伪横向比较。',
  ],
  sourceIds: [
    study.source.finalCloseoutCommit,
    study.threeWayFinal.panelDigest,
  ],
  exportBasePath: '/research/seed-openevo/exports/same-panel-final',
} satisfies ScientificTableView);
