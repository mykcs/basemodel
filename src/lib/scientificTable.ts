export type ScientificScalar = string | number | boolean | null;

export interface ScientificTableColumn {
  key: string;
  label: string;
  unit?: string;
  align?: 'left' | 'center' | 'right';
}

export interface ScientificTableCell {
  raw: ScientificScalar;
  display?: string;
}

export interface ScientificTableRow {
  id: string;
  label: string;
  group?: string;
  cells: Record<string, ScientificTableCell>;
}

export interface ScientificTableView {
  id: string;
  caption: string;
  comparisonId: string;
  rowHeaderLabel: string;
  columns: ScientificTableColumn[];
  rows: ScientificTableRow[];
  notes: string[];
  sourceIds: string[];
  exportBasePath: string;
}

const MISSING_CSV = 'NA';
const MISSING_TEX = String.raw`\textemdash{}`;

export function displayScientificCell(cell: ScientificTableCell): string {
  if (cell.raw === null) return '—';
  if (cell.display !== undefined) return cell.display;
  if (typeof cell.raw === 'boolean') return cell.raw ? '✓' : '—';
  return String(cell.raw);
}

export function scientificTableCell(row: ScientificTableRow, key: string, tableId = 'scientific-table'): ScientificTableCell {
  const cell = row.cells[key];
  if (!cell) throw new Error(`${tableId}/${row.id}: missing cell ${key}`);
  return cell;
}

function assertFiniteScalar(value: ScientificScalar, context: string): void {
  if (typeof value === 'number' && !Number.isFinite(value)) throw new Error(`${context} contains a non-finite number`);
}

export function validateScientificTableView(view: ScientificTableView): ScientificTableView {
  if (!view.id || !view.caption || !view.comparisonId || !view.rowHeaderLabel) throw new Error('Scientific table identity is incomplete');
  if (!view.columns.length || !view.rows.length) throw new Error(`${view.id}: table must contain columns and rows`);
  if (new Set(view.columns.map((column) => column.key)).size !== view.columns.length) throw new Error(`${view.id}: duplicate column key`);
  if (new Set(view.rows.map((row) => row.id)).size !== view.rows.length) throw new Error(`${view.id}: duplicate row id`);

  const keys = new Set(view.columns.map((column) => column.key));
  for (const row of view.rows) {
    if (!row.label) throw new Error(`${view.id}/${row.id}: missing row label`);
    for (const key of keys) {
      const cell = scientificTableCell(row, key, view.id);
      assertFiniteScalar(cell.raw, `${view.id}/${row.id}/${key}`);
    }
    for (const key of Object.keys(row.cells)) {
      if (!keys.has(key)) throw new Error(`${view.id}/${row.id}: unknown cell ${key}`);
    }
  }
  return view;
}

function csvFormulaSafe(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function csvField(value: ScientificScalar): string {
  const raw = value === null
    ? MISSING_CSV
    : typeof value === 'boolean'
      ? (value ? 'TRUE' : 'FALSE')
      : typeof value === 'number'
        ? String(value)
        : csvFormulaSafe(value);
  return `"${raw.replaceAll('"', '""')}"`;
}

function exportColumnLabel(column: ScientificTableColumn): string {
  return column.unit ? `${column.label} [${column.unit}]` : column.label;
}

export function scientificTableToCsv(input: ScientificTableView): string {
  const view = validateScientificTableView(input);
  const header = ['Group', view.rowHeaderLabel, ...view.columns.map(exportColumnLabel)].map(csvField).join(',');
  const rows = view.rows.map((row) => [
    row.group ?? '',
    row.label,
    ...view.columns.map((column) => scientificTableCell(row, column.key, view.id).raw),
  ].map(csvField).join(','));
  return [header, ...rows].join('\n') + '\n';
}

const texEscapes: Record<string, string> = {
  '\\': String.raw`\textbackslash{}`,
  '&': String.raw`\&`,
  '%': String.raw`\%`,
  '$': String.raw`\$`,
  '#': String.raw`\#`,
  '_': String.raw`\_`,
  '{': String.raw`\{`,
  '}': String.raw`\}`,
  '~': String.raw`\textasciitilde{}`,
  '^': String.raw`\textasciicircum{}`,
};

export function escapeLatexText(value: string): string {
  return [...value].map((char) => texEscapes[char] ?? char).join('');
}

function latexCell(value: ScientificScalar): string {
  if (value === null) return MISSING_TEX;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return String(value);
  return escapeLatexText(value);
}

export function scientificTableToLatex(input: ScientificTableView): string {
  const view = validateScientificTableView(input);
  const alignment = ['l', ...view.columns.map((column) => column.align === 'left' ? 'l' : column.align === 'center' ? 'c' : 'r')].join('');
  const header = [escapeLatexText(view.rowHeaderLabel), ...view.columns.map((column) => escapeLatexText(exportColumnLabel(column)))].join(' & ') + String.raw` \\`;
  const body: string[] = [];
  let activeGroup: string | undefined;
  for (const row of view.rows) {
    if (row.group && row.group !== activeGroup) {
      activeGroup = row.group;
      body.push(String.raw`\multicolumn{${view.columns.length + 1}}{l}{\textit{${escapeLatexText(row.group)}}} \\`);
    }
    body.push([
      escapeLatexText(row.label),
      ...view.columns.map((column) => latexCell(scientificTableCell(row, column.key, view.id).raw)),
    ].join(' & ') + String.raw` \\`);
  }
  const noteLines = view.notes.map((note) => `% ${note.replaceAll('\n', ' ')}`);
  return [
    String.raw`\begin{table}[htbp]`,
    String.raw`\centering`,
    `\\caption{${escapeLatexText(view.caption)}}`,
    `\\begin{tabular}{${alignment}}`,
    String.raw`\toprule`,
    header,
    String.raw`\midrule`,
    ...body,
    String.raw`\bottomrule`,
    String.raw`\end{tabular}`,
    ...noteLines,
    String.raw`\end{table}`,
    '',
  ].join('\n');
}
