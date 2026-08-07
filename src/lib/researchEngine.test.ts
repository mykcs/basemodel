import { describe, expect, it } from 'vitest';
import { scoreModels, bucketize, comparabilityProfile } from './researchEngine';
import { analyzeReplacement } from './research/replacement';
import { emptyTask, type ResearchTask } from '../stores/researchTask';
import type { AtlasModel, AtlasPaper } from './types';

function model(partial: Partial<AtlasModel> & { id: string }): AtlasModel {
  return {
    name: partial.id,
    vendor: 'Test', family: 'Fam', generation: 'v1', release_date: '2025-01-01', status: 'active',
    checkpoint: { type: 'instruct', modalities: ['text'], specializations: ['general'] },
    architecture: { type: 'dense', total_parameters_b: 7, active_parameters_b: 7, context_length: 32768, expert_count: 'not_applicable', active_experts_per_token: 'not_applicable' },
    openness: { weights_available: true, base_checkpoint_available: true, finetuning_allowed: true, derivative_release_allowed: 'not_verified', commercial_use_allowed: 'not_verified', license_name: 'Apache 2.0' },
    research: { suitable_for_inference: true, suitable_for_lora: true, suitable_for_sft: true, suitable_for_rl: true, transformers_support: true, vllm_support: true, sglang_support: 'not_verified', verl_recipe_available: 'not_verified' },
    hardware: { inference_tier: '24gb', lora_tier: '24gb', full_sft_tier: '48gb', rl_tier: 'multi_gpu' },
    sources: [{ url: 'https://example.com', type: 'official_model_card', checked_at: '2026-01-01' }],
    data_status: 'verified',
    ...partial,
  };
}

function paperFor(modelId: string, role: AtlasPaper['models'][number]['role'] = 'policy'): AtlasPaper {
  return {
    id: `p-${modelId}`, title: `Paper for ${modelId}`, published_at: '2024-01-01', paper_url: 'https://example.com/p', code_url: 'not_verified', checkpoint_url: 'not_published',
    category: ['demo'], models: [{ model_id: modelId, role, weight_updated: true }], evolution_targets: ['x'], benchmarks: ['b'],
    sources: [{ url: 'https://example.com/p', type: 'paper', checked_at: '2026-01-01' }], data_status: 'verified',
  };
}

const baseTask: ResearchTask = { ...emptyTask };

