export type LocalizedCopy = { zh: string; en: string };

export type ExperimentChildRole =
  | 'result'
  | 'analysis'
  | 'mechanism'
  | 'diagnostic'
  | 'history'
  | 'evidence';

export type ExperimentStatus = 'historical' | 'completed';
export type OpenEvoExperimentId =
  | 'gate-no-update'
  | '7b-long-run'
  | 'successor-3b-1p7b'
  | 'gdr-v1-1p7b'
  | 'directapply-1p7b'
  | 'bounded-effective-state-1p7b';

export interface OpenEvoExperimentChildLink {
  role: ExperimentChildRole;
  label: LocalizedCopy;
  href: string;
  mobileFeatured?: boolean;
  directoryGroup?: LocalizedCopy;
}

export interface OpenEvoExperimentNavigationItem {
  id: OpenEvoExperimentId;
  number: string;
  title: LocalizedCopy;
  summary: LocalizedCopy;
  motivation: LocalizedCopy;
  primaryHref: string;
  childLinks: OpenEvoExperimentChildLink[];
  evidenceLink: OpenEvoExperimentChildLink;
  lineageNote?: LocalizedCopy;
  status: ExperimentStatus;
}

const cap = '/research/seed-openevo/study/capability-exploration';
const sdLoraAccelerationDirectoryGroup = { zh: 'SD-LoRA 加速', en: 'SD-LoRA acceleration' } as const;
export const OPEN_EVO_EXPERIMENTS: OpenEvoExperimentNavigationItem[] = [
  {
    id: 'gate-no-update',
    number: '01',
    title: { zh: '训练跑了很久，但参数一直没有更新', en: 'Training ran for a long time, but the parameters never updated' },
    summary: { zh: '旧 Stage 2 做了很多任务，也收集到了成功轨迹；但更新门槛始终没有被满足，所以训练继续运行时参数没有继续更新。', en: 'The old Stage 2 collected successful trajectories, but its update gate was never satisfied, so training continued without further parameter updates.' },
    motivation: { zh: '检验成功经验能否在旧 Stage 2 规则下真正触发参数学习，并解释为什么训练持续运行却没有参数变化。', en: 'Test whether successful experience could actually trigger parameter learning under the old Stage-2 rule, and explain why training kept running without parameter change.' },
    primaryHref: `${cap}/stage2-256-window/`,
    status: 'historical',
    childLinks: [
      { role: 'analysis', label: { zh: '旧 Gate 为什么卡住了更新', en: 'Why the old gate blocked updates' }, href: `${cap}/stage2-256-window/` },
      { role: 'history', label: { zh: '第一轮 3B / 7B 实验记录', en: 'First 3B / 7B experiment record' }, href: `${cap}/first-run/` },
    ],
    evidenceLink: { role: 'history', label: { zh: '第一轮实验记录', en: 'First-run experiment record' }, href: `${cap}/first-run/` },
  },
  {
    id: '7b-long-run',
    number: '02',
    title: { zh: '7B 长周期实验', en: '7B long-run experiment' },
    summary: { zh: '7B 在长周期训练中持续产生参数更新；训练结束后冻结模型，再进入独立的最终测试。', en: 'The 7B long run continued producing parameter updates; after training, the model was frozen before an independent final evaluation.' },
    motivation: { zh: '删除旧更新门槛后，观察 7B 在固定资源预算里能否持续产生参数更新，并在训练结束后做冻结终评。', en: 'After removing the old update gate, observe whether 7B can keep producing parameter updates under a fixed budget and then measure the frozen final model.' },
    primaryHref: `${cap}/stage2-ceiling/`,
    status: 'completed',
    childLinks: [
      { role: 'result', label: { zh: '7B 最终结果', en: '7B final result' }, href: `${cap}/stage2-ceiling/` },
      { role: 'analysis', label: { zh: '7B SD-LoRA / 参数变化分析', en: '7B SD-LoRA / parameter-change analysis' }, href: `${cap}/stage2-7b-analysis/` },
    ],
    evidenceLink: { role: 'evidence', label: { zh: '7B 冻结结果与归档依据', en: '7B frozen-result and archive evidence' }, href: `${cap}/stage2-ceiling/#ceiling-7b-final-closeout` },
  },
  {
    id: 'successor-3b-1p7b',
    number: '03',
    title: { zh: '3B + 1.7B 后继实验', en: '3B + 1.7B successor experiment' },
    summary: { zh: '旧 3B 暴露购物接口和动作格式问题后，我们固定共同购物规则，分别用 3B 和 1.7B 继续做实验。', en: 'After the old 3B run exposed shopping-interface and action-format problems, the successor experiment fixed shared shopping rules and continued separately with 3B and 1.7B.' },
    motivation: { zh: '旧 3B 暴露动作接口问题后，用同一套购物规则重新建立 3B 和 1.7B 的可解释起点，再分别继续学习。', en: 'After the old 3B run exposed action-interface problems, rebuild an interpretable starting point for 3B and 1.7B under the same shopping rules before continuing learning separately.' },
    primaryHref: `${cap}/openevo-2-0/`,
    status: 'completed',
    childLinks: [
      { role: 'result', label: { zh: '3B + 1.7B 实验总览', en: '3B + 1.7B experiment overview' }, href: `${cap}/openevo-2-0/` },
      { role: 'evidence', label: { zh: '研究报告', en: 'Research report' }, href: `${cap}/openevo-2-0/report/` },
      { role: 'diagnostic', label: { zh: '购物接口与排查过程', en: 'Shopping-interface diagnosis' }, href: `${cap}/openevo-2-0/exploration/` },
      { role: 'diagnostic', label: { zh: 'Harness 2.0 接口对照实验', en: 'Harness 2.0 interface comparison' }, href: `${cap}/openevo-2-0/harness-2-0/` },
    ],
    evidenceLink: { role: 'evidence', label: { zh: '研究报告与实验依据', en: 'Research report and experiment evidence' }, href: `${cap}/openevo-2-0/report/` },
  },
  {
    id: 'gdr-v1-1p7b',
    number: '04',
    title: { zh: '1.7B · GDR-v1 实验', en: '1.7B · GDR-v1 experiment' },
    summary: { zh: '这条 1.7B 线反复产生 SD-LoRA 候选，但 GDR-v1 只让少数候选进入后续模型；训练结束后另做冻结终评。', en: 'This 1.7B line repeatedly produced SD-LoRA candidates, but GDR-v1 admitted only a small subset into later model states; a frozen final followed after training.' },
    motivation: { zh: '检查短期 task-score 小测作为 candidate 准入规则时，会不会过早拒绝已经训练出来的 SD-LoRA 更新。', en: 'Test whether a short-horizon task-score probe used as the candidate-admission rule rejects trained SD-LoRA updates too early.' },
    primaryHref: `${cap}/gdr-directapply/`,
    status: 'historical',
    lineageNote: { zh: '它同时属于上一项 3B + 1.7B 后继实验；这里单独列出来，是因为它后来引出了 GDR 机制问题。', en: 'It is also the 1.7B arm of the successor experiment above; it is listed separately here because it later became the subject of the GDR mechanism question.' },
    childLinks: [
      { role: 'result', label: { zh: '这条 1.7B 的冻结结果', en: 'Frozen result for this 1.7B line' }, href: `${cap}/openevo-2-0/report/` },
      { role: 'analysis', label: { zh: 'GDR-v1 为什么拒绝了大多数候选更新', en: 'Why GDR-v1 rejected most candidate updates' }, href: `${cap}/gdr-directapply/` },
      { role: 'mechanism', label: { zh: '当前 Gated-Delta SD-LoRA：从 admission gate 到 recurrent write', en: 'Current Gated-Delta SD-LoRA: from admission gate to recurrent write' }, href: `${cap}/gated-delta-sd-lora/` },
    ],
    evidenceLink: { role: 'evidence', label: { zh: 'GDR-v1 原始运行依据', en: 'GDR-v1 raw run evidence' }, href: `${cap}/gdr-directapply/#technical-evidence` },
  },
  {
    id: 'directapply-1p7b',
    number: '05',
    title: { zh: '1.7B · DirectApply / No-GDR 实验', en: '1.7B · DirectApply / No-GDR experiment' },
    summary: { zh: '这次实验去掉 GDR-v1 的短期否决权，合法的 SD-LoRA 候选直接进入下一轮；完整训练与一次冻结终评都已经完成。', en: 'This experiment removed GDR-v1’s short-horizon veto, so valid SD-LoRA candidates entered the next round directly; the full training run and one frozen final are complete.' },
    motivation: { zh: '移除 GDR-v1 的短期 task-score 否决，让通过工程合同的候选继续进入下一轮，再观察长期学习轨迹和参数历史。', en: 'Remove GDR-v1’s short-horizon task-score veto, let candidates that pass engineering contracts enter the next round, and observe the longer learning trajectory and parameter history.' },
    primaryHref: `${cap}/q17-directapply-analysis/`,
    status: 'completed',
    childLinks: [
      { role: 'analysis', label: { zh: '完整实验分析', en: 'Full experiment analysis' }, href: `${cap}/q17-directapply-analysis/` },
      { role: 'diagnostic', label: { zh: 'R127 / R128 同题诊断', en: 'R127 / R128 same-task diagnostic' }, href: `${cap}/q17-directapply-frontier/` },
      { role: 'analysis', label: { zh: 'SD-LoRA 为什么越来越慢', en: 'Why SD-LoRA gets slower over time' }, href: `${cap}/sd-lora-scaling/` },
      { role: 'analysis', label: { zh: '两条路线说明', en: 'How the two lines differ' }, href: `${cap}/sd-lora-history/`, mobileFeatured: true, directoryGroup: sdLoraAccelerationDirectoryGroup },
      { role: 'analysis', label: { zh: 'Stable Reduction', en: 'Stable Reduction' }, href: `${cap}/sd-lora-equivalence/`, mobileFeatured: true, directoryGroup: sdLoraAccelerationDirectoryGroup },
      { role: 'analysis', label: { zh: 'Bounded Online Recurrence', en: 'Bounded Online Recurrence' }, href: `${cap}/sd-lora-bounded-state/`, mobileFeatured: true, directoryGroup: sdLoraAccelerationDirectoryGroup },
      { role: 'analysis', label: { zh: '后继三组对比：普通 / Bounded / β-gating（α 固定为 1）', en: 'Three-way successor: baseline / Bounded / β-gating (α fixed at 1)' }, href: `${cap}/bounded-effective-state-gdr/` },
      { role: 'analysis', label: { zh: 'Text Memory 在这条线里发生了什么', en: 'What happened to Text Memory in this line' }, href: `${cap}/text-memory/` },
      { role: 'analysis', label: { zh: 'D1 参数几何：更新方向能否低维近似', en: 'D1 geometry: can the update trajectory be approximated in fewer directions?' }, href: `${cap}/q17-directapply-analysis/#geometry` },
      { role: 'diagnostic', label: { zh: 'D1 行为保持：压缩后还是同一个模型吗', en: 'D1 function preservation: is the compressed model still equivalent?' }, href: `${cap}/q17-directapply-analysis/#function` },
    ],
    evidenceLink: { role: 'evidence', label: { zh: '冻结 final 与原始依据', en: 'Frozen final and raw evidence' }, href: `${cap}/q17-directapply-analysis/#final` },
  },
  {
    id: 'bounded-effective-state-1p7b',
    number: '06',
    title: { zh: '1.7B · 普通 OpenEVO / Bounded / β-gating（α 固定为 1）', en: '1.7B · OpenEVO / Bounded / β-gating (α fixed at 1)' },
    summary: { zh: '我们比较了普通 OpenEVO、把历史压成固定 rank128 State 的 Bounded Online Recurrence，以及在 α 固定为 1 的条件下只启用动态 β-gating 的版本；三组最终模型使用同一冻结 128 题。动态 α + 动态 β 尚未运行。', en: 'We compare ordinary OpenEVO, fixed-rank128 Bounded Online Recurrence, and a dynamic β-gating treatment with α fixed at 1; all three final models use the same frozen 128-task panel. Dynamic α + dynamic β has not been run.' },
    motivation: { zh: '普通 SD-LoRA 历史越积越多、参数更新越来越慢；先用 Bounded Online Recurrence 把历史压成固定 rank128 State，再测试动态 β 能否更好地控制新经验写入；这一版 α 固定为 1。', en: 'Growing SD-LoRA history makes parameter updates slower; first compress history into a fixed rank128 State with Bounded Online Recurrence, then test whether dynamic β better controls new writes while α remains fixed at 1.' },
    primaryHref: `${cap}/bounded-effective-state-gdr/`,
    status: 'completed',
    lineageNote: { zh: '普通 OpenEVO 是更早独立完成的一条线；Bounded Online Recurrence 与 β-gating（α 固定为 1）才是这次预注册的匹配对照。动态 α + 动态 β 尚未运行。三种已完成最终模型使用同一冻结 128 题，因此 Final 可以做描述性同题比较。', en: 'Ordinary OpenEVO is an earlier independent run; Bounded Online Recurrence and β-gating (α fixed at 1) form the preregistered matched contrast. Dynamic α + dynamic β has not been run. The three completed final models use the same frozen 128-task panel, so their finals can be compared descriptively.' },
    childLinks: [
      { role: 'result', label: { zh: '三组实验、方法与冻结终评', en: 'Three experiments, methods, and frozen final' }, href: `${cap}/bounded-effective-state-gdr/` },
      { role: 'analysis', label: { zh: 'Bounded Online Recurrence 如何固定 rank128 State', en: 'How Bounded Online Recurrence fixes a rank128 State' }, href: `${cap}/sd-lora-bounded-state/` },
      { role: 'analysis', label: { zh: '普通 OpenEVO 的独立实验', en: 'Standalone ordinary OpenEVO experiment' }, href: `${cap}/q17-directapply-analysis/#final` },
      { role: 'mechanism', label: { zh: 'Gated Delta 从哪里来，以及本实验为什么只有 β-gating（α 固定为 1）', en: 'Where Gated Delta comes from, and why this study only uses β-gating (α fixed at 1)' }, href: `${cap}/bounded-effective-state-gdr/#method` },
    ],
    evidenceLink: { role: 'evidence', label: { zh: '最终收口与公开证据', en: 'Final closeout and public evidence' }, href: `${cap}/bounded-effective-state-gdr/#evidence` },
  },
];


