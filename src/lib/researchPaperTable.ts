export const paperTableText = (html: string) => html.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/g, ' ').replace(/&minus;|&#8722;/g, '−').replace(/&amp;/g, '&').trim();
export const isPaperTableNumeric = (text: string) => /^[+−-]?(?:\d[\d\s.,eE+−\-/%×±:()\[\]–—]*)(?:\s*(?:s|ms|h|GB|MB|MiB|GiB|bytes|%|分|题|次|轮|步|秒|小时))?$/u.test(text);
export function preparePaperTable(contents: string): string {
contents = contents.replace(/<caption\b([^>]*)>/g, (_tag, attrs: string) => '<caption' + attrs.replace(/\sclass=(?:"[^"]*"|'[^']*')/g, '') + '>');
contents = contents.replace(/<td\b([^>]*)>([\s\S]*?)<\/td>/g, (tag, attrs: string, value: string) => /\bdata-numeric(?:[\s=>]|$)/.test(attrs) || !isPaperTableNumeric(paperTableText(value)) ? tag : '<td' + attrs + ' data-numeric>' + value + '</td>');
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
return contents;
}
