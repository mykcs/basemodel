import fs from 'node:fs';
import path from 'node:path';
import { modelSchema } from '../src/lib/schemas';
import { familyCoverageRecords, currentSurfaceSummary, localizedFamilyClaim } from '../src/lib/familyCoverage';
import { applyPaperCorrection } from '../src/lib/paperCorrections';

const root = process.cwd();
const failures: string[] = [];
const pass = (id: string, ok: boolean, detail: string) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${id} — ${detail}`); if (!ok) failures.push(`${id}: ${detail}`); };
const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');
const json = <T = unknown>(file: string) => JSON.parse(read(file)) as T;

const qwenMax = modelSchema.parse(json('src/content/models/qwen3-7-max.json'));
const qwenPlus = modelSchema.parse(json('src/content/models/qwen3-7-plus.json'));
const qwen = familyCoverageRecords.find((family) => family.id === 'qwen');
pass('HARDEN-DATA-001', Boolean(qwen && qwen.current_generation === 'Qwen3.7'), 'effective Qwen current generation is Qwen3.7');
pass('HARDEN-DATA-002', Boolean(qwen && currentSurfaceSummary(qwen).api === 'qwen3-7-max' && currentSurfaceSummary(qwen).openWeight === 'qwen3-6-35b-a3b'), 'API and open-weight current surfaces are separated');
pass('HARDEN-DATA-003', qwenMax.access?.api_status === 'available' && qwenMax.openness.weights_available === 'not_disclosed' && qwenPlus.access?.api_status === 'available' && qwenPlus.openness.weights_available === 'not_disclosed', 'Qwen3.7 API records preserve undisclosed weight availability instead of inferring false');
pass('HARDEN-I18N-001', ['qwen', 'kimi', 'llama', 'deepseek'].every((id) => { const family = familyCoverageRecords.find((item) => item.id === id); return Boolean(family && localizedFamilyClaim(family, 'zh') && localizedFamilyClaim(family, 'en')); }), 'highlighted family current claims have localized copy');

const seed = applyPaperCorrection(json<any>('src/content/papers/seed.json'));
pass('HARDEN-PAPER-001', seed.checkpoint_url === 'https://huggingface.co/Jinyang23/Seed-AlfWorld-3B' && seed.reproducibility?.checkpoint_status === 'available', 'SEED released checkpoint is applied as an evidence-backed correction');

const explorer = read('src/components/ModelExplorer.tsx');
pass('HARDEN-UX-001', explorer.includes("'研究约束'") && explorer.includes("'目录属性'") && explorer.includes('filterDepth === \'core\''), 'model explorer separates research constraints from catalog attributes');
pass('HARDEN-UX-002', explorer.includes('当前开放权重研究候选') && explorer.includes('当前 API / 托管模型') && explorer.includes('论文中已有采用证据'), 'default decision view is grouped by research meaning');
pass('HARDEN-UX-003', explorer.includes("baseCheckpoint', label: m.explorer.baseCheckpoint"), 'Base checkpoint remains a quick research filter');

const papers = read('src/components/papers/PaperExplorer.tsx');
pass('HARDEN-PAPER-002', papers.includes('evidenceCompleteness') && papers.includes('experimentBurden') && !papers.includes('function difficulty('), 'paper evidence completeness is separate from experiment burden');
pass('HARDEN-PAPER-003', papers.includes('证据化摘要') && papers.includes('Atlas 推导') && papers.includes('Atlas 估算'), 'paper summaries and heuristics expose provenance');
pass('HARDEN-PAPER-004', papers.includes('benchmark: string') && papers.includes("checkpoint: 'all'"), 'upstream benchmark and checkpoint paper filters remain present');

const home = read('src/pages/_bodies/home-v2.astro');
pass('HARDEN-HOME-001', home.includes("'/guide/'") && home.includes('primaryIntents') && home.includes('scoreModels'), 'home has guide entry, three primary intents, and live computed example');
pass('HARDEN-HOME-002', !home.includes('<strong>18</strong>') && !home.includes('<strong>5</strong>') && !home.includes('<strong>3</strong>'), 'hard-coded demo counts are removed');
const paperIndex = read('src/pages/_bodies/papers-index.astro');
pass('HARDEN-PAPERS-INDEX', paperIndex.includes('paper-matrix-advanced') && paperIndex.includes('<details'), 'paper-model matrix is an advanced secondary view');
const guide = read('src/components/GuideContent.astro');
pass('HARDEN-GUIDE-001', ['identity', 'access', 'training', 'reproduction'].every((id) => guide.includes(`id: '${id}'`)), 'guide is organized as four decision-oriented chapters');
const memo = read('src/components/workspace/DecisionMemo.tsx');
pass('HARDEN-MEMO-001', memo.includes('memo-readable') && memo.includes('memo-source-preview'), 'decision memo renders human-readable view before Markdown source');

const tokens = read('src/styles/tokens.css'); const hardening = read('src/styles/hardening.css'); const globalCss = read('src/styles/global.css'); const dataStatus = read('src/pages/_bodies/data-status.astro');
pass('HARDEN-A11Y-001', tokens.includes('--color-accent-fill: #9c3e2a') && tokens.includes('--color-accent-on-fill: #ffffff') && tokens.includes('--color-accent-on-fill: #151a1a'), 'active-control color tokens cover light and dark themes');
pass('HARDEN-A11Y-002', hardening.includes('.brand-mark') && hardening.includes('var(--accent-fill)') && globalCss.includes("@import './hardening.css'"), 'brand and active-control contrast fixes load globally');
pass('HARDEN-VISUAL-001', hardening.includes('.workspace-grid') && hardening.includes('.reason-line') && hardening.includes('.guide-chapter') && hardening.includes('.memo-readable'), 'research-critical hierarchy hardening is present');
pass('HARDEN-TYPES-001', dataStatus.includes('const severityLabels: Record<string, string>') && dataStatus.includes('const reasonLabels: Record<string, string>'), 'data-status dynamic labels use strict-safe index types');

const catalogAudit = read('scripts/audit-catalog-diff.ts'); const freshness = read('scripts/audit-freshness.ts'); const coverage = read('scripts/audit-coverage.ts');
pass('HARDEN-FRESHNESS-001', catalogAudit.includes('discoveryCandidates') && catalogAudit.includes('CATALOG_DIFF_STRICT'), 'official catalog discovery diff exists without auto-promoting candidates to facts');
pass('HARDEN-FRESHNESS-002', freshness.includes('familyCoverageRecords') && coverage.includes('familyCoverageRecords'), 'freshness and coverage audits share the effective family catalog');

if (failures.length) { console.error(`\nFinal product hardening audit failed: ${failures.length} item(s)`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log('\nFinal product hardening audit passed.');
