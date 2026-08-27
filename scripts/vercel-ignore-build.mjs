import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const BUILD_RELEVANT_PREFIXES = ['src/', 'public/', 'scripts/', 'tests/'];
const BUILD_RELEVANT_FILES = new Set([
  '.node-version',
  'package-lock.json',
  'package.json',
  'vercel.json',
  'wrangler.jsonc',
]);
const BUILD_RELEVANT_CONFIG = [
  /^(?:astro|playwright|vitest)\.config\.[cm]?[jt]s$/,
  /^tsconfig(?:\.[^/]+)?\.json$/,
];

export function isBuildRelevantPath(filePath) {
  return (
    BUILD_RELEVANT_PREFIXES.some((prefix) => filePath.startsWith(prefix)) ||
    BUILD_RELEVANT_FILES.has(filePath) ||
    BUILD_RELEVANT_CONFIG.some((pattern) => pattern.test(filePath))
  );
}

export function shouldBuildForFiles(filePaths) {
  return filePaths.some(isBuildRelevantPath);
}

export function mustRunAcceptanceBuild(env = process.env) {
  const deploymentEnv = env.VERCEL_ENV?.trim();
  const pullRequestId = env.VERCEL_GIT_PULL_REQUEST_ID?.trim();
  const gitRef = env.VERCEL_GIT_COMMIT_REF?.trim();

  // PR previews and Production are acceptance surfaces, not build-budget hints.
  // VERCEL_GIT_PREVIOUS_SHA may point at a failed predecessor, so a prose-only
  // follow-up must not skip the first READY artifact for the current source.
  return deploymentEnv === 'production' || Boolean(pullRequestId) || gitRef === 'main';
}

function runGit(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function resolveRange(env) {
  const head = env.VERCEL_GIT_COMMIT_SHA?.trim() || 'HEAD';
  const previous = env.VERCEL_GIT_PREVIOUS_SHA?.trim();

  if (previous && previous !== head) return { base: previous, head };
  return { base: `${head}^`, head };
}

export function main(env = process.env) {
  try {
    if (mustRunAcceptanceBuild(env)) {
      console.log('[vercel-ignore-build] Acceptance surface detected (PR/main/production); running the build fail-closed.');
      process.exitCode = 1;
      return;
    }

    const { base, head } = resolveRange(env);
    runGit(['cat-file', '-e', `${base}^{commit}`]);
    runGit(['cat-file', '-e', `${head}^{commit}`]);

    const output = runGit(['diff', '--name-only', '--no-renames', base, head]);
    const changedFiles = output ? output.split('\n').filter(Boolean) : [];
    const relevantFiles = changedFiles.filter(isBuildRelevantPath);

    if (relevantFiles.length === 0) {
      console.log(
        '[vercel-ignore-build] Non-acceptance preview has no deploy-relevant changes in the proven Git range; skip this build.',
      );
      process.exitCode = 0;
      return;
    }

    console.log('[vercel-ignore-build] Build required for:');
    for (const filePath of relevantFiles) console.log(`- ${filePath}`);
    process.exitCode = 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `[vercel-ignore-build] Could not prove that this deployment is safe to skip (${message}). Running the build.`,
    );
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(invokedPath).href) main();
