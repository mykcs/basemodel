import fs from 'node:fs';
import path from 'node:path';

type Finding = { file: string; kind: string; detail: string };
const root = process.cwd();
const productionDirs = [path.join(root, 'src/content/models'), path.join(root, 'src/content/papers')];
const semanticStates = new Set(['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'not_published', 'unavailable']);
const genericDirectories = [
  'https://huggingface.co/Qwen/models',
  'https://docs.mistral.ai/models',
  'https://platform.openai.com/docs/models',
];
const findings: Finding[] = [];
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
  walk(data, path.relative(root, file));
  if ('checkpoint_url' in data && data.checkpoint_url === 'unknown') findings.push({ file: path.relative(root, file), kind: 'checkpoint-unknown', detail: 'checkpoint_url' });
}

const byKind = Object.fromEntries([...new Set(findings.map((finding) => finding.kind))].map((kind) => [kind, findings.filter((finding) => finding.kind === kind).length]));
console.log(JSON.stringify({ files: files.length, semanticGapFindings: findings.length, byKind, findings }, null, 2));
if (findings.length) process.exitCode = 1;
