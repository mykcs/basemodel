import { familyTree } from '../lib/modelRelations';
import type { AtlasModel } from '../lib/types';

const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

export default function FamilyTree({ models }: { models: AtlasModel[] }) {
  const tree = familyTree(models);
  return <div className="family-tree">{[...tree.entries()].map(([vendor, families]) => <section className="tree-vendor" key={vendor}><h2>{vendor}</h2>{[...families.entries()].map(([family, generations]) => <div className="tree-family" key={family}><h3>{family}</h3>{[...generations.entries()].map(([generation, checkpoints]) => <div className="tree-generation" key={generation}><div className="tree-generation-heading"><strong>{generation}</strong><span>{checkpoints[0]?.release_date} · {checkpoints.length} checkpoints</span></div><div className="tree-checkpoints">{checkpoints.map((model) => <a href={`${base}models/${model.id}/`} className="tree-checkpoint" key={model.id}><span>{model.name}</span><small>{model.architecture.type.toUpperCase()} · {model.checkpoint.type}</small></a>)}</div></div>)}</div>)}</section>)}</div>;
}
