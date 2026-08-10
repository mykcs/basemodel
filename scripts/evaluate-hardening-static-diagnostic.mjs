import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const rows = [];
const check = (id, condition, detail) => rows.push({ id, pass: Boolean(condition), detail });

const families = json('src/content/coverage/families.json').families;
const qwen = families.find((family) => family.id === 'qwen');
check('HARDEN-DATA-001', qwen?.current_generation === 'Qwen3.7', 'Qwen current generation');
check('HARDEN-DATA-002', qwen?.current_flagship_model_id === 'qwen3-7-max' && qwen?.current_open_weight_model_id === 'qwen3-6-35b-a3b', 'Qwen hosted/open split');
const qwenMax = json('src/content/models/qwen3-7-max.json');
const qwenPlus = json('src/content/models/qwen3-7-plus.json');
check('HARDEN-DATA-003', qwenMax.access?.api_status === 'available' && qwenMax.openness?.weights_available === 'not_disclosed' && qwenPlus.access?.api_status === 'available' && qwenPlus.openness?.weights_available === 'not_disclosed', 'Qwen API/weight semantics');
check('HARDEN-DATA-004', qwenMax.openness?.finetuning_allowed === 'not_disclosed' && qwenPlus.openness?.finetuning_allowed === 'not_disclosed' && qwenMax.research?.suitable_for_lora === 'not_disclosed' && qwenPlus.research?.suitable_for_sft === 'not_disclosed', 'Qwen training-right semantics');

const corrections = read('src/lib/paperCorrections.ts');
check('HARDEN-PAPER-001', corrections.includes('https://huggingface.co/Jinyang23/Seed-AlfWorld-3B') && corrections.includes("checkpoint_status: 'available'"), 'SEED correction source contract');

const explorer = read('src/components/ModelExplorer.tsx');
check('HARDEN-UX-001', explorer.includes("'研究约束'") && explorer.includes("'目录属性'") && explorer.includes("key: 'baseCheckpoint'") && explorer.includes('current-open') && explorer.includes('current-api') && explorer.includes('paper-used'), 'Model Explorer decision grouping');
const coreBlockStart = explorer.indexOf("{filterDepth === 'core' ? <>");
const coreBlock = coreBlockStart >= 0 ? explorer.slice(coreBlockStart) : '';
const openWeightSelect = coreBlock.indexOf('<Select label={m.explorer.openWeights}');
const vendorSelect = coreBlock.indexOf('<Select label={m.explorer.vendor}');
check('HARDEN-UX-002', coreBlockStart >= 0 && openWeightSelect >= 0 && vendorSelect > openWeightSelect, `core=${coreBlockStart}, open=${openWeightSelect}, vendor=${vendorSelect}`);

const paperExplorer = read('src/components/papers/PaperExplorer.tsx');
check('HARDEN-PAPER-002', paperExplorer.includes('evidenceCompleteness') && paperExplorer.includes('experimentBurden') && !paperExplorer.includes('function difficulty('), 'paper evidence/burden split');
check('HARDEN-PAPER-003', paperExplorer.includes('证据化摘要') && paperExplorer.includes('Atlas 推导') && paperExplorer.includes('Atlas 估算'), 'paper provenance strings');
check('HARDEN-PAPER-004-original', paperExplorer.includes("config_status === 'available'") && paperExplorer.includes("environment_status === 'reported'") && paperExplorer.includes('!hasHttpUrl(paper.code_url)'), 'original #88 brittle assertion');
check('HARDEN-PAPER-004-fixed', paperExplorer.includes("repro?.config_status === 'available'") && paperExplorer.includes("repro?.config_status === 'partial'") && paperExplorer.includes("repro?.environment_status === 'reported'") && paperExplorer.includes("repro?.environment_status === 'partial'") && paperExplorer.includes('!hasHttpUrl(paper.code_url)'), 'semantic evidence guards');

