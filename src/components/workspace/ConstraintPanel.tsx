import { useState } from 'react';
import { researchTask, setResearchTask, clearResearchTask, type ResearchTask } from '../../stores/researchTask';
import type { Messages } from '../../i18n/zh';
import { accessModeLabel, researchModeLabel, updateMethodLabel } from '../../lib/researchLabels';
import { roleLabel } from '../../lib/format';

interface Props {
  m: Messages;
  locale?: 'zh' | 'en';
}

const MODES: ResearchTask['mode'][] = ['strict', 'method', 'modern', 'new'];
const UPDATES: ResearchTask['update'][] = ['none', 'lora', 'sft', 'rl', 'unsure'];
const ROLES = ['actor', 'policy', 'critic', 'reflector', 'teacher', 'optimizer', 'analyzer', 'reward-model', 'judge', 'evaluator', 'baseline'];
const PRIORITIES = ['comparability', 'current', 'low_cost', 'open_weights', 'chinese', 'tool_use', 'rl'];

export function ConstraintPanel({ m, locale = 'zh' }: Props) {
  const [task, setLocal] = useState<ResearchTask>(researchTask.get());

  const update = (patch: Partial<ResearchTask>) => {
    const next = { ...task, ...patch };
    setLocal(next);
  };

  const apply = () => {
    setResearchTask(task);
  };

  const reset = () => {
    clearResearchTask();
    setLocal(researchTask.get());
  };

  const toggleRole = (role: string) => {
    const roles = task.roles.includes(role)
      ? task.roles.filter((r) => r !== role)
      : [...task.roles, role];
    update({ roles });
  };

  const togglePriority = (p: string) => {
    const priorities = task.priorities.includes(p)
      ? task.priorities.filter((x) => x !== p)
      : [...task.priorities, p];
    update({ priorities });
  };

  return (
    <aside className="constraint-panel">
      <h2>{m.workspace.constraintTitle}</h2>

      <div className="field">
        <label>{m.workspace.modeLabel}</label>
        <select value={task.mode} onChange={(e) => update({ mode: e.target.value as ResearchTask['mode'] })}>
          {MODES.map((mode) => (
            <option key={mode} value={mode}>{researchModeLabel(mode, locale)}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>{m.workspace.updateLabel}</label>
        <select value={task.update} onChange={(e) => update({ update: e.target.value as ResearchTask['update'] })}>
          {UPDATES.map((u) => (
            <option key={u} value={u}>{updateMethodLabel(u, locale)}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>{m.workspace.roleLabel}</label>
        <div className="chip-grid">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              className={`chip ${task.roles.includes(role) ? 'is-active' : ''}`}
              onClick={() => toggleRole(role)}
            >
              {roleLabel(role)}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>{m.workspace.accessModeLabel}</label>
        <select value={task.accessMode} onChange={(e) => update({ accessMode: e.target.value as ResearchTask['accessMode'] })}>
          {(['local', 'api', 'either'] as ResearchTask['accessMode'][]).map((access) => (
            <option key={access} value={access}>{accessModeLabel(access, locale)}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>{m.workspace.priorityLabel}</label>
        <div className="chip-grid">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              className={`chip ${task.priorities.includes(p) ? 'is-active' : ''}`}
              onClick={() => togglePriority(p)}
            >
              {m.selector.goals[p as keyof typeof m.selector.goals] ?? p}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>{m.workspace.resourceLabel}</label>
        <input
          type="number"
          placeholder="GPU VRAM GB"
          value={task.gpuVramGb ?? ''}
          onChange={(e) => update({ gpuVramGb: e.target.value ? Number(e.target.value) : undefined })}
        />
        <input
          type="number"
          placeholder="GPU count"
          value={task.gpuCount ?? ''}
          onChange={(e) => update({ gpuCount: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>

      <div className="field">
        <label>{m.workspace.contextLabel}</label>
        <input
          type="number"
          placeholder="tokens"
          value={task.contextTarget ?? ''}
          onChange={(e) => update({ contextTarget: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>

      <div className="field checkbox">
        <label>
          <input
            type="checkbox"
            checked={task.openWeight ?? false}
            onChange={(e) => update({ openWeight: e.target.checked })}
          />
          {m.workspace.openWeightLabel}
        </label>
      </div>

      <div className="constraint-actions">
        <button type="button" className="button button-primary" onClick={apply}>
          {m.workspace.setTask}
        </button>
        <button type="button" className="button" onClick={reset}>
          {m.workspace.clearTask}
        </button>
      </div>
    </aside>
  );
}
