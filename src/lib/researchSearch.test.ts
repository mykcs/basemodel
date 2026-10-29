import { describe, expect, it } from 'vitest';
import { researchSearchEntries } from './researchSearch';
import { OPEN_EVO_WEBSHOP_NOTE_META, OPEN_EVO_WEBSHOP_PRIMER_IDS } from '../data/openEvoWebShopNoteMetadata';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';
import { CAPABILITY_READER_ROUTES, CAPABILITY_ROUTE_ALIASES, CAPABILITY_TOPIC_GROUPS } from '../data/capabilityReaderRoutes';

const root = '/research/seed-openevo/study/capability-exploration/';
describe('canonical content discovery', () => {
  it('indexes every fixed canonical reader route exactly once', () => {
    const entries = researchSearchEntries();
    const paths = entries.map((row) => row.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const row of SITE_READER_CONTRACTS) {
      if (row.id === 'not-found' || row.redirectsTo || row.sourceRoute.includes('[') || Object.keys(CAPABILITY_ROUTE_ALIASES).some((alias) => row.samplePath === `${root}${alias}/`)) continue;
      expect(paths, row.id).toContain(row.samplePath);
    }
    for (const id of Object.keys(OPEN_EVO_WEBSHOP_NOTE_META)) {
      const path = `/research/seed-openevo/study/results/${id}/`;
      if (OPEN_EVO_WEBSHOP_PRIMER_IDS.has(id)) expect(paths).not.toContain(path);
      else expect(paths).toContain(path);
    }
    expect(paths).toContain('/models/');
    expect(paths).toContain('/papers/');
    expect(paths).toContain('/research/seed-openevo/study/openevo-methods/');
    expect(paths).toContain('/research/seed-openevo/study/advisor-questions/');
    expect(paths).toContain('/research/seed-openevo/study/parameter-memory-results/');
    expect(paths).not.toContain(`${root}stage1-evolution/`);
    expect(paths).not.toContain(`${root}vanilla-sd-lora/`);
  });
  it('gives every canonical capability page exactly one topic, including the archive', () => {
    const grouped = CAPABILITY_TOPIC_GROUPS.flatMap<string>((group) => [...group.routes]);
    const expected = CAPABILITY_READER_ROUTES.filter((row) => row.route && !(row.route in CAPABILITY_ROUTE_ALIASES)).map((row) => row.route);
    expect([...grouped].sort()).toEqual(expected.sort());
    expect(new Set(grouped).size).toBe(grouped.length);
    expect(grouped).toContain('archive');
    for (const alias of Object.values(CAPABILITY_ROUTE_ALIASES)) expect(grouped).toContain(alias);
  });
});
