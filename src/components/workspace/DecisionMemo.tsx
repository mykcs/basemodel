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

interface Props {
  models: AtlasModel[];
  papers: AtlasPaper[];
  m: Messages;
  locale?: Locale;
}

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

function candidateLine(s: ScoredModel, m: Messages): string {
  const reasons = s.reasons.map((r) => m.research.reasons[r] ?? r).join('、');
  const risks = s.risks.map((r) => m.research.risks[r] ?? r).join('、');
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

  const chosen = useMemo(
    () => scored.filter((s) => candidates.includes(s.model.id)),
    [scored, candidates]
  );
  const compareModels = useMemo(
    () => models.filter((x) => compare.includes(x.id)),
    [models, compare]
  );

  const hasTask = hasMeaningfulResearchTask(task);
  const decisionRecord = useMemo(() => buildDecisionRecord(task, scored, candidates, compare), [task, scored, candidates, compare]);
  const snapshotModels = useMemo(() => {
    const ids = new Set([...candidates, ...compare]);
    return models.filter((model) => ids.has(model.id));
  }, [models, candidates, compare]);
  const currentFingerprints = useMemo(() => collectClaimFingerprints(snapshotModels), [snapshotModels]);
  const latestSnapshot = useStore(decisionSnapshots)[0];
  const changesSinceSnapshot = useMemo(() => latestSnapshot ? snapshotChanges(latestSnapshot, currentFingerprints) : [], [latestSnapshot, currentFingerprints]);

  const markdown = useMemo(() => {
    const parts: string[] = [];
    parts.push(`# ${m.research.memo.title}`);
    parts.push('');
    parts.push(`${m.research.memo.dataRevision}: ${decisionRecord.dataRevision}`);
    parts.push('');
    parts.push(`## ${m.research.memo.sectionTask}`);
    parts.push(...taskLines(task, m, locale));
    parts.push('');

    parts.push(`## ${m.research.memo.sectionCandidates}`);
    if (chosen.length === 0 && buckets.baseline.length + buckets.modern.length + buckets.resource.length === 0) {
      parts.push(`_${m.workspace.emptyCandidates}_`);
    } else {
      if (chosen.length > 0) {
        chosen.forEach((s) => parts.push(candidateLine(s, m)));
      } else {
        const top = [...buckets.baseline, ...buckets.modern, ...buckets.resource].slice(0, 5);
        top.forEach((s) => parts.push(candidateLine(s, m)));
      }
    }
    parts.push('');

    if (compareModels.length > 0) {
      parts.push(`## ${m.research.memo.sectionCompare}`);
      compareModels.forEach((x) => parts.push(`- ${x.name} (${x.vendor} · ${x.family})`));
      parts.push('');
    }

    const notSelected = scored.filter((entry) => !candidates.includes(entry.model.id)).slice(0, 5);
    if (notSelected.length > 0) {
      parts.push(`## ${m.research.memo.sectionNotSelected}`);
      notSelected.forEach((entry) => {
        const reason = entry.candidateState === 'blocked' ? m.research.excludedBlocked : entry.candidateState === 'needs_verification' ? m.research.excludedPending : entry.risks.map((risk) => m.research.risks[risk] ?? risk).join('、');
        parts.push(`- **${entry.model.name}**: ${reason || m.research.memo.unverified}`);
      });
      parts.push('');
    }

    const allRisks = [...new Set(chosen.flatMap((s) => s.risks))];
    if (allRisks.length > 0) {
      parts.push(`## ${m.research.memo.sectionRisks}`);
      allRisks.forEach((r) => parts.push(`- ${m.research.risks[r] ?? r}`));
      parts.push('');
    }

    const evidenceSources = [...new Map([
      ...chosen.flatMap((entry) => entry.model.sources),
      ...compareModels.flatMap((model) => model.sources),
      ...papers.filter((paper) => task.reference?.paperId === paper.id).flatMap((paper) => paper.sources),
    ].map((source) => [source.url, source])).values()];
    if (evidenceSources.length > 0) {
      parts.push(`## ${m.research.memo.sectionEvidence}`);
      evidenceSources.forEach((source) => parts.push(`- ${source.title ?? source.type}: ${source.url} (${source.checked_at})`));
      parts.push('');
    }
    const unresolved = [...new Set(scored.flatMap((entry) => entry.outcomes.filter((outcome) => outcome.state === 'unknown').flatMap((outcome) => outcome.fieldPaths)))];
    if (unresolved.length > 0) {
      parts.push(`## ${m.research.memo.unverified}`);
      unresolved.forEach((field) => parts.push(`- ${field}`));
      parts.push('');
    }

    return parts.join('\n');
  }, [task, chosen, buckets, compareModels, m, locale]);

  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decision-memo.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard 不可用时静默
    }
  };

  const downloadJson = () => {
    const blob = new Blob([decisionRecordToJson(decisionRecord)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decision-record.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveSnapshot = () => {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`;
    saveDecisionSnapshot({ id, createdAt: new Date().toISOString(), task, candidateIds: candidates, compareIds: compare, claimFingerprints: currentFingerprints, memoMarkdown: markdown });
    setSnapshotNotice(m.research.memo.snapshotSaved);
    window.setTimeout(() => setSnapshotNotice(''), 1800);
  };

  if (!hasTask) {
    return (
      <section className="decision-memo" aria-label={m.research.memo.title}>
        <h2>{m.research.memo.title}</h2>
        <p className="empty-state">{m.research.memo.empty}</p>
      </section>
    );
  }

  return (
    <section className="decision-memo" aria-label={m.research.memo.title}>
      <div className="memo-header">
        <h2>{m.research.memo.title}</h2>
        <div className="memo-actions">
          <button type="button" className="button" onClick={copy}>
            {copied ? m.research.memo.copied : m.research.memo.copy}
          </button>
          <button type="button" className="button button-primary" onClick={download}>
            {m.research.memo.download}
          </button>
          <button type="button" className="button button-secondary" onClick={downloadJson}>
            {m.research.memo.downloadJson}
          </button>
          <button type="button" className="button button-secondary" onClick={saveSnapshot}>
            {m.research.memo.saveSnapshot}
          </button>
          {snapshotNotice && <span className="muted" role="status">{snapshotNotice}</span>}
        </div>
      </div>
      {changesSinceSnapshot.length > 0 && <aside className="snapshot-change-notice" role="status">
        <strong>{m.research.memo.snapshotChanged.replace('{count}', String(changesSinceSnapshot.length))}</strong>
        <div className="snapshot-change-table-wrap"><table className="snapshot-change-table"><thead><tr><th>{m.research.memo.snapshotField}</th><th>{m.research.memo.snapshotPrevious}</th><th>{m.research.memo.snapshotCurrent}</th><th>{m.research.memo.snapshotChecked}</th></tr></thead><tbody>{changesSinceSnapshot.slice(0, 8).map((change) => <tr key={change.key}><th scope="row">{change.key}</th><td>{change.previousValue}</td><td>{change.currentValue}</td><td>{change.checkedAt}</td></tr>)}</tbody></table></div>
      </aside>}
      <pre className="memo-preview">
        <code>{markdown}</code>
      </pre>
    </section>
  );
}
