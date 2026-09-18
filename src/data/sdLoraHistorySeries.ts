export type SdLoraHistorySeriesRoute =
  | 'vanilla-sd-lora'
  | 'sd-lora-scaling'
  | 'sd-lora-equivalence'
  | 'sd-lora-history-novelty'
  | 'sd-lora-present-function'
  | 'sd-lora-future-learning'
  | 'sd-lora-bounded-state'
  | 'bounded-effective-state-gdr';

export const SD_LORA_HISTORY_OVERVIEW_ROUTE = 'sd-lora-history' as const;

export const SD_LORA_HISTORY_SERIES = [
  {
    route: 'vanilla-sd-lora', number: '01',
    title: { zh: 'Vanilla SD-LoRA 是怎么学习的？', en: 'How does Vanilla SD-LoRA learn?' },
    summary: { zh: '先看一轮更新怎样把新经验变成不断增长的参数历史。', en: 'Start with how one update turns new experience into a growing parameter history.' },
  },
  {
    route: 'sd-lora-scaling', number: '02',
    title: { zh: '为什么历史越多，SD-LoRA 越慢？', en: 'Why does more history make SD-LoRA slower?' },
    summary: { zh: '把 component 数量和一次参数更新的计算成本放到一起看。', en: 'Connect component count to the compute cost of one parameter update.' },
  },
  {
    route: 'sd-lora-equivalence', number: '03',
    title: { zh: 'SD-LoRA v2 · Stable Reduction 改了什么？', en: 'What does SD-LoRA v2 · Stable Reduction change?' },
    summary: { zh: '历史 component 仍然逐个保留；新的 treatment 用 chunk 16 和 FP32 跨 component 归约，把 matched 8-step trainer 加速到约 2×。', en: 'Historical components remain individually retained; the new treatment uses chunk 16 and FP32 cross-component reduction for about 2× speedup in the matched eight-step trainer.' },
  },
  {
    route: 'sd-lora-history-novelty', number: '04',
    title: { zh: '模型一直更新，但真的一直在学新东西吗？', en: 'Does every update really add something new?' },
    summary: { zh: '把不断增长的 component 数与有效维度、更新新颖度和平台期放到同一张图里。', en: 'Compare growing component count with effective dimension, update novelty, and the score plateau.' },
  },
  {
    route: 'sd-lora-present-function', number: '05',
    title: { zh: '如果压缩历史，今天的模型还一样吗？', en: 'If history is compressed, is the model still the same today?' },
    summary: { zh: '研究哪些历史可以删、合并或投影，同时保留当前行为。', en: 'Study which history can be removed, merged, or projected while preserving current behavior.' },
  },
  {
    route: 'sd-lora-future-learning', number: '06',
    title: { zh: '今天一样，明天继续学习还会一样吗？', en: 'If models match today, will they keep learning the same way tomorrow?' },
    summary: { zh: '让完整历史和压缩状态接受完全相同的未来经验，比较后续学习轨迹。', en: 'Give full-history and compressed states the same future experience and compare their later learning trajectories.' },
  },
  {
    route: 'sd-lora-bounded-state', number: '07',
    title: { zh: 'Bounded Online Recurrence 把历史固定在 rank128', en: 'Bounded Online Recurrence keeps history at rank128' },
    summary: { zh: 'R150–R159 连续更新里，历史状态始终 rank128、每轮新更新 rank8；行为 gate 全部 PASS，同轮 Vanilla trainer 对比平均约快 37×。', en: 'Across recurrent R150–R159 updates, the historical state stays rank128 and each new update is rank8; behavior gates pass, with about 37× mean trainer speedup versus same-round Vanilla.' },
  },
  {
    route: 'bounded-effective-state-gdr', number: '08',
    title: { zh: '固定 rank128 以后，怎样控制新经验写多强？', en: 'After fixing rank128, how strongly should new experience be written?' },
    summary: { zh: '160 轮 OFF/ON 已封存：训练期 R1–R159 reward 差值为 +0.025，95% 区间跨 0；同一冻结 128 题终评为 OFF 45.98、ON 20.77。', en: 'The 160-round OFF/ON study is sealed: the R1–R159 training-period reward delta is +0.025 with a 95% interval crossing zero; on the same frozen 128-task final, OFF scores 45.98 and ON 20.77.' },
  },
] as const satisfies readonly {
  route: SdLoraHistorySeriesRoute;
  number: string;
  title: { zh: string; en: string };
  summary: { zh: string; en: string };
}[];
