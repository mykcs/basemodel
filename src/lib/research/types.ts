import type { AtlasModel, AtlasPaper } from '../schemas';
import type { ResearchTask } from '../../stores/researchTask';

export type Bucket = 'baseline' | 'modern' | 'resource';
export type RuleState = 'pass' | 'fail' | 'unknown' | 'not_applicable';
export type RuleSeverity = 'hard' | 'soft';

export interface RuleOutcome {
  state: RuleState;
  code: string;
  severity: RuleSeverity;
  fieldPaths: string[];
  explanationCode: string;
}

export interface DimensionFit {
  level: 'high' | 'medium' | 'low' | 'unknown';
  outcomes: RuleOutcome[];
}

export interface ResearchFit {
  overall: 'high' | 'conditional' | 'explore' | 'blocked';
  feasibility: DimensionFit;
  researchSuitability: DimensionFit;
  comparability: DimensionFit;
  reproducibility: DimensionFit;
  evidenceQuality: DimensionFit;
  reasons: ReasonCode[];
  risks: RiskCode[];
  blockers: RuleOutcome[];
}

export interface ComparabilityProfile {
  checkpointSimilarity: 'same' | 'changed' | 'unknown';
  architectureSimilarity: 'same' | 'changed' | 'unknown';
  parameterScale: 'similar' | 'larger' | 'smaller' | 'unknown';
  accessSimilarity: 'same' | 'changed' | 'unknown';
  overall: 'high' | 'medium' | 'low' | 'unknown';
}

export type ImpactSeverity = 'none' | 'low' | 'medium' | 'high' | 'unknown';
export type ImpactConfidence = 'direct' | 'derived' | 'unknown';
export interface ReplacementImpact {
  dimension: string;
  before: string;
  after: string;
  severity: ImpactSeverity;
  confidence: ImpactConfidence;
  effect: 'none' | 'operational' | 'requires_recalibration' | 'breaks_direct_comparison' | 'unknown';
  explanationCode: string;
  fieldPaths: string[];
}

export type ReasonCode =
  | 'open_weights' | 'fits_gpu' | 'fits_update' | 'role_match' | 'paper_used'
  | 'paper_comparable' | 'current_gen' | 'low_cost' | 'chinese' | 'tool_use'
  | 'baseline_repro' | 'modern_repro' | 'context_ok';

export type RiskCode =
  | 'weights_closed' | 'finetune_prohibited' | 'context_short' | 'gpu_tight'
  | 'no_paper' | 'not_current' | 'update_unverified' | 'legacy'
  | 'evidence_unverified' | 'runtime_missing' | 'license_restricted'
  | 'reproducibility_unverified';

export interface ModelEvaluation {
  model: AtlasModel;
  task: ResearchTask;
  papers: AtlasPaper[];
  outcomes: RuleOutcome[];
  fit: ResearchFit;
  hardFail: boolean;
  hasUnknown: boolean;
  directRoleEvidence: string[];
}

export interface ScoredModel extends ModelEvaluation {
  score: number;
  bucket: Bucket;
  reasons: ReasonCode[];
  risks: RiskCode[];
  paperCount: number;
  /** No hard contradiction. Unknown facts are deliberately not folded into false. */
  eligible: boolean;
  candidateState: 'candidate' | 'conditional' | 'needs_verification' | 'blocked';
}
