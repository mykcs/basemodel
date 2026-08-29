import { persistentAtom } from '@nanostores/persistent';
import { decodeResearchTask, replaceResearchTaskSearchParams } from '../lib/researchTaskCodec';
import { normalizeResearchTask } from '../lib/researchTaskNormalization';

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

const RESEARCH_TASK_STORAGE_KEY = 'atlas-research-task';

export const researchTask = persistentAtom<ResearchTask>(RESEARCH_TASK_STORAGE_KEY, emptyTask, {
  encode(value) {
    return JSON.stringify(normalizeResearchTask(value));
  },
  decode(str) {
    try {
      return normalizeResearchTask(JSON.parse(str) as unknown);
    } catch {
      return emptyTask;
    }
  },
});


if (typeof window !== 'undefined') {
  window.addEventListener('atlas:research-context-change', () => {
    try {
      researchTask.set(normalizeResearchTask(JSON.parse(localStorage.getItem(RESEARCH_TASK_STORAGE_KEY) || '{}') as unknown));
    } catch {
      researchTask.set(emptyTask);
    }
  });
}

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
  const normalized = normalizeResearchTask(task);
  researchTask.set(normalized);
  if (typeof window !== 'undefined') syncResearchTaskToUrl(normalized);
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('atlas:research-context-change'));
}

export function clearResearchTask() {
  researchTask.set(emptyTask);
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.search = replaceResearchTaskSearchParams(url.searchParams, null).toString();
    window.history.replaceState(null, '', url.toString());
    window.dispatchEvent(new Event('atlas:research-context-change'));
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
  if (urlTask) {
    researchTask.set(normalizeResearchTask(urlTask));
    window.dispatchEvent(new Event('atlas:research-context-change'));
  }
}
