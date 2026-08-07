import { useStore } from '@nanostores/react';
import { compareIds, clearCompare } from '../../stores/compare';
import { compareUrl } from '../../stores/compare';
import { useHydrated } from '../../lib/useHydrated';
import type { Messages } from '../../i18n/zh';

interface Props {
  m: Messages;
  locale: 'zh' | 'en';
  modelNames: Record<string, string>;
}

export function CompareTray({ m, locale, modelNames }: Props) {
  const hydrated = useHydrated();
  const ids = useStore(compareIds);

  if (!hydrated || ids.length === 0) return null;

  return (
    <div className="compare-tray" role="region" aria-label={m.workspace.compareTray}>
      <div className="shell tray-inner">
        <span className="tray-label">{m.workspace.compare}</span>
        <div className="tray-chips">
          {ids.map((id) => (
            <span key={id} className="tray-chip">{modelNames[id] ?? id}</span>
          ))}
        </div>
        <div className="tray-actions">
          <a className="button button-primary" href={compareUrl(locale)}>
            {m.workspace.openCompare}
          </a>
          <button type="button" className="button" onClick={() => clearCompare()}>
            {m.workspace.clearCompare}
          </button>
        </div>
      </div>
    </div>
  );
}
