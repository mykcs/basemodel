/**
 * GitHub Actions artifact listings are eventually consistent. Immediately after
 * upload-artifact succeeds, download-artifact(artifact-ids) can still fail to
 * discover that exact ID. Wait for run-level listing visibility, then allow the
 * pinned download action and byte-for-byte verifier to do the real acceptance.
 *
 * No artifact bytes or GitHub credentials are logged.
 */
import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

export function positiveArtifactId(value) {
  const id = typeof value === 'number' ? value : Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Invalid positive artifact ID');
  return id;
}

export async function waitForArtifactIndex({
  artifactId,
  listArtifacts,
  delay = sleep,
  attempts = 15,
  delayMs = 3000,
}) {
  const wanted = positiveArtifactId(artifactId);
  if (typeof listArtifacts !== 'function' || typeof delay !== 'function' ||
      !Number.isInteger(attempts) || attempts < 1 ||
      !Number.isInteger(delayMs) || delayMs < 0) throw new Error('Invalid artifact visibility probe');

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const artifacts = await listArtifacts();
    if (!Array.isArray(artifacts)) throw new Error('GitHub artifact listing must contain an array');
    if (artifacts.some(artifact => artifact?.id === wanted)) return { artifactId: wanted, attempt };
    if (attempt !== attempts) await delay(delayMs);
  }
  throw new Error('Uploaded evidence artifact ID is not discoverable after bounded retries');
}

export async function main(env = process.env, httpFetch = fetch, delay = sleep) {
  const repo = env.GITHUB_REPOSITORY;
  const runId = env.GITHUB_RUN_ID;
  const token = env.GH_TOKEN;
  const wanted = positiveArtifactId(env.FIGURE_ACCEPTED_ARTIFACT_ID);
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo ?? '') ||
      !/^[1-9][0-9]*$/.test(runId ?? '') || !token) {
    throw new Error('Missing scoped GitHub run identity or read-only artifact token');
  }
  const endpoint = `https://api.github.com/repos/${repo}/actions/runs/${runId}/artifacts?per_page=100`;
  const listArtifacts = async () => {
    const response = await httpFetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!response.ok) throw new Error(`GitHub artifact index returned HTTP ${response.status}`);
    const body = await response.json();
    if (body.total_count > 100) throw new Error('Artifact index exceeds single-page verified bound');
    return body.artifacts;
  };
  const result = await waitForArtifactIndex({
    artifactId: wanted, listArtifacts, delay,
    attempts: 15, delayMs: 3000,
  });
  console.log(`Cloud evidence artifact ID indexed on attempt ${result.attempt}`);
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
