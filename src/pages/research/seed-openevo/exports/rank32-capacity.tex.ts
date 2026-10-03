import { RANK32_CAPACITY_TABLE } from '../../../../data/scientificResearchTables';
import { scientificTableToLatex } from '../../../../lib/scientificTable';
export const prerender = true;
export function GET() {
  return new Response(scientificTableToLatex(RANK32_CAPACITY_TABLE), {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'content-disposition': 'inline; filename="rank32-capacity.tex"' },
  });
}
