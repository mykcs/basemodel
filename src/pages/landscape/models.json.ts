import { getCollection } from 'astro:content';
import { toLandscapeModelExport } from '../../lib/landscape';

export async function GET() {
  const models = (await getCollection('models')).map((entry) => toLandscapeModelExport(entry.data));
  return new Response(JSON.stringify({ models }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
