import { RANK32_CAPACITY_TABLE } from '../../../../data/scientificResearchTables';
import { scientificTableToCsv } from '../../../../lib/scientificTable';
export const prerender = true;
export function GET() {
  return new Response(scientificTableToCsv(RANK32_CAPACITY_TABLE), {
    headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'inline; filename="rank32-capacity.csv"' },
  });
}
