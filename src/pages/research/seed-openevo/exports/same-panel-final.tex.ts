import { SAME_PANEL_FINAL_TABLE } from '../../../../data/scientificResearchTables';
import { scientificTableToLatex } from '../../../../lib/scientificTable';
export const prerender = true;
export function GET() {
  return new Response(scientificTableToLatex(SAME_PANEL_FINAL_TABLE), {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'content-disposition': 'inline; filename="same-panel-final.tex"' },
  });
}
