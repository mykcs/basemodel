import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseProtectedVercelUrl } from './verify-vercel-auth.mjs';

/** Never promote a CLI artifact on URL/READY alone. Require real provider project + Git source identity. */
export async function verifyVercelDeployment({
  url, token, projectId, teamId, sha, expectedDeploymentId,
  fetchImpl = fetch,
}) {
  const origin = parseProtectedVercelUrl(url);
  if (!token || !/^prj_[A-Za-z0-9]+$/.test(projectId ?? '')
    || !/^team_[A-Za-z0-9]+$/.test(teamId ?? '') || !/^[0-9a-f]{40}$/.test(sha ?? '')) {
    throw new Error('Protected Vercel token, project, team and exact expected Git SHA are required');
  }
  const api = new URL(`https://api.vercel.com/v13/deployments/${encodeURIComponent(origin.hostname)}`);
  api.searchParams.set('teamId', teamId);
  api.searchParams.set('withGitRepoInfo', 'true');
  const response = await fetchImpl(api, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Vercel deployment identity could not be read: HTTP ${response.status}`);
  const candidate = await response.json();
  if (candidate.projectId !== projectId || candidate.readyState !== 'READY'
    || candidate.target !== 'production'
    || !/^dpl_[A-Za-z0-9]+$/.test(candidate.uid ?? '')) {
    throw new Error('Vercel deployment does not belong to the configured READY Production project');
  }
  if (expectedDeploymentId && candidate.uid !== expectedDeploymentId) {
    throw new Error('Canonical alias does not resolve to the exact staged deployment');
  }
  const claimedShas = [
    candidate.meta?.githubCommitSha,
    candidate.gitSource?.sha,
    candidate.gitSource?.commitSha,
  ].filter(Boolean);
  if (claimedShas.length === 0 || claimedShas.some((actual) => actual !== sha)) {
    throw new Error('FAIL CLOSED: Vercel has not proven the exact source Git SHA');
  }
  if (candidate.meta?.githubRepo && candidate.meta.githubRepo !== 'basemodel') {
    throw new Error('Vercel source repository mismatch');
  }
  if (candidate.meta?.githubOrg && candidate.meta.githubOrg !== 'mykcs') {
    throw new Error('Vercel source owner mismatch');
  }
  return { id: candidate.uid, sha };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyVercelDeployment({
    url: process.env.VERCEL_DEPLOYMENT_LOOKUP_URL,
    token: process.env.VERCEL_TOKEN,
    projectId: process.env.RELEASE_PROJECT_ID,
    teamId: process.env.RELEASE_TEAM_ID,
    sha: process.env.EXPECTED_SHA,
    expectedDeploymentId: process.env.EXPECTED_DEPLOYMENT_ID,
  }).then(({ id, sha }) => {
    if (process.argv.includes('--github-output')) {
      if (!process.env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT not available');
      appendFileSync(process.env.GITHUB_OUTPUT, `id=${id}\n`);
    }
    console.log(`Vercel Production identity PASS: ${id}, exact source ${sha}`);
  }).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
