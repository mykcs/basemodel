import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import type { AtlasModel } from '../../lib/schemas';

export const getStaticPaths = (async () => {
  const models = await getCollection('models');
  return models.map((entry) => ({ params: { id: entry.data.id }, props: { model: entry.data } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const model = props.model as AtlasModel;
  return new Response(JSON.stringify(model), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
};
