import { papersForModel } from './modelRelations';
import type { AtlasModel, AtlasPaper } from './types';
import type { ResearchTask } from '../stores/researchTask';

/**
 * V2 研究决策引擎。
 *
 * 与旧 `filterCandidatesByTask` 的区别：旧版只做布尔过滤（砍掉不满足硬条件的），
 * 本引擎让任务里的 mode / roles / update / priorities / 资源 / 开放性都参与打分，
 * 并为每个候选产出：
 *  - bucket：基准 / 现代 / 资源 三个研究篮子
 *  - reasons：为什么推荐（结构化代码，UI 负责翻译）
 *  - risks：主要风险 / 未核验项
 *
 * 文案不进引擎，引擎只返回结构化代码 + 数值，保持 i18n 单一出口在组件层。
 */

export type Bucket = 'baseline' | 'modern' | 'resource';

export type ReasonCode =
  | 'open_weights'
  | 'fits_gpu'
  | 'fits_update'
  | 'role_match'
  | 'paper_used'
  | 'paper_comparable'
  | 'current_gen'
  | 'low_cost'
  | 'chinese'
  | 'tool_use'
  | 'baseline_repro'
  | 'modern_repro'
  | 'context_ok';

export type RiskCode =
  | 'weights_closed'
  | 'finetune_prohibited'
  | 'context_short'
  | 'gpu_tight'
  | 'no_paper'
  | 'not_current'
  | 'update_unverified'
  | 'legacy';

export interface ScoredModel {
  model: AtlasModel;
  score: number;
  bucket: Bucket;
  reasons: ReasonCode[];
  risks: RiskCode[];
  paperCount: number;
  /** 是否满足任务硬条件（开放权重 / 更新方式 / 上下文 / 显存） */
  eligible: boolean;
}

const ROLE_TO_UPDATE_FIELD: Record<string, 'suitable_for_lora' | 'suitable_for_sft' | 'suitable_for_rl' | 'suitable_for_inference'> = {
  actor: 'suitable_for_inference',
  policy: 'suitable_for_rl',
  critic: 'suitable_for_rl',
  'reward-model': 'suitable_for_sft',
  judge: 'suitable_for_inference',
  evaluator: 'suitable_for_inference',
  teacher: 'suitable_for_sft',
  reflector: 'suitable_for_inference',
  optimizer: 'suitable_for_sft',
  analyzer: 'suitable_for_inference',
  baseline: 'suitable_for_inference',
};

function num(v: number | string): number | null {
  return typeof v === 'number' ? v : null;
}

function bool(v: boolean | string): boolean | null {
  return typeof v === 'boolean' ? v : null;
}

/** 估算在目标更新方式下的显存门槛（粗估，用于 GPU 适配提示）。 */
function requiredTierForTask(model: AtlasModel, task: ResearchTask): string {
  if (task.update === 'rl') return model.hardware.rl_tier;
  if (task.update === 'sft') return model.hardware.full_sft_tier;
  if (task.update === 'lora') return model.hardware.lora_tier;
  return model.hardware.inference_tier;
}

const TIER_ORDER = ['cpu_mac', '16gb', '24gb', '48gb', '80gb', 'multi_gpu'];

function tierIndex(tier: string): number {
  const i = TIER_ORDER.indexOf(tier);
  return i === -1 ? TIER_ORDER.length : i;
}

function vramToTier(vramGb: number, gpuCount: number): number {
  // 单卡档位
  const perCard = vramGb <= 16 ? 1 : vramGb <= 24 ? 2 : vramGb <= 48 ? 3 : vramGb <= 80 ? 4 : 4;
  // 多卡整体抬到 multi_gpu 档
  return gpuCount >= 2 ? 5 : perCard;
}

function isCurrentGen(model: AtlasModel, allModels: AtlasModel[]): boolean {
  if (model.status !== 'active') return false;
  const family = allModels.filter((m) => m.vendor === model.vendor && m.family === model.family);
  const latest = family.reduce((max, m) => (m.release_date > max ? m.release_date : max), '');
  return model.release_date === latest;
}

