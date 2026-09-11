import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { externalBrandAssetProvenance, externalLinkBrand } from './externalLinkBrand';

describe('externalLinkBrand', () => {
  it('recognizes GitHub, Hugging Face, and arXiv destinations, including real subdomains', () => {
    expect(externalLinkBrand('https://github.com/mykcs/basemodel')).toBe('github');
    expect(externalLinkBrand('https://gist.github.com/example/123')).toBe('github');
    expect(externalLinkBrand('https://huggingface.co/Qwen/Qwen2.5-7B-Instruct')).toBe('huggingface');
    expect(externalLinkBrand('https://datasets-server.huggingface.co/rows')).toBe('huggingface');
    expect(externalLinkBrand('https://arxiv.org/abs/2606.01770')).toBe('arxiv');
    expect(externalLinkBrand('https://export.arxiv.org/api/query')).toBe('arxiv');
  });

  it('does not brand lookalike, relative, or malformed URLs', () => {
    expect(externalLinkBrand('https://github.com.example.org/repo')).toBeNull();
    expect(externalLinkBrand('https://huggingface.co.example.org/model')).toBeNull();
    expect(externalLinkBrand('https://arxiv.org.example.org/abs/1234')).toBeNull();
    expect(externalLinkBrand('/research/seed-openevo/')).toBeNull();
    expect(externalLinkBrand('not a url')).toBeNull();
  });

  it('keeps vendored official assets pinned to the reviewed bytes', () => {
    for (const meta of Object.values(externalBrandAssetProvenance)) {
      const bytes = readFileSync(resolve(process.cwd(), `public${meta.asset}`));
      const digest = createHash('sha256').update(bytes).digest('hex');
      expect(digest, meta.upstream).toBe(meta.sha256);
    }
  });
});
