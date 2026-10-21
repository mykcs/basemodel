/**
 * "学长十问"面向忙碌导师的首读决策摘要。
 * 这是既有证据的阅读投影，不覆盖 openEvoAdvisorTenQuestions.ts 的科研权威。
 * 每条结果必须同时包含局部证据边界；未完成项不得呈现为已运行结果。
 */
export const ADVISOR_DECISION_BRIEF = {
  researchQuestion: '长期学习能否保留做题能力、控制长期参数体积与更新成本？建议先测 Q10 新题；后续方案待确认，正式训练未据此启动。',
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
      finding: '把 Bounded 模型第 156 轮的参数更新方向反过来（幅度不变），重做同一批 64 题，均分下降 10.06 分。',
      boundary: '局部因果结果已经通过 Holm 多重比较校正，但不能推广到其他轮次、方法或新题。',
    },
  ],
  unresolved: [
    {
      id: 'q10',
      state: 'unrun',
      fact: '新 128 题已冻结；三条独立长程训练流与正式新题成绩尚未完成。',
    },
    {
      id: 'q03',
      state: 'unrun',
      fact: 'SEED 工程与开发题已有结果，但论文条件下的正式独立复现仍未完成。',
    },
  ],
  historicalBoundary: '三条历史路线并非严格训练对照，不能凭终评分数排方法优劣。',
  nextDecision: '先做 Q10 新题配对评测，再核对 Q03 的论文口径并正式复现，最后检验 Q04 的长期小容量学习。',
  decisionStatus: 'proposal',
  decisionBoundary: '这是研究优先顺序建议；正式训练尚未据此启动，也不代表导师已经批准。',
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
    if (gap.state !== 'unrun' || !gap.fact.trim()) errors.push(`unverified work marked as done: ${gap.id}`);
  }
  if (!['q03', 'q10'].every(id=>brief.unresolved.some(item=>item.id===id)))
    errors.push('formal reproduction or generalization gap missing');
  if (!brief.nextDecision.trim() || brief.decisionStatus!=='proposal' || !brief.decisionBoundary.trim())
    errors.push('next decision scope missing or upgraded to execution');
  return errors;
}
