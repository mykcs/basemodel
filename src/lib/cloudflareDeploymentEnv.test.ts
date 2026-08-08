import { describe, expect, it } from 'vitest';
import {
  resolveCloudflareSiteUrl,
  resolveSearchIndexing,
  stablePagesProductionUrl,
} from '../../scripts/cloudflare-deployment-env.mjs';

describe('Cloudflare deployment identity', () => {
  it('maps a hash production deployment to the durable project alias', () => {
    expect(
      stablePagesProductionUrl('https://c2a58c31.basemodel.pages.dev/some/path'),
    ).toBe('https://basemodel.pages.dev');
  });

  it('keeps an already-stable production alias unchanged', () => {
    expect(stablePagesProductionUrl('https://basemodel.pages.dev/')).toBe(
      'https://basemodel.pages.dev',
    );
  });

  it('prefers an explicit custom domain for production', () => {
    expect(
      resolveCloudflareSiteUrl({
        explicitSiteUrl: 'https://models.example.com/some/path',
        deploymentUrl: 'https://c2a58c31.basemodel.pages.dev',
        branch: 'main',
      }),
    ).toBe('https://models.example.com');
  });

  it('always keeps Preview identity on the Preview deployment URL', () => {
    expect(
      resolveCloudflareSiteUrl({
        explicitSiteUrl: 'https://basemodel.pages.dev',
        deploymentUrl: 'https://abc123.basemodel.pages.dev',
        branch: 'agent/example',
      }),
    ).toBe('https://abc123.basemodel.pages.dev');
  });

  it('fails closed when a Preview has no Cloudflare deployment URL', () => {
    expect(
      resolveCloudflareSiteUrl({
        explicitSiteUrl: 'https://basemodel.pages.dev',
        deploymentUrl: undefined,
        branch: 'agent/example',
      }),
    ).toBeNull();
  });
});

describe('Cloudflare search indexing policy', () => {
  it('enables production indexing by default', () => {
    expect(resolveSearchIndexing({ branch: 'main', configuredValue: undefined })).toBe(
      'enabled',
    );
  });

  it('respects an explicit production noindex setting', () => {
    expect(resolveSearchIndexing({ branch: 'main', configuredValue: 'disabled' })).toBe(
      'disabled',
    );
  });

  it('forces Preview indexing off even if configured globally as enabled', () => {
    expect(
      resolveSearchIndexing({ branch: 'agent/example', configuredValue: 'enabled' }),
    ).toBe('disabled');
  });
});
