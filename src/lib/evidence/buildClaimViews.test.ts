import { describe, expect, it } from 'vitest';
import { buildClaimViews } from './buildClaimViews';
import type { AtlasModel } from '../schemas';

const model = {
  id: 'demo-model',
  name: 'Demo model',
  vendor: 'Demo',
  family: 'Demo',
  generation: '1',
  release_date: '2026-01-01',
  status: 'active',
  checkpoint: { type: 'base', modalities: ['text'], specializations: [] },
  architecture: { type: 'dense', total_parameters_b: 3, active_parameters_b: 3, context_length: 32768, expert_count: 'not_applicable', active_experts_per_token: 'not_applicable' },
  openness: { weights_available: true, base_checkpoint_available: true, finetuning_allowed: true, derivative_release_allowed: 'not_verified', commercial_use_allowed: 'not_verified', license_name: 'Demo' },
  access: { weights_status: 'released', api_status: 'unavailable' },
  research: { suitable_for_inference: true, suitable_for_lora: true, suitable_for_sft: 'not_verified', suitable_for_rl: 'not_verified', transformers_support: true, vllm_support: 'not_verified', sglang_support: 'not_verified', verl_recipe_available: 'not_verified' },
  hardware: { inference_tier: '24gb', lora_tier: '24gb', full_sft_tier: '48gb', rl_tier: 'multi_gpu' },
  sources: [
    { url: 'https://example.com/model-card', title: 'Model card', type: 'official_model_card', checked_at: '2026-01-02', supports: ['openness.weights_available', 'architecture.context_length'], locator: 'weights section' },
    { url: 'https://example.com/secondary', title: 'Runtime note', type: 'third_party_runtime', checked_at: '2026-01-03', supports: ['openness.weights_available'] },
    { url: 'https://example.com/raw', title: 'Unclassified', type: 'official_model_card', checked_at: '2026-01-03', supports: ['unknown.internal_path'] },
  ],
  data_status: 'partial',
} as AtlasModel;

describe('buildClaimViews', () => {
  it('turns supported field paths into human claims and preserves the strongest evidence level', () => {
    const claims = buildClaimViews(model, 'zh');
    const weights = claims.find((claim) => claim.fieldPath === 'openness.weights_available');
    expect(weights?.label).toBe('开放权重');
    expect(weights?.value).toBe(true);
    expect(weights?.evidenceLevel).toBe('official');
    expect(claims.some((claim) => claim.fieldPath === 'unknown.internal_path')).toBe(false);
  });
});
