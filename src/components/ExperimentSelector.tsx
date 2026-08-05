import { useMemo, useState } from 'react';
import { recommendModels } from '../lib/recommendation';
import { architectureLabel } from '../lib/format';
import { getMessages, localePath, type Locale } from '../i18n';
import type { AtlasModel, ExperimentMode, Goal, ResourceTier, TaskDirection } from '../lib/types';

type Props = { models: AtlasModel[]; locale?: Locale };

export default function ExperimentSelector({ models, locale = 'zh' }: Props) {
  const m = getMessages(locale);
  const [mode, setMode] = useState<ExperimentMode>('inference');
  const [task, setTask] = useState<TaskDirection>('general');
  const [resource, setResource] = useState<ResourceTier>('24gb');
  const [goal, setGoal] = useState<Goal>('open_weights');
  const candidates = useMemo(() => recommendModels(models, { mode, task, resource, goal }, locale), [models, mode, task, resource, goal, locale]);

  const modes: [ExperimentMode, string][] = (Object.keys(m.selector.modes) as ExperimentMode[]).map((key) => [key, m.selector.modes[key]]);
  const tasks: [TaskDirection, string][] = (Object.keys(m.selector.tasks) as TaskDirection[]).map((key) => [key, m.selector.tasks[key]]);
  const resources: [ResourceTier, string][] = (Object.keys(m.selector.resources) as ResourceTier[]).map((key) => [key, m.selector.resources[key]]);
  const goals: [Goal, string][] = (Object.keys(m.selector.goals) as Goal[]).map((key) => [key, m.selector.goals[key]]);

  return <div className="selector-shell">
    <div className="selector-fields">
      <Select label={m.selector.mode} value={mode} onChange={(value) => setMode(value as ExperimentMode)} options={modes} />
      <Select label={m.selector.task} value={task} onChange={(value) => setTask(value as TaskDirection)} options={tasks} />
      <Select label={m.selector.resource} value={resource} onChange={(value) => setResource(value as ResourceTier)} options={resources} />
      <Select label={m.selector.goal} value={goal} onChange={(value) => setGoal(value as Goal)} options={goals} />
    </div>
    <div className="selector-result-head"><div><span className="section-kicker">{m.selector.candidateKicker}</span><h2>{m.selector.candidateTitle}</h2></div><span className="result-count">{candidates.filter((item) => item.candidate).length} {m.selector.candidateUnit}</span></div>
    <p className="muted">{m.selector.disclaimer}</p>
    <div className="candidate-list">
      {candidates.slice(0, 4).map((item) => <article className={`candidate-row ${item.candidate ? 'is-candidate' : ''}`} key={item.model.id}>
        <div><strong>{item.model.name}</strong><span>{architectureLabel(item.model.architecture.type, locale)} · {item.model.family}</span></div>
        <div className="candidate-evidence">{item.matched.slice(0, 3).map((value, index) => <span className="check-chip" key={`matched-${index}-${value}`}>✓ {value}</span>)}{item.missing.slice(0, 2).map((value, index) => <span className="unknown-chip" key={`missing-${index}-${value}`}>? {value}</span>)}</div>
        <a className="text-link" href={localePath(locale, `/models/${item.model.id}/`)}>{m.selector.view}</a>
      </article>)}
    </div>
  </div>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>;
}
