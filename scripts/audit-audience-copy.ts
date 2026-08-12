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

type Rule = {
  id: string;
  pattern: RegExp;
  reason: string;
};

const candidateRules: Rule[] = [
  { id: 'COPY-NEGATIVE-HEADING', pattern: /(?:^|[>"'`])\s*(?:不要|不是|当前不再|不再)[^\n<]{0,100}/g, reason: 'Negative-first copy may need reader context before the warning.' },
  { id: 'COPY-RELATIVE-TIME', pattern: /今天|明天|昨天|之前|这次|刚刚/g, reason: 'Relative time needs a visible date, release, or experiment reference.' },
  { id: 'COPY-PROJECT-TERM', pattern: /RTX6|\bP[0-3]\b|wheelhouse|artifact|API snapshot|successor revision|fallback/gi, reason: 'Project terminology should be explained at first use.' },
  { id: 'COPY-SHARED-HARDWARE', pattern: /4\s*[×x]\s*(?:RTX\s*)?3090|4\s*[×x]\s*24GB|旧\s*MacBook|新\s*MacBook/gi, reason: 'Hardware in shared copy must be labeled as a project example, not a universal prerequisite.' },
  { id: 'COPY-CHAT-TONE', pattern: /我们刚才|又失败|正确修法|这就是我们踩过的坑/g, reason: 'Chat or incident-history language should not lead the public success path.' },
  { id: 'COPY-LEGACY-POSITIONING', pattern: /智能体基础模型选择地图|Agent Foundation Model Atlas|通用模型选择与论文采用地图/g, reason: 'Legacy product positioning may conflict with the SEED × OpenEvo research mission.' },
  { id: 'COPY-ZH-EN-SENTENCE', pattern: /[\u3400-\u9fff][^\n]{0,120}[.!?]\s+[A-Z][A-Za-z][A-Za-z ,'-]{18,}[.!?]/g, reason: 'A Chinese surface may be exposing an unexplained full English sentence.' },
];

const productionRoots = ['src', 'public/guides', 'public/og-cover.svg'];

const eligibleExtensions = new Set(['.astro', '.tsx', '.ts', '.json', '.md', '.mdx', '.sh', '.py', '.svg']);
const exclusions = [
  /(?:^|\/)\.omc(?:\/|$)/,
  /(?:^|\/)__fixtures__(?:\/|$)/,
  /(?:^|\/)fixtures?(?:\/|$)/,
  /\.test\.(?:ts|tsx)$/,
  /\.spec\.(?:ts|tsx)$/,
];

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

function lineNumber(source: string, offset: number): number {
  return source.slice(0, offset).split('\n').length;
}

function compact(value: string): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, 180);
}

export function discoverAudienceCopySources(root = process.cwd()): string[] {
  return productionRoots
    .flatMap((sourceRoot) => walk(root, path.join(root, sourceRoot)))
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
        findings.push({
          file,
          line: lineNumber(source, match.index ?? 0),
          ruleId: rule.id,
          snippet: compact(match[0]),
          reason: rule.reason,
          strict: false,
        });
      }
    }
  }
  return findings;
}

export function checkStrictAudienceCopyInvariants(root = process.cwd()): CopyFinding[] {
  const failures: CopyFinding[] = [];
  const add = (file: string, ruleId: string, needle: string, reason: string) => {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    const offset = source.indexOf(needle);
    if (offset >= 0) failures.push({ file, line: lineNumber(source, offset), ruleId, snippet: compact(needle), reason, strict: true });
  };

  for (const file of discoverAudienceCopySources(root)) {
    add(file, 'COPY-NAME-001', '复现 C', 'The OpenEvo guide must never use the erroneous Reproduction C name.');
    add(file, 'COPY-NAME-001', 'Reproduction C', 'The OpenEvo guide must never use the erroneous Reproduction C name.');
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
  for (const [file, needle] of exactBanned) add(file, 'COPY-HEADING-001', needle, 'A known negative or conversation-dependent public heading reappeared.');

  const requiredOwners = [
    'src/layouts/AppLayout.astro',
    'src/content/benchmarkRuns/agentbench-reported.json',
    'src/content/claims/claude-2-access.json',
    'src/lib/fieldCatalog.ts',
    'src/lib/modelFilters.ts',
    'src/pages/_bodies/not-found.astro',
    'public/guides/seed-4x3090-preflight.sh',
    'public/guides/seed-stage1-check.py',
    'public/og-cover.svg',
  ];
  const discovered = new Set(discoverAudienceCopySources(root));
  for (const file of requiredOwners) {
    if (!discovered.has(file)) failures.push({ file, line: 1, ruleId: 'COPY-OWNER-001', snippet: file, reason: 'A known production copy owner must remain in scanner discovery.', strict: true });
  }

  const home = fs.readFileSync(path.join(root, 'src/pages/_bodies/home-v2.astro'), 'utf8');
  if (!home.includes('localizedChangeEventNote(event, locale)')) {
    failures.push({ file: 'src/pages/_bodies/home-v2.astro', line: 1, ruleId: 'COPY-I18N-002', snippet: 'localizedChangeEventNote(event, locale)', reason: 'Home change-event notes must be selected by page locale with an explicit fallback.', strict: true });
  }

  const enGuide = fs.readFileSync(path.join(root, 'src/pages/en/guide.astro'), 'utf8');
  for (const required of ['online workstation', 'internal GPU server', 'This project uses an offline 4×RTX 3090 24GB server as a concrete example', "reader’s actual server"]) {
    if (!enGuide.includes(required)) failures.push({ file: 'src/pages/en/guide.astro', line: 1, ruleId: 'COPY-I18N-003', snippet: required, reason: 'The English Guide must preserve the transferable topology and project-example hardware boundary.', strict: true });
  }

  for (const file of ['src/i18n/zh.ts', 'src/i18n/en.ts']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    if (!source.includes('SEED') || !source.includes('OpenEvo')) {
      failures.push({ file, line: 1, ruleId: 'COPY-META-001', snippet: 'SEED / OpenEvo', reason: 'Core locale metadata must expose the active research mission.', strict: true });
    }
  }

  const guide = fs.readFileSync(path.join(root, 'src/components/OpenEvoSeedBenchmarksGuide.astro'), 'utf8');
  for (const title of ['OpenEvo × WebShop / ALFWorld 复现指南', 'OpenEvo × WebShop / ALFWorld Reproduction Guide']) {
    if (!guide.includes(title)) failures.push({ file: 'src/components/OpenEvoSeedBenchmarksGuide.astro', line: 1, ruleId: 'COPY-I18N-001', snippet: title, reason: 'The canonical guide title must exist in both locales.', strict: true });
  }

  return failures;
}

function printFindings(title: string, findings: CopyFinding[]): void {
  console.log(`\n${title}: ${findings.length}`);
  for (const finding of findings) {
    console.log(`${finding.file}:${finding.line} [${finding.ruleId}] ${finding.snippet}`);
    console.log(`  ${finding.reason}`);
  }
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
