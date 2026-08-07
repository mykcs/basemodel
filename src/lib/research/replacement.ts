import type { AtlasModel, AtlasPaper } from '../schemas';
import type { ResearchMode, ResearchTask } from '../../stores/researchTask';
import type { ImpactSeverity, ReplacementImpact } from './types';

function unknown(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'string' && ['unknown', 'not_verified', 'not_reported', 'not_disclosed', 'not_published', 'unavailable'].includes(value));
}

function impactSeverity(mode: ResearchMode): ImpactSeverity {
  return mode === 'strict' ? 'high' : mode === 'method' ? 'medium' : mode === 'modern' ? 'low' : 'low';
}

function changedImpact(mode: ResearchMode): Pick<ReplacementImpact, 'severity' | 'effect'> {
  if (mode === 'strict') return { severity: 'high', effect: 'breaks_direct_comparison' };
  if (mode === 'method') return { severity: 'medium', effect: 'requires_recalibration' };
  if (mode === 'modern') return { severity: 'low', effect: 'operational' };
  return { severity: impactSeverity(mode), effect: 'operational' };
}

function compare(
  dimension: string,
  before: unknown,
  after: unknown,
  fieldPaths: string[],
  explanationCode: string,
  mode: ResearchMode,
): ReplacementImpact {
  if (unknown(before) || unknown(after)) return { dimension, before: String(before ?? 'unknown'), after: String(after ?? 'unknown'), severity: 'unknown', confidence: 'unknown', effect: 'unknown', explanationCode, fieldPaths };
  if (Object.is(before, after)) return { dimension, before: String(before), after: String(after), severity: 'none', confidence: 'direct', effect: 'none', explanationCode, fieldPaths };
  return { dimension, before: String(before), after: String(after), ...changedImpact(mode), confidence: 'direct', explanationCode, fieldPaths };
}

function roleEvidence(modelId: string, papers: AtlasPaper[]): string[] {
  return papers.flatMap((paper) => paper.models.filter((use) => use.model_id === modelId).map((use) => use.role));
}

export function analyzeReplacement(before: AtlasModel, after: AtlasModel, task: ResearchTask, papers: AtlasPaper[] = []): ReplacementImpact[] {
  const impacts: ReplacementImpact[] = [
    compare('generation', before.generation, after.generation, ['generation'], 'generation_changed', task.mode),
    compare('releaseDate', before.release_date, after.release_date, ['release_date'], 'release_date_changed', task.mode),
    compare('checkpoint', before.checkpoint.type, after.checkpoint.type, ['checkpoint.type'], 'checkpoint_changed', task.mode),
    compare('architecture', before.architecture.type, after.architecture.type, ['architecture.type'], 'architecture_changed', task.mode),
    compare('totalParameters', before.architecture.total_parameters_b, after.architecture.total_parameters_b, ['architecture.total_parameters_b'], 'total_parameters_changed', task.mode),
    compare('activeParameters', before.architecture.active_parameters_b, after.architecture.active_parameters_b, ['architecture.active_parameters_b'], 'active_parameters_changed', task.mode),
    compare('context', before.architecture.context_length, after.architecture.context_length, ['architecture.context_length'], 'context_changed', task.mode),
    compare('openWeights', before.openness.weights_available, after.openness.weights_available, ['openness.weights_available'], 'weights_changed', task.mode),
    compare('baseCheckpoint', before.openness.base_checkpoint_available, after.openness.base_checkpoint_available, ['openness.base_checkpoint_available'], 'base_checkpoint_changed', task.mode),
    compare('finetuning', before.openness.finetuning_allowed, after.openness.finetuning_allowed, ['openness.finetuning_allowed'], 'finetuning_changed', task.mode),
    compare('derivative', before.openness.derivative_release_allowed, after.openness.derivative_release_allowed, ['openness.derivative_release_allowed'], 'derivative_changed', task.mode),
    compare('license', before.openness.license_name, after.openness.license_name, ['openness.license_name'], 'license_changed', task.mode),
    compare('runtime', runtimeSummary(before), runtimeSummary(after), ['research.transformers_support', 'research.vllm_support', 'research.sglang_support', 'research.verl_recipe_available'], 'runtime_changed', task.mode),
    compare('inferenceHardware', before.hardware.inference_tier, after.hardware.inference_tier, ['hardware.inference_tier'], 'inference_hardware_changed', task.mode),
    compare('trainingHardware', trainingHardwareSummary(before), trainingHardwareSummary(after), ['hardware.lora_tier', 'hardware.full_sft_tier', 'hardware.rl_tier'], 'training_hardware_changed', task.mode),
    compare('apiPin', before.reproducibility?.api_version_pinnable, after.reproducibility?.api_version_pinnable, ['reproducibility.api_version_pinnable'], 'api_pin_changed', task.mode),
    compare('chatTemplate', before.reproducibility?.chat_template_public, after.reproducibility?.chat_template_public, ['reproducibility.chat_template_public'], 'chat_template_changed', task.mode),
    compare('tokenizer', before.reproducibility?.tokenizer_public, after.reproducibility?.tokenizer_public, ['reproducibility.tokenizer_public'], 'tokenizer_changed', task.mode),
    compare('config', before.reproducibility?.config_public, after.reproducibility?.config_public, ['reproducibility.config_public'], 'config_changed', task.mode),
  ];
  const beforeRoles = roleEvidence(before.id, papers);
  const afterRoles = roleEvidence(after.id, papers);
  const sameRole = beforeRoles.length > 0 && afterRoles.some((role) => beforeRoles.includes(role));
  impacts.push({
    dimension: 'paperRole',
    before: beforeRoles.length ? beforeRoles.join(', ') : 'unknown',
    after: afterRoles.length ? afterRoles.join(', ') : 'unknown',
    severity: beforeRoles.length === 0 || afterRoles.length === 0 ? 'unknown' : sameRole ? 'none' : impactSeverity(task.mode),
    confidence: beforeRoles.length || afterRoles.length ? 'direct' : 'unknown',
    effect: beforeRoles.length === 0 || afterRoles.length === 0 ? 'unknown' : sameRole ? 'none' : changedImpact(task.mode).effect,
    explanationCode: 'paper_role_changed',
    fieldPaths: ['papers.models.role'],
  });
  return impacts;
}

function runtimeSummary(model: AtlasModel): string {
  return [model.research.transformers_support, model.research.vllm_support, model.research.sglang_support, model.research.verl_recipe_available].join('|');
}

function trainingHardwareSummary(model: AtlasModel): string {
  return [model.hardware.lora_tier, model.hardware.full_sft_tier, model.hardware.rl_tier].join('|');
}
