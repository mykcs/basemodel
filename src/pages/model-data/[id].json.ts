import { getCollection } from 'astro:content';
import type { AtlasModel } from '../../lib/schemas';

export async function getStaticPaths() {
  const models = await getCollection('models');
  return models.map((entry) => ({ params: { id: entry.data.id }, props: { model: entry.data } }));
}

export function GET({ props }: { props: { model: AtlasModel } }) {
  return new Response(JSON.stringify(props.model), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
