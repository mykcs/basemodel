import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

export const BUILD_ARTIFACT_SCHEMA_VERSION = 1;
export const DEFAULT_ARTIFACT_ROOT = 'dist';
export const DEFAULT_MANIFEST_PATH = 'ci-public-build-manifest.json';
export const PUBLIC_BUILD_ENV_KEYS = [
  'PUBLIC_SITE_URL',
  'PUBLIC_SEARCH_INDEXING',
  'PUBLIC_BUILD_SHA',
  'VERCEL_ENV',
  'CF_PAGES',
  'CF_PAGES_BRANCH',
];

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const sha256File = (path) => sha256(readFileSync(path));
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const commandVersion = (command, args = ['--version']) => execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const posixPath = (value) => value.split(sep).join('/');

export function normalizedBuildEnvironment(env = process.env) {
  return Object.fromEntries(PUBLIC_BUILD_ENV_KEYS.map((key) => [key, env[key] ?? null]));
}

export function packageVersionFromLock(lock, packageName) {
  const entry = lock?.packages?.[`node_modules/${packageName}`];
  if (!entry?.version || typeof entry.version !== 'string') {
    throw new Error(`package-lock.json does not contain node_modules/${packageName} version`);
  }
  return entry.version;
}

function collectFilesRecursive(root, current = root, output = []) {
  for (const name of readdirSync(current).sort()) {
    const absolute = join(current, name);
    const stat = lstatSync(absolute);
    if (stat.isSymbolicLink()) throw new Error(`artifact root contains unsupported symlink: ${posixPath(relative(root, absolute))}`);
    if (stat.isDirectory()) {
      collectFilesRecursive(root, absolute, output);
      continue;
    }
    if (!stat.isFile()) throw new Error(`artifact root contains unsupported entry: ${posixPath(relative(root, absolute))}`);
    output.push({
      path: posixPath(relative(root, absolute)),
      size: stat.size,
      sha256: sha256File(absolute),
    });
  }
  return output;
}

export function collectArtifactFiles(rootPath) {
  const root = resolve(rootPath);
  const rootStat = lstatSync(root);
  if (!rootStat.isDirectory()) throw new Error(`artifact root is not a directory: ${rootPath}`);
  const files = collectFilesRecursive(root);
  if (files.length === 0) throw new Error(`artifact root contains no files: ${rootPath}`);
  return files;
}

export function artifactFilesDigest(files) {
  const canonical = files.map(({ path, size, sha256: fileHash }) => `${path}\0${size}\0${fileHash}`).join('\n');
  return sha256(canonical);
}

export function currentRepositoryIdentity(env = process.env) {
  const trackedStatus = git('status', '--porcelain', '--untracked-files=no');
  if (trackedStatus) throw new Error(`tracked worktree must be clean before artifact sealing/verification: ${trackedStatus.split(/\r?\n/)[0]}`);
  const expectedHead = env.CI_HEAD_SHA?.trim();
  const expectedBase = env.CI_BASE_SHA?.trim();
  if (!expectedHead) throw new Error('CI_HEAD_SHA is required');
  if (!expectedBase) throw new Error('CI_BASE_SHA is required');

  const head = git('rev-parse', 'HEAD');
  if (head !== expectedHead) throw new Error(`HEAD mismatch: expected ${expectedHead}, got ${head}`);
  try {
    git('cat-file', '-e', `${expectedBase}^{commit}`);
  } catch {
    throw new Error(`CI_BASE_SHA is not available as a commit: ${expectedBase}`);
  }
  return {
    head,
    base: expectedBase,
    tree: git('rev-parse', 'HEAD^{tree}'),
  };
}

export function currentToolchain() {
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  return {
    node: process.version,
    npm: commandVersion('npm'),
    playwright: packageVersionFromLock(lock, '@playwright/test'),
    astro: packageVersionFromLock(lock, 'astro'),
  };
}

