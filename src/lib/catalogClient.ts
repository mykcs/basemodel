import { baseUrl } from '../i18n';
import type { AtlasModel, AtlasPaper } from './schemas';

export interface CatalogPayload {
  models: AtlasModel[];
  papers: AtlasPaper[];
  paperModelIds: string[];
}

let catalogRequest: Promise<CatalogPayload> | null = null;

export function loadCatalog(): Promise<CatalogPayload> {
  catalogRequest ??= fetch(`${baseUrl()}model-data/catalog.json`, { credentials: 'same-origin' }).then(async (response) => {
    if (!response.ok) throw new Error(`catalog unavailable (${response.status})`);
    return response.json() as Promise<CatalogPayload>;
  });
  return catalogRequest;
}
