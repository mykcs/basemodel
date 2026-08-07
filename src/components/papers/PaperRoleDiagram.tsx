import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import { roleLabel } from '../../lib/format';
import type { Locale } from '../../i18n';
import type { Messages } from '../../i18n/zh';

export function PaperRoleDiagram({ paper, models, locale, m }: { paper: AtlasPaper; models: AtlasModel[]; locale: Locale; m: Messages }) {
  const modelMap = new Map(models.map((model) => [model.id, model]));
  const roles = [...new Set(paper.models.map((use) => use.role))];
  return <section className="paper-role-diagram" aria-labelledby="paper-role-diagram-title">
    <h2 id="paper-role-diagram-title">{m.paperDetail.roleDiagramTitle}</h2>
    <p className="muted">{m.paperDetail.roleDiagramHint}</p>
    <div className="role-topology">{roles.map((role) => <div className="role-node" key={role}><strong>{roleLabel(role, locale)}</strong><div className="role-models">{paper.models.filter((use) => use.role === role).map((use) => <span className="role-model" key={`${role}-${use.model_id}`}>{modelMap.get(use.model_id)?.name ?? use.model_id}</span>)}</div></div>)}</div>
  </section>;
}
