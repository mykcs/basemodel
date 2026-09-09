import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const BUILD_RELEVANT_PREFIXES = ['src/', 'public/', 'scripts/'];
const NON_DEPLOY_TEST_FILE = /(?:^|\/)[^/]+\.(?:test|spec)\.[cm]?[jt]sx?$/;
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

export function mustRunAcceptanceBuild(env) {
  // Any explicitly triggered Preview fails open into real provider acceptance because PR identity is not reliable at the Ignored Build Step boundary.
  return env.VERCEL_ENV === 'preview';
}

export function isBuildRelevantPath(filePath) {
  if (filePath.startsWith('tests/') || NON_DEPLOY_TEST_FILE.test(filePath)) return false;
  return (
    BUILD_RELEVANT_PREFIXES.some((prefix) => filePath.startsWith(prefix)) ||
    BUILD_RELEVANT_FILES.has(filePath) ||
    BUILD_RELEVANT_CONFIG.some((pattern) => pattern.test(filePath))
  );
}

export function shouldBuildForFiles(filePaths) {
  return filePaths.some(isBuildRelevantPath);
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
    const { base, head } = resolveRange(env);
    runGit(['cat-file', '-e', `${base}^{commit}`]);
    runGit(['cat-file', '-e', `${head}^{commit}`]);

    const previewAcceptance = mustRunAcceptanceBuild(env);
    if (previewAcceptance) {
      console.log(
        '[vercel-ignore-build] Triggered Preview cannot be safely skipped before PR identity is proven; running verify:deploy.',
      );
    }

    const output = runGit(['diff', '--name-only', '--no-renames', base, head]);
    const changedFiles = output ? output.split('\n').filter(Boolean) : [];
    const relevantFiles = changedFiles.filter(isBuildRelevantPath);

    if (relevantFiles.length === 0) {
      if (previewAcceptance) {
        console.log(
          '[vercel-ignore-build] Preview acceptance still runs verify:deploy for a docs/governance-only diff; this produces acceptance evidence but never changes Production.',
        );
        process.exitCode = 1;
        return;
      }
      console.log(
        '[vercel-ignore-build] Proven Git range has no deploy-relevant changes; skip this main/Production build.',
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
