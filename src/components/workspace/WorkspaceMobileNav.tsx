import { ArrowLeftRight, FileSearch, ListTodo, Shapes, type LucideIcon } from 'lucide-react';
import type { Messages } from '../../i18n/zh';
import type { MobileWorkspacePane } from '../../stores/ui';

interface Props {
  activePane: MobileWorkspacePane;
  m: Messages;
  onChange: (pane: MobileWorkspacePane) => void;
}

const PANES: Array<{ id: MobileWorkspacePane; icon: LucideIcon; labelKey: 'mobileTask' | 'mobileCandidates' | 'mobileEvidence' | 'mobileCompare' }> = [
  { id: 'task', icon: ListTodo, labelKey: 'mobileTask' },
  { id: 'candidates', icon: Shapes, labelKey: 'mobileCandidates' },
  { id: 'evidence', icon: FileSearch, labelKey: 'mobileEvidence' },
  { id: 'compare', icon: ArrowLeftRight, labelKey: 'mobileCompare' },
];

export function WorkspaceMobileNav({ activePane, m, onChange }: Props) {
  return (
    <nav className="workspace-mobile-nav" aria-label={m.workspace.mobileNavLabel}>
      {PANES.map(({ id, icon: Icon, labelKey }) => (
        <button
          key={id}
          type="button"
          className={activePane === id ? 'is-active' : ''}
          aria-current={activePane === id ? 'page' : undefined}
          onClick={() => onChange(id)}
        >
          <span aria-hidden="true"><Icon size={16} /></span>
          {m.workspace[labelKey]}
        </button>
      ))}
    </nav>
  );
}
