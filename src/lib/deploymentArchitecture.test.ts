import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (relativePath: string): string => readFileSync(new URL(relativePath, import.meta.url), 'utf8');
const readJson = <T>(relativePath: string): T => JSON.parse(readText(relativePath)) as T;

describe('Vercel production deployment architecture', () => {
  const workflowsDir = new URL('../../.github/workflows/', import.meta.url);
  const selfHostedWorkflow = readText('../../.github/workflows/self-hosted-ci.yml');
  const runnerDockerfile = readText('../../.github/runner/Dockerfile');
  const runnerStart = readText('../../.github/runner/mac-orbstack-start.sh');
  const runnerReconcile = readText('../../.github/runner/mac-orbstack-reconcile.sh');
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

  it('uses GitHub Actions only as a self-hosted CI control plane', () => {
    const workflowFiles = existsSync(workflowsDir) ? readdirSync(workflowsDir).filter((name) => /\.ya?ml$/i.test(name)) : [];
    expect(workflowFiles).toEqual(['self-hosted-ci.yml']);
    expect(selfHostedWorkflow).toContain('runs-on: [self-hosted, basemodel-ci]');
    expect(selfHostedWorkflow).not.toMatch(/runs-on:\s*(?:ubuntu|macos|windows)-/);
    expect(selfHostedWorkflow).toContain('persist-credentials: false');
    expect(selfHostedWorkflow).toContain('needs_validation=true');
    expect(selfHostedWorkflow).toContain("grep -Ev '^(docs/|AGENTS\\.md$|README\\.md$|\\.github/)'");
    expect(selfHostedWorkflow).not.toContain('node scripts/vercel-ignore-build.mjs');
    expect(selfHostedWorkflow).toContain('runner/');
    expect(selfHostedWorkflow).toContain("PLAYWRIGHT_WORKERS: '1'");
    expect(selfHostedWorkflow).not.toContain('cache: npm');
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
  });

  it('pins every GitHub-authored action to an immutable commit', () => {
    expect(selfHostedWorkflow).toContain('actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1');
    expect(selfHostedWorkflow).toContain('actions/setup-node@820762786026740c76f36085b0efc47a31fe5020');
    expect(selfHostedWorkflow).not.toMatch(/uses:\s+actions\/[^@\s]+@v\d+/);
  });

  it('runs the full validation path for manual canary checks', () => {
    expect(selfHostedWorkflow).toContain('if [[ "${{ github.event_name }}" == "workflow_dispatch" ]]');
    expect(selfHostedWorkflow).toContain('echo "needs_validation=true" >> "$GITHUB_OUTPUT"');
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

  it('keeps browser regression out of the Vercel Production build command', () => {
    expect(vercelConfig.buildCommand).toBe('npm run verify:deploy && npm run build');
    expect(vercelConfig.buildCommand).not.toContain('vercel-ui-gate');
    expect(vercelConfig.buildCommand).not.toContain('vercel-lab-browser-gate');
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

  it('keeps Vercel Production indexable even if an old Preview-only noindex variable survives', () => {
    for (const source of [appLayout, robots, sitemap]) {
      expect(source).toContain("process.env.VERCEL_ENV === 'production'");
      expect(source).toContain("process.env.PUBLIC_SEARCH_INDEXING === 'disabled' && !isVercelProduction");
      expect(source).toContain("process.env.VERCEL_ENV === 'preview'");
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

  it('spends automatic Vercel deployments on production, semantic-release, and research preview branches', () => {
    expect(vercelConfig.git?.deploymentEnabled).toEqual({
      '*': false,
      '**/*': false,
      main: true,
      'agent/semantic-release-*': true,
      'research/**': true,
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

  it('keeps public branding on the Vercel Production identity', () => {
    expect(ogCover).toContain('basemodel-preview.vercel.app');
    expect(ogCover).not.toContain('basemodel.pages.dev');
  });
});
