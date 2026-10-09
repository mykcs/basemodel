import { describe, expect, it } from 'vitest';
import { initialRewardMatches, scoreRewardExample } from './webshopRewardExample';

describe('WebShop reward explainer (teaching subset, not measurements)', () => {
  it('begins partially satisfied, not successful', () => {
    expect(scoreRewardExample(initialRewardMatches)).toEqual({
      matched: 3, total: 4, taskScore: 0.75, complete: false,
    });
  });
  it('handles all 16 possible match combinations', () => {
    for (let mask = 0; mask < 16; mask += 1) {
      const matches = {
        waterproof: Boolean(mask & 1), breathable: Boolean(mask & 2),
        size: Boolean(mask & 4), price: Boolean(mask & 8),
      };
      const count = Object.values(matches).filter(Boolean).length;
      expect(scoreRewardExample(matches)).toEqual({
        matched: count, total: 4, taskScore: count / 4, complete: count === 4,
      });
    }
  });
});
