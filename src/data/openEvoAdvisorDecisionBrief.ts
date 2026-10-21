/**
 * "学长十问"面向忙碌导师的首读决策摘要。
 * 这是既有证据的阅读投影，不覆盖 openEvoAdvisorTenQuestions.ts 的科研权威。
 * 每条结果必须同时包含局部证据边界；未完成项不得呈现为已运行结果。
 */
export const ADVISOR_DECISION_BRIEF = {
  researchQuestion: 'OpenEVO 能否持续保持做题能力，同时控制长期参数体积与更新成本？后续实验只是研究建议，尚未获导师批准，也尚未正式启动。',
  evidence: [
    {
      id: 'q04',
      kind: 'partial',
      finding: '在训练结束前连续 8 轮，长期参数文件从约 205.6 MB 缩到 51.4 MB（约减少 75%）；同题均分低 1.79 分。',
      boundary: '95% 配对区间为 −3.68 到 +0.12 分；不能据此证明长期使用小容量不会损失能力。',
    },
    {
      id: 'q07',
      kind: 'bounded-answer',
      finding: '第 156 轮反转 Bounded 的一次参数更新方向，64 道同题平均成绩下降 10.06 分。',
      boundary: '这一局部因果结果已经通过多重比较校正，但证据仅覆盖该模型与该轮次，不能推断普遍规律。',
    },
  ],
  unresolved: [
    {
      id: 'q10',
      state: 'unrun',
      fact: '新 128 道确认题已冻结，但三条独立长程训练流及正式新题成绩尚未完成。',
    },
    {
      id: 'q03',
      state: 'unrun',
      fact: 'SEED 的工程与开发题检查已有结果，按论文条件的正式独立复现仍未完成。',
    },
  ],
  historicalBoundary: '三条历史路线的 128 题终评不是完全严格的训练对照，不能凭分数直接判定方法优劣。',
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
