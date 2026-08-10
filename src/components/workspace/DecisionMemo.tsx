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

function taskLines(task: ResearchTask, m: Messages, locale: Locale): string[] {
  const lines: string[] = [];
  lines.push(`- ${m.workspace.modeLabel}: ${researchModeLabel(task.mode, locale)}`);
  if (task.roles.length) lines.push(`- ${m.workspace.roleLabel}: ${task.roles.map((role) => roleLabel(role, locale)).join(locale === 'zh' ? '、' : ', ')}`);
  lines.push(`- ${m.workspace.updateLabel}: ${updateMethodLabel(task.update, locale)}`);
  if (typeof task.gpuVramGb === 'number') lines.push(`- GPU: ${task.gpuVramGb}GB × ${task.gpuCount ?? 1}`);
  if (task.precision) lines.push(`- Precision: ${task.precision}`);
  if (typeof task.batchSize === 'number') lines.push(`- Batch: ${task.batchSize}`);
  if (typeof task.loraRank === 'number') lines.push(`- LoRA rank: ${task.loraRank}`);
  if (task.optimizer) lines.push(`- Optimizer: ${task.optimizer}`);
  if (task.kvCacheEnabled !== undefined) lines.push(`- KV cache: ${task.kvCacheEnabled ? 'included' : 'excluded'}`);
  if (task.openWeight) lines.push(`- ${m.workspace.openWeightLabel}`);
  if (typeof task.contextTarget === 'number') lines.push(`- ${m.workspace.contextLabel}: ${task.contextTarget}`);
  if (task.priorities.length) lines.push(`- ${m.workspace.priorityLabel}: ${task.priorities.map((priority) => m.selector.goals[priority as keyof typeof m.selector.goals] ?? priority).join(locale === 'zh' ? '、' : ', ')}`);
  return lines;
}

function candidateLine(s: ScoredModel, m: Messages, joiner = '、'): string {
  const reasons = s.reasons.map((r) => m.research.reasons[r] ?? r).join(joiner);
  const risks = s.risks.map((r) => m.research.risks[r] ?? r).join(joiner);
  const why = reasons ? ` — ${m.research.whyRecommended}: ${reasons}` : '';
  const risk = risks ? `；${m.research.mainRisks}: ${risks}` : '';
  return `- **${s.model.name}** (${s.model.vendor} · ${s.model.family})${why}${risk}`;
}

