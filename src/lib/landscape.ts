import type { Locale } from '../i18n';
import { architectureLabel, statusLabel, tierLabel } from './format';
import type { AtlasModel, HardwareTier } from './types';

export const LANDSCAPE_HARDWARE_ORDER = [
  'cpu_mac',
  '16gb',
  '24gb',
  '48gb',
  '80gb',
  'multi_gpu',
  'api_only',
] as const;

export type LandscapeHardwareTier = (typeof LANDSCAPE_HARDWARE_ORDER)[number];
export type LandscapeArchitecture = AtlasModel['architecture']['type'];

export interface LandscapePoint {
  id: string;
  name: string;
  vendor: string;
  family: string;
  releaseDate: string;
  releaseTimestamp: number;
  architecture: LandscapeArchitecture;
  architectureLabel: string;
  hardwareTier: HardwareTier;
  hardwareLabel: string;
  hardwareIndex: number;
  parameterB: number | null;
  parameterSource: 'total' | 'active' | 'unknown';
  dataStatus: AtlasModel['data_status'];
  dataStatusLabel: string;
  symbolSize: number;
}

export interface LandscapeModelExport {
  id: string;
  name: string;
  vendor: string;
  family: string;
  release_date: string;
  architecture: AtlasModel['architecture']['type'];
  total_parameters_b: AtlasModel['architecture']['total_parameters_b'];
  active_parameters_b: AtlasModel['architecture']['active_parameters_b'];
  inference_tier: AtlasModel['hardware']['inference_tier'];
  data_status: AtlasModel['data_status'];
}

const semanticStates = new Set([
  'not_disclosed',
  'not_applicable',
  'not_reported',
  'not_verified',
  'not_published',
  'unavailable',
  'unknown',
]);

export function numericParameter(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;
}

export function hardwareIndex(value: HardwareTier): number {
  const index = LANDSCAPE_HARDWARE_ORDER.indexOf(value as LandscapeHardwareTier);
  return index >= 0 ? index : LANDSCAPE_HARDWARE_ORDER.length;
}

export function isSemanticValue(value: unknown): boolean {
  return typeof value === 'string' && semanticStates.has(value);
}

export function parameterForLandscape(model: AtlasModel): { value: number | null; source: LandscapePoint['parameterSource'] } {
  const total = numericParameter(model.architecture.total_parameters_b);
  if (total !== null) return { value: total, source: 'total' };
  const active = numericParameter(model.architecture.active_parameters_b);
  if (active !== null) return { value: active, source: 'active' };
  return { value: null, source: 'unknown' };
}

export function symbolSizeForParameter(value: number | null, maximum: number): number {
  if (value === null) return 12;
  return Math.round(12 + 22 * Math.sqrt(value / Math.max(maximum, 1)));
}

export function buildLandscapePoints(models: AtlasModel[], locale: Locale = 'zh'): LandscapePoint[] {
  const parameters = models.map((model) => parameterForLandscape(model).value).filter((value): value is number => value !== null);
  const maximum = Math.max(...parameters, 1);

  return models.map((model) => {
    const parameter = parameterForLandscape(model);
    const tier = model.hardware.inference_tier;
    return {
      id: model.id,
      name: model.name,
      vendor: model.vendor,
      family: model.family,
      releaseDate: model.release_date,
      releaseTimestamp: Date.parse(`${model.release_date}T00:00:00Z`),
      architecture: model.architecture.type,
      architectureLabel: architectureLabel(model.architecture.type, locale),
      hardwareTier: tier,
      hardwareLabel: tierLabel(tier, locale),
      hardwareIndex: hardwareIndex(tier),
      parameterB: parameter.value,
      parameterSource: parameter.source,
      dataStatus: model.data_status,
      dataStatusLabel: statusLabel(model.data_status, locale),
      symbolSize: symbolSizeForParameter(parameter.value, maximum),
    };
  });
}

export function toLandscapeModelExport(model: AtlasModel): LandscapeModelExport {
  return {
    id: model.id,
    name: model.name,
    vendor: model.vendor,
    family: model.family,
    release_date: model.release_date,
    architecture: model.architecture.type,
    total_parameters_b: model.architecture.total_parameters_b,
    active_parameters_b: model.architecture.active_parameters_b,
    inference_tier: model.hardware.inference_tier,
    data_status: model.data_status,
  };
}

export function landscapeTierLabel(value: string, locale: Locale): string {
  return isSemanticValue(value) ? tierLabel(value as HardwareTier, locale) : value;
}
