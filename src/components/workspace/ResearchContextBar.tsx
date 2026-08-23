import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { researchTask, clearResearchTask, initResearchTaskFromUrl, type ResearchTask } from '../../stores/researchTask';
import { compareIds } from '../../stores/compare';
import { candidateIds } from '../../stores/candidates';
import { localePath, type Locale } from '../../i18n';
import { accessModeLabel, researchModeLabel, updateMethodLabel } from '../../lib/researchLabels';
import { useHydrated } from '../../lib/useHydrated';
import { hasMeaningfulResearchTask } from '../../stores/researchTask';
import './ResearchContextBar.css';

export interface ResearchContextLabels {
  currentTask: string;
  openWeightLabel: string;
  candidates: string;
  compare: string;
  editConstraints: string;
  clearTask: string;
  role: Record<string, string>;
}

interface Props {
  labels: ResearchContextLabels;
  locale: Locale;
}

function taskSummary(task: ResearchTask, labels: ResearchContextLabels, locale: Locale): string {
  const parts: string[] = [];
  parts.push(labels.currentTask);
  parts.push(researchModeLabel(task.mode, locale));
  if (task.roles.length) parts.push(task.roles.map((role) => labels.role[role] ?? role).join(locale === 'zh' ? '、' : ', '));
  if (task.update !== 'none') parts.push(updateMethodLabel(task.update, locale));
  if (typeof task.gpuVramGb === 'number') parts.push(`${task.gpuVramGb}GB`);
  if (task.openWeight) parts.push(labels.openWeightLabel);
  if (typeof task.contextTarget === 'number') parts.push(`${task.contextTarget} tokens`);
  if (task.accessMode !== 'either') parts.push(accessModeLabel(task.accessMode, locale));
  return parts.join(' · ');
}

export function ResearchContextBar({ labels, locale }: Props) {
  const hydrated = useHydrated();
  const task = useStore(researchTask);
  const compare = useStore(compareIds);
  const candidates = useStore(candidateIds);

  useEffect(() => {
    initResearchTaskFromUrl();
  }, []);

  if (!hydrated || !hasMeaningfulResearchTask(task)) return null;

  return (
    <div className="research-context-bar" role="status" aria-live="polite">
      <div className="shell context-inner">
        <span className="context-summary">{taskSummary(task, labels, locale)}</span>
        <span className="context-counts">
          {labels.candidates} {candidates.length} · {labels.compare} {compare.length}
        </span>
        <a className="context-link" href={localePath(locale, '/workspace/')}>
          {labels.editConstraints}
        </a>
        <button
          type="button"
          className="context-clear"
          onClick={() => clearResearchTask()}
          aria-label={labels.clearTask}
        >
          ×
        </button>
      </div>
    </div>
  );
}
