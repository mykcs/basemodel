/**
 * Teaching-only subset of Princeton WebShop get_reward with r_type = 1.
 * Two attributes, one selected option and one price bound have equal weight.
 * The source evaluator also has product-type and fuzzy-match rules:
 * https://github.com/princeton-nlp/WebShop/blob/master/web_agent_site/engine/goal.py
 * This function never represents a measured experiment episode.
 */
export type RewardMatches = Readonly<{
  waterproof: boolean;
  breathable: boolean;
  size: boolean;
  price: boolean;
}>;

export const initialRewardMatches: RewardMatches = Object.freeze({
  waterproof: true,
  breathable: true,
  size: false,
  price: true,
});

export function scoreRewardExample(matches: RewardMatches) {
  const matched = Number(matches.waterproof) + Number(matches.breathable)
    + Number(matches.size) + Number(matches.price);
  return { matched, total: 4, taskScore: matched / 4, complete: matched === 4 };
}
