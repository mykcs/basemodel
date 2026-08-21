import type {
  AccessMode,
  EvidencePolicy,
  ResearchMode,
  ResearchTask,
  ResourceOptimizer,
  ResourcePrecision,
  RuntimeRequirement,
  UpdateMethod,
} from '../stores/researchTask';

const modes: readonly ResearchMode[] = ['strict', 'method', 'modern', 'new'];
const updates: readonly UpdateMethod[] = ['none', 'lora', 'sft', 'rl', 'unsure'];
const accessModes: readonly AccessMode[] = ['local', 'api', 'either'];
const evidencePolicies: readonly EvidencePolicy[] = ['verified_preferred', 'verified_only', 'allow_unknown'];
const runtimes: readonly RuntimeRequirement[] = ['transformers', 'vllm', 'sglang', 'verl'];
const precisions: readonly ResourcePrecision[] = ['fp32', 'bf16', 'fp16', 'int8', 'int4'];
const optimizers: readonly ResourceOptimizer[] = ['adam', 'sgd', 'none'];

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? value as T : fallback;
}

function optionalOneOf<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? value as T : undefined;
}

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean))]
    : [];
}

function number(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function boolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

export function normalizeResearchTask(value: unknown): ResearchTask {
  const input = record(value);
  const referenceInput = record(input.reference);
  const licenseInput = record(input.license);
  const reproducibilityInput = record(input.reproducibility);
  const reference = {
    paperId: optionalString(referenceInput.paperId),
    modelId: optionalString(referenceInput.modelId),
    role: optionalString(referenceInput.role),
  };
  const hasReference = Boolean(reference.paperId || reference.modelId || reference.role);

  return {
    schemaVersion: 2,
    mode: oneOf(input.mode, modes, 'new'),
    ...(hasReference ? { reference } : {}),
    roles: strings(input.roles),
    update: oneOf(input.update, updates, 'none'),
    accessMode: oneOf(input.accessMode, accessModes, 'either'),
    gpuVramGb: number(input.gpuVramGb),
    gpuCount: number(input.gpuCount),
    quantizationAllowed: boolean(input.quantizationAllowed),
    precision: optionalOneOf(input.precision, precisions),
    batchSize: number(input.batchSize),
    loraRank: number(input.loraRank),
    optimizer: optionalOneOf(input.optimizer, optimizers),
    kvCacheEnabled: boolean(input.kvCacheEnabled),
    contextTarget: number(input.contextTarget),
    openWeight: boolean(input.openWeight),
    requireBaseCheckpoint: boolean(input.requireBaseCheckpoint),
    requiredRuntimes: strings(input.requiredRuntimes).filter((item): item is RuntimeRequirement => runtimes.includes(item as RuntimeRequirement)),
    license: {
      ...(typeof licenseInput.requireDerivativeDistribution === 'boolean' ? { requireDerivativeDistribution: licenseInput.requireDerivativeDistribution } : {}),
      ...(typeof licenseInput.requireCommercialUse === 'boolean' ? { requireCommercialUse: licenseInput.requireCommercialUse } : {}),
      ...(typeof licenseInput.allowCustomLicense === 'boolean' ? { allowCustomLicense: licenseInput.allowCustomLicense } : {}),
    },
    reproducibility: {
      ...(typeof reproducibilityInput.requirePinnableRevision === 'boolean' ? { requirePinnableRevision: reproducibilityInput.requirePinnableRevision } : {}),
      ...(typeof reproducibilityInput.requirePublicTokenizer === 'boolean' ? { requirePublicTokenizer: reproducibilityInput.requirePublicTokenizer } : {}),
      ...(typeof reproducibilityInput.requirePublicConfig === 'boolean' ? { requirePublicConfig: reproducibilityInput.requirePublicConfig } : {}),
      ...(typeof reproducibilityInput.requirePublicChatTemplate === 'boolean' ? { requirePublicChatTemplate: reproducibilityInput.requirePublicChatTemplate } : {}),
    },
    evidencePolicy: oneOf(input.evidencePolicy, evidencePolicies, 'verified_preferred'),
    priorities: strings(input.priorities),
  };
}
