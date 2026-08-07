import type { Messages } from '../../i18n/zh';
import type { MobileWorkspacePane } from '../../stores/ui';

interface Props {
  activePane: MobileWorkspacePane;
  m: Messages;
  onChange: (pane: MobileWorkspacePane) => void;
}

const PANES: Array<{ id: MobileWorkspacePane; icon: string; labelKey: 'mobileTask' | 'mobileCandidates' | 'mobileEvidence' | 'mobileCompare' }> = [
  { id: 'task', icon: '☷', labelKey: 'mobileTask' },
  { id: 'candidates', icon: '◇', labelKey: 'mobileCandidates' },
  { id: 'evidence', icon: '◌', labelKey: 'mobileEvidence' },
  { id: 'compare', icon: '⇄', labelKey: 'mobileCompare' },
];

export function WorkspaceMobileNav({ activePane, m, onChange }: Props) {
  return (
    <nav className="workspace-mobile-nav" aria-label={m.workspace.mobileNavLabel}>
      {PANES.map(({ id, icon, labelKey }) => (
        <button
          key={id}
          type="button"
          className={activePane === id ? 'is-active' : ''}
          aria-current={activePane === id ? 'page' : undefined}
          onClick={() => onChange(id)}
        >
          <span aria-hidden="true">{icon}</span>
          {m.workspace[labelKey]}
        </button>
      ))}
    </nav>
  );
}
