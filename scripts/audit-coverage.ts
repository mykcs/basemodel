import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { modelSchema } from '../src/lib/schemas';
import { buildDataHealth, type VendorCoverage, type FamilyCoverage } from '../src/lib/dataHealth';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const models = (fs.readdirSync(path.join(root, 'src/content/models')) as string[]).filter((file) => file.endsWith('.json')).map((file) => modelSchema.parse(JSON.parse(fs.readFileSync(path.join(root, 'src/content/models', file), 'utf8'))));
const vendors = JSON.parse(fs.readFileSync(path.join(root, 'src/content/coverage/vendors.json'), 'utf8')).vendors as VendorCoverage[];
const families = JSON.parse(fs.readFileSync(path.join(root, 'src/content/coverage/families.json'), 'utf8')).families as FamilyCoverage[];
const health = buildDataHealth(models, vendors, families);
const reportDir = path.join(root, 'reports');
fs.mkdirSync(reportDir, { recursive: true });
const lines = [
  '# Atlas coverage', '',
  '| Vendor | Models | Latest release | Stale |',
  '| --- | ---: | --- | ---: |',
  ...health.vendorCoverage.map(({ vendor, modelCount, latestRelease, stale }) => `| ${vendor.name} | ${modelCount} | ${latestRelease} | ${stale} |`),
  '',
  '| Family | Current generation | Present | Models |',
  '| --- | --- | --- | ---: |',
  ...health.familyCoverage.map(({ family, generationPresent, modelCount }) => `| ${family.name} | ${family.current_generation} | ${generationPresent ? 'yes' : 'no'} | ${modelCount} |`),
  '',
];
fs.writeFileSync(path.join(reportDir, 'data-coverage.md'), lines.join('\n'));
fs.writeFileSync(path.join(reportDir, 'data-coverage.json'), JSON.stringify(health, null, 2) + '\n');
console.log(lines.join('\n'));
