import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { shouldBuildForFiles } from './vercel-ignore-build.mjs';

// This is a read-only GitHub mirror alarm. Canonical alias/READY acceptance still
// requires a separate Vercel control-plane read; no deployment is created here.
export function belongsToProductionProject(status) {
  try {
    const url = new URL(status?.environment_url);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port
      && (url.hostname === 'basemodel-preview.vercel.app'
        || /^basemodel-preview-[a-z0-9]{9}-[a-z0-9-]+\.vercel\.app$/.test(url.hostname));
  } catch { return false; }
}

export function classifyProductionMirror(mainSha, deployment, status, filesSinceProduction) {
  if (!/^[a-f0-9]{40}$/.test(mainSha ?? '') || !deployment || !status) return 'UNKNOWN';
  if (deployment.environment !== 'Production' || deployment.creator?.id !== 35613825
    || status.creator?.id !== 35613825 || status.state !== 'success' || !belongsToProductionProject(status)) return 'UNKNOWN';
  if (!/^[a-f0-9]{40}$/.test(deployment.sha ?? '')) return 'UNKNOWN';
  if (deployment.sha === mainSha) return 'MIRROR_MATCH';
  if (Array.isArray(filesSinceProduction) && filesSinceProduction.length > 0
    && filesSinceProduction.length < 300 && !shouldBuildForFiles(filesSinceProduction)) return 'INTENTIONAL_NON_DEPLOY_DIFF';
  return 'MIRROR_MISMATCH';
}

export async function inspectProductionMirror({ repository, token, fetcher = fetch }) {
  if (repository !== 'mykcs/basemodel' || !token) throw new Error('Exact repository and an existing read-only GitHub token are required');
  const api = async path => {
    const response = await fetcher(`https://api.github.com/repos/${repository}/${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`GitHub mirror read failed: HTTP ${response.status}`);
    return response.json();
  };
  const deployments = await api('deployments?environment=Production&per_page=100');
  let production;
  let status;
  // Bound reads; absent evidence is UNKNOWN, never an old Preview or a green badge.
  for (const candidate of deployments.filter(d => d.environment === 'Production' && d.creator?.id === 35613825).slice(0, 10)) {
    const statuses = await api(`deployments/${candidate.id}/statuses?per_page=1`);
    if (statuses[0]?.state === 'success' && statuses[0]?.creator?.id === 35613825 && belongsToProductionProject(statuses[0])) {
      production = candidate;
      status = statuses[0];
      break;
    }
  }
  const main = await api('git/ref/heads/main');
  const mainSha = main.object.sha;
  let files;
  if (production && production.sha !== mainSha) {
    const comparison = await api(`compare/${production.sha}...${mainSha}?per_page=100`);
    if (comparison.status === 'ahead' && comparison.merge_base_commit?.sha === production.sha
      && Array.isArray(comparison.files) && comparison.files.length < 300
      && comparison.files.every(file => file.status !== 'renamed' || file.previous_filename)) {
      files = comparison.files.flatMap(file => file.previous_filename ? [file.filename, file.previous_filename] : [file.filename]);
    }
  }
  // A merge may be superseded while the alarm is reading. Never compare an old
  // event SHA to a newer Production deployment; classify only a stable live main.
  const refreshed = await api('git/ref/heads/main');
  if (refreshed.object.sha !== mainSha) return { result: 'MAIN_MOVED', main_sha: refreshed.object.sha };
  return { result: classifyProductionMirror(mainSha, production, status, files), main_sha: mainSha,
    mirrored_production_sha: production?.sha ?? null, deployment_id: production?.id ?? null,
    evidence: 'GitHub Vercel-bot deployment/status mirror; canonical alias and provider READY require separate Vercel verification' };
}

async function main() {
  const attempts = Number(process.env.PRODUCTION_IDENTITY_ATTEMPTS ?? 1);
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > 20) throw new Error('Attempts must be between 1 and 20');
  let observation;
  for (let i = 0; i < attempts; i++) {
    observation = await inspectProductionMirror({ repository: process.env.GITHUB_REPOSITORY, token: process.env.GITHUB_TOKEN });
    console.log(JSON.stringify(observation));
    if (['MIRROR_MATCH', 'INTENTIONAL_NON_DEPLOY_DIFF'].includes(observation.result)) break;
    if (i < attempts - 1) await new Promise(resolve => setTimeout(resolve, 15000));
  }
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `Production identity: **${observation.result}**\n\nLive main: ${observation.main_sha}\n\nMirrored Production: ${observation.mirrored_production_sha ?? 'unknown'}\n\nRead-only alarm; no deployment or billing action. Verify the Vercel canonical alias before claiming a release. On mismatch, follow deployment-policy.md and issue #964; inspect existing jobs before any authorized recovery.\n`);
  if (!['MIRROR_MATCH', 'INTENTIONAL_NON_DEPLOY_DIFF'].includes(observation.result)) {
    console.error('::error::Production identity is mismatched or unverified. Inspect Vercel existing jobs and canonical alias; use the approved exact-main recovery only after preventing duplicate builds. See issue #964.');
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => { console.error('Production identity UNKNOWN: read failed; no recovery deployment was attempted.'); process.exitCode = 1; });
}
