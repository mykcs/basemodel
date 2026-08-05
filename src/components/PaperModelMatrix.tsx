import type { AtlasModel, AtlasPaper } from '../lib/types';

const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

export default function PaperModelMatrix({ papers, models }: { papers: AtlasPaper[]; models: AtlasModel[] }) {
  const usedModels = models.filter((model) => papers.some((paper) => paper.models.some((use) => use.model_id === model.id)));
  return <div className="matrix-wrap"><table className="matrix-table"><thead><tr><th>论文</th>{usedModels.map((model) => <th key={model.id}>{model.name}</th>)}</tr></thead><tbody>{papers.map((paper) => <tr key={paper.id}><th><a href={`${base}papers/${paper.id}/`}>{paper.title}</a></th>{usedModels.map((model) => { const uses = paper.models.filter((use) => use.model_id === model.id); return <td key={model.id}>{uses.length ? <span className="role-list">{uses.map((use) => <span className="role-chip" key={use.role}>{use.role}</span>)}</span> : <span className="matrix-empty">—</span>}</td>; })}</tr>)}</tbody></table></div>;
}
