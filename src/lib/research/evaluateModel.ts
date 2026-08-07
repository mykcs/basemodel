import { papersForModel } from '../modelRelations';
import type { AtlasModel, AtlasPaper, FamilyCoverageRecord } from '../schemas';
import type { ResearchTask, RuntimeRequirement } from '../../stores/researchTask';
import { familyCoverageRecords, isCurrentModel } from '../familyCoverage';
import type { ComparabilityProfile, DimensionFit, ModelEvaluation, RuleOutcome, RuleState, ScoredModel, ReasonCode, RiskCode, Bucket } from './types';

const TIER_ORDER = ['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu'];

function state(value: unknown): RuleState {
  if (value === true) return 'pass';
  if (value === false) return 'fail';
  return value === undefined || value === null || typeof value === 'string' ? 'unknown' : 'unknown';
}

function outcome(code: string, value: unknown, severity: 'hard' | 'soft', fieldPaths: string[], explanationCode = code): RuleOutcome {
  return { state: state(value), code, severity, fieldPaths, explanationCode };
}

function notApplicable(code: string, fieldPaths: string[] = []): RuleOutcome {
  return { state: 'not_applicable', code, severity: 'soft', fieldPaths, explanationCode: code };
}

function tierIndex(value: unknown): number | null {
  return typeof value === 'string' && TIER_ORDER.includes(value) ? TIER_ORDER.indexOf(value) : null;
}

function requiredTier(model: AtlasModel, task: ResearchTask): unknown {
  if (task.update === 'rl') return model.hardware.rl_tier;
  if (task.update === 'sft') return model.hardware.full_sft_tier;
  if (task.update === 'lora') return model.hardware.lora_tier;
  return model.hardware.inference_tier;
}

function directRoleEvidence(model: AtlasModel, papers: AtlasPaper[], roles: string[]): string[] {
  return papers
    .flatMap((paper) => paper.models.filter((use) => use.model_id === model.id && roles.includes(use.role)).map((use) => `${paper.id}:${use.role}`));
}

export function comparabilityProfile(reference: AtlasModel | undefined, model: AtlasModel): ComparabilityProfile {
  if (!reference) return { checkpointSimilarity: 'unknown', architectureSimilarity: 'unknown', parameterScale: 'unknown', accessSimilarity: 'unknown', overall: 'unknown' };
  if (reference.id === model.id) return { checkpointSimilarity: 'same', architectureSimilarity: 'same', parameterScale: 'similar', accessSimilarity: 'same', overall: 'high' };
  const scale = typeof reference.architecture.total_parameters_b === 'number' && typeof model.architecture.total_parameters_b === 'number'
    ? model.architecture.total_parameters_b === reference.architecture.total_parameters_b ? 'similar' : model.architecture.total_parameters_b > reference.architecture.total_parameters_b ? 'larger' : 'smaller'
    : 'unknown';
  const sameArchitecture = reference.architecture.type === model.architecture.type;
  const sameCheckpoint = reference.checkpoint.type === model.checkpoint.type;
  const sameAccess = reference.openness.weights_available === model.openness.weights_available;
  const known = [scale !== 'unknown', sameArchitecture, sameCheckpoint, reference.openness.weights_available !== 'not_verified' && model.openness.weights_available !== 'not_verified'];
  const score = known.reduce((sum, item) => sum + Number(item), 0);
  return {
    checkpointSimilarity: reference.checkpoint.type === model.checkpoint.type ? 'same' : 'changed',
    architectureSimilarity: sameArchitecture ? 'same' : 'changed',
    parameterScale: scale,
    accessSimilarity: known[3] ? (sameAccess ? 'same' : 'changed') : 'unknown',
    overall: known[3] && score >= 3 ? 'high' : (reference.checkpoint.type !== model.checkpoint.type || reference.architecture.type !== model.architecture.type) ? 'low' : score >= 2 ? 'medium' : score === 0 ? 'unknown' : 'low',
  };
}

