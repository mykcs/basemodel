import type { AtlasModel, SemanticStatus } from './schemas';

export type VendorCoverage = {
  id: string;
  name: string;
  official_catalog_urls: string[];
  refresh_days: number;
  model_types: string[];
};

export type FamilyCoverage = { id: string; vendor_id: string; name: string; current_generation: string };

export type FreshnessIssue = {
  modelId: string;
  severity: 'error' | 'warning' | 'info';
  reason: 'stale-source' | 'missing-current-generation' | 'deprecated-model-marked-active' | 'generic-source-url' | 'source-unreachable' | 'future-release-date';
  field?: string;
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
  familyCoverage: Array<{ family: FamilyCoverage; modelCount: number; generationPresent: boolean; modelIds: string[] }>;
};

const today = () => new Date();
const parseDate = (value: string) => new Date(`${value}T00:00:00Z`);
const ageDays = (value: string, now: Date) => Math.floor((now.getTime() - parseDate(value).getTime()) / 86400000);
const normalizeLabel = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

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
      const official = model.sources.find((source) => source.type === 'official_model_card' || source.type === 'official_docs');
      if (!official) issues.push({ modelId: model.id, severity: 'error', reason: 'generic-source-url', field: 'sources' });
      else if (isGenericSourceUrl(official.url, vendor)) issues.push({ modelId: model.id, severity: 'error', reason: 'generic-source-url', field: 'sources', checkedAt: official.checked_at });
    }
  }

  const vendorCoverage = vendors.map((vendor) => {
    const owned = models.filter((model) => vendorIdFor(model) === vendor.id);
    const stale = owned.filter((model) => issues.some((issue) => issue.modelId === model.id && issue.reason === 'stale-source')).length;
    return { vendor, modelCount: owned.length, latestRelease: owned.map((model) => model.release_date).sort().at(-1) ?? 'unknown', stale };
  });
  const familyCoverage = families.map((family) => {
    const familyLabel = normalizeLabel(family.name);
    const currentLabel = normalizeLabel(family.current_generation);
    const owned = models.filter((model) => vendorIdFor(model) === family.vendor_id && (normalizeLabel(model.family).includes(familyLabel) || normalizeLabel(model.generation).includes(familyLabel)));
    const modelIds = owned.map((model) => model.id);
    const generationPresent = owned.some((model) => {
      const generation = normalizeLabel(model.generation);
      const generationSuffix = generation.startsWith(familyLabel) ? generation.slice(familyLabel.length) : generation;
      const currentSuffix = currentLabel.startsWith(familyLabel) ? currentLabel.slice(familyLabel.length) : currentLabel;
      return generation === currentLabel || generation.includes(currentLabel) || generationSuffix === currentSuffix || generationSuffix.includes(currentSuffix);
    });
    if (!generationPresent) issues.push({ modelId: family.id, severity: 'warning', reason: 'missing-current-generation', field: 'generation' });
    return { family, modelCount: owned.length, generationPresent, modelIds };
  });

  const semanticStates: SemanticStatus[] = ['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'not_published', 'unavailable'];
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
