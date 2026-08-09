import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (relativePath: string): string =>
  readFileSync(new URL(relativePath, import.meta.url), 'utf8');

describe('dual-base Playwright contract', () => {
  const config = readText('../../playwright.config.ts');
  const workflow = readText('../../.github/workflows/validate.yml');
  const rootSmoke = readText('../../e2e/cloudflare-root.spec.ts');

  it('keeps GitHub Pages as the default Playwright base while allowing an override', () => {
    expect(config).toContain("process.env.PLAYWRIGHT_BASE_PATH ?? '/basemodel/'");
    expect(config).toContain('const previewUrl = `http://127.0.0.1:4327${basePath}`;');
  });

  it('wires a Cloudflare-root smoke into the existing Chromium full job', () => {
    expect(workflow).toContain("browser: [chromium, webkit]");
    expect(workflow).toContain("if: ${{ matrix.browser == 'chromium' }}");
    expect(workflow).toContain('PUBLIC_BASE_PATH: /');
    expect(workflow).toContain('PLAYWRIGHT_BASE_PATH: /');
    expect(workflow).toContain('npx playwright test cloudflare-root.spec.ts --project=chromium');
  });

  it('keeps root-only tests out of the normal /basemodel/ suite', () => {
    expect(rootSmoke).toContain("process.env.PLAYWRIGHT_BASE_PATH === '/'");
    expect(rootSmoke).toContain('test.skip(!rootMode');
  });
});
