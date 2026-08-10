import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures: string[] = [];
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (id: string, condition: boolean, detail: string) => {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${id} — ${detail}`);
  if (!condition) failures.push(`${id}: ${detail}`);
};

const home = read('src/pages/_bodies/home-v2.astro');
assert('HARDEN-HOME-001', home.includes('primaryIntents') && home.includes("'/guide/'") && home.includes('scoreModels') && home.includes('sampleFeasible'), 'home starts from three intents, links beginners to Guide, and computes a live example');
assert('HARDEN-HOME-002', !home.includes('<strong>18</strong>') && !home.includes('<strong>5</strong>') && !home.includes('<strong>3</strong>'), 'home no longer contains hard-coded demo counts');
const intentIndex = home.indexOf('intent-grid');
const seedIndex = home.indexOf('<SeedUseCaseStrip');
assert('HARDEN-HOME-003', intentIndex >= 0 && seedIndex > intentIndex, 'the SEED practical thread follows the primary intent choice instead of preceding the hero');

const guide = read('src/components/GuideDecisionChapters.astro');
assert('HARDEN-GUIDE-001', ['identity', 'access', 'training', 'reproduction'].every((id) => guide.includes(`id: '${id}'`)), 'Guide concepts are organized into four decision chapters');

const paperIndex = read('src/pages/_bodies/papers-index.astro');
assert('HARDEN-PAPERS-INDEX', paperIndex.includes('paper-matrix-advanced') && paperIndex.includes('<details'), 'paper-model relation matrix is an advanced secondary view');

const memo = read('src/components/workspace/DecisionMemo.tsx');
assert('HARDEN-MEMO-001', memo.includes('memo-readable') && memo.includes('memo-source-preview') && memo.includes('View exported Markdown source'), 'Decision Memo renders a human-readable primary view and keeps Markdown secondary');

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
  console.error(`\nHardening audit second-half diagnostic failed: ${failures.length} item(s)`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('\nHardening audit second-half diagnostic passed.');
