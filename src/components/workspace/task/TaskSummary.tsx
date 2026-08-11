import { accessModeLabel, researchModeLabel, roleLabel, updateMethodLabel } from '../../../lib/researchLabels';
import { CopyButton } from '../../common/CopyButton';
import type { TaskStepProps } from './types';

export function TaskSummary({ draft, m, locale }: Pick<TaskStepProps, 'draft' | 'm' | 'locale'>) {
  const copy = m.workspace.taskBuilder;
  const roleText = draft.roles.length ? draft.roles.map((role) => roleLabel(role, locale)).join(', ') : m.format.unknown;
  const lines = [
    `${m.workspace.modeLabel}: ${researchModeLabel(draft.mode, locale)}`,
    `${m.workspace.updateLabel}: ${updateMethodLabel(draft.update, locale)}`,
    `${locale === 'zh' ? '访问方式' : 'Access'}: ${accessModeLabel(draft.accessMode, locale)}`,
    `${m.workspace.roleLabel}: ${roleText}`,
  ];
  if (typeof draft.gpuVramGb === 'number') lines.push(`GPU: ${draft.gpuVramGb} GB × ${draft.gpuCount ?? 1}`);
  if (draft.precision) lines.push(`Precision: ${draft.precision} · batch ${draft.batchSize ?? 1} · rank ${draft.loraRank ?? 16}`);
  if (draft.kvCacheEnabled !== undefined) lines.push(`KV cache: ${draft.kvCacheEnabled ? 'on' : 'off'}`);
  if (draft.reference?.paperId) lines.push(`${locale === 'zh' ? '参考论文' : 'Reference paper'}: ${draft.reference.paperId}`);
  const summaryText = `${copy.summaryTitle}\n${lines.join('\n')}`;

  return <aside className="task-summary" aria-label={copy.summaryTitle}>
    <strong>{copy.summaryTitle}</strong>
    <span>{researchModeLabel(draft.mode, locale)} · {updateMethodLabel(draft.update, locale)}</span>
    <span>{accessModeLabel(draft.accessMode, locale)} · {roleText}</span>
    {typeof draft.gpuVramGb === 'number' && <span>{draft.gpuVramGb} GB × {draft.gpuCount ?? 1}</span>}
    {draft.precision && <span>{draft.precision} · batch {draft.batchSize ?? 1} · rank {draft.loraRank ?? 16}</span>}
    {draft.kvCacheEnabled !== undefined && <span>KV cache: {draft.kvCacheEnabled ? 'on' : 'off'}</span>}
    {draft.reference?.paperId && <span>{copy.referenceSelected}</span>}
    <div className="actionable-result-actions"><CopyButton compact value={summaryText} label={locale === 'zh' ? '复制任务摘要' : 'Copy task summary'} copiedLabel={locale === 'zh' ? '任务摘要已复制' : 'Task summary copied'} /></div>
  </aside>;
}
