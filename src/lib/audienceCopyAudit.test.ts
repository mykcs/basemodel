import fs from 'node:fs';
import os from 'node:os';
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
    expect(seedPath).toContain('market.checkedAtIso');
    expect(seedPath).toContain('公开产品快照');
    expect(guide).not.toMatch(/<h[1-6][^>]*>[^<]*(?:不要|不是|不再)/);
  });

  it('keeps the bilingual Guide historical/live-state boundary equivalent', () => {
    const zhGuide = fs.readFileSync(path.join(root, 'src/pages/guide.astro'), 'utf8');
    const enGuide = fs.readFileSync(path.join(root, 'src/pages/en/guide.astro'), 'utf8');
    const state = fs.readFileSync(path.join(root, 'src/lib/openEvoScientificState.ts'), 'utf8');
    expect(zhGuide).toContain('RTX6（4×RTX3090）');
    expect(enGuide).toContain('RTX6 (4×RTX3090)');
    expect(zhGuide).toContain('current-campaign.json');
    expect(enGuide).toContain('current-campaign.json');
    expect(zhGuide).toContain('默认分支快照');
    expect(enGuide).toContain('default-branch snapshot');
    expect(state).toContain("checkedAt: '2026-08-28'");
    expect(state).toContain("phase: 'WB1-TRACKB-CONTINUATION'");
    expect(state).toContain('active scientific branch may be ahead');
    expect(zhGuide).not.toContain('当前实验分配为 <strong>5×RTX5090</strong>');
    expect(enGuide).not.toContain('current allocation of <strong>5×RTX5090</strong>');
    expect(enGuide).not.toContain('move straight into the ALFWorld / WebShop experiment on 4×3090');
  });

  it('requires subject headings while keeping actions concrete', () => {
    const hero = fs.readFileSync(path.join(root, 'src/components/research/SeedOpenEvoMissionHero.astro'), 'utf8');
    const standard = fs.readFileSync(path.join(root, 'docs/agents/current/audience-centered-technical-copy.md'), 'utf8');
    const auditSource = fs.readFileSync(path.join(root, 'scripts/audit-audience-copy.ts'), 'utf8');

    expect(hero).toContain("t('ALFWorld 与 WebShop 研究', 'ALFWorld and WebShop research')");
    expect(hero).toContain("t('研究结果','Research findings')");
    expect(hero).not.toContain('把“曾经成功”“当前准备好”“现在测得结果”分开');
    expect(standard).toContain('Headings name the subject');
    expect(standard).toContain('标题先命名主题');
    expect(standard).toContain('首屏先认对象，再回答实验做了什么');
    expect(standard).toContain('Canonical background belongs behind a link');
    expect(standard).toContain('Current scientific claims must be delegated, not copied');
    expect(auditSource).toContain('COPY-EDITORIAL-AS-HEADING');
    expect(auditSource).toContain('COPY-PRESENTER-HEADING');
    expect(auditSource).toContain('COPY-NARRATIVE-FORK');
    expect(auditSource).toContain('COPY-STATIC-ENGLISH-EYEBROW');
    expect(auditSource).toContain('COPY-SUBJECT-TITLE-001');
    expect(auditSource).toContain('COPY-INTERNAL-LABEL-001');
    expect(auditSource).toContain('COPY-FIRST-READER-JARGON-001');
    expect(standard).toContain('Prefer the literal experimental operation over a narrative metaphor');
    expect(standard).toContain('Eyebrows and kickers are optional');
  });

  it('flags presenter-style reading instructions when they are promoted into headings', () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'audience-copy-presenter-'));
    try {
      const sample = path.join(tmpRoot, 'src', 'components');
      fs.mkdirSync(sample, { recursive: true });
      fs.writeFileSync(path.join(sample, 'Presenter.astro'), '<h2>三个研究问题怎样连起来</h2>\n<p>三个研究问题怎样连起来，可以在正文解释。</p>\n');
      const findings = scanAudienceCopy(tmpRoot).filter((finding) => finding.ruleId === 'COPY-PRESENTER-HEADING');
      expect(findings).toHaveLength(1);
      expect(findings[0]?.snippet).toContain('三个研究问题怎样连起来');
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('flags narrative fork packaging and static English-only eyebrows as review candidates', () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'audience-copy-fork-'));
    try {
      const sample = path.join(tmpRoot, 'src', 'components');
      fs.mkdirSync(sample, { recursive: true });
      fs.writeFileSync(path.join(sample, 'Fork.astro'), '<div eyebrow="HISTORICAL MAP · FIRST RUN"><h2>7B 与 3B 的分岔</h2></div>\n');
      const findings = scanAudienceCopy(tmpRoot);
      expect(findings.some((finding) => finding.ruleId === 'COPY-NARRATIVE-FORK')).toBe(true);
      expect(findings.some((finding) => finding.ruleId === 'COPY-STATIC-ENGLISH-EYEBROW')).toBe(true);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
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

  it('still flags a bare Chinese surface that exposes an unexplained full English sentence', () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'audience-copy-'));
    try {
      const sample = path.join(tmpRoot, 'src');
      fs.mkdirSync(path.join(sample, 'components'), { recursive: true });
      fs.writeFileSync(path.join(sample, 'components', 'Mixed.astro'), '<p>中文段落 English sentence. Followed by another full sentence.</p>\n');
      const findings = scanAudienceCopy(tmpRoot);
      const zhEn = findings.filter((finding) => finding.ruleId === 'COPY-ZH-EN-SENTENCE');
      expect(zhEn.length).toBeGreaterThan(0);
    } finally {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it('keeps the owner inventory connected to the scanner and representative routes', () => {
    const audit = fs.readFileSync(path.join(root, 'docs/agents/current/audience-copy-audit-2026-08-12.md'), 'utf8');
    expect(audit).toContain('Source-owner inventory');
    expect(audit).toContain('scripts/audit-audience-copy.ts');
    expect(audit).toContain('/research/seed-openevo/study/run/');
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
