import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { compareIds, clearCompare, compareUrl } from '../../stores/compare';
import { useHydrated } from '../../lib/useHydrated';
import './CompareTray.css';

export interface CompareTrayLabels {
  compareTray: string;
  compare: string;
  openCompare: string;
  clearCompare: string;
}

interface Props {
  labels: CompareTrayLabels;
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

export function CompareTray({ labels, locale }: Props) {
  const hydrated = useHydrated();
  const ids = useStore(compareIds);
  const [modelNames, setModelNames] = useState<Record<string, string>>({});
  const trayRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const tray = trayRef.current;
    if (!tray) return;
    const root = document.documentElement;
    const syncHeight = () => root.style.setProperty('--compare-tray-height', `${tray.getBoundingClientRect().height}px`);
    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(tray);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--compare-tray-height');
    };
  }, [hydrated, ids.length]);

  if (!hydrated || ids.length === 0) return null;

  return (
    <div ref={trayRef} className="compare-tray" role="region" aria-label={labels.compareTray}>
      <div className="shell tray-inner">
        <span className="tray-label">{labels.compare}</span>
        <div className="tray-chips">
          {ids.map((id) => (
            <span key={id} className="tray-chip">{modelNames[id] ?? id}</span>
          ))}
        </div>
        <div className="tray-actions">
          <a className="button button-primary" href={compareUrl(locale)}>
            {labels.openCompare}
          </a>
          <button type="button" className="button" onClick={() => clearCompare()}>
            {labels.clearCompare}
          </button>
        </div>
      </div>
    </div>
  );
}
