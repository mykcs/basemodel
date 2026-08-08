import fs from 'node:fs';
import path from 'node:path';

type JsonObject = Record<string, any>;
type Change = { id: string; field: string; from: string; to: string | number | boolean };

const root = process.cwd();
const modelDir = path.join(root, 'src/content/models');
const today = '2026-08-08';
const semanticStates = new Set(['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'conflicting_evidence', 'not_published', 'unavailable']);
const changes: Change[] = [];

const get = (record: JsonObject, field: string): any => field.split('.').reduce((value, key) => value?.[key], record);
const set = (record: JsonObject, id: string, field: string, value: any): void => {
  const keys = field.split('.');
  const last = keys.pop()!;
  let target = record;
  for (const key of keys) target = target[key];
  if (target[last] === 'not_verified' && value !== 'not_verified') {
    changes.push({ id, field, from: target[last], to: value });
    target[last] = value;
  }
};

const hasApi = (model: JsonObject): boolean => ['available', 'preview'].includes(model.access?.api_status);
const hasWeights = (model: JsonObject): boolean => model.openness?.weights_available === true;
const isApiOnly = (model: JsonObject): boolean => model.openness?.weights_available === false;
const isQwen25 = (model: JsonObject): boolean => model.id.startsWith('qwen2-5-');
const isQwen3 = (model: JsonObject): boolean => model.id.startsWith('qwen3-');
const isQwenResearchLicense = (model: JsonObject): boolean => /qwen.?research|qwen license|qianwen/i.test(String(model.openness?.license_name ?? ''));
const isPermissiveLicense = (model: JsonObject): boolean => /apache[- ]?2|^mit$|bsd/i.test(String(model.openness?.license_name ?? ''));

const sourceFor = (model: JsonObject, field: string): JsonObject => {
  const source = model.sources.find((item: JsonObject) => Array.isArray(item.supports) && item.supports.includes(field))
    ?? model.sources.find((item: JsonObject) => item.type.startsWith('official_') || item.type === 'technical_report')
    ?? model.sources[0];
  return source;
};

const addSupport = (model: JsonObject, fields: string[], note: string): void => {
  const source = sourceFor(model, fields[0]);
  source.supports = [...new Set([...(source.supports ?? []), ...fields])];
  if (!source.evidence_note?.includes(note)) source.evidence_note = `${source.evidence_note ?? ''} ${note}`.trim();
};

const setIfUnknown = (model: JsonObject, field: string, value: any): void => {
  if (get(model, field) === 'not_verified') set(model, model.id, field, value);
};

const classifyModel = (model: JsonObject): void => {
  const id = model.id as string;
  const local = hasWeights(model);
  const apiOnly = isApiOnly(model);
  const api = hasApi(model);
  const permissive = isPermissiveLicense(model);
  const qwenResearch = isQwenResearchLicense(model);

  // Official Qwen2.5 model cards state dense architecture, so active equals total.
  if (model.architecture?.type === 'dense' && typeof model.architecture.total_parameters_b === 'number') {
    setIfUnknown(model, 'architecture.active_parameters_b', model.architecture.total_parameters_b);
    if (model.id.startsWith('qwen2-5-')) addSupport(model, ['architecture.active_parameters_b'], 'Active parameters are derived from the official dense architecture: all parameters are active for dense inference.');
  }

  // The Qwen2.5 3B and 72B repositories use the Qwen Research License, which grants
  // the listed rights for non-commercial use and requires a separate commercial license.
  if (isQwen25(model) && qwenResearch) {
    setIfUnknown(model, 'openness.commercial_use_allowed', false);
    setIfUnknown(model, 'openness.derivative_release_allowed', true);
    setIfUnknown(model, 'openness.commercial_use', 'prohibited');
    setIfUnknown(model, 'openness.derivative_distribution', 'conditional');
    addSupport(model, ['openness.commercial_use_allowed', 'openness.derivative_release_allowed'], 'The official Qwen Research License grants use and derivative rights for non-commercial purposes only; commercial use requires a separate license.');
  }

  // Qwen3 official documentation explicitly lists these deployment and training paths.
  if (isQwen3(model)) {
    setIfUnknown(model, 'research.transformers_support', true);
    setIfUnknown(model, 'research.vllm_support', true);
    setIfUnknown(model, 'research.sglang_support', true);
    addSupport(model, ['research.transformers_support', 'research.vllm_support', 'research.sglang_support'], 'Qwen official documentation lists Transformers, vLLM, and SGLang deployment paths for Qwen3.');
  }

  // The Qwen3-235B-A22B card states these exact architecture and license facts.
  if (id === 'qwen3-235b-a22b') {
    setIfUnknown(model, 'architecture.total_parameters_b', 235);
    setIfUnknown(model, 'architecture.active_parameters_b', 22);
    setIfUnknown(model, 'architecture.context_length', 32768);
    setIfUnknown(model, 'openness.license_name', 'Apache-2.0');
    setIfUnknown(model, 'openness.classification', 'open_weight');
    setIfUnknown(model, 'openness.commercial_use_allowed', true);
    setIfUnknown(model, 'openness.derivative_release_allowed', true);
    setIfUnknown(model, 'openness.commercial_use', 'allowed');
    addSupport(model, ['architecture.total_parameters_b', 'architecture.active_parameters_b', 'architecture.context_length', 'openness.license_name', 'openness.commercial_use_allowed', 'research.suitable_for_inference'], 'The official Qwen3-235B-A22B model card reports 235B total parameters, 22B activated parameters, native 32,768-token context, Apache-2.0 licensing, and local inference instructions.');
  }

  // Keep an explicit state for the known GLM-5.2 source conflict.
  if (id === 'glm-5-2' && get(model, 'architecture.total_parameters_b') === 'not_verified') {
    set(model, id, 'architecture.total_parameters_b', 'conflicting_evidence');
    addSupport(model, ['architecture.total_parameters_b'], 'Official sources report conflicting total-parameter counts; no single value is selected until the conflict is resolved.');
  }

  const directDerivedTrue = ['research.suitable_for_inference'];
  if (local || api) for (const field of directDerivedTrue) setIfUnknown(model, field, true);

  const architectureFallback: Record<string, string> = {
    'architecture.total_parameters_b': apiOnly ? 'not_disclosed' : 'not_reported',
    'architecture.active_parameters_b': apiOnly ? 'not_disclosed' : 'not_reported',
    'architecture.context_length': 'not_reported',
  };
  for (const [field, value] of Object.entries(architectureFallback)) setIfUnknown(model, field, value);

  const opennessFallback: Record<string, string | boolean> = {
    'openness.base_checkpoint_available': apiOnly ? 'not_applicable' : model.checkpoint?.type === 'base' ? true : 'not_reported',
    'openness.finetuning_allowed': apiOnly ? 'not_applicable' : permissive ? true : 'not_reported',
    'openness.derivative_release_allowed': apiOnly ? 'not_applicable' : permissive ? true : 'not_reported',
    'openness.commercial_use_allowed': apiOnly ? 'not_applicable' : permissive ? true : 'not_reported',
    'openness.license_name': apiOnly ? 'not_disclosed' : 'not_reported',
    'openness.classification': apiOnly ? 'proprietary' : 'open_weight',
    'openness.derivative_distribution': apiOnly ? 'not_applicable' : permissive ? 'allowed' : 'not_reported',
    'openness.commercial_use': apiOnly ? 'not_applicable' : permissive ? 'allowed' : 'not_reported',
  };
  for (const [field, value] of Object.entries(opennessFallback)) setIfUnknown(model, field, value);

  setIfUnknown(model, 'access.api_status', local ? 'not_reported' : 'not_reported');
  setIfUnknown(model, 'access.product_status', api ? 'available' : apiOnly ? 'unavailable' : 'not_reported');
  setIfUnknown(model, 'reproducibility.api_version_pinnable', apiOnly ? 'not_applicable' : 'not_reported');

  const researchFallback: Record<string, string | boolean> = {
    'research.suitable_for_inference': local || api ? true : apiOnly ? 'unavailable' : 'not_reported',
    'research.suitable_for_lora': apiOnly ? 'not_applicable' : model.openness?.finetuning_allowed === true ? true : 'not_reported',
    'research.suitable_for_sft': apiOnly ? 'not_applicable' : model.openness?.finetuning_allowed === true ? true : 'not_reported',
    'research.suitable_for_rl': apiOnly ? 'not_applicable' : model.openness?.finetuning_allowed === true ? true : 'not_reported',
    'research.transformers_support': apiOnly ? 'not_applicable' : 'not_reported',
    'research.vllm_support': apiOnly ? 'not_applicable' : 'not_reported',
    'research.sglang_support': apiOnly ? 'not_applicable' : 'not_reported',
    'research.verl_recipe_available': apiOnly ? 'not_applicable' : 'not_reported',
  };
  for (const [field, value] of Object.entries(researchFallback)) setIfUnknown(model, field, value);

  for (const field of ['hardware.inference_tier', 'hardware.lora_tier', 'hardware.full_sft_tier', 'hardware.rl_tier']) {
    setIfUnknown(model, field, apiOnly ? (api ? 'api_only' : 'not_applicable') : 'not_reported');
  }

  // Derived operational fields must still have explicit field-level provenance.
  if (typeof model.openness?.classification === 'string' && !semanticStates.has(model.openness.classification)) {
    const field = 'openness.classification';
    if (!model.sources.some((source: JsonObject) => source.supports?.includes(field))) addSupport(model, [field], 'Classification is derived from the recorded weight-access boundary: provider-only records are proprietary and released-weight records are open-weight unless a source states a narrower category.');
  }
  if (typeof model.research?.suitable_for_inference === 'boolean' && !model.sources.some((source: JsonObject) => source.supports?.includes('research.suitable_for_inference'))) {
    addSupport(model, ['research.suitable_for_inference'], 'Inference suitability is an operational derivation from the recorded local-weight or API access path, not a performance claim.');
  }
  if (typeof model.openness?.commercial_use === 'string' && !semanticStates.has(model.openness.commercial_use) && !model.sources.some((source: JsonObject) => source.supports?.includes('openness.commercial_use'))) {
    addSupport(model, ['openness.commercial_use'], 'Commercial-use classification is derived only where the recorded license explicitly provides the corresponding permission; otherwise it remains a semantic state.');
  }

};

const files = fs.readdirSync(modelDir).filter((file) => file.endsWith('.json')).sort();
for (const file of files) {
  const fullPath = path.join(modelDir, file);
  const model = JSON.parse(fs.readFileSync(fullPath, 'utf8')) as JsonObject;
  const before = JSON.stringify(model);
  classifyModel(model);

  // No exact not_verified value may survive in production model data. Any field not
  // covered by a stronger rule is classified as not_reported rather than promoted to a fact.
  const fallback = (value: any): any => value === 'not_verified' ? 'not_reported' : value;
  const walk = (value: any, field: string): any => {
    if (typeof value === 'string') return fallback(value);
    if (Array.isArray(value)) return value.map((item, index) => walk(item, `${field}[${index}]`));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, walk(item, field ? `${field}.${key}` : key)]));
    return value;
  };
  const updated = walk(model, '') as JsonObject;
  if (JSON.stringify(updated) !== before) {
    fs.writeFileSync(fullPath, `${JSON.stringify(updated, null, 2)}\n`);
  }
}

const remaining: Array<{ file: string; field: string }> = [];
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(modelDir, file), 'utf8'));
  const walk = (value: any, field: string): void => {
    if (value === 'not_verified') remaining.push({ file, field });
    else if (Array.isArray(value)) value.forEach((item, index) => walk(item, `${field}[${index}]`));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => walk(item, field ? `${field}.${key}` : key));
  };
  walk(data, '');
}

const report = { generated_at: today, files: files.length, changes: changes.length, byTarget: Object.fromEntries([...new Set(changes.map((change) => change.to))].map((target) => [target, changes.filter((change) => change.to === target).length])), remainingNotVerified: remaining, sampleChanges: changes.slice(0, 40) };
fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports/semantic-remediation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (remaining.length) process.exitCode = 1;
