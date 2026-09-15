import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const workflow = read('.github/workflows/public-pr-ci.yml');
const reviewWorkflow = read('.github/workflows/review-preview.yml');
const planner = read('scripts/vercel-ui-plan.ts');
const ciUiGate = read('scripts/ci-ui-gate.mjs');

describe('public GitHub Actions PR preflight', () => {
  it('uses a read-only pull_request workflow with exact-head binding', () => {
    expect(workflow).toContain('pull_request:');
    expect(workflow).not.toContain('pull_request_target');
    expect(workflow).toContain('contents: read');
    expect(workflow).toContain('persist-credentials: false');
    expect(workflow).toContain('refs/pull/${{ github.event.pull_request.number }}/head');
    expect(workflow).toContain('git config --global --add safe.directory "$GITHUB_WORKSPACE"');
    expect(workflow).toContain('test "$(git rev-parse HEAD)" = "$CI_HEAD_SHA"');
    expect(workflow).not.toMatch(/\bsecrets\./);
  });

  it('allocates zero, one, or N independent one-worker browser runners from the shared planner', () => {
    expect(workflow).toContain('name: public-plan');
    expect(workflow).toContain("CI_FULL_BROWSER_SHARDS: '4'");
    expect(workflow).toContain('browser_total: ${{ steps.plan.outputs.browser_total }}');
    expect(workflow).toContain('shards_json: ${{ steps.plan.outputs.shards_json }}');
    expect(workflow).toContain("if: needs.plan.result == 'success' && needs.plan.outputs.browser_total != '0'");
    expect(workflow).toContain('shard: ${{ fromJSON(needs.plan.outputs.shards_json) }}');
    expect(workflow).toContain('CI_EXPECTED_UI_MODE: ${{ needs.plan.outputs.mode }}');
    expect(workflow).toContain("PLAYWRIGHT_WORKERS: '1'");
    expect(workflow).toContain('image: mcr.microsoft.com/playwright:v1.62.1-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e');
    expect(workflow).toContain('PLAYWRIGHT_BROWSERS_PATH: /ms-playwright');
    expect(workflow).toContain('node scripts/ci-public-plan.mjs --github-output');
    expect(workflow).toContain('node scripts/ci-ui-gate.mjs');
    expect(workflow).toContain('name: public-ci-gate');
    expect(workflow).toContain('cancel-in-progress: true');
  });

  it('keeps fast human review off the Mac and splits untrusted build from secret-bearing deploy', () => {
    expect(reviewWorkflow).toContain('workflow_dispatch:');
    expect(reviewWorkflow).toContain("if: github.ref == 'refs/heads/main'");
    expect(reviewWorkflow).toContain('persist-credentials: false');
    expect(reviewWorkflow).toContain('PUBLIC_SEARCH_INDEXING: disabled');
    expect(reviewWorkflow).toContain('actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02');
    expect(reviewWorkflow).toContain('actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093');
    expect(reviewWorkflow).toContain('BASEMODEL_REVIEW_VERCEL_TOKEN');
    expect(reviewWorkflow).toContain('BASEMODEL_REVIEW_VERCEL_PROJECT_ID');
    expect(reviewWorkflow).toContain('BASEMODEL_REVIEW_VERCEL_TEAM_ID');
    const buildSection = reviewWorkflow.split('  build:')[1]?.split('  deploy:')[0] ?? '';
    const deploySection = reviewWorkflow.split('  deploy:')[1] ?? '';
    expect(buildSection).not.toMatch(/secrets\./);
    expect(deploySection).not.toContain('actions/checkout@');
    expect(deploySection).toContain('vercel@59.17.0 deploy --prebuilt');
  });

  it('pins third-party actions and self-protects CI changes as full browser risk', () => {
    expect(workflow).toContain('actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1');
    expect(workflow).toContain('actions/setup-node@820762786026740c76f36085b0efc47a31fe5020');
    expect(planner).toContain("'.github/workflows/public-pr-ci.yml'");
    expect(planner).toContain("'.github/workflows/review-preview.yml'");
    expect(planner).toContain("'scripts/ci-public-plan.mjs'");
    expect(ciUiGate).toContain("file === '.github/workflows/public-pr-ci.yml'");
    expect(ciUiGate).toContain("file === '.github/workflows/review-preview.yml'");
    expect(ciUiGate).toContain("file === 'scripts/ci-public-plan.mjs'");
  });
});
