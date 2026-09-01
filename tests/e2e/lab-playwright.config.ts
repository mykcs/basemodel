import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4327);
const baseURL = `http://127.0.0.1:${port}/`;

export default defineConfig({
  testDir: '.',
  testMatch: 'lab-server-visual-qa.spec.ts',
  fullyParallel: false,
  forbidOnly: true,
  // The Lab gate must prove a clean first attempt. Its former retry masked a
  // hydration/connector scheduling race instead of fixing the synchronization
  // boundary, so keep retries disabled now that the test waits for readiness.
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
