import fs from 'node:fs';
import path from 'node:path';

type Finding = { severity: 'error' | 'warning' | 'info'; record: string; field?: string; kind: string; sourceUrl?: string; checkedAt?: string; action: string };
const root = process.cwd();
const findings: Finding[] = [];
const files = [
  ...fs.readdirSync(path.join(root, 'src/content/models')).filter((file) => file.endsWith('.json')).map((file) => path.join(root, 'src/content/models', file)),
  ...fs.readdirSync(path.join(root, 'src/content/papers')).filter((file) => file.endsWith('.json')).map((file) => path.join(root, 'src/content/papers', file)),
];
const concrete = (value: unknown): boolean => typeof value === 'number' || typeof value === 'boolean' || (typeof value === 'string' && !['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'not_published', 'unavailable', 'unknown'].includes(value));
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, any>;
  const record = String(data.id ?? path.basename(file));
  const sources = Array.isArray(data.sources) ? data.sources : [];
  if (!sources.length) findings.push({ severity: 'error', record, kind: 'missing-source', action: 'Add at least one first-party source.' });
  for (const source of sources) {
    if (!source.evidence_note) findings.push({ severity: 'error', record, kind: 'missing-evidence-note', sourceUrl: source.url, checkedAt: source.checked_at, action: 'Add a concise evidence_note explaining what the source supports.' });
  }
  const walk = (value: unknown, field: string): void => {
    if (concrete(value) && ['architecture', 'openness', 'research', 'hardware'].some((prefix) => field.startsWith(prefix))) {
      const suitable = sources.some((source: any) => ['official_model_card', 'official_docs', 'code'].includes(source.type));
      if (!suitable) findings.push({ severity: 'warning', record, field, kind: 'field-source-mismatch', action: 'Attach an official model card, official documentation, or official code source.' });
    } else if (Array.isArray(value)) value.forEach((item, index) => walk(item, `${field}[${index}]`));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => walk(item, field ? `${field}.${key}` : key));
  };
  walk(data, '');
  if (Array.isArray(data.benchmarks) && data.benchmarks.length) findings.push({ severity: 'info', record, field: 'benchmarks', kind: 'protocol-not-modeled', action: 'Add protocol, harness, and evaluation date when a benchmark claim is expanded.' });
  if (typeof data.openness?.license_name === 'string' && /terms|license/i.test(data.openness.license_name) && !data.sources.some((source: any) => source.type === 'official_model_card' || source.type === 'official_docs')) findings.push({ severity: 'warning', record, field: 'openness.license_name', kind: 'license-source-mismatch', action: 'Link the official license or terms page.' });
}
const report = { generated_at: new Date().toISOString(), files: files.length, errors: findings.filter((finding) => finding.severity === 'error').length, warnings: findings.filter((finding) => finding.severity === 'warning').length, infos: findings.filter((finding) => finding.severity === 'info').length, findings };
fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports/claims.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (report.errors) process.exitCode = 1;
