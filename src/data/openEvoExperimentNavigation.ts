export type LocalizedCopy = { zh: string; en: string };

export type ExperimentChildRole =
  | 'result'
  | 'analysis'
  | 'mechanism'
  | 'diagnostic'
  | 'history'
  | 'evidence';

export type ExperimentStatus = 'historical' | 'completed';

export interface OpenEvoExperimentChildLink {
  role: ExperimentChildRole;
  label: LocalizedCopy;
  href: string;
}

export interface OpenEvoExperimentNavigationItem {
  id: string;
  number: string;
  title: LocalizedCopy;
  summary: LocalizedCopy;
  primaryHref: string;
  childLinks: OpenEvoExperimentChildLink[];
  lineageNote?: LocalizedCopy;
  status: ExperimentStatus;
}

const cap = '/research/seed-openevo/study/capability-exploration';
export const OPEN_EVO_EXPERIMENTS: OpenEvoExperimentNavigationItem[] = [
  {
    id: 'gate-no-update',
    number: '01',
    title: { zh: '训练跑了很久，但参数一直没有更新', en: 'Training ran for a long time, but the parameters never updated' },
    summary: { zh: '旧 Stage 2 做了很多任务，也收集到了成功轨迹；但旧 Gate 要求至少 8 个不同任务重复成功，最好的一批只有 7 个，所以没有触发参数更新。', en: 'The old Stage 2 collected successful trajectories, but its gate required repeated success on at least eight distinct tasks. The best block reached seven, so no parameter update fired.' },
    primaryHref: `${cap}/stage2-256-window/`,
    status: 'historical',
    childLinks: [
      { role: 'analysis', label: { zh: '旧 Gate 为什么卡住了更新', en: 'Why the old gate blocked updates' }, href: `${cap}/stage2-256-window/` },
      { role: 'history', label: { zh: '第一轮 3B / 7B 实验记录', en: 'First 3B / 7B experiment record' }, href: `${cap}/first-run/` },
    ],
  },
  {
    id: '7b-long-run',
    number: '02',
    title: { zh: '7B 长周期实验', en: '7B long-run experiment' },
    summary: { zh: '7B 完成 149 轮学习后冻结模型，再打开 128 道最终测试题：49.33 / 100，58 / 128 完全成功。', en: 'After 149 learning rounds, the 7B model was frozen and evaluated on 128 final tasks: 49.33 / 100 with 58 / 128 exact successes.' },
    primaryHref: `${cap}/stage2-ceiling/`,
    status: 'completed',
    childLinks: [
      { role: 'result', label: { zh: '7B 最终结果', en: '7B final result' }, href: `${cap}/stage2-ceiling/` },
      { role: 'analysis', label: { zh: '7B SD-LoRA / 参数变化分析', en: '7B SD-LoRA / parameter-change analysis' }, href: `${cap}/stage2-7b-analysis/` },
    ],
  },
  {
    id: 'successor-3b-1p7b',
    number: '03',
    title: { zh: '3B + 1.7B 后继实验', en: '3B + 1.7B successor experiment' },
    summary: { zh: '旧 3B 暴露购物接口和动作格式问题后，我们固定共同购物规则，分别用 3B 和 1.7B 继续做实验。', en: 'After the old 3B run exposed shopping-interface and action-format problems, the successor experiment fixed shared shopping rules and continued separately with 3B and 1.7B.' },
    primaryHref: `${cap}/openevo-2-0/`,
    status: 'completed',
    childLinks: [
      { role: 'result', label: { zh: '3B + 1.7B 实验总览', en: '3B + 1.7B experiment overview' }, href: `${cap}/openevo-2-0/` },
      { role: 'evidence', label: { zh: '研究报告', en: 'Research report' }, href: `${cap}/openevo-2-0/report/` },
      { role: 'diagnostic', label: { zh: '购物接口与排查过程', en: 'Shopping-interface diagnosis' }, href: `${cap}/openevo-2-0/exploration/` },
      { role: 'diagnostic', label: { zh: 'Harness 2.0 接口对照实验', en: 'Harness 2.0 interface comparison' }, href: `${cap}/openevo-2-0/harness-2-0/` },
    ],
  },
  {
    id: 'gdr-v1-1p7b',
    number: '04',
    title: { zh: '1.7B · GDR-v1 实验', en: '1.7B · GDR-v1 experiment' },
    summary: { zh: '这条 1.7B 线一共产生 44 个 SD-LoRA 候选，但 GDR-v1 只让 7 个进入后续模型；冻结终评为 37.60 / 100，1 / 128 完全成功。', en: 'This 1.7B line produced 44 SD-LoRA candidates, but GDR-v1 admitted only seven into later model states. Its frozen final was 37.60 / 100 with 1 / 128 exact success.' },
    primaryHref: `${cap}/gdr-directapply/`,
    status: 'historical',
    lineageNote: { zh: '它同时属于上一项 3B + 1.7B 后继实验；这里单独列出来，是因为它后来引出了 GDR 机制问题。', en: 'It is also the 1.7B arm of the successor experiment above; it is listed separately here because it later became the subject of the GDR mechanism question.' },
    childLinks: [
      { role: 'result', label: { zh: '这条 1.7B 的冻结结果', en: 'Frozen result for this 1.7B line' }, href: `${cap}/openevo-2-0/report/` },
      { role: 'analysis', label: { zh: 'GDR-v1 为什么 44 个候选只留下 7 个', en: 'Why GDR-v1 kept only 7 of 44 candidates' }, href: `${cap}/gdr-directapply/` },
      { role: 'mechanism', label: { zh: 'Vanilla SD-LoRA 一轮怎样产生候选参数', en: 'How one Vanilla SD-LoRA round produces a candidate' }, href: `${cap}/vanilla-sd-lora/` },
      { role: 'mechanism', label: { zh: '本地 GDR-v1 与原始 Gated Delta Rule 的区别', en: 'Local GDR-v1 versus the original Gated Delta Rule' }, href: `${cap}/gdr-directapply/#original-gated-delta` },
    ],
  },
  {
    id: 'directapply-1p7b',
    number: '05',
    title: { zh: '1.7B · DirectApply / No-GDR 实验', en: '1.7B · DirectApply / No-GDR experiment' },
    summary: { zh: '这次实验去掉 GDR-v1 的短期否决权，合法的 SD-LoRA 候选直接进入下一轮；160 轮训练和一次冻结终评都已经完成。', en: 'This experiment removed GDR-v1’s short-horizon veto, so valid SD-LoRA candidates entered the next round directly. All 160 training rounds and one frozen final are complete.' },
    primaryHref: `${cap}/q17-directapply-analysis/`,
    status: 'completed',
    childLinks: [
      { role: 'analysis', label: { zh: '完整 160 轮实验分析', en: 'Full 160-round experiment analysis' }, href: `${cap}/q17-directapply-analysis/` },
      { role: 'diagnostic', label: { zh: 'R127 / R128 同题诊断', en: 'R127 / R128 same-task diagnostic' }, href: `${cap}/q17-directapply-frontier/` },
      { role: 'analysis', label: { zh: 'SD-LoRA 为什么越来越慢', en: 'Why SD-LoRA gets slower over time' }, href: `${cap}/sd-lora-scaling/` },
      { role: 'analysis', label: { zh: 'SD-LoRA 历史专题：已测结果与待验证问题', en: 'SD-LoRA history series: measured results and open questions' }, href: `${cap}/sd-lora-history/` },
      { role: 'analysis', label: { zh: 'Text Memory 在这条线里发生了什么', en: 'What happened to Text Memory in this line' }, href: `${cap}/text-memory/` },
      { role: 'analysis', label: { zh: 'D1 参数几何：159 次更新能否低维近似', en: 'D1 geometry: can 159 updates be approximated in fewer directions?' }, href: `${cap}/q17-directapply-analysis/#geometry` },
      { role: 'diagnostic', label: { zh: 'D1 行为保持：压缩后还是同一个模型吗', en: 'D1 function preservation: is the compressed model still equivalent?' }, href: `${cap}/q17-directapply-analysis/#function` },
    ],
  },
];

export const OPEN_EVO_SECONDARY_ROUTES = [
  { label: { zh: '实验流程背景', en: 'Experiment flow background' }, href: '/research/seed-openevo/flow/' },
  { label: { zh: '跨实验结果索引', en: 'Cross-experiment results index' }, href: '/research/seed-openevo/study/results/' },
  { label: { zh: '复现实验', en: 'Reproduce experiments' }, href: '/research/seed-openevo/study/run/' },
] satisfies Array<{ label: LocalizedCopy; href: string }>;
