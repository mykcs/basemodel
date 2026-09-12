export type SdLoraHistorySeriesRoute =
  | 'vanilla-sd-lora'
  | 'sd-lora-scaling'
  | 'sd-lora-equivalence'
  | 'sd-lora-history-novelty'
  | 'sd-lora-present-function'
  | 'sd-lora-future-learning'
  | 'sd-lora-bounded-state';

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
    title: { zh: '为什么“一起算”很快，却可能不再等价？', en: 'Why can faster grouped compute stop being equivalent?' },
    summary: { zh: '这页将解释 BF16、backward 和梯度累加顺序为什么会改变训练轨迹。', en: 'This page will explain how BF16, backward, and gradient accumulation can alter the training trajectory.' },
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
    title: { zh: '能不能把无限历史变成固定大小的学习状态？', en: 'Can unbounded history become a fixed-size learning state?' },
    summary: { zh: '只有前面的科学问题回答清楚以后，才讨论 bounded state、GDR、WY 和 chunkwise。', en: 'Only after the earlier scientific questions are answered do bounded state, GDR, WY, and chunkwise become method candidates.' },
  },
] as const satisfies readonly {
  route: SdLoraHistorySeriesRoute;
  number: string;
  title: { zh: string; en: string };
  summary: { zh: string; en: string };
}[];