function fitLevel(outcomes: RuleOutcome[], failToLow = true): DimensionFit {
  const relevant = outcomes.filter((item) => item.state !== 'not_applicable');
  if (relevant.some((item) => item.state === 'fail')) return { level: failToLow ? 'low' : 'unknown', outcomes };
  if (relevant.length === 0 || relevant.every((item) => item.state === 'unknown')) return { level: 'unknown', outcomes };
  if (relevant.some((item) => item.state === 'unknown')) return { level: 'medium', outcomes };
  return { level: 'high', outcomes };
}

function buildEvaluation(model: AtlasModel, papers: AtlasPaper[], task: ResearchTask): ModelEvaluation {
  const modelPapers = papersForModel(papers, model.id);
  const outcomes: RuleOutcome[] = [];
  const roleEvidence = directRoleEvidence(model, modelPapers, task.roles);
  const push = (item: RuleOutcome) => outcomes.push(item);

  if (task.openWeight === true) push(outcome('open_weights', model.openness.weights_available, 'hard', ['openness.weights_available']));
  if (task.accessMode === 'local') push(outcome('local_access', model.openness.weights_available, 'hard', ['openness.weights_available'], 'local_weights_required'));
  else if (task.accessMode === 'api') push(outcome('api_access', model.access?.api_status === 'unavailable' ? false : model.access?.api_status, 'hard', ['access.api_status'], 'api_access_required'));
  else push(notApplicable('local_access'));

  const updateField: Record<Exclude<ResearchTask['update'], 'none' | 'unsure'>, keyof AtlasModel['research']> = {
    lora: 'suitable_for_lora', sft: 'suitable_for_sft', rl: 'suitable_for_rl',
  };
  if (task.update === 'none' || task.update === 'unsure') push(notApplicable('update_capability'));
  else push(outcome('update_capability', model.research[updateField[task.update]], 'hard', [`research.${updateField[task.update]}`], 'update_capability_required'));

  if (task.roles.length === 0) push(notApplicable('role_evidence'));
  else if (roleEvidence.length > 0) push({ state: 'pass', code: 'role_evidence', severity: 'soft', fieldPaths: ['papers.models.role'], explanationCode: 'direct_role_evidence' });
  else push({ state: 'unknown', code: 'role_evidence', severity: 'soft', fieldPaths: ['papers.models.role'], explanationCode: 'role_evidence_unknown' });

  if (typeof task.contextTarget !== 'number') push(notApplicable('context_length'));
  else if (typeof model.architecture.context_length !== 'number') push(outcome('context_length', undefined, 'hard', ['architecture.context_length'], 'context_length_unknown'));
  else push({ state: model.architecture.context_length >= task.contextTarget ? 'pass' : 'fail', code: 'context_length', severity: 'hard', fieldPaths: ['architecture.context_length'], explanationCode: 'context_target' });

  const tier = requiredTier(model, task);
  if (typeof task.gpuVramGb !== 'number') push(notApplicable('hardware_tier'));
  else if (tier === 'api_only') push(task.accessMode === 'local' ? { state: 'fail', code: 'hardware_tier', severity: 'hard', fieldPaths: ['hardware'], explanationCode: 'local_hardware_required' } : { state: 'pass', code: 'hardware_tier', severity: 'hard', fieldPaths: ['hardware'], explanationCode: 'api_access_available' });
  else if (tierIndex(tier) === null) push(outcome('hardware_tier', undefined, 'hard', ['hardware'], 'hardware_tier_unknown'));
  else {
    const available = task.gpuCount && task.gpuCount > 1 ? TIER_ORDER.length - 1 : task.gpuVramGb <= 16 ? 1 : task.gpuVramGb <= 24 ? 2 : task.gpuVramGb <= 48 ? 3 : task.gpuVramGb <= 80 ? 4 : 5;
    push({ state: available >= tierIndex(tier)! ? 'pass' : 'fail', code: 'hardware_tier', severity: 'hard', fieldPaths: [`hardware.${task.update === 'none' ? 'inference' : task.update}_tier`], explanationCode: 'hardware_tier' });
  }

  const runtimeFields: Record<RuntimeRequirement, keyof AtlasModel['research']> = { transformers: 'transformers_support', vllm: 'vllm_support', sglang: 'sglang_support', verl: 'verl_recipe_available' };
  for (const runtime of task.requiredRuntimes) push(outcome(`runtime_${runtime}`, model.research[runtimeFields[runtime]], 'hard', [`research.${runtimeFields[runtime]}`], 'runtime_required'));
  if (task.requiredRuntimes.length === 0) push(notApplicable('runtime'));

  if (task.requireBaseCheckpoint === true) push(outcome('base_checkpoint', model.openness.base_checkpoint_available, 'hard', ['openness.base_checkpoint_available'], 'base_checkpoint_required'));
  if (task.license.allowCustomLicense === false) push(outcome('custom_license', model.openness.custom_license === false ? true : model.openness.custom_license, 'hard', ['openness.custom_license'], 'custom_license_not_allowed'));
  if (task.license.requireDerivativeDistribution === true) push(outcome('derivative_distribution', model.openness.derivative_release_allowed, 'hard', ['openness.derivative_release_allowed'], 'derivative_distribution_required'));
  if (task.license.requireCommercialUse === true) push(outcome('commercial_use', model.openness.commercial_use_allowed, 'hard', ['openness.commercial_use_allowed'], 'commercial_use_required'));
  if (task.reproducibility.requirePinnableRevision === true) push(outcome('pinnable_revision', model.reproducibility?.api_version_pinnable, 'hard', ['reproducibility.api_version_pinnable'], 'pinnable_revision_required'));
  if (task.reproducibility.requirePublicTokenizer === true) push(outcome('public_tokenizer', model.reproducibility?.tokenizer_public, 'hard', ['reproducibility.tokenizer_public'], 'public_tokenizer_required'));
  if (task.reproducibility.requirePublicConfig === true) push(outcome('public_config', model.reproducibility?.config_public, 'hard', ['reproducibility.config_public'], 'public_config_required'));
  if (task.reproducibility.requirePublicChatTemplate === true) push(outcome('public_chat_template', model.reproducibility?.chat_template_public, 'hard', ['reproducibility.chat_template_public'], 'public_chat_template_required'));

  const evidence = model.data_status === 'verified' ? [{ state: 'pass', code: 'evidence_quality', severity: 'soft', fieldPaths: ['data_status'], explanationCode: 'verified_data' } as RuleOutcome] : [{ state: 'unknown', code: 'evidence_quality', severity: 'soft', fieldPaths: ['data_status'], explanationCode: 'evidence_incomplete' } as RuleOutcome];
  const hard = outcomes.filter((item) => item.severity === 'hard');
  const blockers = hard.filter((item) => item.state === 'fail');
  const unknown = outcomes.some((item) => item.state === 'unknown') || evidence.some((item) => item.state === 'unknown');
  const feasibilityOutcomes = outcomes.filter((item) => ['open_weights', 'local_access', 'context_length', 'hardware_tier', 'base_checkpoint', 'runtime'].some((prefix) => item.code.startsWith(prefix)));
  const researchOutcomes = outcomes.filter((item) => item.code === 'update_capability' || item.code === 'role_evidence');
  const reproducibilityOutcomes = outcomes.filter((item) => ['pinnable_revision', 'public_tokenizer', 'public_config', 'public_chat_template'].includes(item.code));
  const fit: ModelEvaluation['fit'] = {
    overall: blockers.length ? 'blocked' : unknown ? (task.evidencePolicy === 'verified_only' ? 'blocked' : 'conditional') : 'high',
    feasibility: fitLevel(feasibilityOutcomes),
    researchSuitability: fitLevel(researchOutcomes),
    comparability: fitLevel(modelPapers.length ? [{ state: 'pass', code: 'paper_adoption', severity: 'soft', fieldPaths: ['papers.models'], explanationCode: 'paper_adoption' }] : [{ state: 'unknown', code: 'paper_adoption', severity: 'soft', fieldPaths: ['papers.models'], explanationCode: 'paper_adoption_unknown' }]),
    reproducibility: fitLevel(reproducibilityOutcomes),
    evidenceQuality: fitLevel(evidence),
    reasons: [], risks: [], blockers,
  };
  return { model, task, papers: modelPapers, outcomes: [...outcomes, ...evidence], fit, hardFail: blockers.length > 0, hasUnknown: unknown, directRoleEvidence: roleEvidence };
}

