import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { paperSchema } from './schemas';
import { applyPaperCorrection } from './paperCorrections';

const seedRaw = paperSchema.parse(JSON.parse(readFileSync(new URL('../content/papers/seed.json', import.meta.url), 'utf8')));

describe('paper corrections', () => {
  it('exposes the released SEED ALFWorld checkpoint without rewriting the historical ingest record', () => {
    const corrected = applyPaperCorrection(seedRaw);
    expect(seedRaw.checkpoint_url).toBe('not_published');
    expect(corrected.checkpoint_url).toBe('https://huggingface.co/Jinyang23/Seed-AlfWorld-3B');
    expect(corrected.reproducibility?.checkpoint_status).toBe('available');
    expect(corrected.sources.some((source) => source.id === 'src_seed_released_checkpoint_20260810')).toBe(true);
  });

  it('leaves unrelated papers untouched', () => {
    const unrelated = { ...seedRaw, id: 'other-paper' };
    expect(applyPaperCorrection(unrelated)).toBe(unrelated);
  });
});
