import { expect, type Locator } from '@playwright/test';

/** Make a client:visible Astro island ready for an interaction-focused assertion. */
export async function waitForHydratedIsland(root: Locator) {
  await root.scrollIntoViewIfNeeded();
  const island = root.locator('xpath=ancestor::astro-island[1]');
  if (await island.count()) await expect(island).not.toHaveAttribute('ssr', '');
}

/** Make an interactive research explainer ready for hydrated control assertions. */
export async function waitForHydratedExplainer(root: Locator) {
  await waitForHydratedIsland(root);
  await expect(root.locator('.irx-transport')).toBeVisible();
}
