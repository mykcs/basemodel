import type { AtlasModel, SemanticStatus } from './schemas';

export type VendorCoverage = {
  id: string;
  name: string;
  official_catalog_urls: string[];
  refresh_days: number;
  model_types: string[];
};

export type FamilyVariantCoverage = {
  id: string;
  role: 'flagship' | 'foundation' | 'instruct' | 'thinking' | 'code';
  distribution_surfaces: Array<'open_weight' | 'api'>;
  api_aliases?: string[];
  is_current?: boolean;
  source_url: string;
  checked_at: string;
};
export type FamilyCoverage = {
  id: string;
  vendor_id: string;
  name: string;
  current_generation: string;
  current_flagship_model_id?: string;
  current_open_weight_model_id?: string;
  current_api_model_ids?: string[];
  current_claim?: { text: string; status: SemanticStatus | 'confirmed'; source_url: string; checked_at: string };
  official_catalog_urls?: string[];
  open_weight_scope?: string;
  api_scope?: string;
  variants?: FamilyVariantCoverage[];
  as_of?: string;
  latest_generation_label?: string;
  latest_specialized_model_ids?: string[];
  catalog_checked_at?: string;
  catalog_source_ids?: string[];
  confidence?: 'official-confirmed' | 'official-partial' | 'third-party' | 'unverified';
};

export type FreshnessIssue = {
  modelId: string;
  severity: 'error' | 'warning' | 'info';
  reason: 'stale-source' | 'missing-current-generation' | 'unverified-current-flagship' | 'current-flagship-missing' | 'current-open-weight-model-missing' | 'deprecated-model-marked-active' | 'generic-source-url' | 'source-unreachable' | 'future-release-date' | 'semantic-gap' | 'missing-evidence-note' | 'source-claim-coverage-missing';
  recordType?: 'model' | 'family' | 'vendor';
  field?: string;
  claimStatus?: SemanticStatus;
  sourceUrl?: string;
  checkedAt?: string;
};

export type DataHealth = {
  totalModels: number;
  recentModels: number;
  staleModels: number;
  partialOrUnknown: number;
  verified: number;
  semanticGaps: Record<SemanticStatus, number>;
  issues: FreshnessIssue[];
  vendorCoverage: Array<{ vendor: VendorCoverage; modelCount: number; latestRelease: string; stale: number }>;
  familyCoverage: Array<{ family: FamilyCoverage; modelCount: number; generationPresent: boolean; flagshipPresent: boolean; openWeightPresent: boolean; unresolvedCount: number; catalogSourceUrl?: string; modelIds: string[] }>;
};

