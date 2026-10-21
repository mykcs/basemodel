import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readerContractForRoute, SITE_READER_CONTRACTS } from '../data/siteReaderContracts';
import {
  LEGACY_RESEARCH_REDIRECTS,
  legacyResearchRedirectForRoute,
  matchesDeclaredLegacyTarget,
} from './legacyResearchRedirects';

const read = (owner: string): string =>
  readFileSync(new URL('../../' + owner, import.meta.url), 'utf8');
const staticRedirects = LEGACY_RESEARCH_REDIRECTS.filter(row => !row.primerNote);
const dynamicPrimerRedirects = LEGACY_RESEARCH_REDIRECTS.filter(row => row.primerNote);
const primerSource = read('src/components/research/ResearchPrimerMoved.astro');
const resultNoteRouter = read('src/pages/research/seed-openevo/study/results/[note].astro');

describe('legacy research redirect source/acceptance parity', () => {
  it('keeps six unique compatibility aliases without intercepting current research pages', () => {
    expect(LEGACY_RESEARCH_REDIRECTS).toHaveLength(6);
    expect(new Set(LEGACY_RESEARCH_REDIRECTS.map(row => row.sourceRoute)).size).toBe(6);
    for (const row of LEGACY_RESEARCH_REDIRECTS) {
      expect(row.sourceRoute.startsWith('/')).toBe(true);
      expect(row.targetRoute.startsWith('/')).toBe(true);
      expect(legacyResearchRedirectForRoute(row.sourceRoute)).toEqual(row);
      expect(legacyResearchRedirectForRoute(row.sourceRoute + '?from=old')).toEqual(row);
    }
    expect(legacyResearchRedirectForRoute('/research/seed-openevo/study/results/current-conclusion/')).toBeUndefined();
    expect(legacyResearchRedirectForRoute('/research/seed-openevo/study/results/measurement-boundary/')).toBeUndefined();
    expect(legacyResearchRedirectForRoute('/research/seed-openevo/flow/sd-lora/')).toBeUndefined();
  });

  it.each(staticRedirects)('keeps $sourceRoute in sync with its literal Astro destination', row => {
    const source = read(row.owner);
    const declaration = source.match(/const target\s*=\s*'([^']+)'/);
    expect(declaration, row.owner).not.toBeNull();
    expect(declaration?.[1], row.owner).toBe(row.targetRoute);
    expect(source, row.owner).toContain('window.location.replace(target)');

    const contract = SITE_READER_CONTRACTS.find(item => item.sourceRoute === row.sourceRoute);
    expect(contract?.redirectsTo, row.sourceRoute).toBeTruthy();
    // Reader Contract may omit a destination fragment on purpose. It must
    // never contradict the true pathname (and a specified hash must match).
    const declared = new URL(contract?.redirectsTo ?? '/', 'https://basemodel.invalid');
    const actual = new URL(row.targetRoute, 'https://basemodel.invalid');
    expect(declared.pathname, row.sourceRoute).toBe(actual.pathname);
    if (declared.hash) expect(declared.hash, row.sourceRoute).toBe(actual.hash);
    expect(readerContractForRoute(row.sourceRoute)?.id).toBe(contract?.id);
  });

  it('enumerates all migrated result-note IDs without treating normal result notes as redirects', () => {
    const union = primerSource.match(/export type ResearchPrimerMovedId\s*=\s*([^;]+);/)?.[1] ?? '';
    const ids = [...union.matchAll(/'([^']+)'/g)].map(match => match[1]).sort();
    expect(ids).toEqual(dynamicPrimerRedirects.map(row => row.primerNote).sort());
    expect(resultNoteRouter).toContain('primerNotes.has(note as ResearchPrimerMovedId)');
    expect(primerSource).toContain('const target = current.href;');
    expect(primerSource).toContain('window.location.replace(target)');
  });

  it.each(dynamicPrimerRedirects)('tracks the actual destination for $primerNote', row => {
    const source = primerSource;
    const match = source.match(new RegExp(
      "'" + row.primerNote + "':\\s*\\{[\\s\\S]*?href:\\s*'([^']+)'",
    ));
    expect(match?.[1], row.primerNote).toBe(row.targetRoute);
    expect(readerContractForRoute(row.sourceRoute)?.id, row.sourceRoute).toBe('result-note');
    expect(resultNoteRouter).toContain("'"+row.primerNote+"'");
  });

  it('rejects wrong path AND lost chapter fragments: false-green regression controls', () => {
    const base = 'https://basemodel.invalid';
    const model = LEGACY_RESEARCH_REDIRECTS.find(x => x.sourceRoute.endsWith('/flow/base-model/'));
    const design = LEGACY_RESEARCH_REDIRECTS.find(x => x.sourceRoute.endsWith('/study/design/'));
    const seed = LEGACY_RESEARCH_REDIRECTS.find(x => x.primerNote === 'seed-training');
    expect(model).toBeDefined();
    expect(design).toBeDefined();
    expect(seed).toBeDefined();

    expect(matchesDeclaredLegacyTarget(new URL(model!.targetRoute, base).href, model!.targetRoute)).toBe(true);
    expect(matchesDeclaredLegacyTarget(new URL(design!.targetRoute, base).href, design!.targetRoute)).toBe(true);
    expect(matchesDeclaredLegacyTarget(new URL(seed!.targetRoute, base).href, seed!.targetRoute)).toBe(true);
    expect(matchesDeclaredLegacyTarget('/models/qwen2-5-3b-instruct/', model!.targetRoute)).toBe(false);
    expect(matchesDeclaredLegacyTarget('/research/seed-openevo/flow/', design!.targetRoute)).toBe(false);
    expect(matchesDeclaredLegacyTarget('/research/seed-openevo/flow/webshop/', seed!.targetRoute)).toBe(false);
    expect(matchesDeclaredLegacyTarget('/research/seed-openevo/flow/wrong/#training-design', design!.targetRoute)).toBe(false);
  });
});
