/**
 * "学长十问"面向忙碌导师的首读决策摘要。
 * 这是既有证据的阅读投影，不覆盖 openEvoAdvisorTenQuestions.ts 的科研权威。
 * 每条结果必须同时包含局部证据边界；未完成项不得呈现为已运行结果。
 */
export const ADVISOR_DECISION_BRIEF = {
  researchQuestion: 'OpenEVO 能否在反复完成购物任务后继续保持能力，同时控制长期参数的体积与更新成本？',
  evidence: [
    {
      id: 'q04',
      kind: 'partial',
      finding: '在训练末尾 8 轮，长期参数文件从约 205.6 MB 缩至 51.4 MB（约减少 75%）；同题平均成绩低 1.79 分。',
      boundary: '95% 配对区间为 −3.68 到 +0.12 分；这还不能证明长期使用小容量不会损失能力。',
    },
    {
      id: 'q07',
      kind: 'bounded-answer',
      finding: '把 Bounded 第 156 轮的一次参数更新方向反转，同一批 64 道题的平均成绩下降 10.06 分。',
      boundary: '这一局部因果结果通过多重比较校正，不能推广为所有方法和训练轮次的规律。',
    },
  ],
  unresolved: [
    {
      id: 'q10',
      state: 'unrun',
      fact: '新 128 道确认题已冻结，但三条独立长程训练流及冻结新题的正式成绩尚未完成。',
    },
    {
      id: 'q03',
      state: 'unrun',
      fact: 'SEED 的工程与开发题检查已有结果，按论文条件的正式独立复现仍未完成。',
    },
  ],
  historicalBoundary: '三条历史路线的 128 题终评不是完全严格的训练对照，不能用分数直接判定方法优劣。',
  nextDecision: '建议先完成 Q10 的独立新任务配对评测，再完成 Q03 的论文口径校准与正式复现，之后核对 Q04 小容量较长时间学习的表现。',
  decisionStatus: 'proposal',
  decisionBoundary: '以上是研究优先次序的建议，正式训练尚未据此启动，也不代表导师已经批准。',
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
