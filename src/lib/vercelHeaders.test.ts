import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8')) as {
  headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
};

describe('Vercel response header policy', () => {
  it('owns fail-safe HTML security headers and report-only CSP', () => {
    const headers = Object.fromEntries(config.headers?.find((entry) => entry.source === '/(.*)')?.headers.map(({ key, value }) => [key, value]) ?? []);
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['Permissions-Policy']).toContain('camera=()');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Content-Security-Policy-Report-Only']).toContain("frame-ancestors 'none'");
    expect(headers).not.toHaveProperty('Content-Security-Policy');
  });

  it('gives static model data an explicit shared-cache policy', () => {
    const cache = config.headers?.find((entry) => entry.source === '/model-data/(.*)')?.headers.find((header) => header.key === 'Cache-Control')?.value;
    expect(cache).toBe('public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
  });
});
