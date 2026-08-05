import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { modelSchema, paperSchema } from './lib/schemas';

const models = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/models' }),
  schema: modelSchema,
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/papers' }),
  schema: paperSchema,
});

export const collections = { models, papers };
