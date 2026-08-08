import { z } from 'zod';

/** A missing value is a data state, not a numeric/boolean fact. */
export const semanticStatus = z.enum([
  'not_disclosed',
  'not_applicable',
  'not_reported',
  'not_verified',
  'conflicting_evidence',
  'not_published',
  'unavailable',
]);
export const unknownBoolean = z.union([z.boolean(), semanticStatus]);
export const unknownNumber = z.union([z.number(), semanticStatus]);
export const urlOrUnknown = z.union([z.url(), semanticStatus]);
export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const sourceSchema = z.object({
  id: z.string().min(1).optional(),
  url: z.url(),
  title: z.string().min(1).optional(),
  publisher: z.string().min(1).optional(),
  published_at: dateString.optional(),
  revision: z.string().min(1).optional(),
  supports: z.array(z.string().min(1)).min(1).optional(),
  locator: z.string().min(1).optional(),
  notes: z.string().min(1).optional(),
  type: z.enum(['official_model_card', 'official_docs', 'official_announcement', 'official_weights', 'official_license', 'official_api_docs', 'official_code', 'official_benchmark', 'third_party_runtime', 'technical_report', 'paper', 'code', 'benchmark', 'demo_record']),
  checked_at: dateString,
  evidence_note: z.string().min(1).optional(),
});

const accessSchema = z.object({
  weights_status: z.union([z.enum(['unavailable', 'announced', 'released', 'withdrawn']), semanticStatus]),
  weights_released_at: dateString.optional(),
  weights_url: urlOrUnknown.optional(),
  api_status: z.union([z.enum(['unavailable', 'preview', 'available', 'deprecated']), semanticStatus]),
  api_model_ids: z.array(z.string().min(1)).optional(),
  product_status: z.union([z.enum(['unavailable', 'available']), semanticStatus]).optional(),
  product_names: z.array(z.string().min(1)).optional(),
});

const reproducibilitySchema = z.object({
  model_revision_required: z.boolean().optional(),
  api_version_pinnable: unknownBoolean.optional(),
  tokenizer_public: unknownBoolean.optional(),
  config_public: unknownBoolean.optional(),
  chat_template_public: unknownBoolean.optional(),
  preserved_reasoning_history_required: unknownBoolean.optional(),
  known_nondeterminism_notes: z.string().min(1).optional(),
});

const opennessEvidenceSchema = z.object({
  classification: z.union([z.enum(['open_source', 'open_weight', 'source_available', 'proprietary']), semanticStatus]).optional(),
  custom_license: z.boolean().optional(),
  derivative_distribution: z.union([z.enum(['allowed', 'conditional', 'prohibited']), semanticStatus]).optional(),
  commercial_use: z.union([z.enum(['allowed', 'conditional', 'prohibited']), semanticStatus]).optional(),
  conditions: z.array(z.string().min(1)).optional(),
  license_url: urlOrUnknown.optional(),
});

export const modelSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  official_name: z.string().optional(),
  aliases: z.array(z.string().min(1)).optional(),
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
    license_name: z.union([z.string().min(1), semanticStatus]),
    ...opennessEvidenceSchema.shape,
  }),
  access: accessSchema.optional(),
  reproducibility: reproducibilitySchema.optional(),
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
    inference_tier: z.union([z.enum(['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu', 'api_only', 'unknown']), semanticStatus]),
    lora_tier: z.union([z.enum(['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu', 'api_only', 'unknown']), semanticStatus]),
    full_sft_tier: z.union([z.enum(['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu', 'api_only', 'unknown']), semanticStatus]),
    rl_tier: z.union([z.enum(['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu', 'api_only', 'unknown']), semanticStatus]),
  }),
  sources: z.array(sourceSchema).min(1),
  data_status: z.enum(['verified', 'partial', 'demo', 'unknown']),
  claim_status: z.enum(['draft', 'partial', 'claim_verified', 'stale', 'disputed', 'demo', 'unknown']).optional(),
});

export const paperModelSchema = z.object({
  model_id: z.string().min(1),
  role: z.enum(['policy', 'actor', 'teacher', 'optimizer', 'reflector', 'analyzer', 'critic', 'reward-model', 'judge', 'evaluator', 'baseline']),
  weight_updated: unknownBoolean,
  notes: z.string().optional(),
});

