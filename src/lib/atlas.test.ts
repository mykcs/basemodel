import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { filterModels, matchesExperiment, parseOptionalBooleanParam } from './modelFilters';
import { hardwareFits } from './hardware';
import { recommendModels } from './recommendation';
import { papersForModel } from './modelRelations';
import { architectureLabel, categoryLabel, evolutionTargetLabel, isSameCanonicalName, lifecycleLabel, modelContextLabels, modelIdentityTrail, noteLabel, roleLabel, sourceTypeLabel, taskLabel, tierLabel } from './format';
import type { AtlasModel, AtlasPaper } from './types';

const baseModel: AtlasModel = { id: 'test-model', name: 'Test Model', vendor: 'Test', family: 'Test', generation: 'v1', release_date: '2026-01-01', status: 'active', checkpoint: { type: 'instruct', modalities: ['text'], specializations: ['general', 'chinese', 'tool-use'] }, architecture: { type: 'dense', total_parameters_b: 3, active_parameters_b: 3, context_length: 8192, expert_count: null, active_experts_per_token: null }, openness: { weights_available: true, base_checkpoint_available: true, finetuning_allowed: true, derivative_release_allowed: 'unknown', commercial_use_allowed: 'unknown', license_name: 'Demo' }, research: { suitable_for_inference: true, suitable_for_lora: true, suitable_for_sft: true, suitable_for_rl: true, transformers_support: true, vllm_support: true, sglang_support: 'unknown', verl_recipe_available: 'unknown' }, hardware: { inference_tier: '16gb', lora_tier: '24gb', full_sft_tier: '48gb', rl_tier: 'multi_gpu' }, sources: [{ url: 'https://example.com/test', type: 'demo_record', checked_at: '2026-01-01' }], data_status: 'demo' };
const paper: AtlasPaper = { id: 'test-paper', title: 'Test Paper', published_at: '2026-01-01', paper_url: 'https://example.com/paper', code_url: 'unknown', checkpoint_url: 'unknown', category: ['demo'], models: [{ model_id: 'test-model', role: 'policy', weight_updated: true }], evolution_targets: ['policy-weights'], benchmarks: ['Demo'], sources: [{ url: 'https://example.com/paper-source', type: 'demo_record', checked_at: '2026-01-01' }], data_status: 'demo' };
const paperNotes = readdirSync(new URL('../content/papers/', import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
  .flatMap((entry) => {
    const data = JSON.parse(readFileSync(new URL(`../content/papers/${entry.name}`, import.meta.url), 'utf8')) as AtlasPaper;
    return data.models.flatMap((use) => use.notes ? [use.notes] : []);
  });

describe('atlas rules', () => {
  it('filters by architecture and open weights', () => expect(filterModels([baseModel], { architecture: 'dense', openWeights: true })).toHaveLength(1));
  it('keeps absent boolean query filters unset', () => {
    expect(parseOptionalBooleanParam(null)).toBeUndefined();
    expect(parseOptionalBooleanParam('')).toBeUndefined();
    expect(parseOptionalBooleanParam('true')).toBe(true);
    expect(parseOptionalBooleanParam('false')).toBe(false);
  });
  it('preserves unknown hardware as unknown', () => expect(hardwareFits({ ...baseModel, hardware: { ...baseModel.hardware, inference_tier: 'unknown' } }, 'inference', '24gb')).toBe('unknown'));
  it('treats a larger available tier as sufficient', () => expect(hardwareFits(baseModel, 'inference', '24gb')).toBe(true));
  it('returns a candidate when the rule conditions match', () => expect(recommendModels([baseModel], { mode: 'inference', task: 'chinese', resource: '24gb', goal: 'open_weights' })[0].candidate).toBe(true));
  // 弱证据：模型只有泛化 tool-use 专长时，webshop 方向应命中相近方向（relatedTo 反向映射）
  it('gives weak evidence for a related general specialty', () => expect(recommendModels([baseModel], { mode: 'inference', task: 'webshop', resource: '24gb', goal: 'current' })[0].evidence).toBe('weak'));
  it('resolves papers through model ids', () => expect(papersForModel([paper], 'test-model')).toHaveLength(1));
  it('localizes dynamic enum labels and hides unknown storage values', () => {
    expect(architectureLabel('moe', 'zh')).toBe('混合专家（MoE）');
    expect(lifecycleLabel('active', 'zh')).toBe('活跃');
    expect(sourceTypeLabel('official_model_card', 'zh')).toBe('官方模型卡');
    expect(roleLabel('actor', 'zh')).toBe('执行者');
    expect(categoryLabel('self-evolving-agent', 'zh')).toBe('自进化智能体');
    expect(evolutionTargetLabel('planning-policy', 'zh')).toBe('规划策略');
    expect(taskLabel('webshop', 'zh')).toBe('WebShop 网页导航');
    expect(tierLabel('24gb', 'zh')).toBe('24GB GPU');
    expect(roleLabel('future-role', 'zh')).toBe('未知');
  });
  it('does not leak raw resource or task enums in selector evidence', () => {
    const explanation = matchesExperiment(baseModel, 'inference', 'webshop', '24gb', 'current', 'zh');
    const visible = [...explanation.matched, ...explanation.missing].join(' ');
    expect(visible).toContain('24GB GPU');
    expect(visible).toContain('WebShop 网页导航');
    expect(visible).not.toMatch(/\b24gb\b|\bwebshop\b/);
  });
  it('deduplicates canonical model names and localizes relation notes', () => {
    expect(isSameCanonicalName('Kimi K2 Instruct', 'Kimi-K2-Instruct')).toBe(true);
    expect(isSameCanonicalName('Gemma 3 4B IT', 'Gemma 3 4B Instruction-Tuned')).toBe(false);
    expect(modelIdentityTrail({ name: 'GPT-4', vendor: 'OpenAI', family: 'GPT', generation: 'GPT-4' })).toEqual(['OpenAI']);
    expect(modelContextLabels({ name: 'text-davinci-003', family: 'GPT', generation: 'GPT-3.5' })).toEqual(['GPT-3.5']);
    expect(noteLabel('GPT-4 benchmarked as an AgentBench agent.', 'zh')).toBe('GPT-4 作为 AgentBench 智能体参与基准测试。');
    expect(noteLabel('GPT-4 benchmarked as an AgentBench agent.', 'en')).toBe('GPT-4 benchmarked as an AgentBench agent.');
    expect(noteLabel('unmapped note', 'zh')).toBe('未知');
  });
  it('localizes every stored paper relation note while preserving English originals', () => {
    expect(paperNotes.length).toBeGreaterThan(0);
    for (const note of paperNotes) {
      expect(noteLabel(note, 'zh')).not.toBe(note);
      expect(noteLabel(note, 'zh')).not.toBe('未知');
      expect(noteLabel(note, 'en')).toBe(note);
    }
  });
});
