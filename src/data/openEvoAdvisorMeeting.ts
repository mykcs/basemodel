// Historical questions from the 2026-09-22 meeting, not later experiment results.
export const OPEN_EVO_ADVISOR_MEETING = {
  date: '2026-09-22',
  sourceHref: 'https://github.com/mykcs/openevo-experiment/blob/main/docs/science/webshop/reports/ADVISOR_RESEARCH_RECONCILIATION_2026-09-28.md',
  points: [
    { title: '先把学习方式拆开', text: '分清普通 SFT、普通 OPSD 与 SD-LoRA 持续更新。先在同一批经验上比较如何学出一套参数，再看长期演化。' },
    { title: '用验证能力判断训练轮数', text: 'training loss 继续下降，不代表 WebShop 能力继续提高。检查 120 轮附近是否已经达到平台，而不是默认需要 160 轮或更久。' },
    { title: '先验证状态容量，再加复杂机制', text: 'rank128 是否过大，需要真正的容量对照。谱中的少数主方向只是线索，不能直接说明 rank8 就足够保留能力。' },
    { title: '把更新方向与更新强度分开', text: 'β 原本希望控制写入强度，但当时的结果出现了明显的方向变化。先检验更简单的方案：对每轮 LoRA 更新归一化后加权，保持更新方向。' },
    { title: '看更具体的行为诊断', text: 'WebShop 主要是 search 和 click，仅看动作类型熵不够。进一步观察点了哪里、click 参数、token-level entropy，以及掉分时的 Task Vector 变化。' },
    { title: '先让一个简单设定真正有效', text: '先把 WebShop 上一个 LoRA、一套参数的演化做好，再扩展到更复杂的 continual/meta-learning 叙事。' },
  ],
} as const;
