/**
 * "L 学长十问"面向忙碌导师的首读决策摘要。
 * 这是既有证据的阅读投影，不覆盖 openEvoAdvisorTenQuestions.ts 的科研权威。
 * 每条结果必须同时包含局部证据边界；未完成项不得呈现为已运行结果。
 */
export const ADVISOR_DECISION_BRIEF = {
  researchQuestion: '长期学习能否保留做题能力、控制长期参数体积与更新成本？Q10已有开发评测，完整长期方案由用户暂停；新题确认仍未完成。',
  evidence: [
    {
      id: 'q04',
      kind: 'partial',
      finding: '训练末尾第 152–159 轮同题比较：rank128 文件 205.6 MB，rank32 为 51.4 MB（少约 75%），rank32 均分低 1.79 分。',
      boundary: '95% 配对区间 −3.68 到 +0.12 分；不能证明从更早轮次开始长期使用 rank32 也能保持能力。',
    },
    {
      id: 'q07',
      kind: 'bounded-answer',
      finding: '在 Bounded 最终W159上把第 156 轮历史参数更新方向反过来（幅度不变），重做同一批 64 题，均分下降 10.06 分。',
      boundary: '开发题局部结果通过Holm校正；已付128次新题评测中完整模型70.61分、反转62.79分，差−7.82分，联合八项校正区间为 −18.00 至 +1.46 分未确认。沿用同谱系、非独立起点，缺匹配删除对照，不能隔离方向与范数作用。',
    },
  ],
  unresolved: [
    {
      id: 'q10',
      state: 'partial',
      fact: 'Q10已启动过、当前OWNER_PAUSED。单流R12开发评测192次：起点26.66、参照45.22、配方33.90分；配方减参照−11.33分，探索性未校正区间为 −20.87 至 −1.86 分；减起点+7.23分，区间为 −1.74 至 +16.00 分。新128题已冻结，三流160轮及新题确认未完成；本次评测新增训练0。',
    },
    {
      id: 'q03',
      state: 'unrun',
      fact: 'SEED 工程与开发题已有结果，但论文条件下的正式独立复现仍未完成。',
    },
  ],
  historicalBoundary: '三条历史路线并非严格训练对照，不能凭终评分数排方法优劣。',
  nextDecision: '先讨论Q10开发负结果及是否恢复；若用户明确恢复，再按原方案完成长期与新题配对验证。并核对Q03论文口径、Q04长期小容量学习的证据缺口。',
  decisionStatus: 'proposal',
  decisionBoundary: '这是研究优先顺序建议；Q10已有历史启动和开发结果，当前暂停保持有效，建议不构成自动恢复或导师批准。',
} as const;

/**
 * 机械防漏：只能保证结果、边界、未完成和下一决策均有表达。
 * 对含义的冷读理解仍需独立读者；不能把此检查当作理解已通过。
 */
export function validateAdvisorDecisionBrief(brief: typeof ADVISOR_DECISION_BRIEF | {
  evidence: readonly { id: string; kind: string; finding: string; boundary: string }[];
  unresolved: readonly { id: string; state: string; fact: string }[];
  nextDecision: string;
  decisionStatus: string;
  decisionBoundary: string;
}): string[] {
  const errors: string[] = [];
  for (const finding of brief.evidence) {
    if (!finding.finding.trim() || !finding.boundary.trim()) errors.push(`missing evidence/boundary: ${finding.id}`);
    if (!['partial', 'bounded-answer'].includes(finding.kind)) errors.push(`unsupported evidence state: ${finding.id}`);
  }
  for (const gap of brief.unresolved) {
    if (!['unrun', 'partial'].includes(gap.state) || !gap.fact.trim()) errors.push(`unverified work marked as done: ${gap.id}`);
  }
  if (!['q03', 'q10'].every(id=>brief.unresolved.some(item=>item.id===id)))
    errors.push('formal reproduction or generalization gap missing');
  if (!brief.nextDecision.trim() || brief.decisionStatus!=='proposal' || !brief.decisionBoundary.trim())
    errors.push('next decision scope missing or upgraded to execution');
  return errors;
}
