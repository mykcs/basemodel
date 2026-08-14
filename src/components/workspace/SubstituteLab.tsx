import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { researchTask, type ResearchMode, type ResearchTask } from '../../stores/researchTask';
import { analyzeReplacement } from '../../lib/research/replacement';
import { scoreModels } from '../../lib/researchEngine';
import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';

interface Props { models: AtlasModel[]; papers: AtlasPaper[]; m: Messages; locale?: 'zh' | 'en' }
type Verdict = 'recommended' | 'conditional' | 'not_recommended' | 'unknown';

function replacementVerdict(base: AtlasModel, rep: AtlasModel, task: ResearchTask, papers: AtlasPaper[], mode: ResearchMode): Verdict {
  const impacts = analyzeReplacement(base, rep, { ...task, mode }, papers).filter((impact) => impact.severity !== 'none');
  if (impacts.some((impact) => impact.severity === 'high')) return 'not_recommended';
  if (impacts.some((impact) => impact.severity === 'medium')) return 'conditional';
  if (impacts.some((impact) => impact.severity === 'unknown')) return mode === 'modern' ? 'conditional' : 'unknown';
  return 'recommended';
}

export function SubstituteLab({ models, papers, m, locale = 'zh' }: Props) {
  const task = useStore(researchTask);
  const [baseId, setBaseId] = useState('');
  useEffect(() => { if (task.reference?.modelId) setBaseId(task.reference.modelId); }, [task.reference?.modelId]);
  const base = models.find((model) => model.id === baseId) ?? null;
  const substitutes = useMemo(() => {
    if (!base) return [];
    const scored = scoreModels(models, papers, task);
    return scored.filter((entry) => entry.model.id !== base.id && entry.eligible)
      .map((entry) => ({ entry, impacts: analyzeReplacement(base, entry.model, task, papers) }))
      .filter(({ entry }) => (entry.model.vendor === base.vendor && entry.model.family === base.family) || entry.model.release_date > base.release_date)
      .sort((left, right) => right.entry.score - left.entry.score).slice(0, 4);
  }, [base, models, papers, task]);

  const title = locale === 'zh' ? '模型替换分析' : 'Model replacement analysis';
  return <section className="substitute-lab" aria-label={title}>
    <h2>{title}</h2>
    <p className="muted">{locale === 'zh' ? '同一个替代模型会分别按严格复现、方法复现和现代化重跑判断。下方表格按你在工作台选择的复现方式解释每项变化。' : 'The same replacement is judged separately for strict reproduction, method reproduction, and a modern rerun. The table below explains each change using the reproduction mode selected in the workspace.'}</p>
    <div className="field"><label htmlFor="substitute-base">{locale === 'zh' ? '要替换的模型' : 'Model to replace'}</label><select id="substitute-base" value={baseId} onChange={(event) => setBaseId(event.target.value)}><option value="">—</option>{models.map((model) => <option key={model.id} value={model.id}>{model.name} ({model.release_date})</option>)}</select></div>
    {!base ? <p className="empty-state">{m.research.substitute.empty}</p> : substitutes.length === 0 ? <p className="empty-state">{m.research.substitute.noSubstitute}</p> : <div className="substitute-list">{substitutes.map(({ entry, impacts }) => <SubstituteCard key={entry.model.id} base={base} rep={entry.model} impacts={impacts} task={task} papers={papers} m={m} locale={locale} />)}</div>}
  </section>;
}

function SubstituteCard({ base, rep, impacts, task, papers, m, locale }: { base: AtlasModel; rep: AtlasModel; impacts: ReturnType<typeof analyzeReplacement>; task: ResearchTask; papers: AtlasPaper[]; m: Messages; locale: 'zh' | 'en' }) {
  const visible = impacts.filter((impact) => impact.severity !== 'none' || impact.effect === 'unknown');
  const valueLabel = (value: string) => value.split('|').map((part) => {
    if (part === 'true') return m.format.yes;
    if (part === 'false') return m.format.no;
    return m.format.semanticStatus[part as keyof Messages['format']['semanticStatus']] ?? part;
  }).join(' · ');
  const modeLabels: Record<ResearchMode, string> = locale === 'zh'
    ? { strict: '严格复现', method: '方法复现', modern: '现代化重跑', new: '新实验' }
    : { strict: 'Strict', method: 'Method', modern: 'Modern rerun', new: 'New experiment' };
  const verdictLabels: Record<Verdict, string> = locale === 'zh'
    ? { recommended: '适合', conditional: '条件适合', not_recommended: '不建议', unknown: '证据不足' }
    : { recommended: 'Suitable', conditional: 'Conditional', not_recommended: 'Not recommended', unknown: 'Insufficient evidence' };
  const modes: ResearchMode[] = ['strict', 'method', 'modern'];

  return <article className="substitute-card">
    <h3>{base.name} → {rep.name}</h3>
    <div className="replacement-mode-verdicts" aria-label={locale === 'zh' ? '三种复现方式下的替换判断' : 'Replacement verdicts by reproduction mode'}>
      {modes.map((mode) => { const verdict = replacementVerdict(base, rep, task, papers, mode); return <div className={`replacement-verdict verdict-${verdict}`} key={mode}><span>{modeLabels[mode]}</span><strong>{verdictLabels[verdict]}</strong></div>; })}
    </div>
    <p className="muted">{locale === 'zh' ? '主要变化' : 'Main change'}: {m.research.substitute.effect[visible.find((impact) => impact.effect !== 'none')?.effect ?? 'none']}</p>
    <table className="substitute-table"><thead><tr><th scope="col">{locale === 'zh' ? '比较项' : 'Field'}</th><th scope="col">{locale === 'zh' ? '原模型' : 'Original'}</th><th scope="col">{locale === 'zh' ? '替代模型' : 'Replacement'}</th><th scope="col">{locale === 'zh' ? '变化' : 'Change'}</th></tr></thead><tbody>{visible.map((impact) => <tr key={impact.dimension} className={`impact-${impact.severity}`}><th scope="row">{m.research.substitute.impactDimensions[impact.dimension]}</th><td>{valueLabel(impact.before)}</td><td>{valueLabel(impact.after)}</td><td><strong>{m.research.substitute.severity[impact.severity]}</strong><br /><span>{m.research.substitute.impactCodes[impact.explanationCode]}</span><br /><small>{m.research.substitute.confidence[impact.confidence]}</small></td></tr>)}</tbody></table>
  </article>;
}
