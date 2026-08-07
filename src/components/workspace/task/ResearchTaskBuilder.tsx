import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { emptyTask, researchTask, setResearchTask, clearResearchTask, type ResearchTask } from '../../../stores/researchTask';
import type { AtlasModel, AtlasPaper } from '../../../lib/schemas';
import type { Messages } from '../../../i18n/zh';
import type { Locale } from '../../../i18n';
import { ModeStep } from './ModeStep';
import { ReferenceStep } from './ReferenceStep';
import { MethodStep } from './MethodStep';
import { ResourceStep } from './ResourceStep';
import { AccessStep } from './AccessStep';
import { PriorityStep } from './PriorityStep';
import { TaskSummary } from './TaskSummary';
import type { TaskStepProps } from './types';

interface Props { models: AtlasModel[]; papers: AtlasPaper[]; m: Messages; locale: Locale }
const STEP_KEYS = ['stepMode', 'stepReference', 'stepMethod', 'stepResource', 'stepAccess', 'stepPriority'] as const;

export function ResearchTaskBuilder({ models, papers, m, locale }: Props) {
  const task = useStore(researchTask);
  const [draft, setDraft] = useState<ResearchTask>(task);
  const [step, setStep] = useState(0);
  useEffect(() => setDraft(task), [task]);

  const update = (patch: Partial<ResearchTask>) => setDraft((current) => ({ ...current, ...patch, schemaVersion: 2 }));
  const stepProps: TaskStepProps = { draft, update, models, papers, m, locale };
  const isReferenceStep = draft.mode === 'strict' || draft.mode === 'method';
  const visibleSteps = isReferenceStep ? STEP_KEYS : STEP_KEYS.filter((key) => key !== 'stepReference');
  const currentKey = visibleSteps[step] ?? visibleSteps[0];
  const currentIndex = (visibleSteps as readonly string[]).indexOf(currentKey);
  const referenceComplete = !isReferenceStep || Boolean(draft.reference?.paperId && draft.reference?.modelId && draft.reference?.role);
  const renderStep = () => {
    if (currentKey === 'stepMode') return <ModeStep {...stepProps} />;
    if (currentKey === 'stepReference') return <ReferenceStep {...stepProps} />;
    if (currentKey === 'stepMethod') return <MethodStep {...stepProps} />;
    if (currentKey === 'stepResource') return <ResourceStep {...stepProps} />;
    if (currentKey === 'stepAccess') return <AccessStep {...stepProps} />;
    return <PriorityStep {...stepProps} />;
  };
  const next = () => setStep((index) => Math.min(index + 1, visibleSteps.length - 1));
  const back = () => setStep((index) => Math.max(index - 1, 0));
  const finish = () => setResearchTask(draft);

  return (
    <section className="constraint-panel task-builder" aria-label={m.workspace.constraintTitle}>
      <div className="task-builder-header"><div><p className="section-kicker">{m.workspace.constraintTitle}</p><h2>{m.workspace.title}</h2></div><button type="button" className="button button-quiet" onClick={() => { clearResearchTask(); setDraft(emptyTask); setStep(0); }}>{m.workspace.clearTask}</button></div>
      <div className="task-stepper" aria-label={m.workspace.taskBuilder.stepMode}>{visibleSteps.map((key, index) => <button key={key} type="button" className={index === currentIndex ? 'is-active' : ''} aria-current={index === currentIndex ? 'step' : undefined} onClick={() => setStep(index)}>{index + 1}. {m.workspace.taskBuilder[key]}</button>)}</div>
      {renderStep()}
      <TaskSummary draft={draft} m={m} locale={locale} />
      <div className="constraint-actions task-builder-actions"><button type="button" className="button" disabled={currentIndex === 0} onClick={back}>{m.workspace.taskBuilder.back}</button>{currentIndex < visibleSteps.length - 1 ? <button type="button" className="button button-primary" disabled={currentKey === 'stepReference' && !referenceComplete} onClick={next}>{m.workspace.taskBuilder.next}</button> : <button type="button" className="button button-primary" onClick={finish}>{m.workspace.taskBuilder.finish}</button>}</div>
    </section>
  );
}
