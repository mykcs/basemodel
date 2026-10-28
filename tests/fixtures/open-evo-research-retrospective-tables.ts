/** New tables added by the advisor retrospective; the historical table receipt stays immutable.
 * Numeric sources: H1.39-MR@2c05d2692 and advisor-report-20261028@95343f53f.
 * Q04 values are scaled from [0,1] to /100 and rounded to two decimal places.
 */
export const RETROSPECTIVE_NUMERIC_CELLS = [
  ['模型比较', '平均分差', '95% 区间', '普通 LoRA − 基础模型', '+16.37', '+7.81 至 +25.19', 'SD-LoRA − 基础模型', '+24.88', '+16.42 至 +33.65'],
  ['保存的模型', 'Task Score', '完整成功', '起始模型', '26.66', '1 / 64', '第12轮参照模型', '45.22', '7 / 64', '第12轮简化配方', '33.90', '2 / 64'],
  ['训练流／容量', '平均分差', '校正后的95%区间', '流1 · rank32', '+0.56', '−5.35 至 +8.05', '流1 · rank64', '+3.29', '−6.16 至 +13.88', '流2 · rank32', '−0.95', '−9.21 至 +7.80', '流2 · rank64', '−2.65', '−9.96 至 +3.91'],
] as const;
export const RETROSPECTIVE_QUESTION_LABELS = ['训练何时停止', '怎样打好学习基础', 'SEED基线', '参数记忆需要多大', '写入控制是否有益', '能否提前预警做错题', '更新方向的作用', '旧知识是否遗忘', '文字经验是否有益', '长期学习能否迁移到新题'];