export function evaluateModel(model: AtlasModel, papers: AtlasPaper[], task: ResearchTask, allModels: AtlasModel[] = [model], families: FamilyCoverageRecord[] = familyCoverageRecords): ModelEvaluation {
  void allModels;
  void families;
  return buildEvaluation(model, papers, task);
}

function reasonList(model: AtlasModel, evaluation: ModelEvaluation, current: boolean, paperCount: number): { reasons: ReasonCode[]; risks: RiskCode[]; score: number } {
  const reasons: ReasonCode[] = [];
  const risks: RiskCode[] = [];
  let score = 0;
  if (model.openness.weights_available === true) { reasons.push('open_weights'); score += 2; }
  if (evaluation.outcomes.some((item) => item.code === 'hardware_tier' && item.state === 'pass')) { reasons.push('fits_gpu'); score += 2; }
  if (evaluation.outcomes.some((item) => item.code === 'update_capability' && item.state === 'pass')) { reasons.push('fits_update'); score += 2; }
  if (evaluation.directRoleEvidence.length > 0) { reasons.push('role_match'); score += 2; }
  if (paperCount > 0) { reasons.push('paper_used'); score += 1; }
  else risks.push('no_paper');
  if (current) { reasons.push('current_gen'); score += 1; }
  else { risks.push('not_current'); if (model.status === 'legacy') risks.push('legacy'); }
  if (evaluation.hasUnknown) { risks.push('evidence_unverified'); score -= 1; }
  if (evaluation.outcomes.some((item) => item.code === 'update_capability' && item.state === 'fail')) risks.push('update_unverified');
  if (evaluation.outcomes.some((item) => item.code.startsWith('runtime_') && item.state === 'fail')) risks.push('runtime_missing');
  if (evaluation.outcomes.some((item) => ['derivative_distribution', 'commercial_use'].includes(item.code) && item.state === 'fail')) risks.push('license_restricted');
  if (evaluation.outcomes.some((item) => item.code.startsWith('public_') || item.code === 'pinnable_revision')) risks.push('reproducibility_unverified');
  return { reasons, risks, score };
}

