import { hardwareFits } from './hardware';
import type { AtlasModel, ExperimentMode, Goal, ResourceTier, TaskDirection } from './types';

export type ModelFilters = {
  query?: string;
  vendor?: string;
  family?: string;
  architecture?: 'dense' | 'moe' | 'other';
  checkpoint?: AtlasModel['checkpoint']['type'];
  modality?: AtlasModel['checkpoint']['modalities'][number];
  openWeights?: boolean;
  finetuning?: boolean;
  rl?: boolean;
  paperUse?: boolean;
  resource?: ResourceTier;
};

const normalized = (value: string) => value.trim().toLowerCase();
const matchesBoolean = (value: boolean | 'unknown', expected?: boolean) => expected === undefined || value === expected;

export function filterModels(models: AtlasModel[], filters: ModelFilters): AtlasModel[] {
  const query = normalized(filters.query ?? '');
  return models.filter((model) => {
    const searchable = [model.name, model.vendor, model.family, model.generation, ...model.checkpoint.specializations].join(' ').toLowerCase();
    return (!query || searchable.includes(query))
      && (!filters.vendor || model.vendor === filters.vendor)
      && (!filters.family || model.family === filters.family)
      && (!filters.architecture || model.architecture.type === filters.architecture)
      && (!filters.checkpoint || model.checkpoint.type === filters.checkpoint)
      && (!filters.modality || model.checkpoint.modalities.includes(filters.modality))
      && matchesBoolean(model.openness.weights_available, filters.openWeights)
      && matchesBoolean(model.openness.finetuning_allowed, filters.finetuning)
      && matchesBoolean(model.research.suitable_for_rl, filters.rl)
      && (filters.paperUse === undefined || (filters.paperUse ? model.sources.some((source) => source.type === 'paper') : !model.sources.some((source) => source.type === 'paper')))
      && (!filters.resource || [model.hardware.inference_tier, model.hardware.lora_tier, model.hardware.full_sft_tier, model.hardware.rl_tier].includes(filters.resource));
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

export function matchesExperiment(model: AtlasModel, mode: ExperimentMode, task: TaskDirection, resource: ResourceTier, goal: Goal): { matched: string[]; missing: string[] } {
  const matched: string[] = [];
  const missing: string[] = [];
  const check = (condition: boolean | 'unknown', yes: string, no: string) => {
    if (condition === true) matched.push(yes);
    else missing.push(condition === 'unknown' ? `${no}（未知）` : no);
  };

  if (mode === 'harness') matched.push('Harness 资源可单独配置');
  else check(hardwareFits(model, mode, resource), `资源档位：${resource}`, `资源档位：${resource}`);
  if (mode === 'inference') check(model.research.suitable_for_inference, '适合推理', '适合推理');
  if (mode === 'lora') check(model.research.suitable_for_lora, '适合 LoRA', '适合 LoRA');
  if (mode === 'sft') check(model.research.suitable_for_sft, '适合 SFT', '适合 SFT');
  if (mode === 'rl') check(model.research.suitable_for_rl, '适合 RL', '适合 RL');
  if (mode === 'harness') matched.push('外部 Harness 可独立演化');
  if (goal === 'open_weights') check(model.openness.weights_available, '开放权重', '开放权重');
  if (goal === 'low_cost') check(model.hardware.inference_tier === '16gb' || model.hardware.inference_tier === '24gb', '较低显存门槛', '较低显存门槛');
  if (goal === 'chinese') check(model.checkpoint.specializations.includes('chinese'), '中文专长', '中文专长');
  if (goal === 'tool_use') check(model.checkpoint.specializations.includes('tool-use'), '工具调用专长', '工具调用专长');
  if (goal === 'rl') check(model.research.suitable_for_rl, 'RL 资料支持', 'RL 资料支持');
  if (task !== 'general') check(model.checkpoint.specializations.includes(task) || model.checkpoint.specializations.includes('general'), `${task} 方向可作为起点`, `${task} 方向证据`);
  if (goal === 'current') check(model.status === 'active', '当前状态 active', '当前状态 active');
  return { matched, missing };
}