export const OPEN_EVO_CANONICAL_ROUTE_OWNERS: Readonly<Record<string, OpenEvoExperimentId>> = {
  'stage2-256-window': 'gate-no-update',
  'first-run': 'gate-no-update',
  'stage2-ceiling': '7b-long-run',
  'stage2-7b-analysis': '7b-long-run',
  'openevo-2-0': 'successor-3b-1p7b',
  'openevo-2-0/report': 'successor-3b-1p7b',
  'openevo-2-0/exploration': 'successor-3b-1p7b',
  'openevo-2-0/harness-2-0': 'successor-3b-1p7b',
  'stage1-evolution': 'successor-3b-1p7b',
  'gdr-directapply': 'gdr-v1-1p7b',
  'bounded-effective-state-gdr': 'bounded-effective-state-1p7b',
  'q17-directapply-analysis': 'directapply-1p7b',
  'q17-directapply-frontier': 'directapply-1p7b',
  'sd-lora-scaling': 'directapply-1p7b',
  'sd-lora-history': 'directapply-1p7b',
  'sd-lora-equivalence': 'directapply-1p7b',
  'sd-lora-history-novelty': 'directapply-1p7b',
  'sd-lora-present-function': 'directapply-1p7b',
  'sd-lora-future-learning': 'directapply-1p7b',
  'sd-lora-bounded-state': 'directapply-1p7b',
  'sd-lora-bounded-acceleration': 'directapply-1p7b',
  'text-memory': 'directapply-1p7b',
};

