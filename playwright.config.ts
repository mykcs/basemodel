import { defineConfig, devices } from '@playwright/test';

const useSystemChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === '1';
const reuseBuiltOutput = process.env.PLAYWRIGHT_REUSE_BUILD === '1';

export default defineConfig({
  testDir: './tests/e2e',
  // The focused research-geometry cases intentionally walk every bilingual
  // explainer route and every step in sequence. On Vercel's 2-core build
  // environment the desktop cases consistently take ~31–33s, so keep a
  // modest execution-time margin without changing any geometry/contrast/
  // overflow acceptance threshold.
  timeout: 45_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
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
