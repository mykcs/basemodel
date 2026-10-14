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
import { useHydrated } from '../../lib/useHydrated';
import { getMessages, type Locale } from '../../i18n';
import { loadCatalog, type CatalogPayload } from '../../lib/catalogClient';
import '../../styles/workspace.css';

interface Props { locale?: Locale }

export function ResearchWorkspace({ locale = 'zh' }: Props) {
  const hydrated = useHydrated();
  const m = getMessages(locale);
  const [catalog, setCatalog] = useState<CatalogPayload | null>(null);
  const [catalogError, setCatalogError] = useState(false);
  const activePane = useStore(mobileWorkspacePane);

  useEffect(() => {
    initResearchTaskFromUrl();
    let active = true;
    void loadCatalog().then((payload) => {
      if (!active) return;
      setCatalog(payload);
    }).catch(() => {
      if (active) setCatalogError(true);
    });
    return () => { active = false; };
  }, []);

  const setPane = (pane: MobileWorkspacePane) => mobileWorkspacePane.set(pane);

  if (!hydrated || !catalog) return <p className="muted" role="status">{catalogError ? (locale === 'zh' ? '交互式工作台暂时不可用；上面的研究说明仍可阅读。' : 'The interactive workspace is unavailable; the research orientation above remains readable.') : (locale === 'zh' ? '正在加载交互式工作台…' : 'Loading interactive workspace…')}</p>;
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
