import fs from 'node:fs';
import path from 'node:path';

type Finding = { file: string; kind: string; detail: string };
const root = process.cwd();
const productionDirs = [path.join(root, 'src/content/models'), path.join(root, 'src/content/papers'), path.join(root, 'src/content/benchmarkRuns')];
const semanticStates = new Set(['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'conflicting_evidence', 'not_published', 'unavailable']);
const genericDirectories = [
  'https://huggingface.co/Qwen/models',
  'https://docs.mistral.ai/models',
  'https://platform.openai.com/docs/models',
];
const findings: Finding[] = [];
const semanticRecords: Array<{ file: string; states: string[] }> = [];
const files = productionDirs.flatMap((directory) => fs.readdirSync(directory).filter((file) => file.endsWith('.json')).map((file) => path.join(directory, file)));

const walk = (value: unknown, file: string, keyPath = ''): void => {
  if (typeof value === 'string') {
    if (value === 'unknown') findings.push({ file, kind: 'raw-unknown', detail: keyPath });
    if (value === 'unresolved') findings.push({ file, kind: 'unresolved', detail: keyPath });
    if (value.includes('example.com')) findings.push({ file, kind: 'placeholder-domain', detail: keyPath });
    if (/verify/i.test(value) && !keyPath.endsWith('evidence_note')) findings.push({ file, kind: 'verify-placeholder', detail: `${keyPath}=${value}` });
    if (genericDirectories.some((directory) => value.replace(/\/$/, '') === directory.replace(/\/$/, ''))) findings.push({ file, kind: 'generic-source', detail: `${keyPath}=${value}` });
    if (semanticStates.has(value) || !keyPath.endsWith('license_name')) return;
  }
  if (value === null) findings.push({ file, kind: 'null-gap', detail: keyPath });
  if (Array.isArray(value)) value.forEach((item, index) => walk(item, file, `${keyPath}[${index}]`));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => walk(item, file, keyPath ? `${keyPath}.${key}` : key));
};

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;
  const statesInRecord = new Set<string>();
  const collectStates = (value: unknown): void => {
    if (typeof value === 'string' && semanticStates.has(value)) statesInRecord.add(value);
    else if (Array.isArray(value)) value.forEach(collectStates);
    else if (value && typeof value === 'object') Object.values(value).forEach(collectStates);
  };
  collectStates(data);
  if (statesInRecord.size) {
    semanticRecords.push({ file: path.relative(root, file), states: [...statesInRecord].sort() });
    if (statesInRecord.has('not_verified')) findings.push({ file: path.relative(root, file), kind: 'legacy-not-verified-value', detail: 'Replace not_verified with a verified fact or a more precise semantic state.' });
    const isBenchmark = file.includes(`${path.sep}benchmarkRuns${path.sep}`);
    const hasEvidenceNote = isBenchmark
      ? typeof data.evidenceNote === 'string' && data.evidenceNote.trim().length > 0
      : Array.isArray(data.sources) && data.sources.some((source) => Boolean(source && typeof source === 'object' && typeof (source as Record<string, unknown>).evidence_note === 'string' && ((source as Record<string, unknown>).evidence_note as string).trim()));
    if (!hasEvidenceNote) findings.push({ file: path.relative(root, file), kind: 'missing-semantic-evidence-note', detail: 'semantic unknown exists without an evidence note' });
  }
  walk(data, path.relative(root, file));
  if ('checkpoint_url' in data && data.checkpoint_url === 'unknown') findings.push({ file: path.relative(root, file), kind: 'checkpoint-unknown', detail: 'checkpoint_url' });
}

const byKind = Object.fromEntries([...new Set(findings.map((finding) => finding.kind))].map((kind) => [kind, findings.filter((finding) => finding.kind === kind).length]));
const uiContract = [
  ['semantic-status-explanation', fs.readFileSync(path.join(root, 'src/components/common/SemanticStatus.astro'), 'utf8').includes('semanticStatusExplanation')],
  ['semantic-status-legend', fs.existsSync(path.join(root, 'src/components/common/SemanticStatusLegend.astro'))],
  ['benchmark-semantic-rendering', fs.readFileSync(path.join(root, 'src/pages/_bodies/data-status.astro'), 'utf8').includes('<SemanticStatus')],
  ['methodology-all-semantic-states', ['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'conflicting_evidence', 'not_published', 'unavailable'].every((state) => fs.readFileSync(path.join(root, 'src/i18n/en.ts'), 'utf8').includes(state))],
].filter(([, ok]) => !ok).map(([name]) => name);
if (uiContract.length) findings.push({ file: 'src/components/common/SemanticStatus.astro', kind: 'missing-semantic-ui-contract', detail: uiContract.join(', ') });
console.log(JSON.stringify({ files: files.length, semanticRecords: semanticRecords.length, semanticGapFindings: findings.length, byKind, uiContract: uiContract.length ? 'fail' : 'pass', findings }, null, 2));
if (findings.length) process.exitCode = 1;