export function DecisionMemo({ models, papers, m, locale = 'zh' }: Props) {
  const task = useStore(researchTask);
  const compare = useStore(compareIds);
  const candidates = useStore(candidateIds);
  const [copied, setCopied] = useState(false);
  const [snapshotNotice, setSnapshotNotice] = useState('');

  const scored = useMemo(() => scoreModels(models, papers, task), [models, papers, task]);
  const buckets = useMemo(() => bucketize(scored), [scored]);
  const chosen = useMemo(() => scored.filter((s) => candidates.includes(s.model.id)), [scored, candidates]);
  const compareModels = useMemo(() => models.filter((x) => compare.includes(x.id)), [models, compare]);
  const hasTask = hasMeaningfulResearchTask(task);
  const decisionRecord = useMemo(() => buildDecisionRecord(task, scored, candidates, compare), [task, scored, candidates, compare]);
  const snapshotModels = useMemo(() => { const ids = new Set([...candidates, ...compare]); return models.filter((model) => ids.has(model.id)); }, [models, candidates, compare]);
  const currentFingerprints = useMemo(() => collectClaimFingerprints(snapshotModels), [snapshotModels]);
  const latestSnapshot = useStore(decisionSnapshots)[0];
  const changesSinceSnapshot = useMemo(() => latestSnapshot ? snapshotChanges(latestSnapshot, currentFingerprints) : [], [latestSnapshot, currentFingerprints]);

  const displayedCandidates = useMemo(() => chosen.length ? chosen : [...buckets.baseline, ...buckets.modern, ...buckets.resource].slice(0, 5), [buckets, chosen]);
  const notSelected = useMemo(() => scored.filter((entry) => !candidates.includes(entry.model.id)).slice(0, 5), [candidates, scored]);
  const allRisks = useMemo(() => [...new Set(displayedCandidates.flatMap((entry) => entry.risks))], [displayedCandidates]);
  const evidenceSources = useMemo(() => [...new Map([
    ...displayedCandidates.flatMap((entry) => entry.model.sources),
    ...compareModels.flatMap((model) => model.sources),
    ...papers.filter((paper) => task.reference?.paperId === paper.id).flatMap((paper) => paper.sources),
  ].map((source) => [source.url, source])).values()], [compareModels, displayedCandidates, papers, task.reference?.paperId]);
  const unresolved = useMemo(() => [...new Set(scored.flatMap((entry) => entry.outcomes.filter((outcome) => outcome.state === 'unknown').flatMap((outcome) => outcome.fieldPaths)))], [scored]);

  const markdown = useMemo(() => {
    const joiner = locale === 'zh' ? '、' : ', ';
    const parts: string[] = [`# ${m.research.memo.title}`, '', `${m.research.memo.dataRevision}: ${decisionRecord.dataRevision}`, '', `## ${m.research.memo.sectionTask}`, ...taskLines(task, m, locale), '', `## ${m.research.memo.sectionCandidates}`];
    if (!displayedCandidates.length) parts.push(`_${m.workspace.emptyCandidates}_`);
    else displayedCandidates.forEach((entry) => parts.push(candidateLine(entry, m, joiner)));
    parts.push('');
    if (compareModels.length) {
      parts.push(`## ${m.research.memo.sectionCompare}`);
      compareModels.forEach((model) => parts.push(`- ${model.name} (${model.vendor} · ${model.family})`));
      parts.push('');
    }
    if (notSelected.length) {
      parts.push(`## ${m.research.memo.sectionNotSelected}`);
      notSelected.forEach((entry) => {
        const reason = entry.candidateState === 'blocked' ? m.research.excludedBlocked : entry.candidateState === 'needs_verification' ? m.research.excludedPending : entry.risks.map((risk) => m.research.risks[risk] ?? risk).join(joiner);
        parts.push(`- **${entry.model.name}**: ${reason || m.research.memo.unverified}`);
      });
      parts.push('');
    }
    if (allRisks.length) {
      parts.push(`## ${m.research.memo.sectionRisks}`);
      allRisks.forEach((risk) => parts.push(`- ${m.research.risks[risk] ?? risk}`));
      parts.push('');
    }
    if (evidenceSources.length) {
      parts.push(`## ${m.research.memo.sectionEvidence}`);
      evidenceSources.forEach((source) => parts.push(`- ${source.title ?? source.type}: ${source.url} (${source.checked_at})`));
      parts.push('');
    }
    if (unresolved.length) {
      parts.push(`## ${m.research.memo.unverified}`);
      unresolved.forEach((field) => parts.push(`- ${field}`));
      parts.push('');
    }
    return parts.join('\n');
  }, [allRisks, compareModels, decisionRecord.dataRevision, displayedCandidates, evidenceSources, locale, m, notSelected, task, unresolved]);

  const download = () => { const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'decision-memo.md'; a.click(); URL.revokeObjectURL(url); };
  const copy = async () => { try { await navigator.clipboard.writeText(markdown); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard unavailable */ } };
  const downloadJson = () => { const blob = new Blob([decisionRecordToJson(decisionRecord)], { type: 'application/json;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'decision-record.json'; a.click(); URL.revokeObjectURL(url); };
  const saveSnapshot = () => { const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`; saveDecisionSnapshot({ id, createdAt: new Date().toISOString(), task, candidateIds: candidates, compareIds: compare, claimFingerprints: currentFingerprints, memoMarkdown: markdown }); setSnapshotNotice(m.research.memo.snapshotSaved); window.setTimeout(() => setSnapshotNotice(''), 1800); };

  if (!hasTask) return <section className="decision-memo" aria-label={m.research.memo.title}><h2>{m.research.memo.title}</h2><p className="empty-state">{m.research.memo.empty}</p></section>;

  const taskFacts = taskLines(task, m, locale).map((line) => line.replace(/^-[ ]?/, ''));
  const joiner = locale === 'zh' ? '、' : ', ';

  return <section className="decision-memo" aria-label={m.research.memo.title}>
    <div className="memo-header">
      <div><h2>{m.research.memo.title}</h2><p className="memo-revision muted">{m.research.memo.dataRevision}: {decisionRecord.dataRevision}</p></div>
      <div className="memo-actions">
        <button type="button" className="button" onClick={copy}>{copied ? m.research.memo.copied : m.research.memo.copy}</button>
        <button type="button" className="button button-primary" onClick={download}>{m.research.memo.download}</button>
        <button type="button" className="button button-secondary" onClick={downloadJson}>{m.research.memo.downloadJson}</button>
        <button type="button" className="button button-secondary" onClick={saveSnapshot}>{m.research.memo.saveSnapshot}</button>
        {snapshotNotice && <span className="muted" role="status">{snapshotNotice}</span>}
      </div>
    </div>

    {changesSinceSnapshot.length > 0 && <aside className="snapshot-change-notice" role="status">
      <strong>{m.research.memo.snapshotChanged.replace('{count}', String(changesSinceSnapshot.length))}</strong>
      <div className="snapshot-change-table-wrap"><table className="snapshot-change-table"><thead><tr><th>{m.research.memo.snapshotField}</th><th>{m.research.memo.snapshotPrevious}</th><th>{m.research.memo.snapshotCurrent}</th><th>{m.research.memo.snapshotChecked}</th></tr></thead><tbody>{changesSinceSnapshot.slice(0, 8).map((change) => <tr key={change.key}><th scope="row">{change.key}</th><td>{change.previousValue}</td><td>{change.currentValue}</td><td>{change.checkedAt}</td></tr>)}</tbody></table></div>
    </aside>}

    <div className="memo-readable">
      <section><h3>{m.research.memo.sectionTask}</h3><ul>{taskFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul></section>
      <section><h3>{m.research.memo.sectionCandidates}</h3>{displayedCandidates.length ? <div className="memo-candidate-list">{displayedCandidates.map((entry) => <article key={entry.model.id}><h4>{entry.model.name}</h4><div className="memo-model-meta">{entry.model.vendor} · {entry.model.family}</div>{entry.reasons.length > 0 && <p><strong>{m.research.whyRecommended}:</strong> {entry.reasons.map((reason) => m.research.reasons[reason] ?? reason).join(joiner)}</p>}{entry.risks.length > 0 && <p className="memo-risk"><strong>{m.research.mainRisks}:</strong> {entry.risks.map((risk) => m.research.risks[risk] ?? risk).join(joiner)}</p>}</article>)}</div> : <p>{m.workspace.emptyCandidates}</p>}</section>
      {compareModels.length > 0 && <section><h3>{m.research.memo.sectionCompare}</h3><ul>{compareModels.map((model) => <li key={model.id}>{model.name} · {model.vendor} · {model.family}</li>)}</ul></section>}
      {notSelected.length > 0 && <section><h3>{m.research.memo.sectionNotSelected}</h3><ul>{notSelected.map((entry) => <li key={entry.model.id}><strong>{entry.model.name}:</strong> {entry.candidateState === 'blocked' ? m.research.excludedBlocked : entry.candidateState === 'needs_verification' ? m.research.excludedPending : entry.risks.map((risk) => m.research.risks[risk] ?? risk).join(joiner) || m.research.memo.unverified}</li>)}</ul></section>}
      {evidenceSources.length > 0 && <section><h3>{m.research.memo.sectionEvidence}</h3><ul className="memo-evidence-list">{evidenceSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title ?? source.type}</a><span>{source.checked_at}</span></li>)}</ul></section>}
      {unresolved.length > 0 && <section className="memo-unverified"><h3>{m.research.memo.unverified}</h3><p>{locale === 'zh' ? '这些字段没有足够证据。它们不会被自动当成 false，也不应被写成确定结论。' : 'These fields do not have sufficient evidence. They are not coerced to false and should not be written as certain conclusions.'}</p><ul>{unresolved.slice(0, 20).map((field) => <li key={field}><code>{field}</code></li>)}</ul></section>}
    </div>

    <details className="memo-source-preview"><summary>{locale === 'zh' ? '查看导出的 Markdown 源文' : 'View exported Markdown source'}</summary><pre className="memo-preview"><code>{markdown}</code></pre></details>
  </section>;
}
