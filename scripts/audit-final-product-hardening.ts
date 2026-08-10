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
const hardening = read('src/styles/final-hardening.css');
const layout = read('src/layouts/AppLayout.astro');
assert('HARDEN-A11Y-001', tokens.includes('--color-accent-fill: #9c3e2a') && tokens.includes('--color-accent-on-fill: #ffffff') && tokens.includes('--color-accent-on-fill: #151a1a'), 'filled accent tokens provide dedicated light/dark foreground pairs');
assert('HARDEN-VISUAL-001', hardening.includes('.reason-line') && hardening.includes('.workspace-grid') && hardening.includes('.intent-row') && hardening.includes('.guide-chapter') && hardening.includes('.memo-readable'), 'research-critical typography, workbench density, and editorial hierarchy are hardened');
assert('HARDEN-VISUAL-002', layout.includes("../styles/final-hardening.css") && layout.indexOf("../styles/final-hardening.css") > layout.indexOf("../styles/design-refinement.css"), 'final hardening stylesheet is loaded last');
assert('HARDEN-HOME-004', !layout.includes('BeginnerStart') && !layout.includes("area={seedArea} standalone") === false, 'duplicate BeginnerStart onboarding is removed from the layout');

const catalogDiff = read('scripts/audit-catalog-diff.ts');
assert('HARDEN-FRESHNESS-001', catalogDiff.includes('discoveryCandidates') && catalogDiff.includes('CATALOG_DIFF_STRICT') && catalogDiff.includes('review prompts'), 'catalog discovery produces review candidates without auto-promoting them to facts');

if (failures.length) {
  console.error(`\nHardening audit visual/data-tail diagnostic failed: ${failures.length} item(s)`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('\nHardening audit visual/data-tail diagnostic passed.');
