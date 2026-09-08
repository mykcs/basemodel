import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  isBuildRelevantPath,
  mustRunAcceptanceBuild,
  shouldBuildForFiles,
} from '../../scripts/vercel-ignore-build.mjs';

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const vercel = JSON.parse(read('vercel.json')) as {
  ignoreCommand?: string;
  git?: { deploymentEnabled?: Record<string, boolean> };
  github?: { autoJobCancelation?: boolean };
};
const root = read('AGENTS.md');
const latest = read('docs/agents/LATEST.md');
const deploymentPolicy = read('docs/agents/current/deployment-policy.md');
const vercelWorkflow = read('docs/agents/current/vercel-preview-migration-plan.md');
const ignoreBuildScript = read('scripts/vercel-ignore-build.mjs');

describe('Vercel build-budget contract', () => {
  it('keeps automatic cancellation and the repository-owned ignored-build step enabled', () => {
    expect(vercel.github?.autoJobCancelation).toBe(true);
    expect(vercel.ignoreCommand).toBe('node scripts/vercel-ignore-build.mjs');
  });

  it('fails open to real acceptance for every triggered gate Preview', () => {
    expect(mustRunAcceptanceBuild({ VERCEL_ENV: 'preview' })).toBe(true);
    expect(mustRunAcceptanceBuild({ VERCEL_ENV: 'preview', VERCEL_GIT_PULL_REQUEST_ID: '563' })).toBe(true);
    expect(mustRunAcceptanceBuild({ VERCEL_ENV: 'production' })).toBe(false);
  });

  it('spends hosted Preview compute only on explicit exact-SHA gate refs', () => {
    const enabled = vercel.git?.deploymentEnabled ?? {};
    expect(enabled['*']).toBe(false);
    expect(enabled['**/*']).toBe(false);
    expect(enabled.main).toBe(true);
    expect(enabled['ci/vercel-gate-*']).toBe(true);
    expect(enabled['research/**']).toBeUndefined();
    expect(enabled['agent/semantic-release-*']).toBeUndefined();
  });

  it('builds for deploy-relevant source and configuration', () => {
    for (const filePath of [
      'src/pages/index.astro',
      'public/favicon.svg',
      'scripts/audit.ts',
      'package.json',
      'package-lock.json',
      'astro.config.mjs',
      'playwright.config.ts',
      'vitest.config.ts',
      'tsconfig.json',
      '.node-version',
      'vercel.json',
      'wrangler.jsonc',
    ]) {
      expect(isBuildRelevantPath(filePath), filePath).toBe(true);
    }
  });

  it('skips repository governance and prose-only changes', () => {
    for (const filePath of [
      'AGENTS.md',
      'README.md',
      'docs/agents/LATEST.md',
      'docs/agents/current/deployment-policy.md',
      '.github/pull_request_template.md',
    ]) {
      expect(isBuildRelevantPath(filePath), filePath).toBe(false);
    }
    expect(shouldBuildForFiles(['README.md', 'docs/agents/current/example.md'])).toBe(false);
    expect(shouldBuildForFiles(['AGENTS.md', 'docs/README.md', 'docs/agents/README.md', 'docs/agents/current/deployment-policy.md'])).toBe(false);
    expect(root).toContain('unique repository-root Agent bootstrap authority');
    expect(isBuildRelevantPath('src/lib/deploymentArchitecture.test.ts')).toBe(false);
    expect(isBuildRelevantPath('src/components/example.spec.tsx')).toBe(false);
    expect(isBuildRelevantPath('src/lib/example.test.mts')).toBe(false);
    expect(isBuildRelevantPath('tests/e2e/home.spec.ts')).toBe(false);
    expect(shouldBuildForFiles(['.github/runner/Dockerfile', 'src/lib/deploymentArchitecture.test.ts'])).toBe(false);
    expect(shouldBuildForFiles(['README.md', 'src/pages/index.astro'])).toBe(true);
  });

  it('keeps the Agent push/build budget discoverable and concrete in the current policy owner', () => {
    for (const token of [
      'Vercel build-budget discipline',
      'one coherent branch/PR',
      'ordinary pushes spend zero Vercel build compute',
      'persistent `ci/vercel-gate-current` ref',
      'creating a new gate alias directly at an already-existing SHA may not emit the Git push event',
      'at most one corrective gate Preview',
      'one Production build per accepted release batch',
      'Sequential Contents API writes',
      'Git data API multi-file commit',
      'deployment triggers separately as `READY`, `ERROR`, `CANCELED`',
    ]) {
      expect(deploymentPolicy).toContain(token);
    }
    expect(latest).toContain('current/deployment-policy.md');
    expect(vercelWorkflow).toContain('The main saving comes from reducing pushes');
    expect(vercelWorkflow).toContain('VERCEL_GIT_PREVIOUS_SHA');
  });

  it('makes ordinary deployment reporting Vercel-first', () => {
    expect(root).toContain('Vercel is the only ordinary deployment provider');
    expect(root).toContain('persistent `ci/vercel-gate-current` ref');
    expect(root).not.toContain('Open PRs automatically enter the Vercel acceptance path');
    expect(root).toContain('Ordinary completion reports are **Vercel-first**');
    expect(latest).toContain('Vercel is the ordinary CI and deployment authority');
    expect(deploymentPolicy).toContain('Vercel-first completion report');
    expect(deploymentPolicy).toContain('Do not include Cloudflare in an ordinary completion report');
    expect(vercelWorkflow).toContain('Historical providers are not ordinary report dimensions');
  });

  it('keeps docs-only Production skipped while forcing final gate verification through Vercel', () => {
    expect(shouldBuildForFiles(['README.md', 'docs/agents/current/example.md', 'AGENTS.md'])).toBe(false);
    expect(ignoreBuildScript).toContain('mustRunAcceptanceBuild');
    expect(ignoreBuildScript).not.toContain('VERCEL_GIT_PULL_REQUEST_ID');
    expect(ignoreBuildScript).toContain('Preview acceptance still runs verify:deploy');
    expect(ignoreBuildScript).toContain('VERCEL_ENV');
    expect(deploymentPolicy).toContain('docs/governance-only final candidate');
    expect(deploymentPolicy).toContain('must not publish a Production build');
  });
});
