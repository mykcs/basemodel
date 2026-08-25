import { useState } from 'react';
import { PRIORITY_OPTIONS, type TaskStepProps } from './types';

export function PriorityStep({ draft, update, m }: TaskStepProps) {
  const copy = m.workspace.taskBuilder;
  const [priorityLabels] = useState<Record<string, string>>(() => {
    const labels = m.selector.goals as Record<string, string>;
    return labels;
  });
  const selected = draft.priorities;
  const toggle = (value: string) => update({ priorities: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] });
  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= selected.length) return;
    const next = [...selected];
    [next[index]!, next[nextIndex]!] = [next[nextIndex]!, next[index]!];
    update({ priorities: next });
  };
  return (
    <section className="task-step" aria-labelledby="task-step-title">
      <p className="task-step-kicker">{copy.stepPriority}</p>
      <h3>{m.workspace.priorityLabel}</h3>
      <p className="task-step-hint">{copy.priorityHint}</p>
      <div className="priority-options">{PRIORITY_OPTIONS.map((value) => { const active = selected.includes(value); return <button key={value} type="button" className={`chip ${active ? 'is-active' : ''}`} aria-pressed={active} onClick={() => toggle(value)}>{priorityLabels[value] ?? value}</button>; })}</div>
      {selected.length > 0 ? <ol className="priority-list">{selected.map((value, index) => <li key={value}><span>{priorityLabels[value] ?? value}</span><button type="button" className="icon-button" disabled={index === 0} aria-label={`${copy.priorityUp}: ${priorityLabels[value] ?? value}`} onClick={() => move(index, -1)}>↑</button><button type="button" className="icon-button" disabled={index === selected.length - 1} aria-label={`${copy.priorityDown}: ${priorityLabels[value] ?? value}`} onClick={() => move(index, 1)}>↓</button></li>)}</ol> : <p className="task-inline-note">{copy.summaryEmpty}</p>}
      <p className="task-inline-note">{copy.priorityTypeHint}</p>
    </section>
  );
}
