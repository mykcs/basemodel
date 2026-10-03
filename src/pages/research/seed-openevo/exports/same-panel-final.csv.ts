import { SAME_PANEL_FINAL_TABLE } from '../../../../data/scientificResearchTables';
import { scientificTableToCsv } from '../../../../lib/scientificTable';
export const prerender = true;
export function GET() {
  return new Response(scientificTableToCsv(SAME_PANEL_FINAL_TABLE), {
    headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'inline; filename="same-panel-final.csv"' },
  });
}
