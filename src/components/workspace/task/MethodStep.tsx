import type { UpdateMethod } from '../../../stores/researchTask';
import { roleLabel, updateMethodLabel } from '../../../lib/researchLabels';
import { ROLE_OPTIONS, type TaskStepProps } from './types';

const UPDATES: UpdateMethod[] = ['none', 'lora', 'sft', 'rl', 'unsure'];

export function MethodStep({ draft, update, m, locale }: TaskStepProps) {
  const copy = m.workspace.taskBuilder;
  return (
    <section className="task-step" aria-labelledby="task-step-title">
      <p className="task-step-kicker">{copy.stepMethod}</p>
      <h3>{m.workspace.roleLabel} / {m.workspace.updateLabel}</h3>
      <p className="task-step-hint">{copy.methodHint}</p>
      <div className="field">
        <span>{m.workspace.roleLabel}</span>
        <div className="chip-grid" role="group" aria-label={m.workspace.roleLabel}>
          {ROLE_OPTIONS.map((role) => {
            const active = draft.roles.includes(role);
            return <button key={role} type="button" className={`chip ${active ? 'is-active' : ''}`} aria-pressed={active} onClick={() => update({ roles: active ? draft.roles.filter((item) => item !== role) : [...draft.roles, role] })}>{roleLabel(role, locale)}</button>;
          })}
        </div>
      </div>
      <label className="field">
        <span>{m.workspace.updateLabel}</span>
        <select value={draft.update} onChange={(event) => update({ update: event.target.value as UpdateMethod })}>
          {UPDATES.map((value) => <option key={value} value={value}>{updateMethodLabel(value, locale)}</option>)}
        </select>
      </label>
    </section>
  );
}