const today = () => new Date();
const parseDate = (value: string) => new Date(`${value}T00:00:00Z`);
const ageDays = (value: string, now: Date) => Math.floor((now.getTime() - parseDate(value).getTime()) / 86400000);
const semanticStates: SemanticStatus[] = ['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'not_published', 'unavailable'];

export function vendorIdFor(model: Pick<AtlasModel, 'vendor'>): string {
  const value = model.vendor.toLowerCase();
  if (value.includes('openai')) return 'openai';
  if (value.includes('qwen') || value.includes('alibaba')) return 'qwen';
  if (value.includes('google')) return 'google';
  if (value.includes('meta') || value.includes('llama')) return 'meta';
  if (value.includes('anthropic') || value.includes('claude')) return 'anthropic';
  if (value.includes('deepseek')) return 'deepseek';
  if (value.includes('moonshot') || value.includes('kimi')) return 'moonshot';
  if (value.includes('mistral')) return 'mistral';
  if (value.includes('glm') || value.includes('zhipu') || value.includes('z.ai')) return 'glm';
  if (value.includes('vicuna') || value.includes('lmsys')) return 'lmsys';
  return value.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function isGenericSourceUrl(url: string, vendor?: VendorCoverage): boolean {
  if (!vendor) return false;
  const normalized = url.replace(/\/$/, '').toLowerCase();
  return vendor.official_catalog_urls.some((catalog) => normalized === catalog.replace(/\/$/, '').toLowerCase());
}

export function latestCheckedAt(model: Pick<AtlasModel, 'sources'>): string | null {
  return model.sources.map((source) => source.checked_at).sort().at(-1) ?? null;
}

export function buildDataHealth(models: AtlasModel[], vendors: VendorCoverage[], families: FamilyCoverage[], now = today()): DataHealth {
  const issues: FreshnessIssue[] = [];
  const byVendor = new Map(vendors.map((vendor) => [vendor.id, vendor]));
  const staleThreshold = (model: AtlasModel, vendor?: VendorCoverage) => {
    if (model.status === 'legacy') return 90;
    if (vendor) return vendor.refresh_days;
    return model.openness.weights_available === false ? 14 : 30;
  };

  for (const model of models) {
    const vendor = byVendor.get(vendorIdFor(model));
    const checkedAt = latestCheckedAt(model);
    if (parseDate(model.release_date).getTime() > now.getTime() + 86400000) issues.push({ modelId: model.id, severity: 'error', reason: 'future-release-date', field: 'release_date' });
    if (checkedAt && ageDays(checkedAt, now) > staleThreshold(model, vendor)) issues.push({ modelId: model.id, severity: 'warning', reason: 'stale-source', checkedAt });
    if (model.data_status === 'verified') {
      const officialTypes = new Set(['official_model_card', 'official_docs', 'official_announcement', 'official_weights', 'official_license', 'official_api_docs', 'official_code', 'technical_report', 'code']);
      const officialSources = model.sources.filter((source) => officialTypes.has(source.type));
      const modelLevelFields = new Set(['vendor', 'family', 'generation', 'release_date', 'checkpoint.type', 'checkpoint.modalities', 'architecture.context_length', 'access.api_status', 'access.weights_status', 'openness.license_name']);
      const hasModelLevelEvidence = officialSources.some((source) => Array.isArray(source.supports) && source.supports.some((field) => modelLevelFields.has(field)));
      if (!officialSources.length || !hasModelLevelEvidence) {
        const source = officialSources[0];
        issues.push({ modelId: model.id, severity: 'error', reason: 'generic-source-url', field: 'sources', checkedAt: source?.checked_at });
      }
    }
    const visit = (value: unknown, fieldPath: string): void => {
      if (typeof value === 'string' && semanticStates.includes(value as SemanticStatus)) {
        issues.push({ modelId: model.id, recordType: 'model', severity: 'info', reason: 'semantic-gap', field: fieldPath, claimStatus: value as SemanticStatus, sourceUrl: model.sources[0]?.url, checkedAt: model.sources[0]?.checked_at });
      } else if (Array.isArray(value)) value.forEach((item, index) => visit(item, `${fieldPath}[${index}]`));
      else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => visit(item, `${fieldPath}.${key}`));
    };
    visit(model, 'model');
    if (model.sources.some((source) => !source.evidence_note)) issues.push({ modelId: model.id, recordType: 'model', severity: 'warning', reason: 'missing-evidence-note', field: 'sources' });
  }

  const vendorCoverage = vendors.map((vendor) => {
    const owned = models.filter((model) => vendorIdFor(model) === vendor.id);
    const stale = owned.filter((model) => issues.some((issue) => issue.modelId === model.id && issue.reason === 'stale-source')).length;
    return { vendor, modelCount: owned.length, latestRelease: owned.map((model) => model.release_date).sort().at(-1) ?? 'unknown', stale };
  });
  const familyCoverage = families.map((family) => {
    const owned = models.filter((model) => vendorIdFor(model) === family.vendor_id && model.family.toLowerCase() === family.name.toLowerCase());
    const modelIds = owned.map((model) => model.id);
    const flagshipPresent = Boolean(family.current_flagship_model_id && models.some((model) => model.id === family.current_flagship_model_id && vendorIdFor(model) === family.vendor_id));
    const openWeightPresent = Boolean(family.current_open_weight_model_id && models.some((model) => model.id === family.current_open_weight_model_id && vendorIdFor(model) === family.vendor_id));
    if (!family.current_flagship_model_id) issues.push({ modelId: family.id, recordType: 'family', severity: 'warning', reason: 'unverified-current-flagship', field: 'current_flagship_model_id' });
    else if (!flagshipPresent) issues.push({ modelId: family.id, recordType: 'family', severity: 'error', reason: 'current-flagship-missing', field: 'current_flagship_model_id' });
    if (family.current_open_weight_model_id && !openWeightPresent) issues.push({ modelId: family.id, recordType: 'family', severity: 'warning', reason: 'current-open-weight-model-missing', field: 'current_open_weight_model_id' });
    const unresolvedCount = issues.filter((issue) => issue.recordType === 'family' && issue.modelId === family.id).length;
    return { family, modelCount: owned.length, generationPresent: flagshipPresent, flagshipPresent, openWeightPresent, unresolvedCount, catalogSourceUrl: family.current_claim?.source_url ?? family.official_catalog_urls?.[0], modelIds };
  });

  const semanticGaps = Object.fromEntries(semanticStates.map((state) => [state, 0])) as Record<SemanticStatus, number>;
  const countSemantic = (value: unknown): void => {
    if (typeof value === 'string' && semanticStates.includes(value as SemanticStatus)) semanticGaps[value as SemanticStatus] += 1;
    else if (Array.isArray(value)) value.forEach(countSemantic);
    else if (value && typeof value === 'object') Object.values(value).forEach(countSemantic);
  };
  models.forEach(countSemantic);
  return {
    totalModels: models.length,
    recentModels: models.filter((model) => { const checked = latestCheckedAt(model); return checked ? ageDays(checked, now) <= 30 : false; }).length,
    staleModels: new Set(issues.filter((issue) => issue.reason === 'stale-source').map((issue) => issue.modelId)).size,
    partialOrUnknown: models.filter((model) => model.data_status === 'partial' || model.data_status === 'unknown').length,
    verified: models.filter((model) => model.data_status === 'verified').length,
    semanticGaps,
    issues,
    vendorCoverage,
    familyCoverage,
  };
}
