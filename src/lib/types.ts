export type { AtlasModel, AtlasPaper, DataStatus, HardwareTier, PaperModelUse, SemanticStatus, UnknownBoolean } from './schemas';

export type ExperimentMode = 'inference' | 'lora' | 'sft' | 'full_sft' | 'rl' | 'harness';
export type TaskDirection = 'general' | 'webshop' | 'alfworld' | 'coding' | 'research' | 'math' | 'gui' | 'chinese' | 'multilingual';
export type ResourceTier = 'cpu_mac' | '16gb' | '24gb' | '48gb' | '80gb' | 'multi_gpu' | 'api_only';
export type Goal = 'comparability' | 'current' | 'low_cost' | 'open_weights' | 'chinese' | 'tool_use' | 'rl';

export type AtlasModelView = import('./schemas').AtlasModel & { paperCount: number };
