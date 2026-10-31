import assert from 'node:assert/strict';
import { test } from 'node:test';
import { verifyVercelDeployment } from './verify-vercel-deployment.mjs';

const sha = 'a'.repeat(40);
const config = {
  url: 'https://basemodel-preview-abcdef123-example-team.vercel.app/',
  token: 'private-test-token', projectId: 'prj_verified', teamId: 'team_verified', sha,
};
const deployment = {
  uid: 'dpl_verified', projectId: config.projectId, target: 'production',
  readyState: 'READY', meta: { githubCommitSha: sha, githubRepo: 'basemodel', githubOrg: 'mykcs' },
};
const read = (payload = deployment, status = 200) => async (url, options) => {
  assert.equal(url.hostname, 'api.vercel.com');
  assert.equal(url.searchParams.get('teamId'), config.teamId);
  assert.equal(url.searchParams.get('withGitRepoInfo'), 'true');
  assert.equal(options.headers.Authorization, 'Bearer private-test-token');
  return { ok: status === 200, status, json: async () => payload };
};

test('requires exact Vercel project + READY production + source identity', async () => {
  assert.deepEqual(await verifyVercelDeployment({ ...config, fetchImpl: read() }), { id: 'dpl_verified', sha });
  assert.deepEqual(await verifyVercelDeployment({ ...config, url: 'https://basemodel-preview.vercel.app/',
    expectedDeploymentId: 'dpl_verified', fetchImpl: read() }), { id: 'dpl_verified', sha });
  await assert.rejects(() => verifyVercelDeployment({ ...config, fetchImpl: read(deployment, 403) }), /HTTP 403/);
  for (const bad of [
    { projectId: 'prj_wrong' }, { readyState: 'ERROR' }, { target: 'preview' },
    { meta: {} }, { meta: { githubCommitSha: 'b'.repeat(40) } },
    { meta: { ...deployment.meta, githubOrg: 'other' } },
    { gitSource: { sha: 'b'.repeat(40) } },
  ]) await assert.rejects(() => verifyVercelDeployment({ ...config, fetchImpl: read({ ...deployment, ...bad }) }));
  await assert.rejects(() => verifyVercelDeployment({ ...config, expectedDeploymentId: 'dpl_other', fetchImpl: read() }), /alias/);
});
