/**
 * Exact compatibility-route destinations used by cloud acceptance.
 *
 * These routes intentionally navigate on the client. A DOMContentLoaded event
 * from their source URL is not proof the final document is ready. This
 * catalogue is for tests/read-only inspection, NOT an alternate product router.
 * Unit tests compare every target with its Astro owning source so a moved
 * destination cannot silently leave the acceptance tests behind.
 */
export interface LegacyResearchRedirect {
  sourceRoute: string;
  targetRoute: string;
  owner: string;
  primerNote?: 'webshop-training' | 'seed-training' | 'openevo-training';
}

export const LEGACY_RESEARCH_REDIRECTS: readonly LegacyResearchRedirect[] = [
  {
    sourceRoute: '/research/seed-openevo/flow/base-model/',
    targetRoute: '/models/qwen2-5-3b-instruct/#experiment-setup',
    owner: 'src/pages/research/seed-openevo/flow/base-model/index.astro',
  },
  {
    sourceRoute: '/research/seed-openevo/study/design/',
    targetRoute: '/research/seed-openevo/flow/#training-design',
    owner: 'src/pages/research/seed-openevo/study/design/index.astro',
  },
  {
    sourceRoute: '/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/',
    targetRoute: '/research/seed-openevo/flow/sd-lora/',
    owner: 'src/pages/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/index.astro',
  },
  {
    sourceRoute: '/research/seed-openevo/study/results/webshop-training/',
    targetRoute: '/research/seed-openevo/flow/webshop/',
    owner: 'src/components/research/ResearchPrimerMoved.astro',
    primerNote: 'webshop-training',
  },
  {
    sourceRoute: '/research/seed-openevo/study/results/seed-training/',
    targetRoute: '/research/seed-openevo/flow/webshop/#fig-seed-webshop',
    owner: 'src/components/research/ResearchPrimerMoved.astro',
    primerNote: 'seed-training',
  },
  {
    sourceRoute: '/research/seed-openevo/study/results/openevo-training/',
    targetRoute: '/research/seed-openevo/flow/openevo/',
    owner: 'src/components/research/ResearchPrimerMoved.astro',
    primerNote: 'openevo-training',
  },
];

/** Exact source-route match; do not map ordinary result-note routes. */
export function legacyResearchRedirectForRoute(rawPathname: string): LegacyResearchRedirect | undefined {
  const pathname = new URL(rawPathname, 'https://basemodel.invalid').pathname;
  return LEGACY_RESEARCH_REDIRECTS.find(row => row.sourceRoute === pathname);
}

/** Preserve the fragment when a compatibility route explicitly specifies one. */
export function matchesDeclaredLegacyTarget(
  actualURL: string,
  declaredTarget: string,
): boolean {
  const actual = new URL(actualURL, 'https://basemodel.invalid');
  const expected = new URL(declaredTarget, 'https://basemodel.invalid');
  return actual.pathname === expected.pathname && actual.hash === expected.hash;
}
