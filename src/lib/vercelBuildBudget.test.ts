import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  isBuildRelevantPath,
  shouldBuildForFiles,
} from '../../scripts/vercel-ignore-build.mjs';

const vercel = JSON.parse(
  readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'),
) as {
  ignoreCommand?: string;
  github?: { autoJobCancelation?: boolean };
};
const latest = readFileSync(
  new URL('../../docs/agents/LATEST.md', import.meta.url),
  'utf8',
);
const deploymentPolicy = readFileSync(
  new URL('../../docs/agents/current/deployment-policy.md', import.meta.url),
  'utf8',
);
const vercelWorkflow = readFileSync(
  new URL('../../docs/agents/current/vercel-preview-migration-plan.md', import.meta.url),
  'utf8',
);

describe('Vercel build-budget contract', () => {
  it('keeps automatic cancellation and the repository-owned ignored-build step enabled', () => {
    expect(vercel.github?.autoJobCancelation).toBe(true);
    expect(vercel.ignoreCommand).toBe('node scripts/vercel-ignore-build.mjs');
  });

  it('builds for deploy-relevant source, tests and configuration', () => {
    for (const filePath of [
      'src/pages/index.astro',
      'public/favicon.svg',
      'scripts/audit.ts',
      'tests/e2e/home.spec.ts',
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

    expect(
      shouldBuildForFiles(['README.md', 'docs/agents/current/example.md']),
    ).toBe(false);
    expect(shouldBuildForFiles(['README.md', 'src/pages/index.astro'])).toBe(
      true,
    );
  });

  it('keeps the Agent push/build budget discoverable and concrete', () => {
    for (const token of [
      'one coherent branch/PR',
      'one atomic multi-file push',
      'one initial exact-head Preview',
      'at most one corrective Preview',
      'one Production build per accepted release batch',
      'Sequential Contents API writes',
      'Vercel deployment triggers: total / READY / ERROR / CANCELED',
    ]) {
      expect(deploymentPolicy).toContain(token);
    }

    expect(latest).toContain('Vercel build budget');
    expect(latest).toContain('Git data API commit (`blob/tree/commit/ref`)');
    expect(vercelWorkflow).toContain('The main saving comes from reducing pushes');
    expect(vercelWorkflow).toContain('VERCEL_GIT_PREVIOUS_SHA');
  });
});
