import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  exampleProducts, inspectExamplePurchase, initialExamplePurchase,
} from './webshopRewardExample';

describe('WebShop purchase-dependent teaching example', () => {
  it('begins with a completed purchase at 0.75, not an action-progress score', () => {
    expect(inspectExamplePurchase(initialExamplePurchase)).toMatchObject({
      status: 'scored', score: .75, matched: 3, exact: false,
      checks: { waterproof: true, breathable: true, size: false, price: true },
    });
  });

  it('changes the final reward only after a purchase, not after each UI action', () => {
    expect(inspectExamplePurchase({ productId: 'trail', size: '9', purchased: false }))
      .toMatchObject({ status: 'not-purchased', score: null, exact: null });
    expect(inspectExamplePurchase({ productId: 'trail', size: '9', purchased: true }))
      .toMatchObject({ status: 'scored', score: 1, exact: true });
  });

  it('does not permit an unavailable size to be purchased or scored', () => {
    expect(exampleProducts.basic.sizes).toEqual(['8']);
    expect(inspectExamplePurchase({ productId: 'basic', size: '9', purchased: true }))
      .toMatchObject({ status: 'invalid-option', score: null, exact: null });
    expect(inspectExamplePurchase({ productId: 'basic', size: '9', purchased: false }))
      .toMatchObject({ status: 'invalid-option', score: null, exact: null });
  });

  it('ties attributes, price and options to the chosen product, not independent booleans', () => {
    expect(inspectExamplePurchase({ productId: 'basic', size: '8', purchased: true }))
      .toMatchObject({
        score: .5, exact: false,
        checks: { waterproof: false, breathable: true, size: false, price: true },
      });
    expect(inspectExamplePurchase({ productId: 'premium', size: '9', purchased: true }))
      .toMatchObject({
        score: .5, exact: false,
        checks: { waterproof: true, breathable: false, size: true, price: false },
      });
    expect(inspectExamplePurchase({ productId: 'premium', size: '10', purchased: true }))
      .toMatchObject({ score: .25, exact: false });
  });
  it('keeps nonterminal step feedback distinct from final WebShop Task Score', () => {
    const source = readFileSync(
      new URL('../components/research/explainer/EnvironmentExplainers.tsx', import.meta.url),
      'utf8',
    );
    expect(source).not.toContain("reward: 'task_score = 0'");
    expect(source).toContain('本步 reward = 0 · 尚无终局评分');
    expect(source).toContain('不能当作一次失败购买的最终 Task Score = 0');
  });

});
