import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  parseRangeEnv,
  QUALIFICATION_BRANCH_PREFIX,
  QUALIFICATION_ROLES,
  validateQualificationEnvironment,
} from '../../scripts/ci-cloudflare-qualification.mjs';

const read = (path: string) => readFileSync(resolve(path), 'utf8');

describe('Cloudflare Workers Builds qualification', () => {
  it('is qualification-only and cannot silently run on main', () => {
    expect(QUALIFICATION_BRANCH_PREFIX).toBe('ci/cloudflare-workers-builds-qualification-');
    expect([...QUALIFICATION_ROLES]).toEqual(['deterministic', 'browser-1', 'browser-2']);
    expect(() => validateQualificationEnvironment({
      WORKERS_CI: '1',
      WORKERS_CI_BRANCH: 'main',
      WORKERS_CI_COMMIT_SHA: 'a'.repeat(40),
      BASEMODEL_CLOUDFLARE_ROLE: 'deterministic',
    }, '24.18.0')).toThrow(/refuse non-qualification branch/);
  });

  it('binds execution to Workers CI, exact commit identity, explicit role, and Node 24', () => {
    const valid = {
      WORKERS_CI: '1',
      WORKERS_CI_BRANCH: `${QUALIFICATION_BRANCH_PREFIX}20260908`,
      WORKERS_CI_COMMIT_SHA: 'b'.repeat(40),
      BASEMODEL_CLOUDFLARE_ROLE: 'browser-1',
    };
    expect(validateQualificationEnvironment(valid, '24.18.0')).toMatchObject({ role: 'browser-1' });
    expect(() => validateQualificationEnvironment({ ...valid, WORKERS_CI: '0' }, '24.18.0')).toThrow(/WORKERS_CI=1/);
    expect(() => validateQualificationEnvironment({ ...valid, WORKERS_CI_COMMIT_SHA: 'HEAD' }, '24.18.0')).toThrow(/40-character Git SHA/);
    expect(() => validateQualificationEnvironment({ ...valid, BASEMODEL_CLOUDFLARE_ROLE: 'all' }, '24.18.0')).toThrow(/unsupported qualification role/);
    expect(() => validateQualificationEnvironment(valid, '22.16.0')).toThrow(/Node 24 is required/);
  });

  it('parses the exact merge-candidate identity emitted by the existing materializer', () => {
    expect(parseRangeEnv('CI_LOGICAL_EVENT=pull_request\nCI_BASE_SHA=abc\nCI_HEAD_SHA=def\nCI_SOURCE_HEAD_SHA=ghi\n')).toEqual({
      CI_LOGICAL_EVENT: 'pull_request',
      CI_BASE_SHA: 'abc',
      CI_HEAD_SHA: 'def',
      CI_SOURCE_HEAD_SHA: 'ghi',
    });
  });

  it('preserves the existing deterministic and browser contracts instead of weakening them', () => {
    const runner = read('scripts/ci-cloudflare-qualification.mjs');
    expect(runner).toContain("scripts/ci-circleci-prepare.sh");
    expect(runner).toContain("tests/ci-browser-budget.test.mjs");
    expect(runner).toContain("npm', ['run', 'verify:deploy'");
    expect(runner).toContain("npm', ['run', 'build'");
    expect(runner).toContain("CI_BROWSER_SHARD_TOTAL: '2'");
    expect(runner).toContain("PLAYWRIGHT_WORKERS: '1'");
    expect(runner).toContain("CI_UI_FORCE_FULL: '1'");
    expect(runner).toContain("CI_PLAYWRIGHT_WITH_DEPS: '1'");
  });

  it('uses isolated, unrouted Workers and a no-op provider deploy step', () => {
    for (const role of ['deterministic', 'browser-1', 'browser-2']) {
      const config = JSON.parse(read(`cloudflare/ci-qualification/${role}/wrangler.jsonc`));
      expect(config.name).toBe(`basemodel-ci-qual-${role}`);
      expect(config.workers_dev).toBe(false);
      expect(config.preview_urls).toBe(false);
      expect(config.routes).toBeUndefined();
    }
    const noop = read('scripts/ci-cloudflare-qualification-deploy-noop.mjs');
    expect(noop).toContain('deploy is intentionally a no-op');
    expect(noop).toContain('refuse deploy command on non-qualification branch');
  });
});
