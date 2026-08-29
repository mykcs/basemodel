import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { ResearchTaskBuilder } from './task/ResearchTaskBuilder';
import { CandidateBoard } from './CandidateBoard';
import { EvidenceInspector } from './EvidenceInspector';
import { SubstituteLab } from './SubstituteLab';
import { DecisionMemo } from './DecisionMemo';
import { initResearchTaskFromUrl } from '../../stores/researchTask';
import { mobileWorkspacePane, type MobileWorkspacePane } from '../../stores/ui';
import { WorkspaceMobileNav } from './WorkspaceMobileNav';
import { ModelQuickViewDialog } from '../models/ModelQuickViewDialog';
import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import { useHydrated } from '../../lib/useHydrated';
import { baseUrl, getMessages, type Locale } from '../../i18n';
import '../../styles/workspace.css';

interface CatalogPayload { models: AtlasModel[]; papers: AtlasPaper[] }
interface Props { locale?: Locale }
let catalogRequest: Promise<CatalogPayload> | null = null;

export function ResearchWorkspace({ locale = 'zh' }: Props) {
  const hydrated = useHydrated();
  const m = getMessages(locale);
  const [catalog, setCatalog] = useState<CatalogPayload | null>(null);
  const activePane = useStore(mobileWorkspacePane);

  useEffect(() => {
    initResearchTaskFromUrl();
    catalogRequest ??= fetch(`${baseUrl()}model-data/catalog.json`, { credentials: 'same-origin' }).then((response) => {
      if (!response.ok) throw new Error('workspace catalog unavailable');
      return response.json() as Promise<CatalogPayload>;
    });
    let active = true;
    void catalogRequest.then((payload) => {
      if (!active) return;
      setCatalog(payload);
    });
    return () => { active = false; };
  }, []);

  const setPane = (pane: MobileWorkspacePane) => mobileWorkspacePane.set(pane);

  if (!hydrated || !catalog) return <p className="muted" role="status">{locale === 'zh' ? '正在加载交互式工作台…' : 'Loading interactive workspace…'}</p>;
  const { models, papers } = catalog;

  return (
    <div className="workspace">
      <div className="shell">
        <div className="workspace-grid">
          <div className={`workspace-pane workspace-pane-task${activePane === 'task' ? ' is-mobile-active' : ''}`}>
            <ResearchTaskBuilder models={models} papers={papers} m={m} locale={locale} />
          </div>
          <div className={`workspace-pane workspace-pane-candidates${activePane === 'candidates' ? ' is-mobile-active' : ''}`}>
            <CandidateBoard models={models} papers={papers} m={m} locale={locale} />
          </div>
          <div className={`workspace-pane workspace-pane-evidence${activePane === 'evidence' ? ' is-mobile-active' : ''}`}>
            <EvidenceInspector models={models} m={m} locale={locale} />
          </div>
        </div>
        <div className={`workspace-lower workspace-pane workspace-pane-compare${activePane === 'compare' ? ' is-mobile-active' : ''}`}>
          <SubstituteLab models={models} papers={papers} m={m} locale={locale} />
          <DecisionMemo models={models} papers={papers} m={m} locale={locale} />
        </div>
        <WorkspaceMobileNav activePane={activePane} m={m} onChange={setPane} />
        <ModelQuickViewDialog models={models} m={m} locale={locale} />
      </div>
    </div>
  );
}
