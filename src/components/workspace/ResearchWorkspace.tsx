import { useEffect } from 'react';
import { ConstraintPanel } from './ConstraintPanel';
import { CandidateBoard } from './CandidateBoard';
import { EvidenceInspector } from './EvidenceInspector';
import { SubstituteLab } from './SubstituteLab';
import { DecisionMemo } from './DecisionMemo';
import { initResearchTaskFromUrl } from '../../stores/researchTask';
import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';

interface Props {
  models: AtlasModel[];
  papers: AtlasPaper[];
  m: Messages;
}

export function ResearchWorkspace({ models, papers, m }: Props) {
  useEffect(() => {
    initResearchTaskFromUrl();
  }, []);

  return (
    <div className="workspace">
      <div className="shell">
        <header className="page-header">
          <h1>{m.workspace.title}</h1>
          <p className="lede">{m.workspace.lede}</p>
        </header>
        <div className="workspace-grid">
          <ConstraintPanel m={m} />
          <CandidateBoard models={models} papers={papers} m={m} />
          <EvidenceInspector models={models} m={m} />
        </div>
        <div className="workspace-lower">
          <SubstituteLab models={models} papers={papers} m={m} />
          <DecisionMemo models={models} papers={papers} m={m} />
        </div>
      </div>
    </div>
  );
}