export type OpenEvoSecondaryRouteId = 'method-background' | 'cross-experiment-results' | 'reproduction';

export interface OpenEvoSecondaryRoute {
  id: OpenEvoSecondaryRouteId;
  label: LocalizedCopy;
  href: string;
}

export const OPEN_EVO_METHOD_BACKGROUND_ROUTE = {
  id: 'method-background',
  label: { zh: '系统 / 方法背景', en: 'System / method background' },
  href: '/research/seed-openevo/flow/',
} satisfies OpenEvoSecondaryRoute;

export const OPEN_EVO_CROSS_EXPERIMENT_RESULTS_ROUTE = {
  id: 'cross-experiment-results',
  label: { zh: '跨实验结果索引', en: 'Cross-experiment results index' },
  href: '/research/seed-openevo/study/results/',
} satisfies OpenEvoSecondaryRoute;

export const OPEN_EVO_SECONDARY_ROUTES = [
  OPEN_EVO_METHOD_BACKGROUND_ROUTE,
  OPEN_EVO_CROSS_EXPERIMENT_RESULTS_ROUTE,
  { id: 'reproduction', label: { zh: '复现实验', en: 'Reproduce experiments' }, href: '/research/seed-openevo/study/run/' },
] satisfies OpenEvoSecondaryRoute[];
