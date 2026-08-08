import fs from 'node:fs';
import path from 'node:path';

type Severity = 'error' | 'warning' | 'info';
type Finding = { severity: Severity; record: string; field?: string; kind: string; sourceUrl?: string; checkedAt?: string; action: string };
type ClaimRow = { record_id: string; record_type: 'model' | 'paper'; field: string; value: string; evidence_source_ids: string; status: 'supported' | 'unknown' | 'unmapped' | 'legacy-unmapped'; problem: string };

const root = process.cwd();
const findings: Finding[] = [];
const rows: ClaimRow[] = [];
const files = [
  ...fs.readdirSync(path.join(root, 'src/content/models')).filter((file) => file.endsWith('.json')).map((file) => ({ type: 'model' as const, file: path.join(root, 'src/content/models', file) })),
  ...fs.readdirSync(path.join(root, 'src/content/papers')).filter((file) => file.endsWith('.json')).map((file) => ({ type: 'paper' as const, file: path.join(root, 'src/content/papers', file) })),
];
const semantic = new Set(['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'conflicting_evidence', 'not_published', 'unavailable', 'unknown']);
const get = (value: any, field: string): any => field.split('.').reduce((current, key) => current?.[key], value);
const printable = (value: unknown) => value === undefined ? '' : typeof value === 'string' ? value : JSON.stringify(value);
const criticalFields = [
  'vendor', 'family', 'generation', 'release_date', 'checkpoint.type', 'architecture.total_parameters_b', 'architecture.active_parameters_b', 'architecture.context_length',
  'checkpoint.modalities', 'access.weights_status', 'access.api_status', 'openness.license_name', 'openness.classification', 'openness.commercial_use',
  'research.suitable_for_inference', 'research.transformers_support', 'research.vllm_support', 'research.sglang_support',
];
const officialEvidenceTypes = new Set(['official_model_card', 'official_docs', 'official_announcement', 'official_weights', 'official_license', 'official_api_docs', 'official_code', 'technical_report', 'code']);
const fieldIsConcrete = (value: unknown) => value !== undefined && value !== null && !(typeof value === 'string' && semantic.has(value));

for (const entry of files) {
  const data = JSON.parse(fs.readFileSync(entry.file, 'utf8')) as Record<string, any>;
  const record = String(data.id ?? path.basename(entry.file));
  const sources = Array.isArray(data.sources) ? data.sources : [];
  if (!sources.length) findings.push({ severity: 'error', record, kind: 'missing-source', action: 'Add at least one first-party source.' });
  for (const source of sources) {
    if (!source.evidence_note) findings.push({ severity: 'error', record, kind: 'missing-evidence-note', sourceUrl: source.url, checkedAt: source.checked_at, action: 'Add a concise evidence_note explaining what the source supports.' });
  }
  if (entry.type === 'model') {
    for (const field of criticalFields) {
      const value = get(data, field);
      const sourceIds = sources.filter((source: any) => Array.isArray(source.supports) && source.supports.includes(field)).map((source: any) => source.id ?? source.url);
      const concrete = fieldIsConcrete(value);
      const status = sourceIds.length ? 'supported' : concrete && sources.some((source: any) => !source.supports) ? 'legacy-unmapped' : concrete ? 'unmapped' : 'unknown';
      rows.push({ record_id: record, record_type: entry.type, field, value: printable(value), evidence_source_ids: sourceIds.join('|'), status, problem: status === 'supported' || status === 'unknown' ? '' : 'No source explicitly maps to this field.' });
      if (concrete && status === 'unmapped') findings.push({ severity: 'warning', record, field, kind: 'source-claim-coverage-missing', action: 'Add supports to a source or mark the field as a semantic unknown.' });
    }
    const official = sources.some((source: any) => officialEvidenceTypes.has(source.type));
    const licenseClaimSupported = sources.some((source: any) => source.type === 'official_license' || (Array.isArray(source.supports) && source.supports.includes('openness.license_name') && (source.supports.includes('openness.classification') || data.openness?.license_name === 'proprietary')));
    if (data.openness?.custom_license === true && !licenseClaimSupported) findings.push({ severity: 'warning', record, field: 'openness.license_name', kind: 'custom-license-without-license-source', action: 'Attach the official license text or an official source that explicitly states the license class.' });
    if (data.access?.weights_status === 'released' && !sources.some((source: any) => ['official_weights', 'official_model_card', 'official_code'].includes(source.type))) findings.push({ severity: 'warning', record, field: 'access.weights_status', kind: 'weights-released-without-weight-source', action: 'Attach the official weight or model-card source.' });
    if (data.access?.api_status === 'available' && !sources.some((source: any) => ['official_api_docs', 'official_docs', 'official_code'].includes(source.type))) findings.push({ severity: 'warning', record, field: 'access.api_status', kind: 'api-model-without-api-docs', action: 'Attach official API documentation or code.' });
    if (data.data_status === 'verified' && !official) findings.push({ severity: 'warning', record, kind: 'verified-without-official-source', action: 'Use claim_verified only after first-party evidence is attached.' });
  }
  if (Array.isArray(data.benchmarks) && data.benchmarks.length) findings.push({ severity: 'info', record, field: 'benchmarks', kind: 'protocol-not-modeled', action: 'Add protocol, harness, and evaluation date when a benchmark claim is expanded.' });
}

const report = { generated_at: new Date().toISOString(), files: files.length, errors: findings.filter((finding) => finding.severity === 'error').length, warnings: findings.filter((finding) => finding.severity === 'warning').length, infos: findings.filter((finding) => finding.severity === 'info').length, findings, claims: rows };
fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports/claims.json'), JSON.stringify(report, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'reports/claim-audit.json'), JSON.stringify({ generated_at: report.generated_at, claims: rows }, null, 2) + '\n');
const csv = ['record_id,record_type,field,value,evidence_source_ids,status,problem', ...rows.map((row) => [row.record_id, row.record_type, row.field, row.value, row.evidence_source_ids, row.status, row.problem].map((value) => `"${value.replaceAll('"', '""')}"`).join(','))].join('\n') + '\n';
fs.writeFileSync(path.join(root, 'reports/claim-audit.csv'), csv);
const markdown = [`# Claim audit`, ``, `Generated: ${report.generated_at}`, ``, `| Record | Field | Status | Evidence |`, `|---|---|---|---|`, ...rows.map((row) => `| ${row.record_id} | ${row.field} | ${row.status} | ${row.evidence_source_ids || '—'} |`), ``].join('\n');
fs.writeFileSync(path.join(root, 'reports/claim-audit.md'), markdown);
console.log(JSON.stringify({ ...report, claims: rows.length }, null, 2));
if (report.errors) process.exitCode = 1;
