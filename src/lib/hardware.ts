import type { AtlasModel, ExperimentMode, ResourceTier, SemanticStatus } from './types';

const order: ResourceTier[] = ['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu', 'api_only'];

export function hardwareFits(model: AtlasModel, mode: ExperimentMode, available: ResourceTier): boolean | SemanticStatus {
  const field = mode === 'inference' ? 'inference_tier' : mode === 'lora' ? 'lora_tier' : mode === 'sft' || mode === 'full_sft' ? 'full_sft_tier' : 'rl_tier';
  const required = model.hardware[field];
  if (required === 'unknown') return 'not_verified';
  if (required === 'not_disclosed' || required === 'not_applicable' || required === 'not_reported' || required === 'not_verified' || required === 'not_published' || required === 'unavailable') return required;
  if (required === 'api_only') return available === 'api_only';
  if (available === 'api_only') return false;
  if (required === 'multi_gpu') return available === 'multi_gpu';
  return order.indexOf(available) >= order.indexOf(required as ResourceTier);
}
