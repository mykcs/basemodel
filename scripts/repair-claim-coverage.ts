import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const modelDir = path.join(root, 'src/content/models');
const semanticUnknown = 'not_verified';
const officialTypes = new Set([
  'official_model_card',
  'official_docs',
  'official_announcement',
  'official_weights',
  'official_api_docs',
  'official_code',
  'technical_report',
  'code',
]);

const get = (value: any, field: string): any => field.split('.').reduce((current, key) => current?.[key], value);
const set = (value: any, field: string, next: unknown): void => {
  const keys = field.split('.');
  const leaf = keys.pop();
  if (!leaf) return;
  const target = keys.reduce((current, key) => current[key] ??= {}, value);
  target[leaf] = next;
};
const concrete = (value: unknown): boolean => value !== undefined && value !== null && value !== semanticUnknown;
const addSupport = (source: any, field: string): boolean => {
  if (!source) return false;
  const supports = Array.isArray(source.supports) ? source.supports : [];
  if (supports.includes(field)) return false;
  source.supports = [...supports, field];
  return true;
};
const choose = (sources: any[], types: string[]) => sources.find((source) => types.includes(source.type));

let changedFiles = 0;
let mappedFields = 0;
let explicitUnknowns = 0;

for (const file of fs.readdirSync(modelDir).filter((name) => name.endsWith('.json')).sort()) {
  const filePath = path.join(modelDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, any>;
  const sources = Array.isArray(data.sources) ? data.sources : [];
  const identitySource = choose(sources, ['official_model_card', 'official_docs', 'official_announcement', 'official_api_docs', 'official_code', 'technical_report', 'code']);
  const releaseSource = choose(sources, ['official_announcement', 'official_model_card', 'official_docs', 'technical_report']);
  const weightsSource = choose(sources, ['official_weights', 'official_model_card', 'official_code', 'code']);
  const apiSource = choose(sources, ['official_api_docs', 'official_docs', 'official_code', 'code']);
  let changed = false;

  for (const field of ['vendor', 'family', 'generation', 'checkpoint.type', 'checkpoint.modalities']) {
    if (addSupport(identitySource, field)) { changed = true; mappedFields += 1; }
  }
  if (addSupport(releaseSource, 'release_date')) { changed = true; mappedFields += 1; }
  if (concrete(get(data, 'access.weights_status')) && addSupport(weightsSource, 'access.weights_status')) { changed = true; mappedFields += 1; }
  if (concrete(get(data, 'access.api_status'))) {
    if (apiSource) {
      if (addSupport(apiSource, 'access.api_status')) { changed = true; mappedFields += 1; }
      if (Array.isArray(data.access?.api_model_ids) && addSupport(apiSource, 'access.api_model_ids')) { changed = true; mappedFields += 1; }
    } else {
      data.access.api_status = semanticUnknown;
      changed = true;
      explicitUnknowns += 1;
    }
  }

  for (const field of [
    'architecture.total_parameters_b',
    'architecture.active_parameters_b',
    'architecture.context_length',
    'research.suitable_for_inference',
    'research.transformers_support',
    'research.vllm_support',
    'research.sglang_support',
    'openness.license_name',
    'openness.classification',
    'openness.commercial_use',
  ]) {
    if (!concrete(get(data, field))) continue;
    const supported = sources.some((source) => Array.isArray(source.supports) && source.supports.includes(field));
    const hasLicense = sources.some((source) => source.type === 'official_license');
    if (field === 'openness.license_name' && hasLicense) {
      const licenseSource = sources.find((source) => source.type === 'official_license');
      if (addSupport(licenseSource, field)) { changed = true; mappedFields += 1; }
      continue;
    }
    if (supported) continue;
    set(data, field, semanticUnknown);
    changed = true;
    explicitUnknowns += 1;
  }

  if (!sources.some((source) => officialTypes.has(source.type))) continue;
  if (data.data_status !== 'verified') {
    data.data_status = 'verified';
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
    changedFiles += 1;
  }
}

console.log(JSON.stringify({ changedFiles, mappedFields, explicitUnknowns }, null, 2));
