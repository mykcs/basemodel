import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import { roleLabel } from '../../lib/format';
import { localePath, type Locale } from '../../i18n';
import { openQuickView } from '../../stores/ui';
import type { Messages } from '../../i18n/zh';

export function PaperRoleDiagram({ paper, models, locale, m }: { paper: AtlasPaper; models: AtlasModel[]; locale: Locale; m: Messages }) {
  const modelMap = new Map(models.map((model) => [model.id, model]));
  const modelActions = (modelId: string) => {
    const model = modelMap.get(modelId);
    if (!model) return null;
    return <span className="role-model-actions">
      <button type="button" className="role-model-quick-view" onClick={() => openQuickView(model.id)}>{locale === 'zh' ? '快速查看' : 'Quick view'}</button>
      <a href={localePath(locale, `/models/${model.id}/`)}>{locale === 'zh' ? '详情' : 'Details'}</a>
    </span>;
  };

  if (paper.workflow) {
    const nodes = paper.workflow.nodes;
    const edges = new Map(paper.workflow.edges.map((edge) => [`${edge.from}->${edge.to}`, edge]));
    return <section className="paper-role-diagram" aria-labelledby="paper-role-diagram-title">
      <h2 id="paper-role-diagram-title">{m.paperDetail.roleDiagramTitle}</h2>
      <p className="muted">{m.paperDetail.roleDiagramHint}</p>
      <ol className="workflow-flow">
        {nodes.map((node, index) => <li className="workflow-node" key={node.id}>
          <span className="workflow-node-type">{node.type}</span>
          <strong>{node.label ?? (node.model_id ? modelMap.get(node.model_id)?.name ?? node.model_id : node.id)}</strong>
          {node.model_id && modelMap.get(node.model_id) && <small>{modelMap.get(node.model_id)?.name}</small>}
          {node.model_id && modelActions(node.model_id)}
          {index < nodes.length - 1 && <span className="workflow-arrow" aria-hidden="true">→</span>}
          {index < nodes.length - 1 && edges.get(`${node.id}->${nodes[index + 1].id}`)?.label && <small className="workflow-edge-label">{edges.get(`${node.id}->${nodes[index + 1].id}`)?.label}</small>}
        </li>)}
      </ol>
      <p className="workflow-source-note">{locale === 'zh' ? '流程节点与边来自论文记录；未记录的关系不会被补写。' : 'Nodes and edges come from the paper record; unrecorded relations are not filled in.'}</p>
    </section>;
  }

  const roles = [...new Set(paper.models.map((use) => use.role))];
  return <section className="paper-role-diagram" aria-labelledby="paper-role-diagram-title">
    <h2 id="paper-role-diagram-title">{m.paperDetail.roleDiagramTitle}</h2>
    <p className="muted">{m.paperDetail.roleDiagramHint}</p>
    <div className="role-topology">{roles.map((role) => <div className="role-node" key={role}>
      <strong>{roleLabel(role, locale)}</strong>
      <div className="role-models">{paper.models.filter((use) => use.role === role).map((use) => {
        const model = modelMap.get(use.model_id);
        return <div className="role-model" key={`${role}-${use.model_id}`}>
          <span>{model?.name ?? use.model_id}</span>
          {model && modelActions(model.id)}
        </div>;
      })}</div>
    </div>)}</div>
    <p className="workflow-source-note">{locale === 'zh' ? '当前论文记录没有 workflow 边；上方仅展示已记录的角色拓扑，不把 Actor、Environment、Critic 或 Optimizer 关系当作事实。' : 'This paper record has no workflow edges; the topology above only shows recorded roles and does not treat Actor, Environment, Critic, or Optimizer relations as facts.'}</p>
  </section>;
}
