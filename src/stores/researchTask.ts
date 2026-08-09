import { persistentAtom } from '@nanostores/persistent';
import type { AtlasModel } from '../lib/schemas';
import { decodeResearchTask, replaceResearchTaskSearchParams } from '../lib/researchTaskCodec';

export type ResearchMode = 'strict' | 'method' | 'modern' | 'new';
export type UpdateMethod = 'none' | 'lora' | 'sft' | 'rl' | 'unsure';
export type AccessMode = 'local' | 'api' | 'either';
export type EvidencePolicy = 'verified_preferred' | 'verified_only' | 'allow_unknown';
export type RuntimeRequirement = 'transformers' | 'vllm' | 'sglang' | 'verl';
export type ResourcePrecision = 'fp32' | 'bf16' | 'fp16' | 'int8' | 'int4';
export type ResourceOptimizer = 'adam' | 'sgd' | 'none';

export interface ResearchReference {
  paperId?: string;
  modelId?: string;
  role?: string;
}

export interface LicenseConstraints {
  requireDerivativeDistribution?: boolean;
  requireCommercialUse?: boolean;
  allowCustomLicense?: boolean;
}

export interface ReproducibilityConstraints {
  requirePinnableRevision?: boolean;
  requirePublicTokenizer?: boolean;
  requirePublicConfig?: boolean;
  requirePublicChatTemplate?: boolean;
}

export interface ResearchTask {
  schemaVersion: 2;
  mode: ResearchMode;
  reference?: ResearchReference;
  roles: string[];
  update: UpdateMethod;
  accessMode: AccessMode;
  gpuVramGb?: number;
  gpuCount?: number;
  quantizationAllowed?: boolean;
  precision?: ResourcePrecision;
  batchSize?: number;
  loraRank?: number;
  optimizer?: ResourceOptimizer;
  kvCacheEnabled?: boolean;
  contextTarget?: number;
  openWeight?: boolean;
  requireBaseCheckpoint?: boolean;
  requiredRuntimes: RuntimeRequirement[];
  license: LicenseConstraints;
  reproducibility: ReproducibilityConstraints;
  evidencePolicy: EvidencePolicy;
  priorities: string[];
}

export const emptyTask: ResearchTask = {
  schemaVersion: 2,
  mode: 'new',
  roles: [],
  update: 'none',
  accessMode: 'either',
  requiredRuntimes: [],
  license: {},
  reproducibility: {},
  evidencePolicy: 'verified_preferred',
  priorities: [],
};

function mergeTask(value: Partial<ResearchTask>): ResearchTask {
  return {
    ...emptyTask,
    ...value,
    schemaVersion: 2,
    roles: Array.isArray(value.roles) ? value.roles : [],
    requiredRuntimes: Array.isArray(value.requiredRuntimes) ? value.requiredRuntimes : [],
    priorities: Array.isArray(value.priorities) ? value.priorities : [],
    license: { ...emptyTask.license, ...(value.license ?? {}) },
    reproducibility: { ...emptyTask.reproducibility, ...(value.reproducibility ?? {}) },
  };
}

export const researchTask = persistentAtom<ResearchTask>('atlas-research-task', emptyTask, {
  encode(value) {
    return JSON.stringify(value);
  },
  decode(str) {
    try {
      return mergeTask(JSON.parse(str) as Partial<ResearchTask>);
    } catch {
      return emptyTask;
    }
  },
});

export function hasMeaningfulResearchTask(task: ResearchTask): boolean {
  return Boolean(
    task.mode !== 'new' ||
      task.reference?.paperId ||
      task.reference?.modelId ||
      task.reference?.role ||
      task.roles.length > 0 ||
      task.update !== 'none' ||
      task.accessMode !== 'either' ||
      typeof task.gpuVramGb === 'number' ||
      typeof task.gpuCount === 'number' ||
      typeof task.quantizationAllowed === 'boolean' ||
      task.precision !== undefined ||
      typeof task.batchSize === 'number' ||
      typeof task.loraRank === 'number' ||
      task.optimizer !== undefined ||
      typeof task.kvCacheEnabled === 'boolean' ||
      typeof task.contextTarget === 'number' ||
      typeof task.openWeight === 'boolean' ||
      typeof task.requireBaseCheckpoint === 'boolean' ||
      task.requiredRuntimes.length > 0 ||
      Object.values(task.license).some(Boolean) ||
      Object.values(task.reproducibility).some(Boolean) ||
      task.evidencePolicy !== 'verified_preferred' ||
      task.priorities.length > 0,
  );
}

export function setResearchTask(task: ResearchTask) {
  const normalized = mergeTask(task);
  researchTask.set(normalized);
  if (typeof window !== 'undefined') syncResearchTaskToUrl(normalized);
}

export function clearResearchTask() {
  researchTask.set(emptyTask);
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.search = replaceResearchTaskSearchParams(url.searchParams, null).toString();
    window.history.replaceState(null, '', url.toString());
  }
}

function syncResearchTaskToUrl(task: ResearchTask) {
  const url = new URL(window.location.href);
  const currentTask = hasMeaningfulResearchTask(task) ? task : null;
  url.search = replaceResearchTaskSearchParams(url.searchParams, currentTask).toString();
  window.history.replaceState(null, '', url.toString());
}

export function initResearchTaskFromUrl() {
  if (typeof window === 'undefined') return;
  const urlTask = decodeResearchTask(new URLSearchParams(window.location.search));
  if (urlTask) researchTask.set(urlTask);
}

/** Compatibility helper retained for existing workspace integrations. */
export function filterCandidatesByTask(models: AtlasModel[], task: ResearchTask): AtlasModel[] {
  return models.filter((model) => {
    if (task.openWeight === true && model.openness.weights_available === false) return false;
    if (task.update === 'rl' && model.research.suitable_for_rl === false) return false;
    if (task.update === 'lora' && model.research.suitable_for_lora === false) return false;
    if (task.update === 'sft' && model.research.suitable_for_sft === false) return false;
    if (typeof task.contextTarget === 'number' && typeof model.architecture.context_length === 'number' && model.architecture.context_length < task.contextTarget) return false;
    return true;
  });
}

/** Compatibility helper retained for existing workspace integrations. */
export function taskBlockers(model: AtlasModel, task: ResearchTask): string[] {
  const list: string[] = [];
  if (task.openWeight === true && model.openness.weights_available === false) list.push('不开放权重');
  if (task.update === 'rl' && model.research.suitable_for_rl === false) list.push('不支持 RL');
  if (task.update === 'lora' && model.research.suitable_for_lora === false) list.push('不支持 LoRA');
  if (task.update === 'sft' && model.research.suitable_for_sft === false) list.push('不支持 SFT');
  if (typeof task.contextTarget === 'number' && typeof model.architecture.context_length === 'number' && model.architecture.context_length < task.contextTarget) list.push('上下文长度不足');
  return list;
}
