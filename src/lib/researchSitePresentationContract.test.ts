import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const srcRoot = fileURLToPath(new URL('../', import.meta.url));
const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const researchRoots = [join(srcRoot, 'components/research'), join(srcRoot, 'pages/research')];
const allowedExtensions = new Set(['.astro', '.tsx', '.ts', '.md', '.mdx']);

const walk = (path: string): string[] => {
  if (statSync(path).isFile()) return [path];
  return readdirSync(path).flatMap((entry) => walk(join(path, entry)));
};

const researchFiles = researchRoots
  .flatMap((root) => walk(root))
  .filter((file) => allowedExtensions.has(extname(file)))
  .filter((file) => !/\.(?:test|spec)\.(?:ts|tsx)$/.test(file));

const removeTechnicalDisclosures = (source: string) => source
  .replace(/<details\b[\s\S]*?<\/details>/g, '')
  .replace(/<ResearchTechnicalDisclosure\b[\s\S]*?<\/ResearchTechnicalDisclosure>/g, '');

const operationalPatterns = [
  { id: 'python-command', pattern: /(?:^|[\s>`])python(?:3)?\s+[\w./-]+/gm },
  { id: 'package-command', pattern: /(?:^|[\s>`])(?:npm|pnpm|yarn)\s+(?:run|exec|dlx|test|build)\b/gm },
  { id: 'remote-or-container-command', pattern: /(?:^|[\s>`])(?:docker|ssh|rsync|curl)\s+[^\n<`]+/gm },
  { id: 'filesystem-command', pattern: /(?:^|[\s>`])(?:chmod|chown|mkdir|install\s+-d)\s+[^\n<`]+/gm },
  { id: 'shell-script-command', pattern: /\.\/[\w.-]+\.sh(?:\s+[^\n<`]*)?/gm },
  { id: 'secret-export', pattern: /export\s+[A-Z][A-Z0-9_]*=/gm },
] as const;

describe('research-site presentation contract', () => {
  it('routes future research UI work through the durable publication contract', () => {
    const rootAgents = readFileSync(join(repoRoot, 'AGENTS.md'), 'utf8');
    const researchAgents = readFileSync(join(srcRoot, 'components/research/AGENTS.md'), 'utf8');
    const uiContract = readFileSync(join(repoRoot, 'docs/agents/current/ui-design-principles.md'), 'utf8');
    const expressionContract = readFileSync(join(repoRoot, 'docs/agents/current/human-thinking-web-expression-contract.md'), 'utf8');
    const agentIndex = readFileSync(join(repoRoot, 'docs/agents/README.md'), 'utf8');
    const attentionContract = readFileSync(join(repoRoot, 'docs/agents/current/site-reader-attention-contract.md'), 'utf8');

    for (const source of [rootAgents, researchAgents, uiContract, expressionContract]) {
      expect(source).toContain('research-site-presentation-contract.md');
    }
    for (const source of [rootAgents, researchAgents, agentIndex]) {
      expect(source).toContain('site-reader-attention-contract.md');
    }
    expect(researchAgents).toContain('src/data/siteReaderContracts.ts');
    expect(attentionContract).toContain('人的时间和注意力是预算');
    expect(attentionContract).toContain('src/data/siteReaderContracts.ts');
  });

  it('protects longitudinal research figures from silent recent-window cropping', () => {
    const contract = readFileSync(join(repoRoot, 'docs/agents/current/research-site-presentation-contract.md'), 'utf8');
    expect(contract).toContain('preserve the full relevant time axis and the actual earlier trajectory');
    expect(contract).toContain('not silent replacements for earlier history');
    expect(contract).toContain('say that scope in the title/caption');
  });

  it('keeps copy-paste operational commands behind explicit technical disclosure', () => {
    const findings: string[] = [];

    for (const file of researchFiles) {
      const visibleSource = removeTechnicalDisclosures(readFileSync(file, 'utf8'));
      for (const rule of operationalPatterns) {
        rule.pattern.lastIndex = 0;
        for (const match of visibleSource.matchAll(rule.pattern)) {
          findings.push(`${relative(repoRoot, file)}: ${rule.id}: ${match[0].trim()}`);
        }
      }
    }

    expect(findings).toEqual([]);
  });

  it('publishes the MiniMax secret workflow without publishing or printing the key', () => {
    const page = readFileSync(join(srcRoot, 'pages/research/seed-openevo/study/minimax-teacher/index.astro'), 'utf8');
    const disclosureStart = page.indexOf('<ResearchTechnicalDisclosure');
    const disclosureEnd = page.indexOf('</ResearchTechnicalDisclosure>', disclosureStart);
    const secretPath = '$HOME/.secrets/openevo/minimax-teacher.env';

    expect(disclosureStart).toBeGreaterThan(-1);
    expect(disclosureEnd).toBeGreaterThan(disclosureStart);
    expect(page.slice(disclosureStart, disclosureEnd)).toContain(secretPath);
    expect(page.slice(disclosureStart, disclosureEnd)).toContain('getpass.getpass("Paste MiniMax API key (hidden): ")');
    expect(page.slice(disclosureStart, disclosureEnd)).toContain('OPENAI_API_KEY=');
    expect(page.slice(disclosureStart, disclosureEnd)).toContain('chmod 600');
    expect(page.slice(disclosureStart, disclosureEnd)).toContain('wc -l');
    expect(page).not.toContain(`cat ${secretPath}`);
    expect(page).not.toMatch(/\/(?:data\/home|home)\/[A-Za-z0-9._-]+\/\.secrets\/openevo/);
    expect(page).not.toContain('wangr:wangr');
  });

  it('keeps scientific notation visible while moving literal execution commands into depth', () => {
    const smallWorld = readFileSync(join(srcRoot, 'components/research/WebShopSmallWorldFigure.astro'), 'utf8');
    const trainingNote = readFileSync(join(srcRoot, 'components/research/WebShopTrainingNote.astro'), 'utf8');
    const resultExplainer = readFileSync(join(srcRoot, 'components/research/OpenEvoFairComparisonExplainer.astro'), 'utf8');

    expect(removeTechnicalDisclosures(smallWorld)).not.toContain('./setup.sh -d small');
    expect(smallWorld).toContain('./setup.sh -d small');
    expect(removeTechnicalDisclosures(trainingNote)).not.toContain('python train_search.py');
    expect(trainingNote).toContain('python train_search.py');
    expect(resultExplainer).toContain('search[blue shoes]');
  });

  it('keeps the shared disclosure semantic, named, and keyboard-focusable', () => {
    const disclosure = readFileSync(join(srcRoot, 'components/research/ResearchTechnicalDisclosure.astro'), 'utf8');
    expect(disclosure).toContain('<details class="research-technical-disclosure">');
    expect(disclosure).toContain('<summary>');
    expect(disclosure).toContain('summary:focus-visible');
    expect(disclosure).toContain('{summary}');
  });
});
