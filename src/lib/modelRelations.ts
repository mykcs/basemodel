import type { AtlasModel, AtlasPaper, PaperModelUse } from './types';

export function paperUsesModel(paper: AtlasPaper, modelId: string): PaperModelUse[] {
  return paper.models.filter((use) => use.model_id === modelId);
}

export function papersForModel(papers: AtlasPaper[], modelId: string): AtlasPaper[] {
  return papers.filter((paper) => paperUsesModel(paper, modelId).length > 0);
}

export function modelIdsUsedByPapers(papers: AtlasPaper[]): Set<string> {
  return new Set(papers.flatMap((paper) => paper.models.map((use) => use.model_id)));
}

export function familyTree(models: AtlasModel[]) {
  const vendors = new Map<string, Map<string, Map<string, AtlasModel[]>>>();
  for (const model of models) {
    if (!vendors.has(model.vendor)) vendors.set(model.vendor, new Map());
    const families = vendors.get(model.vendor)!;
    if (!families.has(model.family)) families.set(model.family, new Map());
    const generations = families.get(model.family)!;
    if (!generations.has(model.generation)) generations.set(model.generation, []);
    generations.get(model.generation)!.push(model);
  }
  return vendors;
}
