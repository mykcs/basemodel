import type { AtlasModel, ExperimentMode, ResourceTier } from './types';

const order: ResourceTier[] = ['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu', 'api_only'];

export function hardwareFits(model: AtlasModel, mode: ExperimentMode, available: ResourceTier): boolean | 'unknown' {
  const field = mode === 'inference' ? 'inference_tier' : mode === 'lora' ? 'lora_tier' : mode === 'sft' ? 'full_sft_tier' : 'rl_tier';
  const required = model.hardware[field];
  if (required === 'unknown') return 'unknown';
  if (required === 'api_only') return available === 'api_only';
  if (available === 'api_only') return false;
  if (required === 'multi_gpu') return available === 'multi_gpu';
  return order.indexOf(available) >= order.indexOf(required);
}
