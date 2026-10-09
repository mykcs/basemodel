/**
 * A task-shaped teaching example, NOT a WebShop dataset record.
 *
 * Every fictional product below is treated as the same product TYPE
 * (a running shoe, r_type = 1). Their properties, prices and available
 * options are coupled to the product selected by the reader.
 *
 * Princeton's actual get_reward calculates goal-matched attributes, options,
 * price and a product-type multiplier. It also performs fuzzy matching:
 * https://github.com/princeton-nlp/WebShop/blob/master/web_agent_site/engine/goal.py
 *
 * The WebShopTextEnv calls get_reward at the purchase/done transition,
 * not after each agent action. No intermediate "step points" exist here.
 */
export type ExampleProductId = 'trail' | 'basic' | 'premium';
export type ExampleSize = '8' | '9' | '10';

type ExampleProduct = Readonly<{
  id: ExampleProductId;
  zh: string;
  en: string;
  waterproof: boolean;
  breathable: boolean;
  price: number;
  sizes: readonly ExampleSize[];
}>;

export const exampleProducts: Readonly<Record<ExampleProductId, ExampleProduct>> = {
  trail: {
    id: 'trail', zh: '防水透气跑鞋', en: 'Waterproof breathable running shoes',
    waterproof: true, breathable: true, price: 55, sizes: ['8', '9'],
  },
  basic: {
    id: 'basic', zh: '透气日常跑鞋', en: 'Breathable everyday running shoes',
    waterproof: false, breathable: true, price: 45, sizes: ['8'],
  },
  premium: {
    id: 'premium', zh: '防水高价跑鞋', en: 'Premium waterproof running shoes',
    waterproof: true, breathable: false, price: 75, sizes: ['9', '10'],
  },
};

export type ExamplePurchase = Readonly<{
  productId: ExampleProductId;
  size: ExampleSize;
  purchased: boolean;
}>;

export const initialExamplePurchase: ExamplePurchase = Object.freeze({
  productId: 'trail', size: '8', purchased: true,
});

export const exampleGoal = Object.freeze({
  size: '9' as const,
  priceUpper: 60,
  requiredAttributes: ['waterproof', 'breathable'] as const,
  productTypeMultiplier: 1,
});

export function inspectExamplePurchase(purchase: ExamplePurchase) {
  const product = exampleProducts[purchase.productId];
  // Changing product can invalidate a previously selected option.
  // Reject impossible combinations instead of granting artificial points.
  if (!product.sizes.includes(purchase.size)) {
    return {
      status: 'invalid-option' as const,
      score: null,
      exact: null,
      matched: null,
      checks: null,
    };
  }
  const checks = {
    waterproof: product.waterproof,
    breathable: product.breathable,
    size: purchase.size === exampleGoal.size,
    price: product.price <= exampleGoal.priceUpper,
  };
  if (!purchase.purchased) {
    return {
      status: 'not-purchased' as const,
      score: null,
      exact: null,
      matched: null,
      checks,
    };
  }
  const matched = Object.values(checks).filter(Boolean).length;
  // The four denominator units are two goal attributes, one goal option
  // and the price bound; this is NOT four consecutive browsing actions.
  const score = (matched / 4) * exampleGoal.productTypeMultiplier;
  return {
    status: 'scored' as const,
    score,
    exact: score === 1,
    matched,
    checks,
  };
}
