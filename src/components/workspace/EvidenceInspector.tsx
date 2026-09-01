import { useStore } from '@nanostores/react';
import { quickViewId, closeQuickView } from '../../stores/ui';
import { displayBoolean, displayUnknown, licenseLabel, tierLabel } from '../../lib/format';
import type { AtlasModel } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';
import type { Locale } from '../../i18n';
import ExternalBrandMark from '../common/ExternalBrandMark';

interface Props {
  models: AtlasModel[];
  m: Messages;
  locale?: Locale;
}

export function EvidenceInspector({ models, m, locale = 'zh' }: Props) {
  const selected = useStore(quickViewId);
  const model = selected ? models.find((item) => item.id === selected) ?? null : null;

  if (!model) {
    return <aside className="evidence-inspector" aria-label={m.workspace.evidenceTitle}><h2>{m.workspace.evidenceTitle}</h2><p className="empty-state">{m.workspace.emptyCandidates}</p></aside>;
  }

  return (
    <aside className="evidence-inspector" aria-label={m.workspace.evidenceTitle}>
      <div className="inspector-header"><h2>{model.name}</h2><button type="button" className="button" onClick={() => closeQuickView()} aria-label={m.workspace.clearTask}>×</button></div>
      <div className="inspector-section">
        <h3>{m.workspace.openness}</h3>
        <dl className="inspector-facts">
          <dt>{m.detail.openWeights}</dt><dd>{displayBoolean(model.openness.weights_available, locale)}</dd>
          <dt>{m.detail.finetuningAllowed}</dt><dd>{displayBoolean(model.openness.finetuning_allowed, locale)}</dd>
          <dt>{m.detail.opennessClass}</dt><dd>{licenseLabel(model.openness.classification, locale)}</dd>
          <dt>{m.detail.license}</dt><dd>{licenseLabel(model.openness.license_name, locale)}</dd>
        </dl>
      </div>
      <div className="inspector-section">
        <h3>{m.workspace.research}</h3>
        <dl className="inspector-facts">
          <dt>{m.detail.research.lora}</dt><dd>{displayBoolean(model.research.suitable_for_lora, locale)}</dd>
          <dt>{m.detail.research.sft}</dt><dd>{displayBoolean(model.research.suitable_for_sft, locale)}</dd>
          <dt>{m.detail.research.rl}</dt><dd>{displayBoolean(model.research.suitable_for_rl, locale)}</dd>
        </dl>
      </div>
      <div className="inspector-section">
        <h3>{m.workspace.hardware}</h3>
        <dl className="inspector-facts">
          <dt>{m.detail.inference}</dt><dd>{tierLabel(model.hardware.inference_tier, locale)}</dd>
          <dt>{m.detail.research.lora}</dt><dd>{tierLabel(model.hardware.lora_tier, locale)}</dd>
          <dt>{m.detail.research.rl}</dt><dd>{tierLabel(model.hardware.rl_tier, locale)}</dd>
        </dl>
      </div>
      <div className="inspector-section">
        <h3>{m.workspace.access}</h3>
        <dl className="inspector-facts">
          <dt>{m.detail.apiStatus}</dt><dd>{displayUnknown(model.access?.api_status, '', locale)}</dd>
          <dt>{m.detail.weightsStatus}</dt><dd>{displayUnknown(model.access?.weights_status, '', locale)}</dd>
        </dl>
      </div>
      <div className="inspector-section">
        <h3>{m.workspace.sources}</h3>
        {model.sources.length === 0 ? <p>{m.workspace.noSource}</p> : <ul className="inspector-sources">{model.sources.map((source, index) => <li key={source.id ?? `${source.url}-${index}`}><a href={source.url} target="_blank" rel="noopener noreferrer" className="external-link"><ExternalBrandMark href={source.url} />{source.title ?? source.publisher ?? m.workspace.sources} ↗</a><span className="source-meta">{source.checked_at}</span></li>)}</ul>}
      </div>
    </aside>
  );
}