const home = read('src/pages/_bodies/home-v2.astro');
check('HARDEN-HOME-001', home.includes('primaryIntents') && home.includes("'/guide/'") && home.includes('scoreModels') && home.includes('sampleFeasible'), 'home decision-first inputs');
check('HARDEN-HOME-002', !home.includes('<strong>18</strong>') && !home.includes('<strong>5</strong>') && !home.includes('<strong>3</strong>'), 'no hard-coded demo counts');
const intentIndex = home.indexOf('intent-grid');
const seedIndex = home.indexOf('<SeedUseCaseStrip');
check('HARDEN-HOME-003', intentIndex >= 0 && seedIndex > intentIndex, `intent=${intentIndex}, seed=${seedIndex}`);

const guide = read('src/components/GuideDecisionChapters.astro');
check('HARDEN-GUIDE-001', ['identity', 'access', 'training', 'reproduction'].every((id) => guide.includes(`id: '${id}'`)), 'four decision chapters');
const paperIndex = read('src/pages/_bodies/papers-index.astro');
check('HARDEN-PAPERS-INDEX', paperIndex.includes('paper-matrix-advanced') && paperIndex.includes('<details'), 'advanced paper matrix');
const memo = read('src/components/workspace/DecisionMemo.tsx');
check('HARDEN-MEMO-001', memo.includes('memo-readable') && memo.includes('memo-source-preview') && memo.includes('View exported Markdown source'), 'readable memo first');
const dataStatus = read('src/pages/_bodies/data-status.astro');
check('HARDEN-DATA-STATUS-001', dataStatus.includes('托管 / API 当前模型') && dataStatus.includes('开放权重当前模型') && dataStatus.includes('const apiPresent = apiCurrent ? models.some'), 'current surfaces split');
const landscape = read('src/components/landscape/LandscapePrototype.tsx');
check('HARDEN-LANDSCAPE-001', landscape.includes("useState<'learning' | 'full'>('learning')") && landscape.includes('仅显示论文采用模型') && landscape.includes('AccessibleLandscapeTable'), 'landscape learning default');
const tokens = read('src/styles/tokens.css');
const hardening = read('src/styles/final-hardening.css');
const layout = read('src/layouts/AppLayout.astro');
check('HARDEN-A11Y-001', tokens.includes('--color-accent-fill: #9c3e2a') && tokens.includes('--color-accent-on-fill: #ffffff') && tokens.includes('--color-accent-on-fill: #151a1a'), 'filled accent foreground tokens');
check('HARDEN-VISUAL-001', hardening.includes('.reason-line') && hardening.includes('.workspace-grid') && hardening.includes('.intent-row') && hardening.includes('.guide-chapter') && hardening.includes('.memo-readable'), 'hardening CSS selectors');
check('HARDEN-VISUAL-002', layout.includes("../styles/final-hardening.css") && layout.indexOf("../styles/final-hardening.css") > layout.indexOf("../styles/design-refinement.css"), 'hardening CSS loaded last');
check('HARDEN-HOME-004', !layout.includes('BeginnerStart') && !layout.includes("area={seedArea} standalone") === false, 'no duplicate onboarding + SEED standalone context');
const catalogDiff = read('scripts/audit-catalog-diff.ts');
check('HARDEN-FRESHNESS-001', catalogDiff.includes('discoveryCandidates') && catalogDiff.includes('CATALOG_DIFF_STRICT') && catalogDiff.includes('review prompts'), 'catalog discovery contract');

const text = [
  'DIAGNOSTIC_ONLY: static mirror of final hardening assertions',
  ...rows.map((row) => `${row.pass ? 'PASS' : 'FAIL'} ${row.id} — ${row.detail}`),
  `failure_count=${rows.filter((row) => !row.pass).length}`,
].join('\n') + '\n';
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/hardening-static-diagnostics.txt'), text);
console.log(text);
process.exit(0);
