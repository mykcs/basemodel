import { useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { researchTask, hasMeaningfulResearchTask } from '../../../stores/researchTask';
import { candidateIds, addCandidate, removeCandidate } from '../../../stores/candidates';
import { compareIds, addToCompare, removeFromCompare } from '../../../stores/compare';
import { evaluateModel } from '../../../lib/research/evaluateModel';
import type { Locale } from '../../../i18n';
import type { Messages } from '../../../i18n/zh';
import type { AtlasModel, AtlasPaper } from '../../../lib/schemas';

interface Props { model: AtlasModel; papers: AtlasPaper[]; m: Messages; locale: Locale }

export function ModelTaskFit({ model, papers, m }: Props) {
  const task = useStore(researchTask);
  const candidates = useStore(candidateIds);
  const compare = useStore(compareIds);
  const evaluation = useMemo(() => hasMeaningfulResearchTask(task) ? evaluateModel(model, papers, task) : null, [model, papers, task]);
  if (!evaluation) return null;
  const fitLabel = ({ high: m.explorer.fitHigh, conditional: m.explorer.fitConditional, explore: m.explorer.fitExplore, blocked: m.explorer.fitBlocked }[evaluation.fit.overall]);
  const dimensions: Array<[string, string]> = [
    [m.explorer.feasibility, evaluation.fit.feasibility.level], [m.explorer.researchSuitability, evaluation.fit.researchSuitability.level], [m.explorer.comparability, evaluation.fit.comparability.level], [m.explorer.reproducibility, evaluation.fit.reproducibility.level], [m.explorer.evidenceQuality, evaluation.fit.evidenceQuality.level],
  ];
  const inCandidate = candidates.includes(model.id);
  const inCompare = compare.includes(model.id);
  const fitHint = evaluation.fit.overall === 'blocked' ? m.explorer.fitBlockedHint : evaluation.fit.overall === 'conditional' ? m.explorer.fitConditionalHint : evaluation.fit.overall === 'explore' ? m.explorer.fitExploreHint : m.explorer.fitHighHint;
  return <section className="detail-task-fit" aria-labelledby="detail-task-fit-title">
    <div className="section-kicker">{m.explorer.taskFitLabel}</div>
    <h2 id="detail-task-fit-title">{m.explorer.taskFitLabel}: {fitLabel}</h2>
    <p className="muted">{fitHint}</p>
    <dl className="fit-dimensions">{dimensions.map(([label, level]) => <div key={label}><dt>{label}</dt><dd className={`fit-level-${level}`}>{m.explorer[`level${level[0].toUpperCase()}${level.slice(1)}` as 'levelHigh' | 'levelMedium' | 'levelLow' | 'levelUnknown']}</dd></div>)}</dl>
    {evaluation.fit.blockers.length > 0 && <p className="detail-fit-warning">{m.explorer.fitBlockedHint}</p>}
    {evaluation.hasUnknown && evaluation.fit.blockers.length === 0 && <p className="detail-fit-pending">{m.explorer.fitConditionalHint}</p>}
    <div className="detail-task-actions"><button type="button" className="button button-primary" onClick={() => inCandidate ? removeCandidate(model.id) : addCandidate(model.id)}>{inCandidate ? m.workspace.removeCandidate : m.workspace.addCandidate}</button><button type="button" className="button button-secondary" onClick={() => inCompare ? removeFromCompare(model.id) : addToCompare(model.id)}>{inCompare ? m.workspace.removeFromCompare : m.workspace.addToCompare}</button></div>
  </section>;
}
