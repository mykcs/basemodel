export const paperTableText = (html: string) => html.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/g, ' ').replace(/&minus;|&#8722;/g, '−').replace(/&amp;/g, '&').trim();
export const isPaperTableNumeric = (text: string) => /^[+−-]?(?:\d[\d\s.,eE+−\-/%×±:()\[\]–—]*)(?:\s*(?:s|ms|h|GB|MB|MiB|GiB|bytes|%|分|题|次|轮|步|秒|小时))?$/u.test(text);
export function preparePaperTable(contents: string, narrowRecords = false): string {
contents = contents.replace(/<caption\b([^>]*)>/g, (_tag, attrs: string) => '<caption' + attrs.replace(/\sclass=(?:"[^"]*"|'[^']*')/g, '') + '>');
contents = contents.replace(/<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/g, (tag, kind: string, attrs: string, value: string) => /\bdata-numeric(?:[\s=>]|$)/.test(attrs) || !isPaperTableNumeric(paperTableText(value)) ? tag : '<' + kind + attrs + ' data-numeric>' + value + '</' + kind + '>');
const bodyRows = [...contents.matchAll(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/g)].flatMap(body => [...body[1]!.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map(row => [...row[1]!.matchAll(/<(?:th|td)\b([^>]*)>([\s\S]*?)<\/(?:th|td)>/g)]));
const widths = bodyRows.map(row => row.length);
const columns = Math.max(0, ...widths);
const numericColumns = new Set<number>();
for (let i = 0; i < columns; i++) {
  const values = bodyRows.filter(row => row.length === columns && row.every(cell => !/\b(?:colspan|rowspan)\s*=/.test(cell[1]!))).map(row => paperTableText(row[i]?.[2] ?? ''));
  if (values.some(isPaperTableNumeric) && values.every(value => isPaperTableNumeric(value) || /^(?:—|–|-|未运行|未测|待定|N\/A|NA|Not run|Not measured)$/i.test(value))) numericColumns.add(i);
}
contents = contents.replace(/<thead\b([^>]*)>([\s\S]*?)<\/thead>/g, (_tag, attrs: string, head: string) => {
  return '<thead' + attrs + '>' + head.replace(/<tr\b([^>]*)>([\s\S]*?)<\/tr>/g, (_row, rowAttrs: string, row: string) => {
    if (/\b(?:colspan|rowspan)\s*=/.test(row)) return '<tr' + rowAttrs + '>' + row + '</tr>';
    let column = 0;
    return '<tr' + rowAttrs + '>' + row.replace(/<th\b([^>]*)>/g, (tag, cellAttrs: string) => {
      const index = column++;
      return numericColumns.has(index) && !/\bdata-numeric(?:[\s=>]|$)/.test(cellAttrs) ? '<th' + cellAttrs + ' data-numeric>' : tag;
    }) + '</tr>';
  }) + '</thead>';
});
return narrowRecords ? preparePaperRecords(contents) : contents;
}

/** Keep the very same native cells on phones, with their column identity beside each value. */
export function preparePaperRecords(contents: string): string {
  const head = contents.match(/<thead\b[^>]*>([\s\S]*?)<\/thead>/)?.[1] ?? '';
  const rows = [...head.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)];
  const grid: string[][] = [];
  const span = (attrs: string, name: string) => Number(attrs.match(new RegExp('\\b' + name + '\\s*=\\s*["\']?(\\d+)', 'i'))?.[1] ?? 1);
  rows.forEach((row, y) => {
    grid[y] ??= [];
    let x = 0;
    for (const cell of row[1]!.matchAll(/<th\b([^>]*)>([\s\S]*?)<\/th>/g)) {
      while (grid[y]![x] !== undefined) x++;
      const width = span(cell[1]!, 'colspan'), height = span(cell[1]!, 'rowspan');
      for (let dy = 0; dy < height; dy++) {
        grid[y + dy] ??= [];
        for (let dx = 0; dx < width; dx++) grid[y + dy]![x + dx] = paperTableText(cell[2]!);
      }
      x += width;
    }
  });
  const width = Math.max(0, ...grid.map(row => row.length));
  const labels = Array.from({ length: width }, (_, x) => [...new Set(grid.map(row => row[x]).filter(Boolean))].join(' · '));
  if (!labels.length || labels.slice(1).some(label => !label)) throw new Error('Paper records need complete native column headings');
  const attribute = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return contents.replace(/<(tbody|tfoot)\b([^>]*)>([\s\S]*?)<\/\1>/g, (_body, group: string, attrs: string, body: string) => {
    return '<' + group + attrs + ' role="rowgroup">' + body.replace(/<tr\b([^>]*)>([\s\S]*?)<\/tr>/g, (_row, rowAttrs: string, row: string) => {
      if (/\browspan\s*=/.test(row)) throw new Error('Spanning body cells need an explicit narrow reading representation');
      let column = 0;
      const cells = row.replace(/<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/g, (_cell, kind: string, cellAttrs: string, value: string) => {
        const index = column, columns = span(cellAttrs, 'colspan');
        if (index === 0 && columns > 1) throw new Error('Spanning body cells need an explicit narrow reading representation');
        column += columns;
        const label = labels.slice(index, column).join(' · ');
        if (column > width || (index > 0 && !label)) throw new Error('Paper record has more cells than its native header');
        const first = index === 0;
        const tag = first ? 'th' : kind;
        const clean = cellAttrs.replace(/\s(?:scope|role)=(?:"[^"]*"|'[^']*')/g, '');
        const content = first ? value : '<div class="paper-record-value">' + value + '</div>';
        return '<' + tag + clean + (first ? ' scope="row" role="rowheader"' : ' role="cell"') + ' data-paper-label="' + attribute(label ?? '') + '">' + content + '</' + tag + '>';
      });
      if (column !== width) throw new Error('Paper record needs the same complete columns as its native header');
      return '<tr' + rowAttrs + ' role="row">' + cells + '</tr>';
    }) + '</' + group + '>';
  });
}
