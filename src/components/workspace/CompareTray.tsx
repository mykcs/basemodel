import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { compareIds, clearCompare, compareUrl } from '../../stores/compare';
import { useHydrated } from '../../lib/useHydrated';
import type { Messages } from '../../i18n/zh';

interface Props {
  m: Messages;
  locale: 'zh' | 'en';
}

type ModelNamePayload = { name?: unknown };

const modelNameCache = new Map<string, string>();

async function loadModelName(id: string): Promise<string> {
  const cached = modelNameCache.get(id);
  if (cached) return cached;

  try {
    const response = await fetch(`/model-data/${encodeURIComponent(id)}.json`);
    if (!response.ok) throw new Error(`model-data ${response.status}`);
    const payload = await response.json() as ModelNamePayload;
    const name = typeof payload.name === 'string' && payload.name.trim() ? payload.name : id;
    modelNameCache.set(id, name);
    return name;
  } catch {
    modelNameCache.set(id, id);
    return id;
  }
}

export function CompareTray({ m, locale }: Props) {
  const hydrated = useHydrated();
  const ids = useStore(compareIds);
  const [modelNames, setModelNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!hydrated || ids.length === 0) return;
    let cancelled = false;

    void Promise.all(ids.map(async (id) => [id, await loadModelName(id)] as const)).then((entries) => {
      if (!cancelled) setModelNames((current) => ({ ...current, ...Object.fromEntries(entries) }));
    });

    return () => {
      cancelled = true;
    };
  }, [hydrated, ids]);

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
