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
import { candidateIds } from '../../../stores/candidates';
import { compareIds } from '../../../stores/compare';
import { researchProjects, removeResearchProject, saveResearchProject } from '../../../stores/projects';

interface Props { models: AtlasModel[]; papers: AtlasPaper[]; m: Messages; locale: Locale }
const STEP_KEYS = ['stepMode', 'stepReference', 'stepMethod', 'stepResource', 'stepAccess', 'stepPriority'] as const;

export function ResearchTaskBuilder({ models, papers, m, locale }: Props) {
  const task = useStore(researchTask);
  const [draft, setDraft] = useState<ResearchTask>(task);
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [projectNotice, setProjectNotice] = useState('');
  const projects = useStore(researchProjects);
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
  const saveProject = () => {
    const project = saveResearchProject(projectName, draft, candidateIds.get(), compareIds.get());
    setProjectName(project.name);
    setProjectNotice(locale === 'zh' ? '项目已保存到本机' : 'Project saved locally');
    window.setTimeout(() => setProjectNotice(''), 1800);
  };
  const loadProject = (id: string) => {
    const project = projects.find((item) => item.id === id);
    if (!project) return;
    setDraft(project.task);
    setResearchTask(project.task);
    candidateIds.set(project.candidateIds);
    compareIds.set(project.compareIds);
    setProjectName(project.name);
    setProjectNotice(locale === 'zh' ? '项目已恢复' : 'Project restored');
  };

  return (
    <section className="constraint-panel task-builder" aria-label={m.workspace.constraintTitle}>
      <div className="task-builder-header"><div><p className="section-kicker">{m.workspace.constraintTitle}</p><h2>{m.workspace.title}</h2></div><button type="button" className="button button-quiet" onClick={() => { clearResearchTask(); setDraft(emptyTask); setStep(0); }}>{m.workspace.clearTask}</button></div>
      <div className="project-history" aria-label={locale === 'zh' ? '本机研究项目' : 'Local research projects'}>
        <div className="project-history-actions"><input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder={locale === 'zh' ? '项目名称（可选）' : 'Project name (optional)'} aria-label={locale === 'zh' ? '项目名称' : 'Project name'} /><button type="button" className="button button-secondary" onClick={saveProject}>{locale === 'zh' ? '保存项目' : 'Save project'}</button>{projectNotice && <span className="muted" role="status">{projectNotice}</span>}</div>
        {projects.length > 0 && <div className="project-history-list"><label className="field"><span>{locale === 'zh' ? '恢复历史项目' : 'Restore a project'}</span><select value="" onChange={(event) => loadProject(event.target.value)}><option value="">{locale === 'zh' ? '选择一个已保存项目' : 'Choose a saved project'}</option>{projects.map((project) => <option value={project.id} key={project.id}>{project.name} · {project.updatedAt.slice(0, 10)}</option>)}</select></label><button type="button" className="text-button" onClick={() => { const id = projects[0]?.id; if (id) removeResearchProject(id); }}>{locale === 'zh' ? '删除最近项目' : 'Delete most recent'}</button></div>}
      </div>
      <div className="task-stepper" aria-label={m.workspace.taskBuilder.stepMode}>{visibleSteps.map((key, index) => <button key={key} type="button" className={index === currentIndex ? 'is-active' : ''} aria-current={index === currentIndex ? 'step' : undefined} onClick={() => setStep(index)}>{index + 1}. {m.workspace.taskBuilder[key]}</button>)}</div>
      {renderStep()}
      <TaskSummary draft={draft} m={m} locale={locale} />
      <div className="constraint-actions task-builder-actions"><button type="button" className="button" disabled={currentIndex === 0} onClick={back}>{m.workspace.taskBuilder.back}</button>{currentIndex < visibleSteps.length - 1 ? <button type="button" className="button button-primary" disabled={currentKey === 'stepReference' && !referenceComplete} onClick={next}>{m.workspace.taskBuilder.next}</button> : <button type="button" className="button button-primary" onClick={finish}>{m.workspace.taskBuilder.finish}</button>}</div>
    </section>
  );
}
