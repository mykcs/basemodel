import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { researchTask, clearResearchTask, initResearchTaskFromUrl, type ResearchTask } from '../../stores/researchTask';
import { compareIds } from '../../stores/compare';
import { candidateIds } from '../../stores/candidates';
import { baseUrl } from '../../i18n';
import type { Messages } from '../../i18n/zh';

interface Props {
  m: Messages;
}

function taskSummary(task: ResearchTask, m: Messages): string {
  const parts: string[] = [];
  parts.push(m.workspace.currentTask);
  parts.push(`mode=${task.mode}`);
  if (task.roles.length) parts.push(`roles=${task.roles.join(',')}`);
  if (task.update !== 'none') parts.push(`update=${task.update}`);
  if (typeof task.gpuVramGb === 'number') parts.push(`vram=${task.gpuVramGb}GB`);
  if (task.openWeight) parts.push('open-weight');
  if (typeof task.contextTarget === 'number') parts.push(`ctx=${task.contextTarget}`);
  return parts.join(' · ');
}

export function ResearchContextBar({ m }: Props) {
  const task = useStore(researchTask);
  const compare = useStore(compareIds);
  const candidates = useStore(candidateIds);

  useEffect(() => {
    initResearchTaskFromUrl();
  }, []);

  if (task.mode === 'strict' && task.roles.length === 0 && task.update === 'none' && task.priorities.length === 0) {
    return null;
  }

  const base = baseUrl();

  return (
    <div className="research-context-bar" role="status" aria-live="polite">
      <div className="shell context-inner">
        <span className="context-summary">{taskSummary(task, m)}</span>
        <span className="context-counts">
          {m.workspace.candidates} {candidates.length} · {m.workspace.compare} {compare.length}
        </span>
        <a className="context-link" href={`${base}workspace/`}>
          {m.workspace.editConstraints}
        </a>
        <button
          type="button"
          className="context-clear"
          onClick={() => clearResearchTask()}
          aria-label={m.workspace.clearTask}
        >
          ×
        </button>
      </div>
    </div>
  );
}
