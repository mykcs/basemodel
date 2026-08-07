import { accessModeLabel, researchModeLabel, roleLabel, updateMethodLabel } from '../../../lib/researchLabels';
import type { TaskStepProps } from './types';

export function TaskSummary({ draft, m, locale }: Pick<TaskStepProps, 'draft' | 'm' | 'locale'>) {
  const copy = m.workspace.taskBuilder;
  const roleText = draft.roles.length ? draft.roles.map((role) => roleLabel(role, locale)).join(', ') : m.format.unknown;
  return <aside className="task-summary" aria-label={copy.summaryTitle}><strong>{copy.summaryTitle}</strong><span>{researchModeLabel(draft.mode, locale)} · {updateMethodLabel(draft.update, locale)}</span><span>{accessModeLabel(draft.accessMode, locale)} · {roleText}</span>{typeof draft.gpuVramGb === 'number' && <span>{draft.gpuVramGb} GB</span>}{draft.reference?.paperId && <span>{copy.referenceSelected}</span>}</aside>;
}
