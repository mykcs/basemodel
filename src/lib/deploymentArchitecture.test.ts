import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

const readText = (relativePath: string): string => readFileSync(new URL(relativePath, import.meta.url), 'utf8');
const readJson = <T>(relativePath: string): T => JSON.parse(readText(relativePath)) as T;

const allowedWorkflowFiles = [
  'cloud-figure-visual-review.yml', 'public-pr-ci.yml', 'review-preview.yml', 'self-hosted-ci.yml',
];
const assertWorkflowFiles = (files: string[]) => expect([...files].sort()).toEqual(allowedWorkflowFiles);
const assertCloudFigureSafety = (source: string) => {
  const workflow = parse(source);
  expect(Object.keys(workflow.on).sort()).toEqual(['pull_request', 'workflow_dispatch']);
  expect(workflow.permissions).toEqual({ contents: 'read' });
  expect(Object.keys(workflow.jobs)).toEqual(['preflight', 'cloud-figure-browsers', 'cloud-figure-evidence']);
  const job = workflow.jobs['cloud-figure-browsers'];
  expect(job.needs).toBe('preflight');
  expect(workflow.jobs.preflight.steps.some((step: { run?: string }) => step.run === 'npm run verify:deploy')).toBe(true);
  expect(workflow.jobs.preflight.steps.some((step: { run?: string }) => step.run === 'npm run build')).toBe(true);
  expect(job['runs-on']).toBe('ubuntu-24.04');
  expect(job.permissions).toBeUndefined();
  expect(job.environment).toBeUndefined();
  expect(job.strategy.matrix.browser).toEqual(['chromium', 'webkit']);
  expect(job.strategy.matrix.shard).toEqual([1, 2, 3, 4]);
  expect(job.outputs.sha).toBe('${{ steps.candidate.outputs.sha }}');
  const aggregate = workflow.jobs['cloud-figure-evidence'];
  expect(aggregate.needs).toEqual(['preflight', 'cloud-figure-browsers']);
  expect(aggregate.if).toBe('always()');
  expect(aggregate.strategy.matrix.browser).toEqual(['chromium', 'webkit']);
  expect(aggregate.steps.find((step: { name: string }) => step.name === 'Require every browser shard to succeed').run).toContain('full) test "$SHARD_RESULT" = success');
  expect(aggregate.permissions).toEqual({ actions: 'read', contents: 'read' });
  const indexStep = aggregate.steps.find((step: { name: string }) => step.name === 'Wait until exact evidence artifact ID is indexed by GitHub Actions');
  const downloadStep = aggregate.steps.find((step: { name: string }) => step.name === 'Download the uploaded artifact for round-trip verification');
  expect(indexStep).toBeDefined();
  expect(indexStep.env).toEqual({ GH_TOKEN: '${{ github.token }}', FIGURE_ACCEPTED_ARTIFACT_ID: '${{ steps.evidence.outputs.artifact-id }}' });
  expect(indexStep.run).toBe('node scripts/wait-for-cloud-figure-artifact.mjs');
  expect(aggregate.steps.indexOf(indexStep) + 1).toBe(aggregate.steps.indexOf(downloadStep));
  for (const [laneName, lane] of Object.entries(workflow.jobs) as [string, typeof job][]) {
    expect(lane['runs-on']).toBe('ubuntu-24.04');
    if (laneName === 'cloud-figure-evidence') {
      expect(lane.permissions).toEqual({ actions: 'read', contents: 'read' });
    } else {
      expect(lane.permissions).toBeUndefined();
    }
    expect(lane.environment).toBeUndefined();
    for (const step of lane.steps) {
      if (step.uses) expect(step.uses).toMatch(/^actions\/[a-z-]+@[a-f0-9]{40}$/);
      if (step.uses?.startsWith('actions/checkout@')) expect(step.with['persist-credentials']).toBe(false);
      if (step.uses?.startsWith('actions/upload-artifact@')) {
        expect(step.with['retention-days']).toBe(3);
        expect(step.with['if-no-files-found']).toBe('error');
      }
    }
  }
  expect(aggregate.steps.some((step: { run?: string }) => step.run === 'node scripts/verify-cloud-figure-evidence.mjs aggregate raw-shards accepted-evidence')).toBe(true);
  expect(aggregate.steps.some((step: { run?: string }) => step.run === 'node scripts/verify-cloud-figure-evidence.mjs roundtrip artifact-roundtrip')).toBe(true);
  const lock = readJson<{ packages: Record<string, { version: string }> }>('../../package-lock.json');
  expect(job.container.image).toMatch(new RegExp('^mcr\\.microsoft\\.com/playwright:v' + lock.packages['node_modules/@playwright/test']!.version.replaceAll('.', '\\.') + '-noble@sha256:[a-f0-9]{64}$'));
  const checkout = job.steps.find((step: { uses?: string }) => step.uses?.startsWith('actions/checkout@'));
  expect(checkout.with['persist-credentials']).toBe(false);
  expect(checkout.with.ref).toBe('${{ steps.candidate.outputs.sha }}');
  const upload = job.steps.find((step: { uses?: string }) => step.uses?.startsWith('actions/upload-artifact@'));
  expect(upload.if).toBe('always()');
  expect(upload.with['retention-days']).toBe(3);
  expect(upload.with['if-no-files-found']).toBe('error');
  for (const step of job.steps) {
    if (step.uses) expect(step.uses).toMatch(/^actions\/[a-z-]+@[a-f0-9]{40}$/);
  }
  // Inspect parsed values: a comment cannot satisfy a permission/trigger assertion.
  const executable = JSON.stringify(workflow);
  expect(executable).not.toMatch(/secrets\.|write-all|contents:write|vercel deploy|target=production|git push/i);
};

