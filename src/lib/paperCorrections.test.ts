import { describe, expect, it } from 'vitest';
import { applyPaperCorrection } from './paperCorrections';

describe('paper corrections', () => {
  it('upgrades SEED released checkpoint availability without inventing other fields', () => {
    const paper = { id: 'seed', checkpoint_url: 'not_published', reproducibility: { code_status: 'available', checkpoint_status: 'unavailable', config_status: 'partial' }, sources: [{ url: 'https://arxiv.org/abs/2607.14777' }] };
    const corrected = applyPaperCorrection(paper);
    expect(corrected.checkpoint_url).toBe('https://huggingface.co/Jinyang23/Seed-AlfWorld-3B');
    expect(corrected.reproducibility?.checkpoint_status).toBe('available');
    expect(corrected.reproducibility?.config_status).toBe('partial');
    expect(corrected.sources.some((source) => source.url === 'https://jinyangwu.github.io/seed/')).toBe(true);
  });
});
