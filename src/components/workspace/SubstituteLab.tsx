import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { researchTask } from '../../stores/researchTask';
import { analyzeReplacement } from '../../lib/research/replacement';
import { scoreModels } from '../../lib/researchEngine';
import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';

interface Props { models: AtlasModel[]; papers: AtlasPaper[]; m: Messages }

export function SubstituteLab({ models, papers, m }: Props) {
  const task = useStore(researchTask);
  const [baseId, setBaseId] = useState('');
  useEffect(() => {
    if (task.reference?.modelId) setBaseId(task.reference.modelId);
  }, [task.reference?.modelId]);
  const base = models.find((model) => model.id === baseId) ?? null;
  const substitutes = useMemo(() => {
    if (!base) return [];
    const scored = scoreModels(models, papers, task);
    return scored
      .filter((entry) => entry.model.id !== base.id && entry.eligible)
      .map((entry) => ({ entry, impacts: analyzeReplacement(base, entry.model, task, papers) }))
      .filter(({ entry }) => (entry.model.vendor === base.vendor && entry.model.family === base.family) || entry.model.release_date > base.release_date)
      .sort((left, right) => right.entry.score - left.entry.score)
      .slice(0, 4);
  }, [base, models, papers, task]);

  return <section className="substitute-lab" aria-label={m.research.substitute.title}>
    <h2>{m.research.substitute.title}</h2>
    <div className="field"><label htmlFor="substitute-base">{m.research.substitute.selectBase}</label><select id="substitute-base" value={baseId} onChange={(event) => setBaseId(event.target.value)}><option value="">—</option>{models.map((model) => <option key={model.id} value={model.id}>{model.name} ({model.release_date})</option>)}</select></div>
    {!base ? <p className="empty-state">{m.research.substitute.empty}</p> : substitutes.length === 0 ? <p className="empty-state">{m.research.substitute.noSubstitute}</p> : <div className="substitute-list">{substitutes.map(({ entry, impacts }) => <SubstituteCard key={entry.model.id} base={base} rep={entry.model} impacts={impacts} m={m} />)}</div>}
  </section>;
}

function SubstituteCard({ base, rep, impacts, m }: { base: AtlasModel; rep: AtlasModel; impacts: ReturnType<typeof analyzeReplacement>; m: Messages }) {
  const visible = impacts.filter((impact) => impact.severity !== 'none' || impact.effect === 'unknown');
  const valueLabel = (value: string) => value.split('|').map((part) => {
    if (part === 'true') return m.format.yes;
    if (part === 'false') return m.format.no;
    return m.format.semanticStatus[part as keyof Messages['format']['semanticStatus']] ?? part;
  }).join(' · ');
  return <article className="substitute-card">
    <h3>{base.name} → {rep.name}</h3>
    <p className="muted">{m.research.substitute.modeImpact}: {m.research.substitute.effect[visible.find((impact) => impact.effect !== 'none')?.effect ?? 'none']}</p>
    <table className="substitute-table"><thead><tr><th scope="col">{m.research.substitute.field}</th><th scope="col">{m.research.substitute.original}</th><th scope="col">{m.research.substitute.replacement}</th><th scope="col">{m.research.substitute.impact}</th></tr></thead><tbody>{visible.map((impact) => <tr key={impact.dimension} className={`impact-${impact.severity}`}><th scope="row">{m.research.substitute.impactDimensions[impact.dimension]}</th><td>{valueLabel(impact.before)}</td><td>{valueLabel(impact.after)}</td><td><strong>{m.research.substitute.severity[impact.severity]}</strong><br /><span>{m.research.substitute.impactCodes[impact.explanationCode]}</span><br /><small>{m.research.substitute.confidence[impact.confidence]}</small></td></tr>)}</tbody></table>
  </article>;
}
