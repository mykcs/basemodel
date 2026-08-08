import { useStore } from '@nanostores/react';
import { useMemo } from 'react';
import { researchTask } from '../../stores/researchTask';
import { compareIds, addToCompare, removeFromCompare } from '../../stores/compare';
import { candidateIds, addCandidate, removeCandidate } from '../../stores/candidates';
import { openQuickView } from '../../stores/ui';
import { scoreModels, bucketize, type ScoredModel, type Bucket } from '../../lib/researchEngine';
import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';
import { fieldLabel } from '../../lib/fieldCatalog';
import type { Locale } from '../../i18n';

interface Props {
  models: AtlasModel[];
  papers: AtlasPaper[];
  m: Messages;
  locale?: Locale;
}

const BUCKETS: Bucket[] = ['baseline', 'modern', 'resource'];

export function CandidateBoard({ models, papers, m, locale = 'zh' }: Props) {
  const task = useStore(researchTask);
  const compare = useStore(compareIds);
  const candidates = useStore(candidateIds);

  const scored = useMemo(() => scoreModels(models, papers, task), [models, papers, task]);
  const buckets = useMemo(() => bucketize(scored), [scored]);
  const excluded = useMemo(() => scored.filter((entry) => entry.candidateState === 'blocked' || entry.candidateState === 'needs_verification'), [scored]);

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

      {total === 0 && excluded.length === 0 ? (
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
      {excluded.length > 0 && (
        <details className="excluded-candidates">
          <summary>{m.research.excludedTitle} ({excluded.length})</summary>
          <p className="bucket-hint">{m.research.excludedHint}</p>
          <ul className="candidate-list">
            {excluded.map((entry) => <ExcludedRow key={entry.model.id} scored={entry} m={m} locale={locale} />)}
          </ul>
        </details>
      )}
    </section>
  );
}

function ExcludedRow({ scored, m, locale }: { scored: ScoredModel; m: Messages; locale: Locale }) {
  const outcomes = scored.candidateState === 'blocked'
    ? scored.fit.blockers
    : scored.outcomes.filter((outcome) => outcome.state === 'unknown');
  const paths = [...new Set(outcomes.flatMap((outcome) => outcome.fieldPaths))].slice(0, 4);
  return (
    <li className="candidate-row excluded-row">
      <div className="candidate-info">
        <div className="candidate-name-line"><strong>{scored.model.name}</strong><span className="candidate-meta">{scored.model.vendor} · {scored.model.family}</span></div>
        <div className="risk-line"><span className="risk-label">{scored.candidateState === 'blocked' ? m.research.excludedBlocked : m.research.excludedPending}</span></div>
        {paths.length > 0 && <ul className="excluded-reasons">{paths.map((path) => <li key={path}><span aria-hidden="true">{scored.candidateState === 'blocked' ? '✕' : '?'}</span> {fieldLabel(path, locale)}</li>)}</ul>}
      </div>
      <button type="button" className="button" onClick={() => openQuickView(scored.model.id)}>{m.detail.overview}</button>
    </li>
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
        <details className="candidate-fit-profile">
          <summary>{m.explorer.taskFitLabel}</summary>
          <dl className="candidate-fit-grid">
            {([
              [m.explorer.feasibility, scored.fit.feasibility.level],
              [m.explorer.researchSuitability, scored.fit.researchSuitability.level],
              [m.explorer.comparability, scored.fit.comparability.level],
              [m.explorer.reproducibility, scored.fit.reproducibility.level],
              [m.explorer.evidenceQuality, scored.fit.evidenceQuality.level],
            ] as Array<[string, 'high' | 'medium' | 'low' | 'unknown']>).map(([label, level]) => {
              const levelKey = `level${String(level).charAt(0).toUpperCase()}${String(level).slice(1)}` as 'levelHigh' | 'levelMedium' | 'levelLow' | 'levelUnknown';
              return <div key={label}><dt>{label}</dt><dd className={`fit-level-${String(level)}`}>{m.explorer[levelKey]}</dd></div>;
            })}
          </dl>
        </details>
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
