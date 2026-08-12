import type { AtlasModel, AtlasPaper } from '../../lib/schemas';
import { roleLabel } from '../../lib/format';
import { localePath, type Locale } from '../../i18n';
import { openQuickView } from '../../stores/ui';
import type { Messages } from '../../i18n/zh';

export function PaperRoleDiagram({ paper, models, locale, m: _m }: { paper: AtlasPaper; models: AtlasModel[]; locale: Locale; m: Messages }) {
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
      <h2 id="paper-role-diagram-title">{locale === 'zh' ? '这些模型按什么顺序参与实验' : 'How the models take part in the experiment'}</h2>
      <p className="muted">{locale === 'zh' ? '按论文记录展示模型、环境和步骤之间的先后关系；论文没有记录的连接不会补写。' : 'Show the recorded order between models, environments, and steps. Connections the paper did not record are left absent.'}</p>
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
      <p className="workflow-source-note">{locale === 'zh' ? '这里的步骤和连接来自论文记录；没有来源的关系保持空白。' : 'The steps and connections shown here come from the paper record; unsupported relations remain blank.'}</p>
    </section>;
  }

  const roles = [...new Set(paper.models.map((use) => use.role))];
  return <section className="paper-role-diagram" aria-labelledby="paper-role-diagram-title">
    <h2 id="paper-role-diagram-title">{locale === 'zh' ? '这些模型在论文里分别负责什么' : 'What each model does in the paper'}</h2>
    <p className="muted">{locale === 'zh' ? '论文没有记录完整步骤顺序时，就按 actor、teacher、critic 等已记录职责把模型分组。' : 'When the paper does not record a complete step-by-step workflow, group models by the recorded actor, teacher, critic, or other roles.'}</p>
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
    <p className="workflow-source-note">{locale === 'zh' ? '这篇论文没有记录步骤之间的连接，因此这里只展示已经明确记录的模型职责，不推测 Actor、Environment、Critic 或 Optimizer 怎样相连。' : 'This paper does not record connections between steps, so this view shows only recorded model roles and does not guess how Actor, Environment, Critic, or Optimizer are connected.'}</p>
  </section>;
}
