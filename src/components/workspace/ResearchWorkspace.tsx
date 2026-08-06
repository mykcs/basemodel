import { useEffect } from 'react';
import { ConstraintPanel } from './ConstraintPanel';
import { CandidateBoard } from './CandidateBoard';
import { EvidenceInspector } from './EvidenceInspector';
import { initResearchTaskFromUrl } from '../../stores/researchTask';
import type { AtlasModel } from '../../lib/schemas';
import type { Messages } from '../../i18n/zh';

interface Props {
  models: AtlasModel[];
  m: Messages;
}

export function ResearchWorkspace({ models, m }: Props) {
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
          <CandidateBoard models={models} m={m} />
          <EvidenceInspector models={models} m={m} />
        </div>
      </div>
    </div>
  );
}
