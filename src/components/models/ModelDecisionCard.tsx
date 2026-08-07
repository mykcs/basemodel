import type { AtlasModel } from '../../lib/schemas';
import type { ResearchFit } from '../../lib/research/types';
import { architectureLabel, checkpointLabel, parameterSummary, modalityLabel } from '../../lib/format';
import { localePath, type Locale } from '../../i18n';
import type { Messages } from '../../i18n/zh';

interface Props {
  model: AtlasModel;
  fit?: ResearchFit;
  locale: Locale;
  m: Messages;
  inCandidate: boolean;
  inCompare: boolean;
  paperAdopted: boolean;
  onToggleCandidate: () => void;
  onToggleCompare: () => void;
  onQuickView: () => void;
}

const levelText = { high: 'high', medium: 'medium', low: 'low', unknown: 'unknown' } as const;

export function ModelDecisionCard({ model, fit, locale, m, inCandidate, inCompare, paperAdopted, onToggleCandidate, onToggleCompare, onQuickView }: Props) {
  const fitLabel = fit ? ({ high: m.explorer.fitHigh, conditional: m.explorer.fitConditional, explore: m.explorer.fitExplore, blocked: m.explorer.fitBlocked }[fit.overall]) : undefined;
  const dimensions = fit ? [
    [m.explorer.feasibility, fit.feasibility.level], [m.explorer.researchSuitability, fit.researchSuitability.level], [m.explorer.comparability, fit.comparability.level], [m.explorer.reproducibility, fit.reproducibility.level], [m.explorer.evidenceQuality, fit.evidenceQuality.level],
  ] as Array<[string, keyof typeof levelText]> : [];
  return <article className="model-card decision-card">
    <div className="card-topline"><span className="eyebrow">{model.vendor}</span>{paperAdopted && <span className="paper-adoption-tag">{m.explorer.hasPaper}</span>}</div>
    <h3><a href={localePath(locale, `/models/${model.id}/`)}>{model.name}</a></h3>
    <p className="model-meta">{model.family} · {model.generation} · {model.release_date}</p>
    {fit && <div className={`task-fit task-fit-${fit.overall}`} aria-label={`${m.explorer.taskFitLabel}: ${fitLabel}`}><span>{m.explorer.taskFitLabel}</span><strong>{fitLabel}</strong><small>{fit.overall === 'blocked' ? m.explorer.fitBlockedHint : fit.overall === 'conditional' ? m.explorer.fitConditionalHint : fit.overall === 'explore' ? m.explorer.fitExploreHint : m.explorer.fitHighHint}</small></div>}
    {fit && <dl className="fit-dimensions">{dimensions.map(([label, level]) => <div key={label}><dt>{label}</dt><dd className={`fit-level-${level}`}>{m.explorer[`level${level[0].toUpperCase()}${level.slice(1)}` as 'levelHigh' | 'levelMedium' | 'levelLow' | 'levelUnknown']}</dd></div>)}</dl>}
    <p className="model-architecture"><strong>{architectureLabel(model.architecture.type, locale)}</strong><span>{parameterSummary(model.architecture.total_parameters_b, model.architecture.active_parameters_b, model.architecture.type, locale)}</span></p>
    <div className="tag-row">{model.checkpoint.modalities.map((value) => <span className="tag" key={value}>{modalityLabel(value, locale)}</span>)}<span className="tag">{checkpointLabel(model.checkpoint.type, locale)}</span><span className={`tag ${model.openness.weights_available === true ? 'tag-open' : 'tag-unknown'}`}>{model.openness.weights_available === true ? m.explorer.openWeightsTag : model.openness.weights_available === false ? (locale === 'zh' ? '权重不可用' : 'Weights unavailable') : (locale === 'zh' ? '权重待核验' : 'Weights unverified')}</span></div>
    <div className="card-footer decision-card-actions"><button className="button button-secondary" type="button" onClick={onQuickView}>{locale === 'zh' ? '一眼概览' : 'Quick view'}</button><button className="button button-secondary" type="button" onClick={onToggleCandidate}>{inCandidate ? m.workspace.removeCandidate : m.workspace.addCandidate}</button><button className="button button-secondary" type="button" onClick={onToggleCompare}>{inCompare ? m.workspace.removeFromCompare : m.workspace.addToCompare}</button><a className="card-compare" href={`${localePath(locale, '/compare/')}?models=${encodeURIComponent(model.id)}`} aria-label={m.explorer.compareAria.replace('{name}', model.name)}>{m.explorer.compare}</a></div>
  </article>;
}
