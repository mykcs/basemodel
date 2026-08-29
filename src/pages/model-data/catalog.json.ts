import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { modelIdsUsedByPapers } from '../../lib/modelRelations';

export const prerender = true;

export const GET: APIRoute = async () => {
  const models = (await getCollection('models')).map((entry) => entry.data);
  const papers = (await getCollection('papers')).map((entry) => entry.data);
  const paperModelIds = [...modelIdsUsedByPapers(papers)];
  return new Response(JSON.stringify({ models, papers, paperModelIds }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
