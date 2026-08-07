import type { ResearchTask, ResearchMode, UpdateMethod, AccessMode, EvidencePolicy, RuntimeRequirement } from '../stores/researchTask';

const modes: ResearchMode[] = ['strict', 'method', 'modern', 'new'];
const updates: UpdateMethod[] = ['none', 'lora', 'sft', 'rl', 'unsure'];
const accessModes: AccessMode[] = ['local', 'api', 'either'];
const evidencePolicies: EvidencePolicy[] = ['verified_preferred', 'verified_only', 'allow_unknown'];
const runtimes: RuntimeRequirement[] = ['transformers', 'vllm', 'sglang', 'verl'];

function oneOf<T extends string>(value: string | null, values: readonly T[]): T | undefined {
  return value && (values as readonly string[]).includes(value) ? value as T : undefined;
}

function list(value: string | null): string[] {
  return value ? [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))] : [];
}

function flag(params: URLSearchParams, key: string): boolean | undefined {
  const value = params.get(key);
  return value === null ? undefined : value === '1' || value === 'true';
}

export function encodeResearchTask(task: ResearchTask): URLSearchParams {
  const params = new URLSearchParams();
  params.set('v', '2');
  if (task.mode !== 'new') params.set('mode', task.mode);
  if (task.reference?.paperId) params.set('paper', task.reference.paperId);
  if (task.reference?.modelId) params.set('model', task.reference.modelId);
  if (task.reference?.role) params.set('role', task.reference.role);
  if (task.roles.length) params.set('roles', task.roles.join(','));
  if (task.update !== 'none') params.set('update', task.update);
  if (task.accessMode !== 'either') params.set('access', task.accessMode);
  if (typeof task.gpuVramGb === 'number') params.set('gpu', String(task.gpuVramGb));
  if (typeof task.gpuCount === 'number') params.set('gpus', String(task.gpuCount));
  if (task.quantizationAllowed !== undefined) params.set('quant', task.quantizationAllowed ? '1' : '0');
  if (typeof task.contextTarget === 'number') params.set('ctx', String(task.contextTarget));
  if (task.openWeight !== undefined) params.set('open', task.openWeight ? '1' : '0');
  if (task.requireBaseCheckpoint !== undefined) params.set('base', task.requireBaseCheckpoint ? '1' : '0');
  if (task.requiredRuntimes.length) params.set('runtime', task.requiredRuntimes.join(','));
  const licenseKeys: Record<string, string> = {
    requireDerivativeDistribution: 'derivativeDistribution',
    requireCommercialUse: 'commercialUse',
    allowCustomLicense: 'customLicense',
  };
  const license = Object.entries(task.license).filter(([, value]) => value).map(([key]) => licenseKeys[key] ?? key).join(',');
  if (license) params.set('license', license);
  const reproKeys: Record<string, string> = {
    requirePinnableRevision: 'pinnableRevision',
    requirePublicTokenizer: 'publicTokenizer',
    requirePublicConfig: 'publicConfig',
    requirePublicChatTemplate: 'publicChatTemplate',
  };
  const repro = Object.entries(task.reproducibility).filter(([, value]) => value).map(([key]) => reproKeys[key] ?? key).join(',');
  if (repro) params.set('repro', repro);
  if (task.evidencePolicy !== 'verified_preferred') params.set('evidence', task.evidencePolicy);
  if (task.priorities.length) params.set('priority', task.priorities.join(','));
  return params;
}

export function decodeResearchTask(params: URLSearchParams): ResearchTask | null {
  if (params.get('v') !== '2') {
    const legacy = params.get('task');
    if (!legacy) return null;
    try {
      const parsed = JSON.parse(legacy) as Partial<ResearchTask>;
      return {
        schemaVersion: 2,
        mode: oneOf(parsed.mode ?? null, modes) ?? 'new',
        reference: parsed.reference,
        roles: parsed.roles ?? [],
        update: oneOf(parsed.update ?? null, updates) ?? 'none',
        accessMode: 'either',
        gpuVramGb: parsed.gpuVramGb,
        gpuCount: parsed.gpuCount,
        contextTarget: parsed.contextTarget,
        openWeight: parsed.openWeight,
        requiredRuntimes: [],
        license: {},
        reproducibility: {},
        evidencePolicy: 'verified_preferred',
        priorities: parsed.priorities ?? [],
      };
    } catch {
      return null;
    }
  }

  const number = (key: string) => {
    const value = params.get(key);
    if (value === null || value === '') return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
  };
  const licenseValues = new Set(list(params.get('license')));
  const reproValues = new Set(list(params.get('repro')));
  return {
    schemaVersion: 2,
    mode: oneOf(params.get('mode'), modes) ?? 'new',
    reference: params.get('paper') || params.get('model') || params.get('role') ? { paperId: params.get('paper') ?? undefined, modelId: params.get('model') ?? undefined, role: params.get('role') ?? undefined } : undefined,
    roles: list(params.get('roles')),
    update: oneOf(params.get('update'), updates) ?? 'none',
    accessMode: oneOf(params.get('access'), accessModes) ?? 'either',
    gpuVramGb: number('gpu'),
    gpuCount: number('gpus'),
    quantizationAllowed: flag(params, 'quant'),
    contextTarget: number('ctx'),
    openWeight: flag(params, 'open'),
    requireBaseCheckpoint: flag(params, 'base'),
    requiredRuntimes: list(params.get('runtime')).filter((value): value is RuntimeRequirement => runtimes.includes(value as RuntimeRequirement)),
    license: {
      ...(licenseValues.has('derivativeDistribution') ? { requireDerivativeDistribution: true } : {}),
      ...(licenseValues.has('commercialUse') ? { requireCommercialUse: true } : {}),
      ...(licenseValues.has('customLicense') ? { allowCustomLicense: true } : {}),
    },
    reproducibility: {
      ...(reproValues.has('pinnableRevision') ? { requirePinnableRevision: true } : {}),
      ...(reproValues.has('publicTokenizer') ? { requirePublicTokenizer: true } : {}),
      ...(reproValues.has('publicConfig') ? { requirePublicConfig: true } : {}),
      ...(reproValues.has('publicChatTemplate') ? { requirePublicChatTemplate: true } : {}),
    },
    evidencePolicy: oneOf(params.get('evidence'), evidencePolicies) ?? 'verified_preferred',
    priorities: list(params.get('priority')),
  };
}
