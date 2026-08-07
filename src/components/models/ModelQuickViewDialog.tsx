import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { closeQuickView, quickViewId } from '../../stores/ui';
import { displayBoolean, displayUnknown, licenseLabel, tierLabel } from '../../lib/format';
import { localePath, type Locale } from '../../i18n';
import type { AtlasModel } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';

interface Props {
  models: AtlasModel[];
  m: Messages;
  locale: Locale;
}

export function ModelQuickViewDialog({ models, m, locale }: Props) {
  const selected = useStore(quickViewId);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const model = selected ? models.find((item) => item.id === selected) ?? null : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (model && !dialog.open) dialog.showModal();
    if (!model && dialog.open) dialog.close();
  }, [model]);

  const close = () => {
    closeQuickView();
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="quick-view-dialog"
      aria-labelledby="quick-view-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      {model && (
        <article className="quick-view-dialog-inner">
          <header className="quick-view-header">
            <div>
              <p className="section-kicker">{m.detail.overview}</p>
              <h2 id="quick-view-title">{model.name}</h2>
              <p className="muted">{model.vendor} · {model.family} · {model.generation}</p>
            </div>
            <button type="button" className="button" onClick={close} aria-label={m.workspace.closeQuickView}>×</button>
          </header>
          <dl className="quick-view-facts">
            <dt>{m.detail.openWeights}</dt><dd>{displayBoolean(model.openness.weights_available, locale)}</dd>
            <dt>{m.detail.finetuningAllowed}</dt><dd>{displayBoolean(model.openness.finetuning_allowed, locale)}</dd>
            <dt>{m.detail.license}</dt><dd>{licenseLabel(model.openness.license_name, locale)}</dd>
            <dt>{m.detail.inference}</dt><dd>{tierLabel(model.hardware.inference_tier, locale)}</dd>
            <dt>{m.detail.context}</dt><dd>{displayUnknown(model.architecture.context_length, m.detail.tokensSuffix, locale)}</dd>
            <dt>{m.detail.apiStatus}</dt><dd>{displayUnknown(model.access?.api_status, '', locale)}</dd>
          </dl>
          <div className="quick-view-actions">
            <a className="button button-primary" href={localePath(locale, `/models/${model.id}/`)}>{m.detail.overview}</a>
            <button type="button" className="button button-secondary" onClick={close}>{m.workspace.closeQuickView}</button>
          </div>
        </article>
      )}
    </dialog>
  );
}
