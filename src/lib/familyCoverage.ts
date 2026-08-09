import type { AtlasModel, FamilyCoverageRecord } from './schemas';
import coverageData from '../content/coverage/families.json';
import overrideData from '../content/coverage/family-overrides.json';

export type EffectiveFamilyCoverageRecord = FamilyCoverageRecord & {
  current_hosted_flagship_model_id?: string;
  current_api_flagship_model_id?: string;
  current_research_recommended_model_ids?: string[];
  current_claim?: FamilyCoverageRecord['current_claim'] & { text_zh?: string; text_en?: string };
};
type FamilyOverride = Partial<EffectiveFamilyCoverageRecord> & { id: string };
type SurfaceProjection = {
  current_hosted_flagship_model_id?: string;
  current_api_flagship_model_id?: string;
  current_flagship_model_id?: string;
  current_api_model_ids?: string[];
  current_open_weight_model_id?: string;
  current_research_recommended_model_ids?: string[];
};
type LocalizedClaimProjection = { current_claim?: { text: string; text_zh?: string; text_en?: string } };

function mergeFamilyRecord(base: EffectiveFamilyCoverageRecord, override?: FamilyOverride): EffectiveFamilyCoverageRecord {
  if (!override) return base;
  return {
    ...base,
    ...override,
    current_claim: override.current_claim ? { ...(base.current_claim ?? {}), ...override.current_claim } as EffectiveFamilyCoverageRecord['current_claim'] : base.current_claim,
    variants: override.variants ?? base.variants,
    official_catalog_urls: override.official_catalog_urls ?? base.official_catalog_urls,
  };
}

const overrides = new Map((overrideData.overrides as FamilyOverride[]).map((record) => [record.id, record]));
const baseFamilies = coverageData.families as EffectiveFamilyCoverageRecord[];
export const familyCoverageRecords: EffectiveFamilyCoverageRecord[] = baseFamilies.map((record) => mergeFamilyRecord(record, overrides.get(record.id)));

export function isCurrentModel(model: AtlasModel, families: EffectiveFamilyCoverageRecord[] = [], allModels: AtlasModel[] = []): boolean {
  const family = families.find((record) => record.name === model.family || record.id === model.family.toLowerCase());
  if (family) {
    const explicitIds = new Set([
      family.current_flagship_model_id,
      family.current_hosted_flagship_model_id,
      family.current_api_flagship_model_id,
      family.current_open_weight_model_id,
      ...(family.current_api_model_ids ?? []),
      ...(family.current_research_recommended_model_ids ?? []),
      ...(family.variants ?? []).filter((variant) => variant.is_current).map((variant) => variant.id),
    ].filter((value): value is string => Boolean(value)));
    if (explicitIds.has(model.id) || model.aliases?.some((alias) => explicitIds.has(alias))) return true;
    if (explicitIds.size) return false;
    return model.generation === family.current_generation ? model.status !== 'legacy' : false;
  }
  if (allModels.length === 0) return model.status === 'active';
  const familyModels = allModels.filter((candidate) => candidate.vendor === model.vendor && candidate.family === model.family);
  const latest = familyModels.reduce((max, candidate) => candidate.release_date > max ? candidate.release_date : max, '');
  return model.status === 'active' && model.release_date === latest;
}

export function currentSurfaceSummary(family: SurfaceProjection) {
  return {
    hosted: family.current_hosted_flagship_model_id ?? family.current_api_flagship_model_id ?? family.current_flagship_model_id,
    api: family.current_api_flagship_model_id ?? family.current_api_model_ids?.[0],
    openWeight: family.current_open_weight_model_id,
    researchRecommended: family.current_research_recommended_model_ids ?? [],
  };
}

export function localizedFamilyClaim(family: LocalizedClaimProjection, locale: 'zh' | 'en'): string | undefined {
  const claim = family.current_claim;
  if (!claim) return undefined;
  return locale === 'zh' ? claim.text_zh ?? claim.text : claim.text_en ?? claim.text;
}
