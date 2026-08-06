import { useStore } from '@nanostores/react';
import { researchTask, filterCandidatesByTask, taskBlockers, type ResearchTask } from '../../stores/researchTask';
import { compareIds, addToCompare, removeFromCompare } from '../../stores/compare';
import { candidateIds, addCandidate, removeCandidate } from '../../stores/candidates';
import { openQuickView } from '../../stores/ui';
import type { AtlasModel } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';

interface Props {
  models: AtlasModel[];
  m: Messages;
}

export function CandidateBoard({ models, m }: Props) {
  const task = useStore(researchTask);
  const compare = useStore(compareIds);
  const candidates = useStore(candidateIds);

  const filtered = filterCandidatesByTask(models, task);

  return (
    <section className="candidate-board" aria-label={m.workspace.candidateTitle}>
      <div className="board-header">
        <h2>{m.workspace.candidateTitle}</h2>
        <span className="result-count">
          {filtered.length} {m.workspace.candidateCount}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">{m.workspace.emptyCandidates}</p>
      ) : (
        <ul className="candidate-list">
          {filtered.map((model) => (
            <CandidateRow
              key={model.id}
              model={model}
              task={task}
              m={m}
              inCompare={compare.includes(model.id)}
              inCandidate={candidates.includes(model.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

interface RowProps {
  model: AtlasModel;
  task: ResearchTask;
  m: Messages;
  inCompare: boolean;
  inCandidate: boolean;
}

function CandidateRow({ model, task, m, inCompare, inCandidate }: RowProps) {
  const blockers = taskBlockers(model, task);

  return (
    <li className="candidate-row">
      <div className="candidate-info">
        <strong>{model.name}</strong>
        <span>{model.vendor} · {model.family}</span>
        {blockers.length > 0 && (
          <span className="candidate-blockers">{blockers.join(' · ')}</span>
        )}
      </div>
      <div className="candidate-actions">
        <button
          type="button"
          className={`button ${inCompare ? 'button-secondary' : 'button-primary'}`}
          onClick={() => (inCompare ? removeFromCompare(model.id) : addToCompare(model.id))}
        >
          {inCompare ? m.workspace.removeFromCompare : m.workspace.addToCompare}
        </button>
        <button
          type="button"
          className="button"
          onClick={() => (inCandidate ? removeCandidate(model.id) : addCandidate(model.id))}
        >
          {inCandidate ? m.workspace.removeCandidate : m.workspace.addCandidate}
        </button>
        <button type="button" className="button" onClick={() => openQuickView(model.id)}>
          {m.detail.overview}
        </button>
      </div>
    </li>
  );
}
