import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4327/basemodel/',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    // CI builds once in the workflow before browser-specific jobs. Local E2E stays
    // self-contained so a fresh checkout can run `npm run test:e2e` directly.
    command: process.env.CI
      ? 'npm run preview -- --host 127.0.0.1 --port 4327'
      : 'npm run build && npm run preview -- --host 127.0.0.1 --port 4327',
    url: 'http://127.0.0.1:4327/basemodel/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
