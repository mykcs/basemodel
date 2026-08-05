import { z } from 'zod';

export const unknownBoolean = z.union([z.boolean(), z.literal('unknown')]);
export const unknownNumber = z.union([z.number(), z.null(), z.literal('unknown')]);
export const urlOrUnknown = z.union([z.url(), z.literal('unknown')]);
export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const sourceSchema = z.object({
  url: z.url(),
  type: z.enum(['official_model_card', 'official_docs', 'paper', 'code', 'benchmark', 'demo_record']),
  checked_at: dateString,
});

export const modelSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  official_name: z.string().optional(),
  vendor: z.string().min(1),
  family: z.string().min(1),
  generation: z.string().min(1),
  release_date: dateString,
  status: z.enum(['active', 'legacy', 'preview', 'unknown']),
  checkpoint: z.object({
    type: z.enum(['base', 'instruct', 'thinking', 'coder', 'vision']),
    modalities: z.array(z.enum(['text', 'image', 'audio', 'video'])).min(1),
    specializations: z.array(z.string()).default([]),
  }),
  architecture: z.object({
    type: z.enum(['dense', 'moe', 'other']),
    total_parameters_b: unknownNumber,
    active_parameters_b: unknownNumber,
    context_length: unknownNumber,
    expert_count: unknownNumber,
    active_experts_per_token: unknownNumber,
  }),
  openness: z.object({
    weights_available: unknownBoolean,
    base_checkpoint_available: unknownBoolean,
    finetuning_allowed: unknownBoolean,
    derivative_release_allowed: unknownBoolean,
    commercial_use_allowed: unknownBoolean,
    license_name: z.string().min(1),
  }),
  research: z.object({
    suitable_for_inference: unknownBoolean,
    suitable_for_lora: unknownBoolean,
    suitable_for_sft: unknownBoolean,
    suitable_for_rl: unknownBoolean,
    transformers_support: unknownBoolean,
    vllm_support: unknownBoolean,
    sglang_support: unknownBoolean,
    verl_recipe_available: unknownBoolean,
  }),
  hardware: z.object({
    inference_tier: z.enum(['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu', 'api_only', 'unknown']),
    lora_tier: z.enum(['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu', 'api_only', 'unknown']),
    full_sft_tier: z.enum(['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu', 'api_only', 'unknown']),
    rl_tier: z.enum(['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu', 'api_only', 'unknown']),
  }),
  sources: z.array(sourceSchema).min(1),
  data_status: z.enum(['verified', 'partial', 'demo', 'unknown']),
});

export const paperModelSchema = z.object({
  model_id: z.string().min(1),
  role: z.enum(['policy', 'actor', 'teacher', 'optimizer', 'reflector', 'analyzer', 'critic', 'reward-model', 'judge', 'evaluator', 'baseline']),
  weight_updated: unknownBoolean,
  notes: z.string().optional(),
});

export const paperSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  published_at: dateString,
  paper_url: urlOrUnknown,
  code_url: urlOrUnknown,
  checkpoint_url: urlOrUnknown,
  category: z.array(z.string()).min(1),
  models: z.array(paperModelSchema).min(1),
  evolution_targets: z.array(z.string()).min(1),
  benchmarks: z.array(z.string()).min(1),
  sources: z.array(sourceSchema).min(1),
  data_status: z.enum(['verified', 'partial', 'demo', 'unknown']),
});

export type AtlasModel = z.infer<typeof modelSchema>;
export type AtlasPaper = z.infer<typeof paperSchema>;
export type PaperModelUse = z.infer<typeof paperModelSchema>;
export type DataStatus = AtlasModel['data_status'];
export type UnknownBoolean = z.infer<typeof unknownBoolean>;
export type HardwareTier = AtlasModel['hardware']['inference_tier'];