describe('Vercel production deployment architecture', () => {
  const workflowsDir = new URL('../../.github/workflows/', import.meta.url);
  const macFallbackWorkflow = readText('../../.github/workflows/self-hosted-ci.yml');
  const circleCiConfig = readText('../../.circleci/config.yml');
  const ciPlan = readText('../../scripts/ci-plan.mjs');
  const ciDocsContract = readText('../../scripts/ci-docs-contract.mjs');
  const headerVisibility = readText('../../tests/e2e/global-header-visibility.spec.ts');
  const runnerDockerfile = readText('../../.github/runner/Dockerfile');
  const runnerStart = readText('../../.github/runner/mac-orbstack-start.sh');
  const runnerReconcile = readText('../../.github/runner/mac-orbstack-reconcile.sh');
  const runnerHousekeeping = readText('../../.github/runner/mac-orbstack-housekeeping.sh');
  const runnerInstall = readText('../../.github/runner/mac-orbstack-install-launch-agent.sh');
  const astroConfig = readText('../../astro.config.mjs');
  const appLayout = readText('../../src/layouts/AppLayout.astro');
  const robots = readText('../../src/pages/robots.txt.ts');
  const sitemap = readText('../../src/pages/sitemap.xml.ts');
  const buildCloudflare = readText('../../scripts/build-cloudflare.mjs');
  const dependabot = readText('../../.github/dependabot.yml');
  const playwright = readText('../../playwright.config.ts');
  const ogCover = readText('../../public/og-cover.svg');
  const packageJson = readJson<{ scripts: Record<string, string> }>('../../package.json');
  const vercelConfig = readJson<{
    buildCommand?: string;
    git?: { deploymentEnabled?: Record<string, boolean> };
    github?: { autoJobCancelation?: boolean };
  }>('../../vercel.json');

  it('uses Vercel as primary CI while retaining CircleCI and Mac as manual fallbacks', () => {
    const workflowFiles = existsSync(workflowsDir) ? readdirSync(workflowsDir).filter((name) => /\.ya?ml$/i.test(name)) : [];
    assertWorkflowFiles(workflowFiles);
    expect(circleCiConfig).not.toContain('pr_cloud_ci:');
    expect(circleCiConfig).not.toContain('main_cloud_ci:');
    expect(circleCiConfig).toContain('manual_cloud_ci:');
    expect(circleCiConfig).toContain('pipeline.event.name == "api"');
    expect(circleCiConfig).toContain('browser_shard_1');
    expect(circleCiConfig).toContain('browser_shard_2');
    expect(circleCiConfig).toContain('CI_BROWSER_SHARD_TOTAL: "2"');
    expect(circleCiConfig).toContain('scripts/ci-circleci-prepare.sh');
    expect(circleCiConfig).toContain('node:24-bookworm-slim@sha256:ba849c60be29959425b8734d57b8b4b7d56f98edd9504c9af091d5281095a71e');
    expect(macFallbackWorkflow).toContain('workflow_dispatch:');
    expect(macFallbackWorkflow).not.toContain('pull_request:');
    expect(macFallbackWorkflow).not.toMatch(/\n\s*push:/);
    expect(macFallbackWorkflow).toContain('runs-on: [self-hosted, basemodel-ci]');
    expect(macFallbackWorkflow).not.toMatch(/runs-on:\s*(?:ubuntu|macos|windows)-/);
    expect(macFallbackWorkflow).toContain('persist-credentials: false');
    expect(macFallbackWorkflow).toContain("CI_UI_FORCE_FULL: '1'");
    expect(ciPlan).toContain('code, CI, config, test, asset, data, or mixed PR diff requires full validation');
    expect(ciDocsContract).toContain("git(['diff', '--check'");
    expect(ciDocsContract).toContain("git(['diff', '--name-only'");
    expect(macFallbackWorkflow).toContain("PLAYWRIGHT_WORKERS: '1'");
    expect(headerVisibility).toContain('const globalHeaderRouteShardCount = 4;');
    expect(headerVisibility).toContain('partitionRoundRobin');
    expect(macFallbackWorkflow).not.toContain('cache: npm');
    expect(runnerDockerfile).toContain('FROM node:24-bookworm-slim');
    expect(runnerDockerfile).toContain('@playwright/test@1.62.1');
    expect(runnerStart).toContain("grep -q 'AC Power'");
    expect(runnerStart).toContain('--cpus 4');
    expect(runnerStart).toContain('--memory 4g');
    expect(runnerStart).toContain('--memory-swap 8g');
    expect(runnerStart).toContain('--cap-drop ALL');
    expect(runnerStart).toContain('--log-opt max-size=20m');
    expect(runnerStart).toContain('--log-opt max-file=5');
    expect(runnerStart).toContain('--restart no');
    expect(runnerStart).toContain('docker image inspect --format');
    expect(runnerStart).toContain(".State.Health.Status");
    expect(runnerStart).not.toContain('docker exec "$container" bash -lc "ps -ef');
    expect(runnerStart).not.toContain('/var/run/docker.sock');
    expect(runnerStart).not.toMatch(/(?:^|\s)(?:-v|--volume)(?:\s|=)/m);
  });

  it('keeps the cloud figure workflow read-only, pinned and exact-head bound', () => {
    const cloud = readText('../../.github/workflows/cloud-figure-visual-review.yml');
    assertCloudFigureSafety(cloud);
    for (const command of ['test:ui', 'test:ui:all']) {
      expect(packageJson.scripts[command]).toContain('tests/e2e/advisor-figure-paper-collision.spec.ts');
      expect(packageJson.scripts[command]).toContain('tests/e2e/q17-frontier-content-first.spec.ts');
    }
    expect(readText('../../scripts/preflight-ui.ts')).toContain('q17-mobile-comparison-cell-collision');
    expect(readText('../../scripts/preflight-ui.ts')).toContain('q03-rendered-label-axis-collision');
    expect(packageJson.scripts['test:ui:all']).toContain('tests/e2e/sitewide-figure-width-scope.spec.ts');
    expect(cloud).toContain('node scripts/ci-ui-test-list.mjs timed test:ui:all ${{ matrix.browser }} ${{ matrix.shard }} 4');
    expect(cloud).toContain('npm run ui:overflow-preflight');
    expect(cloud).toContain('actions/download-artifact@37930b1c2abaa49bbe596cd826c3c89aef350131');
    expect(cloud).toContain('figure-inventory/playwright-run.json');
    expect(cloud).toContain('    timeout-minutes: 65');
    expect(cloud).toContain('--list --reporter=json');
    expect(readText('../../scripts/verify-cloud-figure-evidence.mjs')).toContain('Downloaded bytes differ:');
    expect(cloud).toContain('git config --global --add safe.directory "$GITHUB_WORKSPACE"');
    expect(cloud).not.toMatch(/safe\.directory\s+['"]?\*/);
  });

  it('rejects missing coverage, skipped cases and corrupt downloaded evidence', () => {
    for (const testPath of ['scripts/verify-cloud-figure-evidence.test.mjs', 'scripts/wait-for-cloud-figure-artifact.test.mjs']) {
      execFileSync(process.execPath, ['--test', testPath], {
        cwd: new URL('../../', import.meta.url), stdio: 'pipe',
      });
    }
  });

  it('rejects unknown workflows and unsafe cloud workflow mutations', () => {
    expect(() => assertWorkflowFiles([...allowedWorkflowFiles, 'unknown.yml'])).toThrow();
    const source = readText('../../.github/workflows/cloud-figure-visual-review.yml');
    for (const bad of [
      source.replace('  pull_request:', '  pull_request_target:'),
      source.replace('  contents: read', '  contents: write'),
      source.replace('      actions: read', '      actions: write'),
      source.replace('Wait until exact evidence artifact ID is indexed by GitHub Actions', 'Artifact visibility check absent'),
      source.replace('    runs-on: ubuntu-24.04', '    runs-on: ubuntu-24.04\n    environment: production'),
      source.replace('run: npm ci', 'run: vercel deploy --target=production'),
      source.replace('persist-credentials: false', 'persist-credentials: true'),
    ]) expect(() => assertCloudFigureSafety(bad)).toThrow();
  });

  it('reconciles runner image drift without deleting the previous container', () => {
    expect(runnerStart).toContain(`docker image inspect --format '{{.Id}}' "$image"`);
    expect(runnerStart).toContain(`docker container inspect --format '{{.Image}}' "$container"`);
    expect(runnerStart).toContain('RUNNER_CONFIG_SHA256');
    expect(runnerStart).toContain('com.mykcs.basemodel.runner-config-sha256');
    expect(runnerStart).toContain('com.mykcs.basemodel.runner-runtime-contract');
    expect(runnerStart).toContain('docker rename "$container" "$backup_container"');
    expect(runnerStart).toContain('restored independently registered legacy container');
    expect(runnerStart).toContain('docker exec -d -u runner "$legacy_container"');
    expect(runnerStart).toContain('docker update --cpus 4 --memory 4g --memory-swap 8g --pids-limit 1024');
    expect(runnerStart).toContain('runner_is_busy');
    expect(runnerStart).not.toMatch(/docker\s+(?:container\s+)?rm\b/);
  });

  it('runs the listener under the container init process and exposes a healthcheck', () => {
    const entrypointUrl = new URL('../../.github/runner/entrypoint.sh', import.meta.url);
    expect(existsSync(entrypointUrl)).toBe(true);
    const entrypoint = existsSync(entrypointUrl) ? readFileSync(entrypointUrl, 'utf8') : '';
    expect(runnerDockerfile).toContain('ENTRYPOINT ["/usr/local/bin/runner-entrypoint"]');
    expect(runnerDockerfile).toContain('HEALTHCHECK');
    expect(runnerDockerfile).not.toContain('CMD ["sleep", "infinity"]');
    expect(entrypoint).toContain('exec ./run.sh');
    expect(runnerStart).not.toContain('nohup ./run.sh');
    expect(runnerDockerfile).toContain('RUNNER_MANUALLY_TRAP_SIG=1');
    expect(runnerDockerfile).toContain('ACTIONS_RUNNER_PRINT_LOG_TO_STDOUT=1');
  });

  it('uses a user LaunchAgent as the only automatic lifecycle owner', () => {
    expect(runnerInstall).toContain('Library/LaunchAgents');
    expect(runnerInstall).toContain('Library/Application Support/BasemodelCI');
    expect(runnerInstall).toContain('label="com.mykcs.basemodel-ci-runner"');
    expect(runnerInstall).toContain("plutil -insert 'ProgramArguments.0' -string");
    expect(runnerInstall).not.toContain('plutil -insert ProgramArguments -append');
    expect(runnerInstall).toContain('$label.pending.XXXXXX")');
    expect(runnerInstall).not.toContain('$label.pending.XXXXXX.plist")');
    expect(runnerInstall).toContain('plutil -insert EnvironmentVariables -dictionary');
    expect(runnerInstall).toContain('EnvironmentVariables.PATH');
    expect(runnerInstall).toContain('/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin');
    expect(runnerInstall).toContain('plutil -insert StartInterval -integer 60');
    expect(runnerInstall).not.toContain('sudo');
    expect(runnerReconcile).toContain("grep -q 'AC Power'");
    expect(runnerReconcile).toContain('docker stop --time 30');
    expect(runnerReconcile).toContain('legacy_container="basemodel-ci-runner"');
    expect(runnerReconcile).toContain('/usr/bin/logger');
    expect(runnerReconcile).toContain('backoff_seconds=900');
    expect(runnerReconcile).toContain('disk_warning_interval=21600');
    expect(runnerReconcile).not.toContain('docker system prune');
    expect(runnerReconcile).not.toContain('pmset -a');
    expect(runnerReconcile).toContain('mac-orbstack-housekeeping.sh');
    expect(runnerInstall).toContain('mac-orbstack-housekeeping.sh');
    expect(runnerHousekeeping).toContain('container_backup_prefix="${container}-backup-"');
    expect(runnerHousekeeping).toContain('bundle_backup_prefix="libexec.backup-"');
    expect(runnerHousekeeping).toContain('docker container rm -- "$name"');
    expect(runnerHousekeeping).toContain('docker builder prune --force --max-used-space');
    expect(runnerHousekeeping).toContain('run_with_timeout');
    expect(runnerHousekeeping).toContain('CI_HOST_BUILD_CACHE_MAX_USED_SPACE:-6GB');
    expect(runnerHousekeeping).toContain('basemodel-ci');
    expect(runnerHousekeeping).toContain('openevo-mac-ci');
    expect(runnerHousekeeping).toContain('select(.status ==');
    expect(runnerHousekeeping).toContain('elif any then');
    expect(runnerHousekeeping).toContain('local_container="$3"');
    expect(runnerHousekeeping).toContain('all(.status ==');
    expect(runnerHousekeeping).toContain('offline');
    expect(runnerHousekeeping).toContain('docker container inspect --format');
    expect(runnerHousekeeping).toContain(') >/dev/null 2>&1 &');
    expect(runnerHousekeeping).not.toContain('docker system prune');
  });

  it('pins every GitHub-authored action to an immutable commit', () => {
    expect(macFallbackWorkflow).toContain('actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1');
    expect(macFallbackWorkflow).toContain('actions/setup-node@820762786026740c76f36085b0efc47a31fe5020');
    expect(macFallbackWorkflow).not.toMatch(/uses:\s+actions\/[^@\s]+@v\d+/);
  });

  it('keeps CircleCI and Mac recovery manual while preserving full fallback coverage', () => {
    expect(circleCiConfig).not.toContain('main_cloud_ci:');
    expect(circleCiConfig).not.toContain('pr_cloud_ci:');
    expect(circleCiConfig).toContain('manual_cloud_ci:');
    expect(circleCiConfig).toContain('event: api');
    expect(circleCiConfig).toContain('head_sha: << pipeline.git.revision >>');
    expect(macFallbackWorkflow).toContain('workflow_dispatch:');
    expect(macFallbackWorkflow).not.toContain('pull_request:');
    expect(macFallbackWorkflow).not.toMatch(/\n\s*push:/);
    expect(macFallbackWorkflow).toContain("CI_UI_FORCE_FULL: '1'");
    expect(ciPlan).toContain("eventName === 'push'");
    expect(ciPlan).toContain("eventName === 'workflow_dispatch'");
    expect(ciPlan).toContain("mode: 'full'");
  });

  it('cleans only the completed job workspace while preserving dependency caches', () => {
    const cleanupUrl = new URL('../../.github/runner/job-completed.sh', import.meta.url);
    expect(existsSync(cleanupUrl)).toBe(true);
    const cleanup = existsSync(cleanupUrl) ? readFileSync(cleanupUrl, 'utf8') : '';
    expect(runnerDockerfile).toContain('ACTIONS_RUNNER_HOOK_JOB_STARTED=/usr/local/bin/runner-job-completed.sh');
    expect(runnerDockerfile).toContain('ACTIONS_RUNNER_HOOK_JOB_COMPLETED=/usr/local/bin/runner-job-completed.sh');
    expect(runnerDockerfile).not.toMatch(/ACTIONS_RUNNER_HOOK_JOB_(?:STARTED|COMPLETED)=\S+(?<!\.sh)$/m);
    expect(cleanup).toContain("workspace_root='/home/runner/actions-runner/_work'");
    expect(cleanup).toContain('realpath');
    expect(cleanup).toContain('GITHUB_WORKSPACE');
    expect(cleanup).not.toContain('/home/runner/.npm');
    expect(cleanup).not.toContain('/home/runner/.cache/ms-playwright');
  });

  it('retries transient runner downloads without weakening checksum verification', () => {
    expect(runnerDockerfile).toContain('--retry 5 --retry-all-errors --retry-delay 2');
    expect(runnerDockerfile).toContain('--connect-timeout 20 --max-time 300');
    expect(runnerDockerfile).toContain('sha256sum -c -');
  });

  it('keeps repository and browser acceptance in required Public PR CI while Vercel owns provider build/deploy', () => {
    expect(vercelConfig.buildCommand).toBe('npm run build');
    expect(vercelConfig.buildCommand).not.toContain('verify:deploy');
    expect(vercelConfig.buildCommand).not.toContain('vercel-ui-gate');
    expect(vercelConfig.buildCommand).not.toContain('vercel-lab-browser-gate');
    const publicWorkflow = readText('../../.github/workflows/public-pr-ci.yml');
    expect(publicWorkflow).toContain('run: npm run verify:deploy');
    expect(publicWorkflow).toContain('name: public-ci-gate');
    expect(readText('../../scripts/request-vercel-final-gate.mjs')).toContain("const PUBLIC_CI_GATE_NAME = 'public-ci-gate'");
    expect(readText('../../scripts/ci-ui-gate.mjs')).toContain('const ciInfrastructureChanged');
    expect(readText('../../scripts/ci-ui-gate.mjs')).toContain("file.startsWith('.github/runner/')");
  });

  it('uses the stable Vercel project domain as Production identity at the origin root', () => {
    expect(astroConfig).toContain("'https://basemodel-preview.vercel.app'");
    expect(astroConfig).toMatch(/\bbase:\s*['"]\/['"]/);
    expect(appLayout).toContain("process.env.VERCEL_ENV === 'preview'");
    expect(playwright).toContain("process.env.PLAYWRIGHT_PORT ?? '4327'");
    expect(playwright).toContain('const previewURL = `http://127.0.0.1:${previewPort}/`');
    expect(playwright).toContain('baseURL: previewURL');
  });

  it('keeps access-protected Vercel Production out of cooperative crawler indexes', () => {
    for (const source of [appLayout, robots, sitemap]) {
      expect(source).toContain("const isPrivateProduction = process.env.VERCEL_ENV === 'production'");
      expect(source).toContain("process.env.PUBLIC_SEARCH_INDEXING === 'disabled'");
      expect(source).toContain('isPrivateProduction || explicitNoIndex || isVercelPreview || isCloudflarePreview');
    }
  });

  it('keeps Preview deployments out of cooperative crawler indexes', () => {
    expect(robots).toContain("return new Response('User-agent: *\\nDisallow: /\\n'");
  });

  it('keeps ordinary search available while opting out named AI training crawlers', () => {
    expect(robots).toContain("'GPTBot'");
    expect(robots).toContain("'ClaudeBot'");
    expect(robots).toContain("'Google-Extended'");
    expect(robots).toContain("'User-agent: OAI-SearchBot");
    expect(robots).toContain("'User-agent: ChatGPT-User");
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
  });

  it('keeps deterministic checks provider-neutral and preserves Cloudflare fallback validation', () => {
    expect(packageJson.scripts['verify:deploy']).toContain('npm run check');
    expect(packageJson.scripts['verify:deploy']).toContain('npm test');
    expect(buildCloudflare).toContain("run('npm', ['run', 'verify:deploy'])");
    expect(buildCloudflare).toContain('Legacy/fallback Cloudflare validation only');
  });

  it('keeps ordinary working refs free and reserves Vercel for exact-SHA gate refs plus main', () => {
    expect(vercelConfig.git?.deploymentEnabled).toEqual({
      '*': false,
      '**/*': false,
      main: true,
      'ci/vercel-gate-final': true,
    });
    expect(vercelConfig.github?.autoJobCancelation).toBe(true);
  });

  it('does not maintain GitHub Actions dependencies through Dependabot', () => {
    expect(dependabot).not.toContain('package-ecosystem: github-actions');
  });

  it('keeps browser major upgrades deliberate', () => {
    expect(dependabot).toContain('dependency-name: "@playwright/test"');
    expect(dependabot).toContain('version-update:semver-major');
  });

  it('keeps canonical branding on the Vercel Production identity', () => {
    expect(ogCover).toContain('basemodel-preview.vercel.app');
    expect(ogCover).not.toContain('basemodel.pages.dev');
  });
});
