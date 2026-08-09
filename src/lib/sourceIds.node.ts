import crypto from 'node:crypto';

export type SourceWithOptionalId = { id?: string; url: string };

export function normalizeSourceUrl(rawUrl: string): string {
  const url = new URL(rawUrl);
  url.hash = '';
  url.hostname = url.hostname.toLowerCase();
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
  url.searchParams.sort();
  return url.toString();
}

export function stableSourceId(rawUrl: string): string {
  return `src_${crypto.createHash('sha1').update(normalizeSourceUrl(rawUrl)).digest('hex').slice(0, 12)}`;
}

export function withStableSourceIds<T extends { sources: SourceWithOptionalId[] }>(record: T): T {
  return {
    ...record,
    sources: record.sources.map((source) => ({
      ...source,
      id: source.id ?? stableSourceId(source.url),
    })),
  } as T;
}