describe('researchEngine tri-state evaluation', () => {
  it('not_verified does not become false', () => {
    const candidate = model({ id: 'unknown-open', openness: { weights_available: 'not_verified', base_checkpoint_available: true, finetuning_allowed: true, derivative_release_allowed: 'not_verified', commercial_use_allowed: 'not_verified', license_name: 'Apache 2.0' } });
    const result = scoreModels([candidate], [], { ...baseTask, openWeight: true })[0];
    expect(result.eligible).toBe(true);
    expect(result.candidateState).toBe('conditional');
    expect(result.outcomes.find((item) => item.code === 'open_weights')?.state).toBe('unknown');
  });

  it('only an explicit false creates a hard blocker', () => {
    const candidate = model({ id: 'closed', openness: { weights_available: false, base_checkpoint_available: false, finetuning_allowed: false, derivative_release_allowed: 'not_verified', commercial_use_allowed: 'not_verified', license_name: 'Proprietary' } });
    const result = scoreModels([candidate], [], { ...baseTask, openWeight: true })[0];
    expect(result.eligible).toBe(false);
    expect(result.candidateState).toBe('blocked');
    expect(result.fit.blockers.map((item) => item.code)).toContain('open_weights');
  });

  it('unknown RL capability stays conditionally eligible', () => {
    const candidate = model({ id: 'unknown-rl', research: { suitable_for_inference: true, suitable_for_lora: true, suitable_for_sft: true, suitable_for_rl: 'not_verified', transformers_support: true, vllm_support: true, sglang_support: 'not_verified', verl_recipe_available: 'not_verified' } });
    const result = scoreModels([candidate], [], { ...baseTask, update: 'rl' })[0];
    expect(result.eligible).toBe(true);
    expect(result.outcomes.find((item) => item.code === 'update_capability')?.state).toBe('unknown');
  });

  it('role matching requires direct paper evidence, not inferred capability', () => {
    const modelWithRl = model({ id: 'policy-model' });
    const direct = scoreModels([modelWithRl], [paperFor('policy-model', 'policy')], { ...baseTask, roles: ['policy'] })[0];
    const inferred = scoreModels([modelWithRl], [], { ...baseTask, roles: ['policy'] })[0];
    expect(direct.reasons).toContain('role_match');
    expect(inferred.reasons).not.toContain('role_match');
    expect(inferred.outcomes.find((item) => item.code === 'role_evidence')?.state).toBe('unknown');
  });

  it('strict mode uses the selected reference model as baseline', () => {
    const original = model({ id: 'original', release_date: '2023-01-01', status: 'legacy' });
    const modern = model({ id: 'modern', release_date: '2026-06-01' });
    const results = scoreModels([original, modern], [paperFor('original')], { ...baseTask, mode: 'strict', reference: { modelId: 'original', paperId: 'p-original', role: 'policy' } });
    expect(results.find((item) => item.model.id === 'original')?.bucket).toBe('baseline');
    expect(results.find((item) => item.model.id === 'original')?.reasons).toContain('baseline_repro');
    expect(results.find((item) => item.model.id === 'modern')?.bucket).toBe('modern');
  });

  it('uses explicit family coverage before release-date fallback', () => {
    const old = model({ id: 'old', release_date: '2026-01-01' });
    const current = model({ id: 'current', release_date: '2025-01-01' });
    const result = scoreModels([old, current], [], { ...baseTask, mode: 'modern' }, [{ id: 'fam', vendor_id: 'test', name: 'Fam', current_generation: 'v1', current_flagship_model_id: 'current' }]);
    expect(result.find((item) => item.model.id === 'current')?.reasons).toContain('current_gen');
    expect(result.find((item) => item.model.id === 'old')?.reasons).not.toContain('current_gen');
  });

  it('context and single-GPU insufficiency are explicit hard failures when known', () => {
    const candidate = model({ id: 'too-small', architecture: { type: 'dense', total_parameters_b: 7, active_parameters_b: 7, context_length: 4096, expert_count: 'not_applicable', active_experts_per_token: 'not_applicable' }, hardware: { inference_tier: '80gb', lora_tier: '80gb', full_sft_tier: 'multi_gpu', rl_tier: 'multi_gpu' } });
    const result = scoreModels([candidate], [], { ...baseTask, contextTarget: 32768, gpuVramGb: 24, gpuCount: 1 })[0];
    expect(result.fit.blockers.map((item) => item.code)).toEqual(expect.arrayContaining(['context_length', 'hardware_tier']));
  });

  it('verified_only separates unknown records from formal buckets', () => {
    const candidate = model({ id: 'pending', data_status: 'partial' });
    const result = scoreModels([candidate], [], { ...baseTask, evidencePolicy: 'verified_only' })[0];
    expect(result.candidateState).toBe('needs_verification');
    expect(bucketize([result]).modern).toHaveLength(0);
  });

  it('method comparability remains explicit rather than a single displayed score', () => {
    const reference = model({ id: 'reference' });
    const replacement = model({ id: 'replacement', checkpoint: { type: 'base', modalities: ['text'], specializations: ['general'] }, architecture: { type: 'moe', total_parameters_b: 30, active_parameters_b: 3, context_length: 32768, expert_count: 8, active_experts_per_token: 2 } });
    const profile = comparabilityProfile(reference, replacement);
    expect(profile.checkpointSimilarity).toBe('changed');
    expect(profile.architectureSimilarity).toBe('changed');
    expect(profile.parameterScale).toBe('larger');
    expect(profile.overall).toBe('low');
  });

  it('replacement impact changes severity with the research mode and preserves unknowns', () => {
    const reference = model({ id: 'reference', generation: 'v1', openness: { weights_available: true, base_checkpoint_available: true, finetuning_allowed: true, derivative_release_allowed: 'not_verified', commercial_use_allowed: 'not_verified', license_name: 'Apache 2.0' } });
    const replacement = model({ id: 'replacement', generation: 'v2', openness: { weights_available: false, base_checkpoint_available: true, finetuning_allowed: false, derivative_release_allowed: 'not_verified', commercial_use_allowed: 'not_verified', license_name: 'Proprietary' } });
    const strict = analyzeReplacement(reference, replacement, { ...baseTask, mode: 'strict' });
    const modern = analyzeReplacement(reference, replacement, { ...baseTask, mode: 'modern' });
    expect(strict.find((impact) => impact.dimension === 'generation')?.effect).toBe('breaks_direct_comparison');
    expect(strict.find((impact) => impact.dimension === 'generation')?.severity).toBe('high');
    expect(modern.find((impact) => impact.dimension === 'generation')?.severity).toBe('low');
    expect(strict.find((impact) => impact.dimension === 'apiPin')?.severity).toBe('unknown');
  });
});
