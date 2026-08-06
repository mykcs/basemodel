import { describe, expect, it } from 'vitest';
import { scoreModels, bucketize } from './researchEngine';
import type { AtlasModel, AtlasPaper } from './types';
import type { ResearchTask } from '../stores/researchTask';

function model(partial: Partial<AtlasModel> & { id: string }): AtlasModel {
  return {
    name: partial.id,
    vendor: 'Test',
    family: 'Fam',
    generation: 'v1',
    release_date: '2025-01-01',
    status: 'active',
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
    id: `p-${modelId}`,
    title: `Paper for ${modelId}`,
    published_at: '2024-01-01',
    paper_url: 'https://example.com/p',
    code_url: 'not_verified',
    checkpoint_url: 'not_published',
    category: ['demo'],
    models: [{ model_id: modelId, role, weight_updated: true }],
    evolution_targets: ['x'],
    benchmarks: ['b'],
    sources: [{ url: 'https://example.com/p', type: 'paper', checked_at: '2026-01-01' }],
    data_status: 'verified',
  };
}

const baseTask: ResearchTask = { mode: 'new', roles: [], update: 'none', priorities: [] };

describe('researchEngine.scoreModels', () => {
  it('硬条件：只考虑开放权重时，闭源模型不 eligible', () => {
    const closed = model({ id: 'closed', openness: { weights_available: false, base_checkpoint_available: false, finetuning_allowed: false, derivative_release_allowed: 'not_verified', commercial_use_allowed: 'not_verified', license_name: 'Proprietary' } });
    const out = scoreModels([closed], [], { ...baseTask, openWeight: true });
    expect(out[0].eligible).toBe(false);
  });

  it('update=rl 时，未确认 RL 的模型不 eligible', () => {
    const noRl = model({ id: 'no-rl', research: { suitable_for_inference: true, suitable_for_lora: true, suitable_for_sft: true, suitable_for_rl: 'not_verified', transformers_support: true, vllm_support: true, sglang_support: 'not_verified', verl_recipe_available: 'not_verified' } });
    const out = scoreModels([noRl], [], { ...baseTask, update: 'rl' });
    expect(out[0].eligible).toBe(false);
    expect(out[0].risks).toContain('update_unverified');
  });

  it('角色：policy 角色 + RL 能力 → 得 role_match 分', () => {
    const m = model({ id: 'actor-model' });
    const papers = [paperFor('actor-model', 'policy')];
    const out = scoreModels([m], papers, { ...baseTask, roles: ['policy'], update: 'rl' });
    expect(out[0].reasons).toContain('role_match');
    expect(out[0].paperCount).toBe(1);
  });

  it('模式：modern 偏好当前代（reasons 含 modern_repro）', () => {
    const old = model({ id: 'old', release_date: '2023-01-01', status: 'legacy' });
    const current = model({ id: 'new', release_date: '2026-06-01' });
    const out = scoreModels([old, current], [], { ...baseTask, mode: 'modern' });
    const newOne = out.find((s) => s.model.id === 'new')!;
    expect(newOne.bucket).toBe('modern');
    expect(newOne.reasons).toContain('modern_repro');
  });

  it('模式：strict 偏好有论文的基准模型（bucket=baseline）', () => {
    const paperModel = model({ id: 'baseline-m', release_date: '2023-05-01', status: 'legacy' });
    const papers = [paperFor('baseline-m')];
    const out = scoreModels([paperModel], papers, { ...baseTask, mode: 'strict' });
    expect(out[0].bucket).toBe('baseline');
    expect(out[0].reasons).toContain('baseline_repro');
  });

  it('GPU：显存不足 → gpu_tight 风险', () => {
    const big = model({ id: 'big', hardware: { inference_tier: '80gb', lora_tier: '80gb', full_sft_tier: 'multi_gpu', rl_tier: 'multi_gpu' } });
    const out = scoreModels([big], [], { ...baseTask, gpuVramGb: 24, gpuCount: 1 });
    expect(out[0].risks).toContain('gpu_tight');
  });

  it('bucketize 只返回 eligible，并按 bucket 分组', () => {
    const a = model({ id: 'a', release_date: '2026-06-01' }); // modern
    const b = model({ id: 'b', release_date: '2022-01-01', status: 'legacy' }); // baseline if paper
    const papers = [paperFor('b')];
    const scored = scoreModels([a, b], papers, { ...baseTask, mode: 'modern' });
    const buckets = bucketize(scored);
    expect(buckets.modern.map((s) => s.model.id)).toContain('a');
    expect(buckets.baseline.map((s) => s.model.id)).toContain('b');
  });

  it('排序：eligible 且分数高的排前', () => {
    const withPaper = model({ id: 'wp' });
    const noPaper = model({ id: 'np', release_date: '2020-01-01', status: 'legacy' });
    const papers = [paperFor('wp')];
    const out = scoreModels([noPaper, withPaper], papers, { ...baseTask, priorities: ['comparability'] });
    expect(out[0].model.id).toBe('wp');
    expect(out[0].score).toBeGreaterThan(out[1].score);
  });
});
