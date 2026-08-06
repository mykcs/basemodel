import { useStore } from '@nanostores/react';
import { compareIds, clearCompare } from '../../stores/compare';
import { baseUrl } from '../../i18n';
import type { Messages } from '../../i18n/zh';

interface Props {
  m: Messages;
  locale: 'zh' | 'en';
}

export function CompareTray({ m, locale }: Props) {
  const ids = useStore(compareIds);

  if (ids.length === 0) return null;

  const base = baseUrl();
  const compareHref = locale === 'en' ? `${base}en/compare/` : `${base}compare/`;

  return (
    <div className="compare-tray" role="region" aria-label={m.workspace.compareTray}>
      <div className="shell tray-inner">
        <span className="tray-label">{m.workspace.compare}</span>
        <div className="tray-chips">
          {ids.map((id) => (
            <span key={id} className="tray-chip">{id}</span>
          ))}
        </div>
        <div className="tray-actions">
          <a className="button button-primary" href={compareHref}>
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
