import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { modelSchema } from '../src/lib/schemas';
import { buildDataHealth, type VendorCoverage, type FamilyCoverage } from '../src/lib/dataHealth';
import { familyCoverageRecords } from '../src/lib/familyCoverage';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const loadModels = () => (fs.readdirSync(path.join(root, 'src/content/models')) as string[]).filter((file) => file.endsWith('.json')).map((file) => modelSchema.parse(JSON.parse(fs.readFileSync(path.join(root, 'src/content/models', file), 'utf8'))));
const vendors = JSON.parse(fs.readFileSync(path.join(root, 'src/content/coverage/vendors.json'), 'utf8')).vendors as VendorCoverage[];
const families = familyCoverageRecords as FamilyCoverage[];
const health = buildDataHealth(loadModels(), vendors, families);
const reportDir = path.join(root, 'reports');
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, 'data-freshness.json'), JSON.stringify(health, null, 2) + '\n');
const lines = [
  '# Atlas data freshness', '', `- Generated: ${new Date().toISOString()}`, `- Models: ${health.totalModels}`, `- Checked within 30 days: ${health.recentModels}`, `- Stale records: ${health.staleModels}`, `- Partially verified records: ${health.partialOrUnknown}`, `- Verified records: ${health.verified}`, '', '## Issues', '',
  ...(health.issues.length ? health.issues.map((issue) => `- ${issue.severity.toUpperCase()} ${issue.modelId}: ${issue.reason}${issue.checkedAt ? ` (checked ${issue.checkedAt})` : ''}`) : ['- None']), '',
];
fs.writeFileSync(path.join(reportDir, 'data-freshness.md'), lines.join('\n'));
console.log(lines.join('\n'));
if (health.issues.some((issue) => issue.severity === 'error')) process.exit(1);
