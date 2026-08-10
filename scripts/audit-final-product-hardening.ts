import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures: string[] = [];
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (id: string, condition: boolean, detail: string) => {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${id} — ${detail}`);
  if (!condition) failures.push(`${id}: ${detail}`);
};

const dataStatus = read('src/pages/_bodies/data-status.astro');
assert('HARDEN-DATA-STATUS-001', dataStatus.includes('托管 / API 当前模型') && dataStatus.includes('开放权重当前模型') && dataStatus.includes('const apiPresent = apiCurrent ? models.some'), 'Data Status separates current surfaces and verifies the displayed API model directly');

const landscape = read('src/components/landscape/LandscapePrototype.tsx');
assert('HARDEN-LANDSCAPE-001', landscape.includes("useState<'learning' | 'full'>('learning')") && landscape.includes('仅显示论文采用模型') && landscape.includes('AccessibleLandscapeTable'), 'Landscape defaults to a low-cognitive-load learning view with paper filtering and an accessible table');

const tokens = read('src/styles/tokens.css');
assert('HARDEN-A11Y-001', tokens.includes('--color-accent-fill: #9c3e2a') && tokens.includes('--color-accent-on-fill: #ffffff') && tokens.includes('--color-accent-on-fill: #151a1a'), 'filled accent tokens provide dedicated light/dark foreground pairs');

if (failures.length) {
  console.error(`\nHardening audit data/landscape/a11y diagnostic failed: ${failures.length} item(s)`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('\nHardening audit data/landscape/a11y diagnostic passed.');
