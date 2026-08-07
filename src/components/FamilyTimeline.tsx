import { useMemo, useState } from 'react';
import { architectureLabel, checkpointLabel } from '../lib/format';
import { familyTree, papersForModel } from '../lib/modelRelations';
import { familyCoverageRecords, isCurrentModel } from '../lib/familyCoverage';
import { getMessages, localePath, type Locale } from '../i18n';
import type { AtlasModel, AtlasPaper } from '../lib/types';

type Filter = 'all' | 'current' | 'paper' | 'open';

export default function FamilyTimeline({ models, papers, locale = 'zh' }: { models: AtlasModel[]; papers: AtlasPaper[]; locale?: Locale }) {
  const m = getMessages(locale);
  const [filter, setFilter] = useState<Filter>('all');
  const tree = useMemo(() => familyTree(models), [models]);
  const visible = (model: AtlasModel) => filter === 'all' || (filter === 'current' && isCurrentModel(model, familyCoverageRecords, models)) || (filter === 'paper' && papersForModel(papers, model.id).length > 0) || (filter === 'open' && model.openness.weights_available === true);
  return <div className="family-timeline"><div className="timeline-filters" role="group" aria-label={m.families.filterLabel}>{(['all', 'current', 'paper', 'open'] as Filter[]).map((value) => <button key={value} type="button" className={`button ${filter === value ? 'button-primary' : 'button-secondary'}`} aria-pressed={filter === value} onClick={() => setFilter(value)}>{m.families.filters[value]}</button>)}</div>{[...tree.entries()].map(([vendor, families]) => <section className="tree-vendor" key={vendor}><h2>{vendor}</h2>{[...families.entries()].map(([family, generations]) => { const visibleGenerations = [...generations.entries()].map(([generation, checkpoints]) => [generation, checkpoints.filter(visible)] as const).filter(([, checkpoints]) => checkpoints.length); return visibleGenerations.length ? <div className="tree-family" key={family}><h3>{family}</h3><div className="timeline-track">{visibleGenerations.map(([generation, checkpoints]) => <div className="timeline-generation" key={generation}><div className="tree-generation-heading"><strong>{generation}</strong><span>{checkpoints[0]?.release_date} · {checkpoints.length} {m.familyUnits.checkpoints}</span></div><div className="tree-checkpoints">{checkpoints.map((model) => <a href={localePath(locale, `/models/${model.id}/`)} className="tree-checkpoint" key={model.id}><span>{model.name}</span><small>{architectureLabel(model.architecture.type, locale)} · {checkpointLabel(model.checkpoint.type, locale)}{isCurrentModel(model, familyCoverageRecords, models) ? ` · ${m.families.current}` : ''}</small></a>)}</div></div>)}</div></div> : null; })}</section>)}</div>;
}
