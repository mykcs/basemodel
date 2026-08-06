import { useStore } from '@nanostores/react';
import { quickViewId, closeQuickView } from '../../stores/ui';
import type { AtlasModel } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';

interface Props {
  models: AtlasModel[];
  m: Messages;
}

function renderBoolean(value: boolean | string): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

export function EvidenceInspector({ models, m }: Props) {
  const selected = useStore(quickViewId);
  const model = selected ? models.find((m) => m.id === selected) ?? null : null;

  if (!model) {
    return (
      <aside className="evidence-inspector" aria-label={m.workspace.evidenceTitle}>
        <h2>{m.workspace.evidenceTitle}</h2>
        <p className="empty-state">{m.workspace.emptyCandidates}</p>
      </aside>
    );
  }

  return (
    <aside className="evidence-inspector" aria-label={m.workspace.evidenceTitle}>
      <div className="inspector-header">
        <h2>{model.name}</h2>
        <button type="button" className="button" onClick={() => closeQuickView()} aria-label="Close">
          ×
        </button>
      </div>

      <div className="inspector-section">
        <h3>{m.workspace.openness}</h3>
        <dl className="inspector-facts">
          <dt>weights_available</dt>
          <dd>{renderBoolean(model.openness.weights_available)}</dd>
          <dt>finetuning_allowed</dt>
          <dd>{renderBoolean(model.openness.finetuning_allowed)}</dd>
          <dt>classification</dt>
          <dd>{String(model.openness.classification ?? '-')}</dd>
        </dl>
      </div>

      <div className="inspector-section">
        <h3>{m.workspace.research}</h3>
        <dl className="inspector-facts">
          <dt>suitable_for_lora</dt>
          <dd>{renderBoolean(model.research.suitable_for_lora)}</dd>
          <dt>suitable_for_sft</dt>
          <dd>{renderBoolean(model.research.suitable_for_sft)}</dd>
          <dt>suitable_for_rl</dt>
          <dd>{renderBoolean(model.research.suitable_for_rl)}</dd>
        </dl>
      </div>

      <div className="inspector-section">
        <h3>{m.workspace.hardware}</h3>
        <dl className="inspector-facts">
          <dt>inference_tier</dt>
          <dd>{String(model.hardware.inference_tier)}</dd>
          <dt>lora_tier</dt>
          <dd>{String(model.hardware.lora_tier)}</dd>
          <dt>rl_tier</dt>
          <dd>{String(model.hardware.rl_tier)}</dd>
        </dl>
      </div>

      <div className="inspector-section">
        <h3>{m.workspace.access}</h3>
        <dl className="inspector-facts">
          <dt>api_status</dt>
          <dd>{String(model.access?.api_status ?? '-')}</dd>
          <dt>weights_status</dt>
          <dd>{String(model.access?.weights_status ?? '-')}</dd>
        </dl>
      </div>

      <div className="inspector-section">
        <h3>{m.workspace.sources}</h3>
        {model.sources.length === 0 ? (
          <p>{m.workspace.noSource}</p>
        ) : (
          <ul className="inspector-sources">
            {model.sources.map((s, i) => (
              <li key={i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="external-link">
                  {s.type} ↗
                </a>
                <span className="source-meta">{s.checked_at}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
