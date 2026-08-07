export interface CompareExportModel { id: string; name: string }
export interface CompareExportRow { label: string; values: string[]; impact?: string }

function escapeCell(value: string): string {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function comparisonToMarkdown(models: CompareExportModel[], rows: CompareExportRow[]): string {
  const header = `| ${['字段', ...models.map((model) => escapeCell(model.name))].join(' | ')} |`;
  const divider = `| ${['---', ...models.map(() => '---')].join(' | ')} |`;
  const body = rows.map((row) => `| ${[escapeCell(row.label), ...row.values.map(escapeCell)].join(' | ')} |`).join('\n');
  return `## 模型对比\n\n${header}\n${divider}\n${body}`;
}

export function comparisonToCsv(models: CompareExportModel[], rows: CompareExportRow[]): string {
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  return [
    ['字段', ...models.map((model) => model.name)].map(quote).join(','),
    ...rows.map((row) => [row.label, ...row.values].map(quote).join(',')),
  ].join('\n');
}
