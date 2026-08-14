import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkStrictAudienceCopyInvariants, discoverAudienceCopySources, scanAudienceCopy } from '../../scripts/audit-audience-copy';
import { localizedChangeEventNote } from './localizedChangeEvent';

const root = process.cwd();

describe('audience copy audit', () => {
  it('discovers production copy owners while excluding tests and agent history', () => {
    const files = discoverAudienceCopySources(root);
    expect(files).toContain('src/components/OpenEvoSeedBenchmarksGuide.astro');
    expect(files).toContain('src/content/guides/research-workbench.json');
    expect(files).toContain('src/layouts/AppLayout.astro');
    expect(files).toContain('src/content/benchmarkRuns/agentbench-reported.json');
    expect(files).toContain('src/content/claims/claude-2-access.json');
    expect(files).toContain('src/lib/fieldCatalog.ts');
    expect(files).toContain('src/lib/modelFilters.ts');
    expect(files).toContain('src/pages/_bodies/not-found.astro');
    expect(files).toContain('public/guides/seed-4x3090-preflight.sh');
    expect(files).toContain('public/guides/seed-stage1-check.py');
    expect(files).toContain('public/og-cover.svg');
    expect(files.some((file) => file.includes('/.omc/') || file.includes('.test.'))).toBe(false);
  });

  it('covers every production Astro and TSX source owner', () => {
    const discovered = new Set(discoverAudienceCopySources(root));
    const expected = fs.readdirSync(path.join(root, 'src'), { recursive: true, encoding: 'utf8' })
      .filter((file) => /\.(?:astro|tsx)$/.test(file) && !/\.(?:test|spec)\.tsx$/.test(file))
      .map((file) => `src/${file}`);
    expect(expected.length).toBeGreaterThan(100);
    expect(expected.filter((file) => !discovered.has(file))).toEqual([]);
  });

  it('selects structured change-event copy by locale with safe fallbacks', () => {
    const event = JSON.parse(fs.readFileSync(path.join(root, 'src/content/changeEvents/claude-2-retired.json'), 'utf8'));
    expect(localizedChangeEventNote(event, 'zh')).toBe('官方目录记录将 Claude 2 标记为已退役。');
    expect(localizedChangeEventNote(event, 'en')).toBe('Official catalog record marks Claude 2 as retired.');
    expect(localizedChangeEventNote({ eventType: 'status_changed', note: 'Legacy fallback.' }, 'zh')).toBe('Legacy fallback.');
  });

  it('blocks verified relative-time and negative-heading regressions', () => {
    const seedPath = fs.readFileSync(path.join(root, 'src/components/SeedReproductionPath.astro'), 'utf8');
    const guide = fs.readFileSync(path.join(root, 'src/pages/guide.astro'), 'utf8');
    expect(seedPath).not.toMatch(/今天真的租|rent today/);
    expect(seedPath).toContain('带核验日期的目录');
    expect(guide).not.toMatch(/<h[1-6][^>]*>[^<]*(?:不要|不是|不再)/);
  });

  it('keeps the bilingual Guide current/historical hardware boundary equivalent', () => {
    const zhGuide = fs.readFileSync(path.join(root, 'src/pages/guide.astro'), 'utf8');
    const enGuide = fs.readFileSync(path.join(root, 'src/pages/en/guide.astro'), 'utf8');
    expect(zhGuide).toContain('5×RTX5090');
    expect(zhGuide).toContain('RTX6（4×RTX3090）');
    expect(zhGuide).toContain('Phase H0');
    expect(enGuide).toContain('5×RTX5090');
    expect(enGuide).toContain('RTX6 (4×RTX3090)');
    expect(enGuide).toContain('Phase H0');
    expect(enGuide).not.toContain('move straight into the ALFWorld / WebShop experiment on 4×3090');
  });

  it('requires subject headings while keeping actions concrete', () => {
    const hero = fs.readFileSync(path.join(root, 'src/components/research/SeedOpenEvoMissionHero.astro'), 'utf8');
    const standard = fs.readFileSync(path.join(root, 'docs/agents/current/audience-centered-technical-copy.md'), 'utf8');
    const auditSource = fs.readFileSync(path.join(root, 'scripts/audit-audience-copy.ts'), 'utf8');

    expect(hero).toContain("t('ALFWorld 与 WebShop 研究', 'ALFWorld and WebShop research')");
    expect(hero).toContain("t('实验结果','Experiment results')");
    expect(hero).not.toContain('把“曾经成功”“当前准备好”“现在测得结果”分开');
    expect(standard).toContain('Headings name the subject');
    expect(standard).toContain('标题先命名主题');
    expect(auditSource).toContain('COPY-EDITORIAL-AS-HEADING');
    expect(auditSource).toContain('COPY-SUBJECT-TITLE-001');
  });

  it('reports contextual candidates with actionable evidence', () => {
    const findings = scanAudienceCopy(root);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((finding) => finding.file && finding.line > 0 && finding.ruleId && finding.snippet && finding.reason)).toBe(true);
    expect(findings.every((finding) => finding.strict === false)).toBe(true);
  });

  it('keeps the high-confidence public-copy invariants green', () => {
    expect(checkStrictAudienceCopyInvariants(root)).toEqual([]);
  });

  it('keeps the owner inventory connected to the scanner and representative routes', () => {
    const audit = fs.readFileSync(path.join(root, 'docs/agents/current/audience-copy-audit-2026-08-12.md'), 'utf8');
    expect(audit).toContain('Source-owner inventory');
    expect(audit).toContain('scripts/audit-audience-copy.ts');
    expect(audit).toContain('/guide/openevo-webshop-alfworld/');
    expect(audit).toContain('src/layouts/AppLayout.astro');
    expect(audit).toContain('src/content/benchmarkRuns/**');
    expect(audit).toContain('src/content/claims/**');
    expect(audit).toContain('src/lib/fieldCatalog.ts');
    expect(audit).toContain('src/lib/modelFilters.ts');
    expect(audit).toContain('PASS');
    expect(audit).toContain('FIXED');
    expect(audit).toContain('EXEMPT');
  });
});
