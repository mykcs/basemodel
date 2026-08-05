import { useEffect, useMemo, useState } from 'react';
import { filterModels, parseOptionalBooleanParam, sortModels, type ModelFilters } from '../lib/modelFilters';
import { displayBoolean, statusLabel } from '../lib/format';
import { getMessages, localePath, type Locale } from '../i18n';
import type { AtlasModel } from '../lib/types';

export default function ModelExplorer({ models, paperModelIds, locale = 'zh' }: { models: AtlasModel[]; paperModelIds: string[]; locale?: Locale }) {
  const m = getMessages(locale);
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const booleanParam = (name: string) => parseOptionalBooleanParam(params.get(name));
  const [filters, setFilters] = useState<ModelFilters>({
    query: params.get('q') ?? '',
    vendor: params.get('vendor') ?? undefined,
    family: params.get('family') ?? undefined,
    generation: params.get('generation') ?? undefined,
    architecture: (params.get('architecture') as ModelFilters['architecture']) ?? undefined,
    checkpoint: (params.get('checkpoint') as ModelFilters['checkpoint']) ?? undefined,
    modality: (params.get('modality') as ModelFilters['modality']) ?? undefined,
    openWeights: booleanParam('openWeights'),
    finetuning: booleanParam('finetuning'),
    rl: booleanParam('rl'),
    paperUse: booleanParam('paperUse'),
    resource: (params.get('resource') as ModelFilters['resource']) ?? undefined,
    specialization: params.get('specialization') ?? undefined,
    minParams: params.get('minParams') ? Number(params.get('minParams')) : undefined,
    maxParams: params.get('maxParams') ? Number(params.get('maxParams')) : undefined,
  });
  const [sort, setSort] = useState<'release' | 'parameters' | 'name'>('release');
  const [showFilters, setShowFilters] = useState(false);
  const result = useMemo(() => sortModels(filterModels(models, filters, new Set(paperModelIds)), sort), [models, filters, paperModelIds, sort]);
  const vendors = [...new Set(models.map((model) => model.vendor))];
  const families = [...new Set(models.map((model) => model.family))];
  const generations = [...new Set(models.map((model) => model.generation))];
  const specializations = [...new Set(models.flatMap((model) => model.checkpoint.specializations))];
  const resourceOptions: [string, string][] = [['', m.explorer.any], ...(Object.keys(m.format.tier) as Array<keyof typeof m.format.tier>).filter((key) => key !== 'unknown').map((key) => [key, m.format.tier[key]] as [string, string])];
  const modalityOptions: [string, string][] = [['', m.explorer.any], ...(Object.keys(m.modalities) as Array<keyof typeof m.modalities>).map((key) => [key, m.modalities[key]] as [string, string])];
  const paramOptions: [string, string][] = [['', m.explorer.any], ['1', '≥1B'], ['3', '≥3B'], ['7', '≥7B'], ['14', '≥14B'], ['32', '≥32B'], ['70', '≥70B'], ['100', '≥100B']];

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.query) next.set('q', filters.query);
    if (filters.vendor) next.set('vendor', filters.vendor);
    if (filters.family) next.set('family', filters.family);
    if (filters.generation) next.set('generation', filters.generation ?? '');
    if (filters.architecture) next.set('architecture', filters.architecture);
    if (filters.checkpoint) next.set('checkpoint', filters.checkpoint);
    if (filters.modality) next.set('modality', filters.modality);
    if (filters.openWeights !== undefined) next.set('openWeights', String(filters.openWeights));
    if (filters.finetuning !== undefined) next.set('finetuning', String(filters.finetuning));
    if (filters.rl !== undefined) next.set('rl', String(filters.rl));
    if (filters.paperUse !== undefined) next.set('paperUse', String(filters.paperUse));
    if (filters.resource) next.set('resource', filters.resource);
    if (filters.specialization) next.set('specialization', filters.specialization);
    if (filters.minParams !== undefined) next.set('minParams', String(filters.minParams));
    if (filters.maxParams !== undefined) next.set('maxParams', String(filters.maxParams));
    window.history.replaceState({}, '', `${window.location.pathname}${next.toString() ? `?${next}` : ''}`);
  }, [filters]);

  const update = (key: keyof ModelFilters, value: string | boolean | number | undefined) => setFilters((current) => ({ ...current, [key]: value === '' ? undefined : value }));
  const clear = () => setFilters({});
  const yesNo: [string, string][] = [['', m.explorer.any], ['true', m.explorer.yes], ['false', m.explorer.no]];
  const haveNot: [string, string][] = [['', m.explorer.any], ['true', m.explorer.have], ['false', m.explorer.haveNot]];
  return <section className="explorer-shell">
    <div className="explorer-toolbar"><label className="search-field"><span className="sr-only">{m.explorer.searchLabel}</span><input value={filters.query ?? ''} onChange={(event) => update('query', event.target.value)} placeholder={m.explorer.searchPlaceholder} /></label><button className="button button-secondary filter-button" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters}>{m.explorer.filter} {showFilters ? '↑' : '↓'}</button><label className="sort-field"><span>{m.explorer.sort}</span><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="release">{m.explorer.sortRelease}</option><option value="parameters">{m.explorer.sortParams}</option><option value="name">{m.explorer.sortName}</option></select></label></div>
    {showFilters && <div className="filter-panel">
      <Select label={m.explorer.vendor} value={filters.vendor ?? ''} onChange={(value) => update('vendor', value)} options={[['', m.explorer.allVendors], ...vendors.map((value) => [value, value])]} />
      <Select label={m.explorer.family} value={filters.family ?? ''} onChange={(value) => update('family', value)} options={[['', m.explorer.allFamilies], ...families.map((value) => [value, value])]} />
      <Select label={m.explorer.generation} value={filters.generation ?? ''} onChange={(value) => update('generation', value)} options={[['', m.explorer.allGenerations], ...generations.map((value) => [value, value])]} />
      <Select label={m.explorer.architecture} value={filters.architecture ?? ''} onChange={(value) => update('architecture', value)} options={[['', m.explorer.allArchitectures], ['dense', 'Dense'], ['moe', 'MoE'], ['other', m.explorer.other]]} />
      <Select label={m.explorer.checkpoint} value={filters.checkpoint ?? ''} onChange={(value) => update('checkpoint', value)} options={[['', m.explorer.allCheckpoints], ['base', 'Base'], ['instruct', 'Instruct'], ['thinking', 'Thinking'], ['coder', 'Coder'], ['vision', 'Vision']]} />
      <Select label={m.explorer.modality} value={filters.modality ?? ''} onChange={(value) => update('modality', value)} options={modalityOptions} />
      <Select label={m.explorer.minParams} value={filters.minParams === undefined ? '' : String(filters.minParams)} onChange={(value) => update('minParams', value === '' ? undefined : Number(value))} options={paramOptions} />
      <Select label={m.explorer.specialization} value={filters.specialization ?? ''} onChange={(value) => update('specialization', value)} options={[['', m.explorer.allSpecializations], ...specializations.map((value) => [value, value])]} />
      <Select label={m.explorer.openWeights} value={filters.openWeights === undefined ? '' : String(filters.openWeights)} onChange={(value) => update('openWeights', value === '' ? undefined : value === 'true')} options={yesNo} />
      <Select label={m.explorer.finetuning} value={filters.finetuning === undefined ? '' : String(filters.finetuning)} onChange={(value) => update('finetuning', value === '' ? undefined : value === 'true')} options={yesNo} />
      <Select label={m.explorer.rl} value={filters.rl === undefined ? '' : String(filters.rl)} onChange={(value) => update('rl', value === '' ? undefined : value === 'true')} options={yesNo} />
      <Select label={m.explorer.paperUse} value={filters.paperUse === undefined ? '' : String(filters.paperUse)} onChange={(value) => update('paperUse', value === '' ? undefined : value === 'true')} options={haveNot} />
      <Select label={m.explorer.hardwareTier} value={filters.resource ?? ''} onChange={(value) => update('resource', value)} options={resourceOptions} />
      <button className="text-button" onClick={clear}>{m.explorer.clearAll}</button>
    </div>}
    <div className="explorer-summary"><span>{m.explorer.showing} {result.length} {m.explorer.of} {models.length} {m.explorer.modelsUnit}</span><span className="muted">{paperModelIds.length} {m.explorer.withPapers}</span></div>
    <div className="model-grid">{result.map((model) => <article className="model-card" key={model.id}><div className="card-topline"><span className="eyebrow">{model.vendor}</span><span className={`status-badge status-${model.data_status}`}>{statusLabel(model.data_status, locale)}</span></div><h3><a href={localePath(locale, `/models/${model.id}/`)}>{model.name}</a></h3><p className="model-meta">{model.family} · {model.generation} · {model.release_date}</p><p className="model-architecture"><strong>{model.architecture.type === 'moe' ? 'MoE' : model.architecture.type === 'dense' ? 'Dense' : m.explorer.other}</strong><span>{model.architecture.total_parameters_b === 'unknown' ? m.explorer.paramsUnknown : `${model.architecture.total_parameters_b}B total`}</span></p><div className="tag-row">{model.checkpoint.modalities.map((value) => <span className="tag" key={value}>{value}</span>)}<span className="tag">{model.checkpoint.type}</span>{model.openness.weights_available === true && <span className="tag tag-open">{m.explorer.openWeightsTag}</span>}</div><div className="card-footer"><span>RL: {displayBoolean(model.research.suitable_for_rl, locale)}</span><span>{paperModelIds.includes(model.id) ? m.explorer.hasPaper : m.explorer.noPaper}</span></div></article>)}</div>
    {result.length === 0 && <div className="empty-state"><strong>{m.explorer.emptyTitle}</strong><span>{m.explorer.emptyBody}</span></div>}
  </section>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([option, text]) => <option value={option} key={option}>{text}</option>)}</select></label>; }
