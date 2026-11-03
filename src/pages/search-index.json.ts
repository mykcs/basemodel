import { getCollection } from 'astro:content';
import { researchSearchEntries } from '../lib/researchSearch';

export const prerender = true;

export async function GET() {
  const models = await getCollection('models');
  const papers = await getCollection('papers');
  const families = [...new Map(models.map(({ data }) => [data.family, data.vendor])).entries()];
  const payload = [
    ...models.map(({ data }) => ({ type: 'model', id: data.id, title: data.name, subtitle: `${data.vendor} · ${data.family}`, aliases: data.aliases ?? [] })),
    ...papers.map(({ data }) => ({ type: 'paper', id: data.id, title: data.title, subtitle: data.category.join(' · '), category: data.category })),
    ...families.map(([family, vendor]) => ({ type: 'family', id: family, title: family, subtitle: vendor, path: '/families/' })),
    ...researchSearchEntries(),
  ];
  return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
}
