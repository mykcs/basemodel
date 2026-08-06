import { useStore } from '@nanostores/react';
import { useMemo } from 'react';
import { researchTask } from '../../stores/researchTask';
import { compareIds, addToCompare, removeFromCompare } from '../../stores/compare';
import { candidateIds, addCandidate, removeCandidate } from '../../stores/candidates';
import { openQuickView } from '../../stores/ui';
import { scoreModels, bucketize, type ScoredModel, type Bucket } from '../../lib/researchEngine';
import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';

interface Props {
  models: AtlasModel[];
  papers: AtlasPaper[];
  m: Messages;
}

const BUCKETS: Bucket[] = ['baseline', 'modern', 'resource'];

export function CandidateBoard({ models, papers, m }: Props) {
  const task = useStore(researchTask);
  const compare = useStore(compareIds);
  const candidates = useStore(candidateIds);

  const scored = useMemo(() => scoreModels(models, papers, task), [models, papers, task]);
  const buckets = useMemo(() => bucketize(scored), [scored]);

  const bucketMeta: Record<Bucket, { title: string; hint: string }> = {
    baseline: { title: m.research.bucketBaseline, hint: m.research.bucketBaselineHint },
    modern: { title: m.research.bucketModern, hint: m.research.bucketModernHint },
    resource: { title: m.research.bucketResource, hint: m.research.bucketResourceHint },
  };

  const total = buckets.baseline.length + buckets.modern.length + buckets.resource.length;

  return (
    <section className="candidate-board" aria-label={m.workspace.candidateTitle}>
      <div className="board-header">
        <h2>{m.workspace.candidateTitle}</h2>
        <span className="result-count">
          {total} {m.workspace.candidateCount}
        </span>
      </div>

      {total === 0 ? (
        <p className="empty-state">{m.workspace.emptyCandidates}</p>
      ) : (
        BUCKETS.map((bucket) =>
          buckets[bucket].length === 0 ? null : (
            <div key={bucket} className={`candidate-bucket bucket-${bucket}`}>
              <div className="bucket-header">
                <h3>{bucketMeta[bucket].title}</h3>
                <p className="bucket-hint">{bucketMeta[bucket].hint}</p>
              </div>
              <ul className="candidate-list">
                {buckets[bucket].map((s) => (
                  <CandidateRow
                    key={s.model.id}
                    scored={s}
                    m={m}
                    inCompare={compare.includes(s.model.id)}
                    inCandidate={candidates.includes(s.model.id)}
                  />
                ))}
              </ul>
            </div>
          )
        )
      )}
    </section>
  );
}

interface RowProps {
  scored: ScoredModel;
  m: Messages;
  inCompare: boolean;
  inCandidate: boolean;
}

function CandidateRow({ scored, m, inCompare, inCandidate }: RowProps) {
  const { model, reasons, risks, paperCount } = scored;

  return (
    <li className="candidate-row">
      <div className="candidate-info">
        <div className="candidate-name-line">
          <strong>{model.name}</strong>
          <span className="candidate-meta">
            {model.vendor} · {model.family}
            {paperCount > 0 && (
              <span className="paper-count">
                {' '}· {paperCount} {m.research.papersUsed}
              </span>
            )}
          </span>
        </div>

        {reasons.length > 0 && (
          <div className="reason-line">
            <span className="reason-label">{m.research.whyRecommended}:</span>
            <span className="chip-row">
              {reasons.map((r) => (
                <span key={r} className="reason-chip">
                  {m.research.reasons[r] ?? r}
                </span>
              ))}
            </span>
          </div>
        )}

        {risks.length > 0 && (
          <div className="risk-line">
            <span className="risk-label">{m.research.mainRisks}:</span>
            <span className="chip-row">
              {risks.map((r) => (
                <span key={r} className="risk-chip">
                  {m.research.risks[r] ?? r}
                </span>
              ))}
            </span>
          </div>
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
