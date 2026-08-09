import { defineConfig, devices } from '@playwright/test';

const useSystemChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === '1';
const requestedBasePath = process.env.PLAYWRIGHT_BASE_PATH ?? '/basemodel/';
const cleanBasePath = requestedBasePath.trim().replace(/^\/+|\/+$/g, '');
const basePath = cleanBasePath ? `/${cleanBasePath}/` : '/';
const previewUrl = `http://127.0.0.1:4327${basePath}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: previewUrl,
    trace: 'retain-on-failure',
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
    // CI builds once in the workflow before browser-specific jobs. Local E2E stays
    // self-contained so a fresh checkout can run `npm run test:e2e` directly.
    command: process.env.CI
      ? 'npm run preview -- --host 127.0.0.1 --port 4327'
      : 'npm run build && npm run preview -- --host 127.0.0.1 --port 4327',
    url: previewUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});