import { useEffect } from 'react';
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
import type { Messages } from '../../i18n/zh';
import { useHydrated } from '../../lib/useHydrated';

interface Props {
  models: AtlasModel[];
  papers: AtlasPaper[];
  m: Messages;
  locale?: 'zh' | 'en';
}

export function ResearchWorkspace({ models, papers, m, locale = 'zh' }: Props) {
  const hydrated = useHydrated();
  const activePane = useStore(mobileWorkspacePane);

  useEffect(() => {
    initResearchTaskFromUrl();
  }, []);

  const setPane = (pane: MobileWorkspacePane) => mobileWorkspacePane.set(pane);

  if (!hydrated) return null;

  return (
    <div className="workspace">
      <div className="shell">
        <header className="page-header">
          <h1>{m.workspace.title}</h1>
          <p className="lede">{m.workspace.lede}</p>
        </header>
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
          <SubstituteLab models={models} papers={papers} m={m} />
          <DecisionMemo models={models} papers={papers} m={m} locale={locale} />
        </div>
        <WorkspaceMobileNav activePane={activePane} m={m} onChange={setPane} />
        <ModelQuickViewDialog models={models} m={m} locale={locale} />
      </div>
    </div>
  );
}
