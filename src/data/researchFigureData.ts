import analysisSnapshot from './researchAnalysisSnapshot.json';
import { frozenFinalView, getResearchEvidence, RESEARCH_EVIDENCE } from './researchEvidenceIndex';

const betaScore = getResearchEvidence('beta-r200-task-score');
const final = frozenFinalView();
const beta = analysisSnapshot.studies.betaLateTraining;

if (beta.id !== 'beta-late-training') throw new Error('Unexpected beta analysis identity');

export const BETA_TRAINING_FIGURE = {
  id: 'beta-r96-r199-task-score',
  title: 'β-gating · 第96–199轮训练 Task Score',
  question: '后期掉分之后，训练表现有没有继续恶化？',
  evaluationRole: 'training' as const,
  xMeaning: 'round' as const,
  xLabel: '训练轮次',
  yLabel: 'Task Score / 100',
  yDomain: [0, 100] as const,
  extensionBoundary: 160,
  rawPoints: betaScore.points.map((point) => ({
    round: point.position,
    score: point.value === null ? null : point.value * 100,
  })),
  windows: beta.windows.map((window) => ({
    id: window.id,
    firstRound: window.firstRound,
    lastRound: window.lastRound,
    roundCount: window.roundCount,
    score: window.scorePoints,
    missingRounds: window.missing.taskScore,
  })),
  source: {
    href: '/research/seed-openevo/evidence/bounded-beta-r200-round-series-20261001.json',
    label: '104轮逐轮机器可读数据',
    revision: betaScore.revision,
  },
  supports: '第140–159轮低谷之后，第160–199轮训练 Task Score 回升；这是一条训练期轨迹。',
  doesNotSupport: '不能据此生成新的冻结 Final，也不能单独判定120、160或200轮是最佳停止点。',
} as const;

export const SAME_PANEL_FINAL_FIGURE = {
  id: 'same-panel-final-comparison',
  title: '同一冻结128题 · 三个最终模型',
  question: '把题目固定以后，三个已经完成的最终模型表现怎样？',
  evaluationRole: 'frozen_final' as const,
  denominator: 128,
  panelDigest: final.panelDigest,
  rows: [
    { id: 'directapply', label: '普通 OpenEVO', taskScore: final.directApply.score, exactCount: final.directApply.exactCount, exactRate: final.directApply.exactRate },
    { id: 'bounded', label: 'OpenEVO + Bounded', taskScore: final.off.score, exactCount: final.off.exactCount, exactRate: final.off.exactRate },
    { id: 'beta', label: 'OpenEVO + Bounded + β', taskScore: final.on.score, exactCount: final.on.exactCount, exactRate: final.on.exactRate },
  ],
  source: {
    href: '/research/seed-openevo/evidence/bounded-effective-state-final-snapshot-20260918.json',
    label: '同题 Final 机器可读快照',
  },
  supports: '三组模型在完全相同的冻结128题上可以并排阅读 Task Score 与完整成功数。',
  doesNotSupport: final.boundary,
} as const;

const rankPending = RESEARCH_EVIDENCE.find((item) => item.id === 'rank32-continuation-pending');
if (!rankPending) throw new Error('Missing pending rank32 evidence contract');

export const CAPACITY_TRADEOFF_FIGURE = {
  id: 'rank-capacity-tradeoff',
  title: '持久 State 容量—质量—体积',
  question: '把长期参数 State 压小以后，能力和存储代价怎样一起变化？',
  state: 'awaiting-publication' as const,
  evaluationRole: 'development' as const,
  dimensions: ['State rank', 'adapter bytes', 'Task Score', 'exact success'] as const,
  source: {
    href: 'https://github.com/mykcs/basemodel/pull/805',
    label: '来源发布 PR #805',
    revision: rankPending.source.commit,
  },
  reason: rankPending.publication.reason,
  rows: [
    { id: 'rank128', label: 'rank128', stateRank: 128, adapterBytes: null, taskScore: null, exactCount: null },
    { id: 'rank32', label: 'rank32', stateRank: 32, adapterBytes: null, taskScore: null, exactCount: null },
  ],
  supports: '当前只确认这项比较已有明确来源；网站发布数据尚未完成接入。',
  doesNotSupport: '在 #805 接入前不画容量前沿、不复制结果数字，也不从 effective rank 反推最小可训 rank。',
} as const;
