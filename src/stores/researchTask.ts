import { persistentAtom } from '@nanostores/persistent';
import type { AtlasModel } from '../lib/schemas';

export interface ResearchTask {
  mode: 'strict' | 'method' | 'modern' | 'new';
  /** 论文/实验里模型承担的角色 */
  roles: string[];
  /** 预期要做的权重更新方式 */
  update: 'none' | 'lora' | 'sft' | 'rl' | 'unsure';
  /** 单卡显存 GB */
  gpuVramGb?: number;
  /** 卡数 */
  gpuCount?: number;
  /** 是否只考虑开放权重 */
  openWeight?: boolean;
  /** 目标上下文长度 */
  contextTarget?: number;
  /** 优先目标 */
  priorities: string[];
}

export const emptyTask: ResearchTask = {
  mode: 'strict',
  roles: [],
  update: 'none',
  priorities: [],
};

export const researchTask = persistentAtom<ResearchTask>(
  'atlas-research-task',
  emptyTask,
  {
    encode(value) {
      return JSON.stringify(value);
    },
    decode(str) {
      try {
        const parsed = JSON.parse(str) as Partial<ResearchTask>;
        return { ...emptyTask, ...parsed };
      } catch {
        return emptyTask;
      }
    },
  }
);

export function setResearchTask(task: ResearchTask) {
  researchTask.set(task);
  if (typeof window !== 'undefined') {
    syncResearchTaskToUrl(task);
  }
}

export function clearResearchTask() {
  researchTask.set(emptyTask);
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.searchParams.delete('task');
    window.history.replaceState(null, '', url.toString());
  }
}

function syncResearchTaskToUrl(task: ResearchTask) {
  const url = new URL(window.location.href);
  const hasData =
    task.mode !== 'strict' ||
    task.roles.length > 0 ||
    task.update !== 'none' ||
    typeof task.gpuVramGb === 'number' ||
    typeof task.gpuCount === 'number' ||
    typeof task.openWeight === 'boolean' ||
    typeof task.contextTarget === 'number' ||
    task.priorities.length > 0;
  if (hasData) {
    url.searchParams.set('task', JSON.stringify(task));
  } else {
    url.searchParams.delete('task');
  }
  window.history.replaceState(null, '', url.toString());
}

export function initResearchTaskFromUrl() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const encoded = url.searchParams.get('task');
  if (encoded) {
    try {
      const parsed = JSON.parse(encoded) as Partial<ResearchTask>;
      researchTask.set({ ...emptyTask, ...parsed });
    } catch {
      // ignore malformed url state
    }
  }
}

/** 根据当前研究任务对模型列表做简单规则筛选。 */
export function filterCandidatesByTask(
  models: AtlasModel[],
  task: ResearchTask
): AtlasModel[] {
  return models.filter((m) => {
    if (task.openWeight === true && m.openness.weights_available !== true) return false;
    if (task.update === 'rl' && m.research.suitable_for_rl !== true) return false;
    if (task.update === 'lora' && m.research.suitable_for_lora !== true) return false;
    if (task.update === 'sft' && m.research.suitable_for_sft !== true) return false;
    if (typeof task.contextTarget === 'number') {
      const ctx = m.architecture.context_length;
      if (typeof ctx === 'number' && ctx < task.contextTarget) return false;
    }
    return true;
  });
}

/** 判断某模型在任务下的主要障碍（用于候选面板提示）。 */
export function taskBlockers(model: AtlasModel, task: ResearchTask): string[] {
  const list: string[] = [];
  if (task.openWeight === true && model.openness.weights_available !== true) {
    list.push('不开放权重');
  }
  if (task.update === 'rl' && model.research.suitable_for_rl !== true) {
    list.push('未确认适合 RL');
  }
  if (task.update === 'lora' && model.research.suitable_for_lora !== true) {
    list.push('未确认支持 LoRA');
  }
  if (task.update === 'sft' && model.research.suitable_for_sft !== true) {
    list.push('未确认支持 SFT');
  }
  if (typeof task.contextTarget === 'number') {
    const ctx = model.architecture.context_length;
    if (typeof ctx === 'number' && ctx < task.contextTarget) {
      list.push('上下文长度不足');
    }
  }
  return list;
}
