import fs from 'node:fs';
import path from 'node:path';

export type CopyFinding = {
  file: string;
  line: number;
  ruleId: string;
  snippet: string;
  reason: string;
  strict: boolean;
};

type Rule = { id: string; pattern: RegExp; reason: string };

const candidateRules: Rule[] = [
  { id: 'COPY-NEGATIVE-HEADING', pattern: /(?:^|[>"'`])\s*(?:不要|不是|当前不再|不再)[^\n<]{0,100}/g, reason: 'Negative-first copy may need reader context before the warning.' },
  { id: 'COPY-RELATIVE-TIME', pattern: /今天|明天|昨天|之前|这次|刚刚/g, reason: 'Relative time needs a visible date, release, or experiment reference.' },
  { id: 'COPY-PROJECT-TERM', pattern: /RTX6|\bP[0-3]\b|wheelhouse|artifact|API snapshot|successor revision|fallback/gi, reason: 'Project terminology should be explained at first use.' },
  { id: 'COPY-SHARED-HARDWARE', pattern: /(?:4\s*[×x]\s*(?:RTX\s*)?3090|5\s*[×x]\s*(?:RTX\s*)?5090|8\s*[×x]\s*(?:RTX\s*)?5090|4\s*[×x]\s*24GB)/gi, reason: 'Explicit project hardware must say whether it is historical, current allocation, visible inventory, or a reader example.' },
  { id: 'COPY-CHAT-TONE', pattern: /我们刚才|又失败|正确修法|这就是我们踩过的坑/g, reason: 'Chat or incident-history language should not lead the public path.' },
  { id: 'COPY-LEGACY-POSITIONING', pattern: /智能体基础模型选择地图|Agent Foundation Model Atlas|通用模型选择与论文采用地图/g, reason: 'Legacy product positioning may conflict with the SEED × OpenEvo research mission.' },
  { id: 'COPY-ABSTRACT-PACKAGING', pattern: /第一性研究链|框架改进结论|可核验的路径|可追踪的对话|讲成一场对话/g, reason: 'Abstract packaging may hide the concrete subject or result.' },
  { id: 'COPY-EDITORIAL-AS-HEADING', pattern: /把[“"'][^\n]{1,60}[”"'][^\n]{0,50}(?:分开|区分)|先[^\n]{0,45}(?:再|然后|最后)[^\n]{0,60}/g, reason: 'Editorial instructions and sequencing sentences belong in body copy, not prominent headings.' },
  { id: 'COPY-ZH-EN-SENTENCE', pattern: /[\u3400-\u9fff][^\n]{0,120}[.!?]\s+[A-Z][A-Za-z][A-Za-z ,'-]{18,}[.!?]/g, reason: 'A Chinese surface may be exposing an unexplained full English sentence.' },
];

const productionRoots = ['src', 'public/guides', 'public/og-cover.svg'];
const eligibleExtensions = new Set(['.astro', '.tsx', '.ts', '.json', '.md', '.mdx', '.sh', '.py', '.svg']);
const exclusions = [/(?:^|\/)\.omc(?:\/|$)/, /(?:^|\/)__fixtures__(?:\/|$)/, /(?:^|\/)fixtures?(?:\/|$)/, /\.test\.(?:ts|tsx)$/, /\.spec\.(?:ts|tsx)$/];

function walk(root: string, relative = root): string[] {
  if (!fs.existsSync(relative)) return [];
  const stat = fs.statSync(relative);
  if (stat.isFile()) return [relative];
  return fs.readdirSync(relative, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(relative, entry.name);
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') return [];
    return entry.isDirectory() ? walk(root, next) : [next];
  });
}

function lineNumber(source: string, offset: number): number { return source.slice(0, offset).split('\n').length; }
function compact(value: string): string { return value.replace(/\s+/g, ' ').trim().slice(0, 180); }

export function discoverAudienceCopySources(root = process.cwd()): string[] {
  return productionRoots.flatMap((sourceRoot) => walk(root, path.join(root, sourceRoot)))
    .filter((file) => eligibleExtensions.has(path.extname(file)))
    .map((file) => path.relative(root, file))
    .filter((file) => !exclusions.some((pattern) => pattern.test(file)))
    .sort();
}

export function scanAudienceCopy(root = process.cwd()): CopyFinding[] {
  const findings: CopyFinding[] = [];
  for (const file of discoverAudienceCopySources(root)) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    for (const rule of candidateRules) {
      rule.pattern.lastIndex = 0;
      for (const match of source.matchAll(rule.pattern)) {
        findings.push({ file, line: lineNumber(source, match.index ?? 0), ruleId: rule.id, snippet: compact(match[0]), reason: rule.reason, strict: false });
      }
    }
  }
  return findings;
}

export function checkStrictAudienceCopyInvariants(root = process.cwd()): CopyFinding[] {
  const failures: CopyFinding[] = [];
  const source = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');
  const fail = (file: string, ruleId: string, needle: string, reason: string, offset = 0) => failures.push({ file, line: Math.max(1, lineNumber(source(file), offset)), ruleId, snippet: compact(needle), reason, strict: true });
  const ban = (file: string, ruleId: string, needle: string, reason: string) => {
    const value = source(file); const offset = value.indexOf(needle); if (offset >= 0) fail(file, ruleId, needle, reason, offset);
  };
  const requireText = (file: string, ruleId: string, needle: string, reason: string) => {
    if (!source(file).includes(needle)) fail(file, ruleId, needle, reason);
  };

  const discoveredFiles = discoverAudienceCopySources(root);
  const runtimeCopyFiles = discoveredFiles.filter((file) => /^(?:src\/(?:components|pages|layouts)|public\/)/.test(file));
  for (const file of runtimeCopyFiles) {
    ban(file, 'COPY-NAME-001', '复现 C', 'The OpenEvo guide must never use the erroneous Reproduction C name.');
    ban(file, 'COPY-NAME-001', 'Reproduction C', 'The OpenEvo guide must never use the erroneous Reproduction C name.');
    ban(file, 'COPY-HEADING-001', '把“曾经成功”“当前准备好”“现在测得结果”分开', 'Editorial claim-separation instructions must not return as public copy.');
    ban(file, 'COPY-HEADING-001', '先用一段话看懂方法', 'Teaching instructions must not replace the subject as public copy.');
    ban(file, 'COPY-HEADING-001', '这些模型在论文里分别负责什么', 'A sentence-style prompt must not replace the Model roles heading.');
    ban(file, 'COPY-HEADING-001', '这些数字从哪里来，缺数据时怎么看', 'A sentence-style prompt must not replace the Data sources heading.');
    ban(file, 'COPY-ACTION-TITLE-001', '用 SEED 的两个 Agent 基准，检验并改进 OpenEvo', 'Rejected abstract mission wording must not return.');
    ban(file, 'COPY-ACTION-TITLE-001', 'Use SEED’s two agent benchmarks to evaluate and improve OpenEvo', 'Rejected abstract mission wording must not return.');
    ban(file, 'COPY-ACTION-TITLE-002', '把框架与基准讲成一场可追踪的对话', 'Rejected conversation packaging must not return.');
    ban(file, 'COPY-ACTION-TITLE-002', 'Turn frameworks and benchmarks into a traceable conversation', 'Rejected conversation packaging must not return.');
  }

  const exactBanned = [
    ['src/components/GuideDecisionChapters.astro', '不要背术语'],
    ['src/pages/guide.astro', '明天就按这三步做'],
    ['src/pages/_bodies/home-v2.astro', '学习、执行、比较，不再是三套互不相干的网站'],
    ['src/pages/_bodies/home-v2.astro', 'note: event.note ?? event.eventType'],
    ['src/components/SeedReproductionPath.astro', '再决定今天真的租哪张卡'],
    ['src/components/SeedReproductionPath.astro', 'rent today'],
    ['src/pages/guide.astro', '第二步不要直接跑 150 updates'],
    ['src/pages/guide.astro', '迁移不是“把文件复制过去就开跑”'],
    ['src/pages/en/guide.astro', 'move straight into the ALFWorld / WebShop experiment on 4×3090'],
    ['src/pages/en/guide.astro', 'profiling on the four 3090s'],
  ] as const;
  for (const [file, needle] of exactBanned) ban(file, 'COPY-HEADING-002', needle, 'A known negative or conversation-dependent public heading reappeared.');

  const requiredOwners = ['src/layouts/AppLayout.astro','src/content/benchmarkRuns/agentbench-reported.json','src/content/claims/claude-2-access.json','src/lib/fieldCatalog.ts','src/lib/modelFilters.ts','src/pages/_bodies/not-found.astro','public/guides/seed-4x3090-preflight.sh','public/guides/seed-stage1-check.py','public/og-cover.svg'];
  const discovered = new Set(discoveredFiles);
  for (const file of requiredOwners) if (!discovered.has(file)) failures.push({ file, line: 1, ruleId: 'COPY-OWNER-001', snippet: file, reason: 'A known production copy owner must remain in scanner discovery.', strict: true });

  requireText('src/pages/_bodies/home-v2.astro', 'COPY-I18N-002', 'localizedChangeEventNote(event, locale)', 'Home change-event notes must be selected by page locale with an explicit fallback.');

  const hero = 'src/components/research/SeedOpenEvoMissionHero.astro';
  requireText(hero, 'COPY-SUBJECT-TITLE-001', "t('ALFWorld 与 WebShop 研究', 'ALFWorld and WebShop research')", 'The first-screen heading must name the durable research subject rather than an editorial instruction.');
  requireText(hero, 'COPY-STATUS-001', '5× RTX 5090', 'The current experiment allocation must be visible.');
  requireText(hero, 'COPY-STATUS-001', 'RTX6 · 4× RTX 3090', 'RTX6 must be visibly labeled as historical context.');

  const program = 'src/components/research/OpenEvoExperimentProgram.astro';
  for (const required of ['当前实验进展', 'Phase G · completed', 'Phase H0', '5× RTX 5090', 'RTX6（4×RTX 3090）']) requireText(program, 'COPY-STATUS-002', required, 'Current experiment status and hardware chronology must remain explicit.');
  ban(program, 'COPY-STATUS-003', 'formal_task_consumption_allowed = false', 'The old pre-Phase-G state must not return as current status.');

  const zhGuide = 'src/pages/guide.astro';
  const enGuide = 'src/pages/en/guide.astro';
  for (const required of ['5×RTX5090', 'RTX6（4×RTX3090）', 'Phase H0']) requireText(zhGuide, 'COPY-I18N-003', required, 'The Chinese Guide must preserve current-versus-historical experiment status.');
  for (const required of ['5×RTX5090', 'RTX6 (4×RTX3090)', 'Phase H0']) requireText(enGuide, 'COPY-I18N-003', required, 'The English Guide must preserve current-versus-historical experiment status.');

  const experimentGuide = 'src/components/OpenEvoSeedBenchmarksGuide.astro';
  for (const title of ['OpenEvo 实验复现指南', 'OpenEvo experiment reproduction guide']) requireText(experimentGuide, 'COPY-I18N-001', title, 'The current guide must have a normal bilingual subject title.');

  const methodology = 'src/pages/methodology.astro';
  for (const title of ['数据来源与缺失信息','缺失值状态','证据来源','模型推荐边界']) requireText(methodology, 'COPY-SUBJECT-TITLE-002', title, 'Methodology headings must name their subject directly.');

  const paperDetail = 'src/pages/_bodies/paper-detail.astro';
  for (const title of ['方法摘要','复现方式','模型角色']) requireText(paperDetail, 'COPY-SUBJECT-TITLE-003', title, 'Paper detail headings must name their subject directly.');

  for (const file of ['src/i18n/zh.ts', 'src/i18n/en.ts']) {
    const value = source(file);
    if (!value.includes('SEED') || !value.includes('OpenEvo')) failures.push({ file, line: 1, ruleId: 'COPY-META-001', snippet: 'SEED / OpenEvo', reason: 'Core locale metadata must expose the active research mission.', strict: true });
  }

  const standardPath = 'docs/agents/current/audience-centered-technical-copy.md';
  for (const required of ['Headings name the subject', '标题先命名主题', 'ALFWorld 与 WebShop 研究', '5×RTX5090']) requireText(standardPath, 'COPY-STANDARD-001', required, 'The durable copy standard must preserve the subject-heading rule and current hardware chronology example.');

  return failures;
}

function printFindings(title: string, findings: CopyFinding[]): void {
  console.log(`\n${title}: ${findings.length}`);
  for (const finding of findings) { console.log(`${finding.file}:${finding.line} [${finding.ruleId}] ${finding.snippet}`); console.log(`  ${finding.reason}`); }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const strict = process.argv.includes('--strict');
  const sources = discoverAudienceCopySources();
  const findings = scanAudienceCopy();
  const failures = checkStrictAudienceCopyInvariants();
  console.log(`Audience copy audit scanned ${sources.length} production source files.`);
  printFindings('Review candidates (contextual; non-blocking)', findings);
  printFindings('Strict invariant failures', failures);
  console.log('\nCandidate findings are a review queue, not automatic copy errors.');
  if (strict && failures.length > 0) process.exit(1);
}