export function currentSourceInputs(env = process.env) {
  return {
    packageJsonSha256: sha256File('package.json'),
    packageLockSha256: sha256File('package-lock.json'),
    buildEnvironment: normalizedBuildEnvironment(env),
  };
}

export function buildManifest({ rootPath = DEFAULT_ARTIFACT_ROOT, env = process.env } = {}) {
  const files = collectArtifactFiles(rootPath);
  return {
    schemaVersion: BUILD_ARTIFACT_SCHEMA_VERSION,
    artifactKind: 'public-static-build',
    repository: env.GITHUB_REPOSITORY ?? null,
    repositoryIdentity: currentRepositoryIdentity(env),
    toolchain: currentToolchain(),
    sourceInputs: currentSourceInputs(env),
    artifact: {
      root: posixPath(rootPath),
      fileCount: files.length,
      filesDigest: artifactFilesDigest(files),
      files,
    },
  };
}

function assertDeepEqual(label, actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} mismatch: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

export function verifyManifestShape(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new Error('manifest must be an object');
  if (manifest.schemaVersion !== BUILD_ARTIFACT_SCHEMA_VERSION) throw new Error(`unsupported manifest schemaVersion: ${manifest.schemaVersion}`);
  if (manifest.artifactKind !== 'public-static-build') throw new Error(`unsupported artifactKind: ${manifest.artifactKind}`);
  if (!manifest.repositoryIdentity || !manifest.toolchain || !manifest.sourceInputs || !manifest.artifact) throw new Error('manifest is missing required sections');
  if (!Array.isArray(manifest.artifact.files) || manifest.artifact.files.length === 0) throw new Error('manifest artifact.files must be a non-empty array');
}

export function verifyManifest(manifest, { rootPath = DEFAULT_ARTIFACT_ROOT, env = process.env } = {}) {
  verifyManifestShape(manifest);
  const repositoryIdentity = currentRepositoryIdentity(env);
  const toolchain = currentToolchain();
  const sourceInputs = currentSourceInputs(env);
  const files = collectArtifactFiles(rootPath);
  const artifact = {
    root: posixPath(rootPath),
    fileCount: files.length,
    filesDigest: artifactFilesDigest(files),
    files,
  };

  assertDeepEqual('repository identity', manifest.repositoryIdentity, repositoryIdentity);
  assertDeepEqual('toolchain', manifest.toolchain, toolchain);
  assertDeepEqual('source inputs', manifest.sourceInputs, sourceInputs);
  assertDeepEqual('artifact file inventory', manifest.artifact, artifact);
  if (manifest.repository !== (env.GITHUB_REPOSITORY ?? null)) {
    throw new Error(`repository mismatch: expected ${JSON.stringify(manifest.repository)}, got ${JSON.stringify(env.GITHUB_REPOSITORY ?? null)}`);
  }
  return { repositoryIdentity, toolchain, sourceInputs, artifact };
}

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} requires a value`);
  return value;
}

function usage() {
  console.error('Usage: node scripts/ci-build-artifact.mjs <create|verify> [--root dist] [--manifest ci-public-build-manifest.json]');
}

export function main() {
  const command = process.argv[2];
  if (!['create', 'verify'].includes(command)) {
    usage();
    process.exitCode = 2;
    return;
  }
  const rootPath = argValue('--root', DEFAULT_ARTIFACT_ROOT);
  const manifestPath = argValue('--manifest', DEFAULT_MANIFEST_PATH);

  if (command === 'create') {
    const manifest = buildManifest({ rootPath });
    mkdirSync(dirname(resolve(manifestPath)), { recursive: true });
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`[ci-build-artifact] sealed ${manifest.artifact.fileCount} files digest=${manifest.artifact.filesDigest} head=${manifest.repositoryIdentity.head}`);
    return;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const verified = verifyManifest(manifest, { rootPath });
  console.log(`[ci-build-artifact] verified ${verified.artifact.fileCount} files digest=${verified.artifact.filesDigest} head=${verified.repositoryIdentity.head}`);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(`[ci-build-artifact] FAIL: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
