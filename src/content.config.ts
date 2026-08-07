import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { modelSchema, paperSchema } from './lib/schemas';

const models = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/models' }),
  schema: modelSchema,
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/papers' }),
  schema: paperSchema,
});

const claims = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/claims' }),
  schema: z.object({
    id: z.string(), subjectType: z.enum(['model', 'paper']), subjectId: z.string(), fieldPath: z.string(),
    status: z.union([z.literal('verified'), z.enum(['not_disclosed', 'not_applicable', 'not_reported', 'not_verified', 'not_published', 'unavailable'])]),
    evidenceIds: z.array(z.string()).default([]), evidenceNote: z.string().optional(),
  }),
});

const benchmarkRuns = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/benchmarkRuns' }),
  schema: z.object({
    id: z.string(), paperId: z.string().optional(), modelIds: z.array(z.string()), benchmark: z.string(),
    status: z.enum(['reported', 'reproduced', 'not_verified']), sourceIds: z.array(z.string()).default([]),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/guides' }),
  schema: z.object({
    id: z.string(), title_zh: z.string(), title_en: z.string(), lede_zh: z.string(), lede_en: z.string(),
    steps_zh: z.array(z.string()), steps_en: z.array(z.string()), note_zh: z.string(), note_en: z.string(),
  }),
});

const changeEvents = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/changeEvents' }),
  schema: z.object({
    id: z.string(), entityType: z.enum(['model', 'paper', 'family']), entityId: z.string(),
    eventType: z.enum(['release', 'evidence_checked', 'status_changed']), occurredAt: z.string(),
    sourceId: z.string().optional(), note: z.string().optional(),
  }),
});

export const collections = { models, papers, claims, benchmarkRuns, guides, changeEvents };
