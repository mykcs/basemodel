import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const workflow = read('.github/workflows/public-pr-ci.yml');
const planner = read('scripts/vercel-ui-plan.ts');
const ciUiGate = read('scripts/ci-ui-gate.mjs');

describe('public GitHub Actions PR preflight', () => {
  it('uses a read-only pull_request workflow with exact-head binding', () => {
    expect(workflow).toContain('pull_request:');
    expect(workflow).not.toContain('pull_request_target');
    expect(workflow).toContain('contents: read');
    expect(workflow).toContain('persist-credentials: false');
    expect(workflow).toContain('refs/pull/${{ github.event.pull_request.number }}/head');
    expect(workflow).toContain('test "$(git rev-parse HEAD)" = "$CI_HEAD_SHA"');
    expect(workflow).not.toMatch(/secrets\./);
  });

  it('runs four independent one-worker browser shards and one aggregate gate', () => {
    expect(workflow).toContain('shard: [1, 2, 3, 4]');
    expect(workflow).toContain("CI_BROWSER_SHARD_TOTAL: '4'");
    expect(workflow).toContain("PLAYWRIGHT_WORKERS: '1'");
    expect(workflow).toContain('node scripts/ci-ui-gate.mjs');
    expect(workflow).toContain('name: public-ci-gate');
    expect(workflow).toContain('cancel-in-progress: true');
  });

  it('pins third-party actions and self-protects CI changes as full browser risk', () => {
    expect(workflow).toContain('actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1');
    expect(workflow).toContain('actions/setup-node@820762786026740c76f36085b0efc47a31fe5020');
    expect(planner).toContain("'.github/workflows/public-pr-ci.yml'");
    expect(ciUiGate).toContain("file === '.github/workflows/public-pr-ci.yml'");
  });
});
