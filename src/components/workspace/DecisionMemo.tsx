import { useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { hasMeaningfulResearchTask, researchTask, type ResearchTask } from '../../stores/researchTask';
import { compareIds } from '../../stores/compare';
import { candidateIds } from '../../stores/candidates';
import { scoreModels, bucketize, type ScoredModel } from '../../lib/researchEngine';
import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';
import type { Locale } from '../../i18n';
import { roleLabel } from '../../lib/format';
import { researchModeLabel, updateMethodLabel } from '../../lib/researchLabels';
import { buildDecisionRecord, decisionRecordToJson } from '../../lib/decisionRecord';
import { collectClaimFingerprints, decisionSnapshots, saveDecisionSnapshot, snapshotChanges } from '../../stores/snapshots';

interface Props { models: AtlasModel[]; papers: AtlasPaper[]; m: Messages; locale?: Locale }
type Fact = { label: string; value: string };
function taskFacts(task: ResearchTask, m: Messages, locale: Locale): Fact[] {
  const facts: Fact[] = [{ label: m.workspace.modeLabel, value: researchModeLabel(task.mode, locale) }];
  if (task.roles.length) facts.push({ label: m.workspace.roleLabel, value: task.roles.map((role) => roleLabel(role, locale)).join(locale === 'zh' ? '、' : ', ') });
  facts.push({ label: m.workspace.updateLabel, value: updateMethodLabel(task.update, locale) });
  if (typeof task.gpuVramGb === 'number') facts.push({ label: 'GPU', value: `${task.gpuVramGb}GB × ${task.gpuCount ?? 1}` });
  if (task.precision) facts.push({ label: 'Precision', value: task.precision });
  if (typeof task.batchSize === 'number') facts.push({ label: 'Batch', value: String(task.batchSize) });
  if (typeof task.loraRank === 'number') facts.push({ label: 'LoRA rank', value: String(task.loraRank) });
  if (task.optimizer) facts.push({ label: 'Optimizer', value: task.optimizer });
  if (task.kvCacheEnabled !== undefined) facts.push({ label: 'KV cache', value: task.kvCacheEnabled ? (locale === 'zh' ? '计入' : 'included') : (locale === 'zh' ? '不计入' : 'excluded') });
  if (task.openWeight) facts.push({ label: m.workspace.openWeightLabel, value: locale === 'zh' ? '必须' : 'required' });
  if (typeof task.contextTarget === 'number') facts.push({ label: m.workspace.contextLabel, value: String(task.contextTarget) });
  if (task.priorities.length) facts.push({ label: m.workspace.priorityLabel, value: task.priorities.map((priority) => m.selector.goals[priority as keyof typeof m.selector.goals] ?? priority).join(locale === 'zh' ? '、' : ', ') });
  return facts;
}
function candidateTexts(s: ScoredModel, m: Messages) { return { reasons: s.reasons.map((reason) => m.research.reasons[reason] ?? reason), risks: s.risks.map((risk) => m.research.risks[risk] ?? risk) }; }

export function DecisionMemo({ models, papers, m, locale = 'zh' }: Props) {
  const task = useStore(researchTask); const compare = useStore(compareIds); const candidates = useStore(candidateIds); const [copied, setCopied] = useState(false); const [snapshotNotice, setSnapshotNotice] = useState('');
  const scored = useMemo(() => scoreModels(models, papers, task), [models, papers, task]); const buckets = useMemo(() => bucketize(scored), [scored]);
  const chosen = useMemo(() => scored.filter((entry) => candidates.includes(entry.model.id)), [scored, candidates]);
  const displayedCandidates = useMemo(() => chosen.length ? chosen : [...buckets.baseline, ...buckets.modern, ...buckets.resource].slice(0, 5), [chosen, buckets]);
  const compareModels = useMemo(() => models.filter((model) => compare.includes(model.id)), [models, compare]);
  const hasTask = hasMeaningfulResearchTask(task); const decisionRecord = useMemo(() => buildDecisionRecord(task, scored, candidates, compare), [task, scored, candidates, compare]); const facts = useMemo(() => taskFacts(task, m, locale), [task, m, locale]);
  const snapshotModels = useMemo(() => { const ids = new Set([...candidates, ...compare]); return models.filter((model) => ids.has(model.id)); }, [models, candidates, compare]);
  const currentFingerprints = useMemo(() => collectClaimFingerprints(snapshotModels), [snapshotModels]); const latestSnapshot = useStore(decisionSnapshots)[0]; const changesSinceSnapshot = useMemo(() => latestSnapshot ? snapshotChanges(latestSnapshot, currentFingerprints) : [], [latestSnapshot, currentFingerprints]);
  const notSelected = useMemo(() => scored.filter((entry) => !candidates.includes(entry.model.id)).slice(0, 5), [scored, candidates]);
  const allRisks = useMemo(() => [...new Set(displayedCandidates.flatMap((entry) => entry.risks))], [displayedCandidates]);
  const unresolved = useMemo(() => [...new Set(displayedCandidates.flatMap((entry) => entry.outcomes.filter((outcome) => outcome.state === 'unknown').flatMap((outcome) => outcome.fieldPaths)))], [displayedCandidates]);
  const evidenceSources = useMemo(() => [...new Map([...displayedCandidates.flatMap((entry) => entry.model.sources), ...compareModels.flatMap((model) => model.sources), ...papers.filter((paper) => task.reference?.paperId === paper.id).flatMap((paper) => paper.sources)].map((source) => [source.url, source])).values()], [displayedCandidates, compareModels, papers, task.reference?.paperId]);

  const markdown = useMemo(() => {
    const parts: string[] = [`# ${m.research.memo.title}`, '', `${m.research.memo.dataRevision}: ${decisionRecord.dataRevision}`, '', `## ${m.research.memo.sectionTask}`];
    facts.forEach((fact) => parts.push(`- ${fact.label}: ${fact.value}`)); parts.push('', `## ${m.research.memo.sectionCandidates}`);
    if (!displayedCandidates.length) parts.push(`_${m.workspace.emptyCandidates}_`);
    displayedCandidates.forEach((entry) => { const text = candidateTexts(entry, m); parts.push(`- **${entry.model.name}** (${entry.model.vendor} · ${entry.model.family})${text.reasons.length ? ` — ${m.research.whyRecommended}: ${text.reasons.join('、')}` : ''}${text.risks.length ? `；${m.research.mainRisks}: ${text.risks.join('、')}` : ''}`); });
    if (compareModels.length) { parts.push('', `## ${m.research.memo.sectionCompare}`); compareModels.forEach((model) => parts.push(`- ${model.name} (${model.vendor} · ${model.family})`)); }
    if (notSelected.length) { parts.push('', `## ${m.research.memo.sectionNotSelected}`); notSelected.forEach((entry) => parts.push(`- **${entry.model.name}**: ${entry.candidateState === 'blocked' ? m.research.excludedBlocked : entry.candidateState === 'needs_verification' ? m.research.excludedPending : candidateTexts(entry, m).risks.join('、') || m.research.memo.unverified}`)); }
    if (allRisks.length) { parts.push('', `## ${m.research.memo.sectionRisks}`); allRisks.forEach((risk) => parts.push(`- ${m.research.risks[risk] ?? risk}`)); }
    if (evidenceSources.length) { parts.push('', `## ${m.research.memo.sectionEvidence}`); evidenceSources.forEach((source) => parts.push(`- ${source.title ?? source.type}: ${source.url} (${source.checked_at})`)); }
    if (unresolved.length) { parts.push('', `## ${m.research.memo.unverified}`); unresolved.forEach((field) => parts.push(`- ${field}`)); }
    return parts.join('\n');
  }, [m, decisionRecord.dataRevision, facts, displayedCandidates, compareModels, notSelected, allRisks, evidenceSources, unresolved]);

  const downloadBlob = (content: string, type: string, filename: string) => { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); };
  const copy = async () => { try { await navigator.clipboard.writeText(markdown); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard may be unavailable */ } };
  const saveSnapshot = () => { const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`; saveDecisionSnapshot({ id, createdAt: new Date().toISOString(), task, candidateIds: candidates, compareIds: compare, claimFingerprints: currentFingerprints, memoMarkdown: markdown }); setSnapshotNotice(m.research.memo.snapshotSaved); window.setTimeout(() => setSnapshotNotice(''), 1800); };
  if (!hasTask) return <section className="decision-memo" aria-label={m.research.memo.title}><h2>{m.research.memo.title}</h2><p className="empty-state">{m.research.memo.empty}</p></section>;

  return <section className="decision-memo" aria-label={m.research.memo.title}>
    <div className="memo-header"><div><h2>{m.research.memo.title}</h2><p className="muted memo-revision">{m.research.memo.dataRevision}: {decisionRecord.dataRevision}</p></div><div className="memo-actions"><button type="button" className="button" onClick={copy}>{copied ? m.research.memo.copied : m.research.memo.copy}</button><button type="button" className="button button-primary" onClick={() => downloadBlob(markdown, 'text/markdown;charset=utf-8', 'decision-memo.md')}>{m.research.memo.download}</button><button type="button" className="button button-secondary" onClick={() => downloadBlob(decisionRecordToJson(decisionRecord), 'application/json;charset=utf-8', 'decision-record.json')}>{m.research.memo.downloadJson}</button><button type="button" className="button button-secondary" onClick={saveSnapshot}>{m.research.memo.saveSnapshot}</button>{snapshotNotice && <span className="muted" role="status">{snapshotNotice}</span>}</div></div>
    {changesSinceSnapshot.length > 0 && <aside className="snapshot-change-notice" role="status"><strong>{m.research.memo.snapshotChanged.replace('{count}', String(changesSinceSnapshot.length))}</strong><div className="snapshot-change-table-wrap"><table className="snapshot-change-table"><thead><tr><th>{m.research.memo.snapshotField}</th><th>{m.research.memo.snapshotPrevious}</th><th>{m.research.memo.snapshotCurrent}</th><th>{m.research.memo.snapshotChecked}</th></tr></thead><tbody>{changesSinceSnapshot.slice(0, 8).map((change) => <tr key={change.key}><th scope="row">{change.key}</th><td>{change.previousValue}</td><td>{change.currentValue}</td><td>{change.checkedAt}</td></tr>)}</tbody></table></div></aside>}
    <div className="memo-readable"><section><h3>{m.research.memo.sectionTask}</h3><dl className="memo-facts">{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></section><section><h3>{m.research.memo.sectionCandidates}</h3>{displayedCandidates.length ? <div className="memo-candidate-list">{displayedCandidates.map((entry) => { const text = candidateTexts(entry, m); return <article key={entry.model.id}><h4>{entry.model.name}</h4><p className="memo-model-meta">{entry.model.vendor} · {entry.model.family}</p>{text.reasons.length > 0 && <p><strong>{m.research.whyRecommended}</strong><br />{text.reasons.join(locale === 'zh' ? '；' : '; ')}</p>}{text.risks.length > 0 && <p className="memo-risk"><strong>{m.research.mainRisks}</strong><br />{text.risks.join(locale === 'zh' ? '；' : '; ')}</p>}</article>; })}</div> : <p className="muted">{m.workspace.emptyCandidates}</p>}</section>{compareModels.length > 0 && <section><h3>{m.research.memo.sectionCompare}</h3><ul>{compareModels.map((model) => <li key={model.id}>{model.name} · {model.family}</li>)}</ul></section>}{allRisks.length > 0 && <section><h3>{m.research.memo.sectionRisks}</h3><ul>{allRisks.map((risk) => <li key={risk}>{m.research.risks[risk] ?? risk}</li>)}</ul></section>}{unresolved.length > 0 && <section className="memo-unverified"><h3>{m.research.memo.unverified}</h3><p className="muted">{locale === 'zh' ? '这些字段没有被转换成 false；在严格复现前应继续核验。' : 'These fields remain unknown rather than being coerced to false; verify them before strict reproduction.'}</p><ul>{unresolved.map((field) => <li key={field}><code>{field}</code></li>)}</ul></section>}{evidenceSources.length > 0 && <section><h3>{m.research.memo.sectionEvidence}</h3><ol className="memo-evidence-list">{evidenceSources.slice(0, 12).map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title ?? source.type}</a><span>{source.checked_at}</span></li>)}</ol></section>}</div>
    <details className="memo-source-preview"><summary>{locale === 'zh' ? '查看 Markdown 源文本' : 'View Markdown source'}</summary><pre className="memo-preview"><code>{markdown}</code></pre></details>
  </section>;
}
