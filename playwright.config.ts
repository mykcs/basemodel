import { defineConfig, devices } from '@playwright/test';

const useSystemChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === '1';
const reuseBuiltOutput = process.env.PLAYWRIGHT_REUSE_BUILD === '1';

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
    baseURL: 'http://127.0.0.1:4327/',
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
    // Local/Agent E2E stays self-contained. Release Preview builds may reuse
    // the exact static output that Vercel just produced so the browser gate
    // validates that tree without paying for a redundant Astro build.
    command: reuseBuiltOutput
      ? 'npm run preview -- --host 127.0.0.1 --port 4327'
      : 'npm run build && npm run preview -- --host 127.0.0.1 --port 4327',
    url: 'http://127.0.0.1:4327/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
