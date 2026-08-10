import fs from 'node:fs';
import path from 'node:path';
import vendorsFile from '../src/content/coverage/vendors.json';
import { modelSchema } from '../src/lib/schemas';

const root = process.cwd();
const reportDir = path.join(root, 'reports');
fs.mkdirSync(reportDir, { recursive: true });

const models = fs.readdirSync(path.join(root, 'src/content/models'))
  .filter((file) => file.endsWith('.json'))
  .map((file) => modelSchema.parse(JSON.parse(fs.readFileSync(path.join(root, 'src/content/models', file), 'utf8'))));

const normalize = (value: string) => value
  .toLowerCase()
  .replace(/&quot;|&#34;/g, '')
  .replace(/[._ ]/g, '-')
  .replace(/[^a-z0-9-]+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const tracked = new Set<string>();
for (const model of models) {
  [model.id, model.name, model.official_name, ...(model.aliases ?? []), ...(model.access?.api_model_ids ?? [])]
    .filter((value): value is string => Boolean(value))
    .forEach((value) => tracked.add(normalize(value)));
}

const extractors: Record<string, RegExp[]> = {
  openai: [/\bgpt[-._ ]?[0-9][a-z0-9._-]{1,40}/gi],
  qwen: [/\bqwen[0-9][a-z0-9._-]{1,48}/gi],
  google: [/\bgem(?:ini|ma)[-_ ]?[0-9][a-z0-9._-]{1,48}/gi],
  meta: [/\b(?:llama|muse)[-_ ]?[a-z0-9][a-z0-9._-]{1,48}/gi],
  anthropic: [/\bclaude[-_ ]?[a-z0-9][a-z0-9._-]{1,48}/gi],
  deepseek: [/\bdeepseek[-_][a-z0-9][a-z0-9._-]{1,48}/gi],
  moonshot: [/\bkimi[-_][a-z0-9][a-z0-9._-]{1,48}/gi],
  mistral: [/\bmistral[-_ ]?[a-z0-9][a-z0-9._-]{1,48}/gi],
  glm: [/\bglm[-_][a-z0-9][a-z0-9._-]{1,48}/gi],
  xai: [/\bgrok[-_][a-z0-9][a-z0-9._-]{1,48}/gi],
  minimax: [/\bminimax[-_][a-z0-9][a-z0-9._-]{1,48}/gi],
};

const stopSuffixes = new Set(['docs', 'documentation', 'api', 'model', 'models', 'pricing', 'guide', 'overview', 'preview']);
const cleanCandidate = (raw: string) => {
  const pieces = normalize(raw).split('-');
  while (pieces.length > 2 && stopSuffixes.has(pieces.at(-1)!)) pieces.pop();
  return pieces.join('-');
};

type CatalogResult = {
  vendor: string;
  vendorId: string;
  url: string;
  status: 'ok' | 'forbidden' | 'error';
  checkedAt: string;
  discovered: string[];
  untracked: string[];
  error?: string;
};

const results: CatalogResult[] = [];
for (const vendor of vendorsFile.vendors) {
  const regexes = extractors[vendor.id] ?? [];
  if (!regexes.length) continue;
  for (const url of vendor.official_catalog_urls) {
    const checkedAt = new Date().toISOString();
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(12000),
        headers: { 'user-agent': 'agent-model-atlas-discovery/1.0' },
      });
      if (response.status === 403 || response.status === 405) {
        results.push({ vendor: vendor.name, vendorId: vendor.id, url, status: 'forbidden', checkedAt, discovered: [], untracked: [] });
        continue;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.text();
      const discovered = [...new Set(regexes.flatMap((regex) => [...body.matchAll(regex)].map((match) => cleanCandidate(match[0]))))]
        .filter((candidate) => candidate.length >= 5)
        .sort();
      const untracked = discovered.filter((candidate) => !tracked.has(candidate));
      results.push({ vendor: vendor.name, vendorId: vendor.id, url, status: 'ok', checkedAt, discovered, untracked });
    } catch (error) {
      results.push({ vendor: vendor.name, vendorId: vendor.id, url, status: 'error', checkedAt, discovered: [], untracked: [], error: error instanceof Error ? error.message : String(error) });
    }
  }
}

const candidates = [...new Set(results.flatMap((result) => result.untracked))].sort();
const report = {
  generatedAt: new Date().toISOString(),
  trackedIdentifiers: tracked.size,
  catalogsChecked: results.length,
  discoveryCandidates: candidates,
  note: 'Discovery candidates are review prompts, not verified facts. Add or change a model only after first-party evidence confirms identity and scope.',
  results,
};

fs.writeFileSync(path.join(reportDir, 'catalog-diff.json'), JSON.stringify(report, null, 2) + '\n');
const markdown = [
  '# Official catalog discovery diff', '',
  `Generated: ${report.generatedAt}`, '',
  '> These identifiers are review prompts only. A regex match is not evidence that a new model exists or that Atlas metadata should change.', '',
  `- Tracked identifiers: ${report.trackedIdentifiers}`,
  `- Catalog endpoints checked: ${report.catalogsChecked}`,
  `- Untracked discovery candidates: ${candidates.length}`, '',
  '## Candidates', '',
  ...(candidates.length ? candidates.map((candidate) => `- \`${candidate}\``) : ['- None discovered']), '',
  '## Catalogs', '',
  '| Vendor | Status | Discovered | Untracked | URL |',
  '| --- | --- | ---: | ---: | --- |',
  ...results.map((result) => `| ${result.vendor} | ${result.status} | ${result.discovered.length} | ${result.untracked.length} | ${result.url} |`), '',
].join('\n');
fs.writeFileSync(path.join(reportDir, 'catalog-diff.md'), markdown);
console.log(markdown);

if (process.env.CATALOG_DIFF_STRICT === '1' && candidates.length) {
  console.error('Untracked official-catalog identifiers require evidence review.');
  process.exit(1);
}
