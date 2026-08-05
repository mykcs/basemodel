import { hardwareFits } from './hardware';
import type { AtlasModel, ExperimentMode, Goal, ResourceTier, TaskDirection } from './types';

export type ModelFilters = {
  query?: string;
  vendor?: string;
  family?: string;
  generation?: string;
  architecture?: 'dense' | 'moe' | 'other';
  checkpoint?: AtlasModel['checkpoint']['type'];
  modality?: AtlasModel['checkpoint']['modalities'][number];
  openWeights?: boolean;
  finetuning?: boolean;
  rl?: boolean;
  paperUse?: boolean;
  resource?: ResourceTier;
  specialization?: string;
  minParams?: number;
  maxParams?: number;
};

const normalized = (value: string) => value.trim().toLowerCase();
const matchesBoolean = (value: boolean | 'unknown', expected?: boolean) => expected === undefined || value === expected;
const numericParams = (value: number | null | 'unknown') => (typeof value === 'number' ? value : null);

export function filterModels(models: AtlasModel[], filters: ModelFilters, paperModelIds?: Set<string>): AtlasModel[] {
  const query = normalized(filters.query ?? '');
  return models.filter((model) => {
    const searchable = [model.name, model.vendor, model.family, model.generation, ...model.checkpoint.specializations].join(' ').toLowerCase();
    const total = numericParams(model.architecture.total_parameters_b);
    const fitsParams = (filters.minParams === undefined || (total !== null && total >= filters.minParams))
      && (filters.maxParams === undefined || (total !== null && total <= filters.maxParams));
    const fitsSpecialization = filters.specialization === undefined || model.checkpoint.specializations.includes(filters.specialization);
    return (!query || searchable.includes(query))
      && (!filters.vendor || model.vendor === filters.vendor)
      && (!filters.family || model.family === filters.family)
      && (!filters.generation || model.generation === filters.generation)
      && (!filters.architecture || model.architecture.type === filters.architecture)
      && (!filters.checkpoint || model.checkpoint.type === filters.checkpoint)
      && (!filters.modality || model.checkpoint.modalities.includes(filters.modality))
      && matchesBoolean(model.openness.weights_available, filters.openWeights)
      && matchesBoolean(model.openness.finetuning_allowed, filters.finetuning)
      && matchesBoolean(model.research.suitable_for_rl, filters.rl)
      && (filters.paperUse === undefined || (filters.paperUse ? paperModelIds?.has(model.id) : !paperModelIds?.has(model.id)))
      && (!filters.resource || [model.hardware.inference_tier, model.hardware.lora_tier, model.hardware.full_sft_tier, model.hardware.rl_tier].includes(filters.resource))
      && fitsParams
      && fitsSpecialization;
  });
}

export function sortModels(models: AtlasModel[], key: 'release' | 'parameters' | 'name' = 'release'): AtlasModel[] {
  return [...models].sort((a, b) => {
    if (key === 'name') return a.name.localeCompare(b.name);
    if (key === 'parameters') return numeric(b.architecture.total_parameters_b) - numeric(a.architecture.total_parameters_b);
    return b.release_date.localeCompare(a.release_date);
  });
}

function numeric(value: number | null | 'unknown') {
  return typeof value === 'number' ? value : -1;
}

export function matchesExperiment(model: AtlasModel, mode: ExperimentMode, task: TaskDirection, resource: ResourceTier, goal: Goal): { matched: string[]; missing: string[]; evidence: 'direct' | 'weak' | 'unknown' } {
  const matched: string[] = [];
  const missing: string[] = [];
  const check = (condition: boolean | 'unknown', yes: string, no: string) => {
    if (condition === true) matched.push(yes);
    else missing.push(condition === 'unknown' ? `${no}（未知）` : no);
  };

  if (mode === 'harness') {
    check(model.research.suitable_for_inference, '指令遵循', '指令遵循');
    check(model.checkpoint.specializations.includes('tool-use'), '工具调用专长', '工具调用专长');
    check(model.hardware.inference_tier !== 'unknown', '硬件档位已知', '硬件档位已知');
  } else {
    check(hardwareFits(model, mode, resource), `资源档位：${resource}`, `资源档位：${resource}`);
  }
  if (mode === 'inference') check(model.research.suitable_for_inference, '适合推理', '适合推理');
  if (mode === 'lora') check(model.research.suitable_for_lora, '适合 LoRA', '适合 LoRA');
  if (mode === 'sft') check(model.research.suitable_for_sft, '适合 SFT', '适合 SFT');
  if (mode === 'rl') check(model.research.suitable_for_rl, '适合 RL', '适合 RL');
  if (goal === 'open_weights') check(model.openness.weights_available, '开放权重', '开放权重');
  if (goal === 'low_cost') check(model.hardware.inference_tier === '16gb' || model.hardware.inference_tier === '24gb', '较低显存门槛', '较低显存门槛');
  if (goal === 'chinese') check(model.checkpoint.specializations.includes('chinese'), '中文专长', '中文专长');
  if (goal === 'tool_use') check(model.checkpoint.specializations.includes('tool-use'), '工具调用专长', '工具调用专长');
  if (goal === 'rl') check(model.research.suitable_for_rl, 'RL 资料支持', 'RL 资料支持');

  let evidence: 'direct' | 'weak' | 'unknown' = 'unknown';
  if (task !== 'general') {
    if (model.checkpoint.specializations.includes(task)) {
      matched.push(`${task} 方向有直接证据`);
      evidence = 'direct';
    } else if (model.checkpoint.specializations.some((s) => relatedTo(s, task))) {
      matched.push(`${task} 方向有弱证据（相近专长）`);
      evidence = 'weak';
    } else if (model.checkpoint.specializations.includes('general')) {
      missing.push(`${task} 方向仅有 general 标签，不能作为直接证据`);
    } else {
      missing.push(`${task} 方向证据`);
    }
  }

  if (goal === 'comparability') {
    check(model.sources.some((s) => s.type === 'paper' || s.type === 'benchmark'), '有论文/benchmark 记录', '有论文/benchmark 记录');
    check(model.research.verl_recipe_available === true || model.research.suitable_for_rl === true, '可复现训练路径或 RL 支持', '可复现训练路径或 RL 支持');
    check(model.openness.weights_available === true, '权重可获取', '权重可获取');
  }
  if (goal === 'current') check(model.status === 'active', '当前状态 active', '当前状态 active');
  return { matched, missing, evidence };
}

// 把模型的泛化专长映射到它相近支持的方向。注意：这是"专长 → 方向"的反向映射，
// 因为模型 specializations 只含 tool-use / reasoning / multimodal 这类泛化标签，
// 不会等于方向名（webshop / coding / gui）。原实现把 map 建成"方向 → 专长"再用
// map[task].includes(专长) 查询，导致 coding / research / gui 三项永远查不到、永不命中。
function relatedTo(specialty: string, task: TaskDirection): boolean {
  const specialtyToTasks: Record<string, TaskDirection[]> = {
    'tool-use': ['webshop', 'alfworld', 'research', 'gui'],
    agent: ['webshop', 'alfworld', 'coding', 'research', 'gui'],
    reasoning: ['webshop', 'alfworld', 'coding', 'research', 'math'],
    coding: ['coding', 'research'],
    mathematics: ['math'],
    multimodal: ['gui'],
    vision: ['gui'],
    chinese: ['chinese'],
    multilingual: ['multilingual'],
  };
  return specialtyToTasks[specialty]?.includes(task) ?? false;
}
