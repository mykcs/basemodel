import type { ResearchMode } from '../../../stores/researchTask';
import { researchModeLabel } from '../../../lib/researchLabels';
import type { TaskStepProps } from './types';

const MODES: ResearchMode[] = ['strict', 'method', 'modern', 'new'];

export function ModeStep({ draft, update, m, locale }: TaskStepProps) {
  const copy = m.workspace.taskBuilder;
  return (
    <section className="task-step" aria-labelledby="task-step-title">
      <p className="task-step-kicker">{copy.stepMode}</p>
      <h3 id="task-step-title">{m.workspace.modeLabel}</h3>
      <p className="task-step-hint">{copy.modeImplication}</p>
      <div className="mode-card-grid">
        {MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            className={`mode-card ${draft.mode === mode ? 'is-active' : ''}`}
            aria-pressed={draft.mode === mode}
            onClick={() => update({ mode, ...(mode === 'strict' || mode === 'method' ? {} : { reference: undefined }) })}
          >
            <strong>{researchModeLabel(mode, locale)}</strong>
            <span>{copy[`${mode}Desc`]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
