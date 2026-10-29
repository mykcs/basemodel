import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { belongsToProductionProject, classifyProductionMirror, inspectProductionMirror } from '../../scripts/verify-production-identity.mjs';
const sha = 'a'.repeat(40);
const old = 'b'.repeat(40);
const deployment = { id: 1, environment: 'Production', creator: { id: 35613825 }, sha };
const status = { state: 'success', creator: { id: 35613825 }, environment_url: 'https://basemodel-preview.vercel.app' };
describe('read-only Production identity alarm', () => {
  it('pins the project as well as the Vercel bot and Production environment', () => {
    expect(belongsToProductionProject({ environment_url: 'https://basemodel-preview-abc123def-example-team.vercel.app' })).toBe(true);
    for (const environment_url of ['https://basemodel-ui-preview-abc123def-example-team.vercel.app', 'https://basemodel-preview.vercel.app.example.com', 'http://basemodel-preview.vercel.app', 'not a URL']) {
      expect(classifyProductionMirror(sha, deployment, { ...status, environment_url })).toBe('UNKNOWN');
    }
  });
  it('ignores another project reporting Production for the same repository and commit', async () => {
    const replies = [[{ ...deployment, id: 2 }, deployment],
      [{ ...status, environment_url: 'https://other-project.vercel.app' }], [status], { object: { sha } }, { object: { sha } }];
    const fetcher: typeof fetch = async () => new Response(JSON.stringify(replies.shift()), { status: 200 });
    expect((await inspectProductionMirror({ repository: 'mykcs/basemodel', token: 'test', fetcher })).deployment_id).toBe(1);
  });
  it('runs on main and Production events with read-only permissions and no new secrets', () => {
    const workflow = parse(readFileSync(new URL('../../.github/workflows/production-identity.yml', import.meta.url), 'utf8'));
    expect(Object.keys(workflow.on).sort()).toEqual(['deployment_status', 'push', 'workflow_dispatch']);
    expect(workflow.on.push.branches).toEqual(['main']);
    expect(workflow.permissions).toEqual({ contents: 'read', deployments: 'read' });
    expect(workflow.jobs.identity['timeout-minutes']).toBe(8);
    const serialized = JSON.stringify(workflow);
    expect(serialized).not.toMatch(/secrets\.|vercel deploy|git push|write-all/);
    for (const step of workflow.jobs.identity.steps) {
      if (step.uses) expect(step.uses).toMatch(/^actions\/[a-z-]+@[a-f0-9]{40}$/);
      if (step.uses?.startsWith('actions/checkout@')) expect(step.with).toEqual({ ref: 'main', 'persist-credentials': false });
    }
  });
  it('requires the precise source identity and trusted Production mirror', () => {
    expect(classifyProductionMirror(sha, deployment, status)).toBe('MIRROR_MATCH');
    expect(classifyProductionMirror(old, deployment, status)).toBe('MIRROR_MISMATCH');
    expect(classifyProductionMirror(sha, { ...deployment, environment: 'Preview' }, status)).toBe('UNKNOWN');
    expect(classifyProductionMirror(sha, { ...deployment, creator: { id: 1 } }, status)).toBe('UNKNOWN');
    expect(classifyProductionMirror(sha, deployment, { ...status, state: 'pending' })).toBe('UNKNOWN');
    expect(classifyProductionMirror(sha, null, null)).toBe('UNKNOWN');
    expect(classifyProductionMirror(old, deployment, status, ['docs/example.md'])).toBe('INTENTIONAL_NON_DEPLOY_DIFF');
    expect(classifyProductionMirror(old, deployment, status, ['src/pages/index.astro'])).toBe('MIRROR_MISMATCH');
    expect(classifyProductionMirror(old, deployment, status, Array(300).fill('docs/example.md'))).toBe('MIRROR_MISMATCH');
  });
  it('fails closed on moved main and never issues provider writes', async () => {
    const calls: string[] = [];
    const replies = [[deployment], [status], { object: { sha } }, { object: { sha: old } }];
    const fetcher: typeof fetch = async (url, options) => {
      calls.push(String(url));
      expect(options?.method).toBeUndefined();
      return new Response(JSON.stringify(replies.shift()), { status: 200 });
    };
    expect(await inspectProductionMirror({ repository: 'mykcs/basemodel', token: 'test', fetcher })).toEqual({ result: 'MAIN_MOVED', main_sha: old });
    expect(calls).toHaveLength(4);
    expect(calls.every(url => url.startsWith('https://api.github.com/repos/mykcs/basemodel/'))).toBe(true);
  });
  it('treats renamed-away production source as deploy-relevant', async () => {
    for (const previous_filename of ['src/pages/old.astro', undefined]) {
      const replies = [[{ ...deployment, sha: old }], [status], { object: { sha } },
        { status: 'ahead', merge_base_commit: { sha: old }, files: [{ filename: 'docs/old.astro', status: 'renamed', previous_filename }] },
        { object: { sha } }];
      const fetcher: typeof fetch = async () => new Response(JSON.stringify(replies.shift()), { status: 200 });
      expect((await inspectProductionMirror({ repository: 'mykcs/basemodel', token: 'test', fetcher })).result).toBe('MIRROR_MISMATCH');
    }
  });
});
