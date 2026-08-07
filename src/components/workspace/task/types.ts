import type { AtlasModel, AtlasPaper } from '../../../lib/schemas';
import type { Locale } from '../../../i18n';
import type { Messages } from '../../../i18n/zh';
import type { ResearchTask } from '../../../stores/researchTask';

export const ROLE_OPTIONS = [
  'actor', 'policy', 'critic', 'reflector', 'teacher', 'optimizer', 'analyzer',
  'reward-model', 'judge', 'evaluator', 'baseline',
] as const;

export const PRIORITY_OPTIONS = [
  'comparability', 'open_weights', 'current', 'low_cost', 'chinese', 'tool_use', 'rl',
] as const;

export const RUNTIME_OPTIONS = ['transformers', 'vllm', 'sglang', 'verl'] as const;

export type TaskUpdater = (patch: Partial<ResearchTask>) => void;

export interface TaskStepProps {
  draft: ResearchTask;
  update: TaskUpdater;
  models: AtlasModel[];
  papers: AtlasPaper[];
  m: Messages;
  locale: Locale;
}
