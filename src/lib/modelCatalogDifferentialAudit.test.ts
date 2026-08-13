import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readJson = <T>(relativePath: string): T =>
  JSON.parse(readFileSync(new URL(relativePath, import.meta.url), 'utf8')) as T;

describe('2026-08-12 official model catalog differential audit', () => {
  it('records all twelve vendor catalogs as rechecked on the audit date', () => {
    const vendors = readJson<{ vendors: Array<{ id: string; catalog_checked_at: string }> }>(
      '../content/coverage/vendors.json',
    ).vendors;

    expect(vendors).toHaveLength(12);
    expect(new Set(vendors.map((vendor) => vendor.id))).toEqual(
      new Set([
        'openai', 'qwen', 'google', 'meta', 'anthropic', 'deepseek',
        'moonshot', 'mistral', 'glm', 'lmsys', 'xai', 'minimax',
      ]),
    );
    expect(vendors.every((vendor) => vendor.catalog_checked_at === '2026-08-12')).toBe(true);
  });

  it('keeps every family current-claim surface on the same audit snapshot', () => {
    const families = readJson<{
      families: Array<{
        id: string;
        catalog_checked_at?: string;
        as_of?: string;
        current_claim?: { checked_at: string };
      }>;
    }>('../content/coverage/families.json').families;

    expect(families).toHaveLength(14);
    for (const family of families) {
      expect(family.catalog_checked_at, family.id).toBe('2026-08-12');
      expect(family.as_of, family.id).toBe('2026-08-12');
      expect(family.current_claim?.checked_at, family.id).toBe('2026-08-12');
    }
  });

  it('represents the complete current Grok API surface with internal model IDs', () => {
    const families = readJson<{ families: Array<Record<string, unknown>> }>(
      '../content/coverage/families.json',
    ).families;
    const grok = families.find((family) => family.id === 'grok') as {
      current_flagship_model_id: string;
      current_api_model_ids: string[];
      latest_specialized_model_ids: string[];
      variants: Array<{ id: string; api_aliases?: string[] }>;
    };

    expect(grok.current_flagship_model_id).toBe('grok-4-5');
    expect(grok.current_api_model_ids).toEqual([
      'grok-4-5',
      'grok-4-20',
      'grok-4-20-multi-agent',
      'grok-4-3',
      'grok-build-0-1',
    ]);
    expect(grok.latest_specialized_model_ids).toEqual([
      'grok-4-20-multi-agent',
      'grok-build-0-1',
    ]);
    expect(grok.variants.map((variant) => variant.id)).toEqual(
      expect.arrayContaining([
        'grok-4-5',
        'grok-4-20',
        'grok-4-20-multi-agent',
        'grok-4-3',
        'grok-build-0-1',
      ]),
    );
  });

  it('keeps Grok 4.20 and Grok Build facts aligned with first-party API docs', () => {
    const grok420 = readJson<{
      release_date: string;
      architecture: { context_length: number };
      access: { api_status: string; api_model_ids: string[] };
    }>('../content/models/grok-4-20.json');
    const multiAgent = readJson<{
      status: string;
      architecture: { context_length: number };
      access: { api_status: string; api_model_ids: string[] };
    }>('../content/models/grok-4-20-multi-agent.json');
    const build = readJson<{
      release_date: string;
      checkpoint: { type: string };
      architecture: { context_length: number };
      access: { api_status: string; api_model_ids: string[] };
    }>('../content/models/grok-build-0-1.json');

    expect(grok420).toMatchObject({
      release_date: '2026-03-10',
      architecture: { context_length: 1_000_000 },
      access: { api_status: 'available' },
    });
    expect(grok420.access.api_model_ids).toEqual(
      expect.arrayContaining([
        'grok-4.20-0309-reasoning',
        'grok-4.20-0309-non-reasoning',
      ]),
    );
    expect(multiAgent).toMatchObject({
      status: 'preview',
      architecture: { context_length: 1_000_000 },
      access: { api_status: 'preview' },
    });
    expect(build).toMatchObject({
      release_date: '2026-05-19',
      checkpoint: { type: 'coder' },
      architecture: { context_length: 256_000 },
      access: { api_status: 'available' },
    });
    expect(build.access.api_model_ids).toContain('grok-build-0.1');
  });

  it('corrects MiniMax M3 architecture, modalities, runtime and provenance', () => {
    const model = readJson<{
      checkpoint: { modalities: string[] };
      architecture: {
        total_parameters_b: number;
        active_parameters_b: number;
        context_length: number;
        expert_count: number;
        active_experts_per_token: number;
      };
      access: { api_status: string; api_model_ids: string[] };
      research: {
        transformers_support: boolean;
        vllm_support: boolean;
        sglang_support: boolean;
      };
      sources: Array<{ url: string; type: string }>;
    }>('../content/models/minimax-m3.json');

    expect(model.checkpoint.modalities).toEqual(['text', 'image', 'video']);
    expect(model.architecture).toEqual({
      type: 'moe',
      total_parameters_b: 428,
      active_parameters_b: 23,
      context_length: 1_048_576,
      expert_count: 128,
      active_experts_per_token: 4,
    });
    expect(model.access).toMatchObject({
      api_status: 'available',
      api_model_ids: ['MiniMax-M3'],
    });
    expect(model.research).toMatchObject({
      transformers_support: true,
      vllm_support: true,
      sglang_support: true,
    });
    expect(model.sources.some((source) => source.url.includes('ithome.com'))).toBe(false);
    expect(model.sources.some((source) => source.url === 'https://www.minimax.io/blog/minimax-m3')).toBe(true);
  });

  it('moves Mistral Large 3 source prose into structured fields and the API family surface', () => {
    const model = readJson<{
      release_date: string;
      architecture: {
        total_parameters_b: number;
        active_parameters_b: number;
        context_length: number;
      };
      openness: { license_name: string; classification: string };
      access: { api_status: string; api_model_ids: string[] };
      research: { transformers_support: boolean };
      hardware: {
        inference_tier: string;
        lora_tier: string;
        full_sft_tier: string;
        rl_tier: string;
      };
    }>('../content/models/mistral-large-3.json');
    const families = readJson<{
      families: Array<{ id: string; current_api_model_ids?: string[] }>;
    }>('../content/coverage/families.json').families;
    const mistral = families.find((family) => family.id === 'mistral');

    expect(model).toMatchObject({
      release_date: '2025-12-02',
      architecture: {
        total_parameters_b: 675,
        active_parameters_b: 41,
        context_length: 256_000,
      },
      openness: {
        license_name: 'Apache-2.0',
        classification: 'open_weight',
      },
      access: {
        api_status: 'available',
        api_model_ids: ['mistral-large-2512'],
      },
      research: {
        transformers_support: false,
      },
      hardware: {
        inference_tier: 'multi_gpu',
        lora_tier: 'not_reported',
        full_sft_tier: 'not_reported',
        rl_tier: 'not_reported',
      },
    });
    expect(mistral?.current_api_model_ids).toContain('mistral-large-3');
  });
});