export function scoreModels(
  models: AtlasModel[],
  papers: AtlasPaper[],
  task: ResearchTask
): ScoredModel[] {
  const results: ScoredModel[] = models.map((model) => {
    const reasons: ReasonCode[] = [];
    const risks: RiskCode[] = [];
    let score = 0;

    const paperList = papersForModel(papers, model.id);
    const paperCount = paperList.length;
    const hasPaper = paperCount > 0;
    const openW = bool(model.openness.weights_available) === true;
    const finetune = bool(model.openness.finetuning_allowed);
    const current = isCurrentGen(model, models);
    const specializations = model.checkpoint.specializations;

    // ---- 硬条件（决定 eligible） ----
    let eligible = true;
    if (task.openWeight === true && !openW) eligible = false;
    if (task.update === 'rl' && bool(model.research.suitable_for_rl) !== true) eligible = false;
    if (task.update === 'lora' && bool(model.research.suitable_for_lora) !== true) eligible = false;
    if (task.update === 'sft' && bool(model.research.suitable_for_sft) !== true) eligible = false;
    if (typeof task.contextTarget === 'number') {
      const ctx = num(model.architecture.context_length);
      if (ctx !== null && ctx < task.contextTarget) eligible = false;
    }

    // ---- 开放性 ----
    if (openW) {
      score += 2;
      reasons.push('open_weights');
    } else if (task.openWeight) {
      risks.push('weights_closed');
    }
    if (finetune === false) risks.push('finetune_prohibited');

    // ---- 更新方式 ----
    if (task.update !== 'none' && task.update !== 'unsure') {
      const ok =
        task.update === 'rl'
          ? bool(model.research.suitable_for_rl) === true
          : task.update === 'lora'
            ? bool(model.research.suitable_for_lora) === true
            : bool(model.research.suitable_for_sft) === true;
      if (ok) {
        score += 2;
        reasons.push('fits_update');
      } else {
        risks.push('update_unverified');
      }
    }

    // ---- 角色匹配（论文中该角色 + 该角色对应的更新能力） ----
    let roleHits = 0;
    for (const role of task.roles) {
      const inPaper = paperList.some((p) => p.models.some((u) => u.model_id === model.id && u.role === role));
      const field = ROLE_TO_UPDATE_FIELD[role];
      const capability = field ? bool(model.research[field]) === true : false;
      if (inPaper || capability) {
        roleHits += 1;
        if (inPaper) score += 1;
      }
    }
    if (task.roles.length > 0 && roleHits > 0) {
      score += 2;
      reasons.push('role_match');
    }

    // ---- 论文采用 ----
    if (hasPaper) {
      score += 1;
      reasons.push('paper_used');
      if (paperCount >= 2) reasons.push('paper_comparable');
    } else {
      risks.push('no_paper');
    }

    // ---- 当前代 ----
    if (current) {
      score += 1;
      reasons.push('current_gen');
    } else {
      risks.push('not_current');
      if (model.status === 'legacy') risks.push('legacy');
    }

    // ---- 资源 ----
    const requiredTier = requiredTierForTask(model, task);
    let gpuFits: boolean | null = null;
    if (typeof task.gpuVramGb === 'number') {
      const have = vramToTier(task.gpuVramGb, task.gpuCount ?? 1);
      const need = tierIndex(requiredTier);
      gpuFits = requiredTier === 'api_only' ? true : have >= need;
      if (gpuFits) {
        score += 1;
        reasons.push('fits_gpu');
      } else {
        risks.push('gpu_tight');
      }
    }
    const lowCostTier = model.hardware.inference_tier === '16gb' || model.hardware.inference_tier === '24gb' || model.hardware.inference_tier === 'cpu_mac';
    if (task.priorities.includes('low_cost') && lowCostTier) {
      score += 1;
      reasons.push('low_cost');
    }

    // ---- 上下文 ----
    if (typeof task.contextTarget === 'number') {
      const ctx = num(model.architecture.context_length);
      if (ctx !== null && ctx >= task.contextTarget) {
        reasons.push('context_ok');
      } else {
        risks.push('context_short');
      }
    }

    // ---- 优先目标 ----
    if (task.priorities.includes('chinese') && specializations.includes('chinese')) {
      score += 1;
      reasons.push('chinese');
    }
    if (task.priorities.includes('tool_use') && specializations.includes('tool-use')) {
      score += 1;
      reasons.push('tool_use');
    }
    if (task.priorities.includes('comparability') && hasPaper) {
      score += 1;
      if (!reasons.includes('paper_comparable')) reasons.push('paper_comparable');
    }
    if (task.priorities.includes('current') && current) score += 1;
    if (task.priorities.includes('open_weights') && openW) score += 1;

    // ---- 研究模式影响 bucket ----
    let bucket: Bucket;
    if (task.mode === 'strict' || task.mode === 'method') {
      // 复现优先：有论文采用、老一代可比模型进基准篮
      bucket = hasPaper && !current ? 'baseline' : hasPaper ? 'baseline' : 'modern';
      if (hasPaper) {
        score += 1;
        reasons.push('baseline_repro');
      }
    } else {
      // modern / new：当前代旗舰优先
      bucket = current ? 'modern' : hasPaper ? 'baseline' : 'modern';
      if (current) {
        score += 1;
        reasons.push('modern_repro');
      }
    }
    // 资源约束强时，资源可行但非当前代 / 无论文的进资源篮
    if (typeof task.gpuVramGb === 'number' && gpuFits === true && !current && !hasPaper) {
      bucket = 'resource';
    }

    return { model, score, bucket, reasons: [...new Set(reasons)], risks: [...new Set(risks)], paperCount, eligible };
  });

  // 排序：eligible 优先，再按分数，再按论文数，再按发布日期
  return results.sort((a, b) => {
    if (a.eligible !== b.eligible) return Number(b.eligible) - Number(a.eligible);
    if (b.score !== a.score) return b.score - a.score;
    if (b.paperCount !== a.paperCount) return b.paperCount - a.paperCount;
    return b.model.release_date.localeCompare(a.model.release_date);
  });
}

/** 把三篮拆出来，保持排序。 */
export function bucketize(scored: ScoredModel[]): Record<Bucket, ScoredModel[]> {
  return {
    baseline: scored.filter((s) => s.bucket === 'baseline' && s.eligible),
    modern: scored.filter((s) => s.bucket === 'modern' && s.eligible),
    resource: scored.filter((s) => s.bucket === 'resource' && s.eligible),
  };
}