const workflowSchema = z.object({
  nodes: z.array(z.object({
    id: z.string().min(1),
    type: z.enum(['model', 'environment', 'module', 'artifact']),
    label: z.string().optional(),
    model_id: z.string().min(1).optional(),
  })),
  edges: z.array(z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    label: z.string().optional(),
    source_ids: z.array(z.string().min(1)).optional(),
  })),
});

const paperReproducibilitySchema = z.object({
  code_status: z.enum(['available', 'partial', 'unavailable', 'not_verified']),
  checkpoint_status: z.enum(['available', 'partial', 'unavailable', 'not_verified']),
  config_status: z.enum(['available', 'partial', 'unavailable', 'not_verified']),
  environment_status: z.enum(['reported', 'partial', 'not_reported', 'not_verified']),
  notes: z.array(z.string().min(1)).optional(),
});

const modelSelectionSchema = z.object({
  model_id: z.string().min(1),
  rationale: z.string().min(1),
  basis: z.enum(['explicit_in_paper', 'explicit_in_code', 'derived', 'unknown']),
  source_ids: z.array(z.string().min(1)).optional(),
});

export const claimSchema = z.object({
  id: z.string().min(1),
  subject_type: z.enum(['model', 'paper', 'family']),
  subject_id: z.string().min(1),
  field: z.string().min(1),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), semanticStatus]),
  status: z.enum(['verified', 'partial', 'disputed', 'stale']),
  confidence: z.enum(['direct_official', 'official_partial', 'paper', 'third_party', 'derived']),
  valid_from: dateString.optional(),
  valid_to: dateString.optional(),
  checked_at: dateString,
  evidence: z.array(z.object({
    source_id: z.string().min(1),
    relation: z.enum(['supports', 'contradicts']),
  })),
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
  workflow: workflowSchema.optional(),
  reproducibility: paperReproducibilitySchema.optional(),
  model_selection: z.array(modelSelectionSchema).optional(),
});

export type AtlasModel = z.infer<typeof modelSchema>;
export type AtlasPaper = z.infer<typeof paperSchema>;
export type AtlasClaim = z.infer<typeof claimSchema>;
export type PaperModelUse = z.infer<typeof paperModelSchema>;
export type DataStatus = AtlasModel['data_status'];
export type UnknownBoolean = z.infer<typeof unknownBoolean>;
export type SemanticStatus = z.infer<typeof semanticStatus>;
export type HardwareTier = AtlasModel['hardware']['inference_tier'];

export const familyVariantSchema = z.object({
  id: z.string().min(1),
  role: z.enum(['flagship', 'foundation', 'instruct', 'thinking', 'code']),
  distribution_surfaces: z.array(z.enum(['open_weight', 'api'])),
  api_aliases: z.array(z.string().min(1)).optional(),
  is_current: z.boolean().optional(),
  source_url: z.url(),
  checked_at: dateString,
});

export const familySchema = z.object({
  id: z.string().min(1),
  vendor_id: z.string().min(1),
  name: z.string().min(1),
  current_generation: z.string().min(1),
  latest_generation_label: z.string().min(1).optional(),
  latest_specialized_model_ids: z.array(z.string().min(1)).optional(),
  current_flagship_model_id: z.string().min(1).optional(),
  current_open_weight_model_id: z.string().min(1).optional(),
  current_api_model_ids: z.array(z.string().min(1)).optional(),
  current_claim: z.object({ text: z.string().min(1), status: z.union([semanticStatus, z.literal('confirmed')]), source_url: z.url(), checked_at: dateString }).optional(),
  official_catalog_urls: z.array(z.url()).optional(),
  catalog_checked_at: dateString.optional(),
  catalog_source_ids: z.array(z.string().min(1)).optional(),
  confidence: z.enum(['official-confirmed', 'official-partial', 'third-party', 'unverified']).optional(),
  open_weight_scope: z.string().min(1).optional(),
  api_scope: z.string().min(1).optional(),
  variants: z.array(familyVariantSchema).optional(),
  as_of: dateString.optional(),
});

export type FamilyCoverageRecord = z.infer<typeof familySchema>;
