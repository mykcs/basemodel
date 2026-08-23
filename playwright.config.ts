import { defineConfig, devices } from '@playwright/test';

const useSystemChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === '1';
const reuseBuiltOutput = process.env.PLAYWRIGHT_REUSE_BUILD === '1';
const previewPort = process.env.PLAYWRIGHT_PORT ?? '4327';
const previewURL = `http://127.0.0.1:${previewPort}/`;

export default defineConfig({
  testDir: './tests/e2e',
  // The focused research-geometry cases intentionally walk every bilingual
  // explainer route and every step in sequence. After the route expansion,
  // Vercel's 2-core build environment needs roughly 45–55s for a desktop
  // matrix. Give the deterministic walk enough execution time without
  // changing any geometry/contrast/overflow acceptance threshold.
  timeout: 90_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // Release acceptance is fail-closed: a flaky retry must not turn a failed
  // exact-head browser run into accepted evidence.
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: previewURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(useSystemChrome ? { channel: 'chrome' } : {}),
      },
    },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    // Astro 7's preview command detaches into a background process, while
    // Playwright requires the configured server process to stay attached.
    // This server keeps that process attached and preserves static 404 status.
    command: reuseBuiltOutput
      ? `node scripts/playwright-static-server.mjs`
      : `npm run build && node scripts/playwright-static-server.mjs`,
    url: previewURL,
    // Never accept a server started from another worktree. A busy port now
    // fails fast, while PLAYWRIGHT_PORT lets parallel validation use isolation.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
