import type { AtlasModel, FamilyCoverageRecord } from './schemas';
import coverageData from '../content/coverage/families.json';

export const familyCoverageRecords = coverageData.families as FamilyCoverageRecord[];

export function isCurrentModel(model: AtlasModel, families: FamilyCoverageRecord[] = [], allModels: AtlasModel[] = []): boolean {
  const family = families.find((record) => record.name === model.family || record.id === model.family);
  if (family) {
    if (family.current_flagship_model_id === model.id || family.current_open_weight_model_id === model.id || family.current_api_model_ids?.includes(model.id)) return true;
    if (family.variants?.some((variant) => variant.id === model.id && variant.is_current)) return true;
    if (family.current_flagship_model_id || family.current_open_weight_model_id || family.current_api_model_ids?.length || family.variants?.some((variant) => variant.is_current)) return false;
    return model.generation === family.current_generation ? model.status !== 'legacy' : false;
  }
  if (allModels.length === 0) return model.status === 'active';
  const familyModels = allModels.filter((candidate) => candidate.vendor === model.vendor && candidate.family === model.family);
  const latest = familyModels.reduce((max, candidate) => candidate.release_date > max ? candidate.release_date : max, '');
  return model.status === 'active' && model.release_date === latest;
}