export function scoreModels(models: AtlasModel[], papers: AtlasPaper[], task: ResearchTask, families: FamilyCoverageRecord[] = familyCoverageRecords): ScoredModel[] {
  const results = models.map((model) => {
    const evaluation = buildEvaluation(model, papers, task);
    const paperCount = evaluation.papers.length;
    const current = isCurrentModel(model, families, models);
    const lists = reasonList(model, evaluation, current, paperCount);
    const reference = task.reference?.modelId === model.id;
    let bucket: Bucket = current ? 'modern' : paperCount ? 'baseline' : 'modern';
    if (task.mode === 'strict' && task.reference?.modelId) bucket = reference ? 'baseline' : current ? 'modern' : 'resource';
    if (task.mode === 'method' && task.reference?.modelId) bucket = reference ? 'baseline' : 'modern';
    if (typeof task.gpuVramGb === 'number' && lists.reasons.includes('fits_gpu') && !current && paperCount === 0) bucket = 'resource';
    if (task.mode === 'strict' && reference) lists.reasons.push('baseline_repro');
    if (task.mode === 'modern' && current) lists.reasons.push('modern_repro');
    const candidateState: ScoredModel['candidateState'] = evaluation.hardFail ? 'blocked' : task.evidencePolicy === 'verified_only' && evaluation.hasUnknown ? 'needs_verification' : evaluation.hasUnknown && task.evidencePolicy === 'verified_preferred' ? 'conditional' : 'candidate';
    return { ...evaluation, score: lists.score, bucket, reasons: [...new Set(lists.reasons)], risks: [...new Set(lists.risks)], paperCount, eligible: !evaluation.hardFail, candidateState };
  });
  return results.sort((left, right) => Number(right.eligible) - Number(left.eligible) || Number(right.candidateState === 'candidate') - Number(left.candidateState === 'candidate') || right.score - left.score || right.paperCount - left.paperCount || right.model.release_date.localeCompare(left.model.release_date));
}
