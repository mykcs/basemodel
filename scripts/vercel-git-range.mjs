import { execFileSync } from 'node:child_process';

export const VERCEL_FINAL_GATE_REF = 'ci/vercel-gate-final';
export const VERCEL_FINAL_BASE_REF = 'ci/vercel-gate-base';

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function normalizePath(file) {
  return file.replaceAll('\\', '/').replace(/^\.\//, '');
}

export function parseLsRemote(output, ref) {
  const line = output.split(/\r?\n/).find((entry) => entry.endsWith(`\t${ref}`));
  const sha = line?.split(/\s+/)[0] ?? '';
  if (!/^[0-9a-f]{40}$/.test(sha)) {
    throw new Error(`could not resolve remote ref ${ref}`);
  }
  return sha;
}

function remoteSha(ref) {
  return parseLsRemote(git(['ls-remote', 'origin', ref]), ref);
}

function persistentGateBase(head) {
  const liveMainRef = 'refs/heads/main';
  const gateBaseRef = `refs/heads/${VERCEL_FINAL_BASE_REF}`;
  const liveMain = remoteSha(liveMainRef);
  const gateBase = remoteSha(gateBaseRef);
  if (gateBase !== liveMain) {
    throw new Error(`persistent gate base is stale: ${gateBase} != live main ${liveMain}`);
  }
  git([
    'fetch', '--no-tags', '--depth=1', 'origin',
    `${gateBaseRef}:refs/remotes/origin/${VERCEL_FINAL_BASE_REF}`,
  ]);
  git(['cat-file', '-e', `${gateBase}^{commit}`]);
  git(['cat-file', '-e', `${head}^{commit}`]);
  return gateBase;
}

export function resolveVercelComparisonRange(env = process.env) {
  const head = env.VERCEL_GIT_COMMIT_SHA?.trim() || 'HEAD';
  const branch = env.VERCEL_GIT_COMMIT_REF?.trim() || '';
  const persistentGatePreview = env.VERCEL_ENV === 'preview' && branch === VERCEL_FINAL_GATE_REF;

  if (persistentGatePreview) {
    return { base: persistentGateBase(head), head, source: 'persistent-gate-base' };
  }

  const previous = env.VERCEL_GIT_PREVIOUS_SHA?.trim();
  const pullRequestPreview = env.VERCEL_ENV === 'preview' && Boolean(env.VERCEL_GIT_PULL_REQUEST_ID?.trim());
  if (pullRequestPreview && (!previous || previous === head)) {
    throw new Error('first PR Preview has no previous accepted Vercel SHA; require the complete browser matrix');
  }
  const base = previous && previous !== head ? previous : `${head}^`;
  git(['cat-file', '-e', `${base}^{commit}`]);
  git(['cat-file', '-e', `${head}^{commit}`]);
  return { base, head, source: previous && previous !== head ? 'vercel-previous-sha' : 'parent-fallback' };
}

export function changedFilesForVercel(env = process.env) {
  const { base, head } = resolveVercelComparisonRange(env);
  const output = git(['diff', '--name-only', '--no-renames', base, head]);
  return output ? output.split(/\r?\n/).map(normalizePath).filter(Boolean) : [];
}
