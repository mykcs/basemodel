import { useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { researchTask, type ResearchTask } from '../../stores/researchTask';
import { compareIds } from '../../stores/compare';
import { candidateIds } from '../../stores/candidates';
import { scoreModels, bucketize, type ScoredModel } from '../../lib/researchEngine';
import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';

interface Props {
  models: AtlasModel[];
  papers: AtlasPaper[];
  m: Messages;
}

function taskLines(task: ResearchTask, m: Messages): string[] {
  const lines: string[] = [];
  lines.push(`- ${m.workspace.modeLabel}: ${task.mode}`);
  if (task.roles.length) lines.push(`- ${m.workspace.roleLabel}: ${task.roles.join(', ')}`);
  lines.push(`- ${m.workspace.updateLabel}: ${task.update}`);
  if (typeof task.gpuVramGb === 'number') lines.push(`- GPU: ${task.gpuVramGb}GB × ${task.gpuCount ?? 1}`);
  if (task.openWeight) lines.push(`- ${m.workspace.openWeightLabel}`);
  if (typeof task.contextTarget === 'number') lines.push(`- ${m.workspace.contextLabel}: ${task.contextTarget}`);
  if (task.priorities.length) lines.push(`- ${m.workspace.priorityLabel}: ${task.priorities.join(', ')}`);
  return lines;
}

function candidateLine(s: ScoredModel, m: Messages): string {
  const reasons = s.reasons.map((r) => m.research.reasons[r] ?? r).join('、');
  const risks = s.risks.map((r) => m.research.risks[r] ?? r).join('、');
  const why = reasons ? ` — ${m.research.whyRecommended}: ${reasons}` : '';
  const risk = risks ? `；${m.research.mainRisks}: ${risks}` : '';
  return `- **${s.model.name}** (${s.model.vendor} · ${s.model.family})${why}${risk}`;
}

export function DecisionMemo({ models, papers, m }: Props) {
  const task = useStore(researchTask);
  const compare = useStore(compareIds);
  const candidates = useStore(candidateIds);
  const [copied, setCopied] = useState(false);

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

  const hasTask =
    task.mode !== 'strict' || task.roles.length > 0 || task.update !== 'none' || task.priorities.length > 0;

  const markdown = useMemo(() => {
    const parts: string[] = [];
    parts.push(`# ${m.research.memo.title}`);
    parts.push('');
    parts.push(`## ${m.research.memo.sectionTask}`);
    parts.push(...taskLines(task, m));
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

    const allRisks = [...new Set(chosen.flatMap((s) => s.risks))];
    if (allRisks.length > 0) {
      parts.push(`## ${m.research.memo.sectionRisks}`);
      allRisks.forEach((r) => parts.push(`- ${m.research.risks[r] ?? r}`));
      parts.push('');
    }

    return parts.join('\n');
  }, [task, chosen, buckets, compareModels, m]);

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
        </div>
      </div>
      <pre className="memo-preview">
        <code>{markdown}</code>
      </pre>
    </section>
  );
}
