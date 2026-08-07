import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET() {
  const models = await getCollection('models');
  const papers = await getCollection('papers');
  const families = [...new Map(models.map(({ data }) => [data.family, data.vendor])).entries()];
  const payload = [
    ...models.map(({ data }) => ({ type: 'model', id: data.id, title: data.name, subtitle: `${data.vendor} · ${data.family}`, aliases: data.aliases ?? [] })),
    ...papers.map(({ data }) => ({ type: 'paper', id: data.id, title: data.title, subtitle: data.category.join(' · '), category: data.category })),
    ...families.map(([family, vendor]) => ({ type: 'family', id: family, title: family, subtitle: vendor, path: '/families/' })),
    { type: 'guide', id: 'guide', title: 'Guide', subtitle: 'Research workbench', path: '/guide/' },
    { type: 'guide', id: 'methodology', title: 'Methodology', subtitle: 'Data and evidence', path: '/methodology/' },
  ];
  return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
}
