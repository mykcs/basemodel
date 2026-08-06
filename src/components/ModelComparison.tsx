import { useEffect, useMemo, useState } from 'react';
import { architectureLabel, checkpointLabel, displayBoolean, displayUnknown, licenseLabel, modalityLabel, specializationLabel, statusLabel, tierLabel } from '../lib/format';
import { getMessages, type Locale } from '../i18n';
import type { AtlasModel } from '../lib/types';

export default function ModelComparison({ models, locale = 'zh' }: { models: AtlasModel[]; locale?: Locale }) {
  const m = getMessages(locale);
  const [selected, setSelected] = useState(() => initialSelection(models));
  const [query, setQuery] = useState('');
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const active = useMemo(() => models.filter((model) => selected.includes(model.id)), [models, selected]);
  const visibleModels = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return models;
    return models.filter((model) => [model.name, model.vendor, model.family, model.generation, model.id].some((value) => value.toLowerCase().includes(needle)));
  }, [models, query]);
  const canStart = selected.length >= 2;
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 5 ? [...current, id] : current);

  useEffect(() => {
    const next = new URLSearchParams(window.location.search);
    if (selected.length) next.set('models', selected.join(','));
    else next.delete('models');
    window.history.replaceState({}, '', `${window.location.pathname}${next.toString() ? `?${next}` : ''}`);
  }, [selected]);

  const joiner = locale === 'zh' ? '、' : ', ';
  const rows: ComparisonRow[] = [
    { group: 'identity', label: m.compareRows.vendor, value: (x) => x.vendor },
    { group: 'identity', label: m.compareRows.familyGen, value: (x) => `${x.family} / ${x.generation}` },
    { group: 'identity', label: m.compareRows.release, value: (x) => x.release_date },
    { group: 'architecture', label: m.compareRows.architecture, value: (x) => architectureLabel(x.architecture.type, locale) },
    { group: 'architecture', label: m.compareRows.totalParams, value: (x) => displayUnknown(x.architecture.total_parameters_b, 'B', locale) },
    { group: 'architecture', label: m.compareRows.activeParams, value: (x) => displayUnknown(x.architecture.active_parameters_b, 'B', locale) },
    { group: 'architecture', label: m.compareRows.context, value: (x) => displayUnknown(x.architecture.context_length, m.detail.tokensSuffix, locale) },
    { group: 'architecture', label: m.compareRows.modalities, value: (x) => x.checkpoint.modalities.map((value) => modalityLabel(value, locale)).join(joiner) },
    { group: 'architecture', label: m.compareRows.specializations, value: (x) => x.checkpoint.specializations.map((value) => specializationLabel(value, locale)).join(joiner) || m.format.unknown },
    { group: 'access', label: m.compareRows.checkpoint, value: (x) => checkpointLabel(x.checkpoint.type, locale) },
    { group: 'access', label: m.compareRows.openWeights, value: (x) => displayBoolean(x.openness.weights_available, locale) },
    { group: 'access', label: m.compareRows.license, value: (x) => licenseLabel(x.openness.license_name, locale) },
    { group: 'research', label: m.compareRows.loraSftRl, value: (x) => `${displayBoolean(x.research.suitable_for_lora, locale)} / ${displayBoolean(x.research.suitable_for_sft, locale)} / ${displayBoolean(x.research.suitable_for_rl, locale)}` },
    { group: 'research', label: m.compareRows.inferenceTier, value: (x) => tierLabel(x.hardware.inference_tier, locale) },
    { group: 'evidence', label: m.compareRows.dataStatus, value: (x) => statusLabel(x.data_status, locale) },
  ];
  const visibleRows = rows.filter((row) => !onlyDifferences || new Set(active.map(row.value)).size > 1);
  const groupedRows = ['identity', 'architecture', 'access', 'research', 'evidence'].map((group) => ({ group: group as ComparisonRow['group'], rows: visibleRows.filter((row) => row.group === group) })).filter((section) => section.rows.length);

  return <div className="comparison-shell"><div className="comparison-picker"><div><span className="section-kicker">{m.compare.selectKicker}</span><h2>{m.compare.selectTitle}</h2><p className="muted">{m.compare.selected} {selected.length} / 5 {canStart ? '' : m.compare.minTwo}</p></div><div><label className="field" htmlFor="compare-search"><span>{m.compare.searchLabel}</span><input id="compare-search" type="search" value={query} placeholder={m.compare.searchPlaceholder} onChange={(event) => setQuery(event.target.value)} /></label><div className="picker-list">{visibleModels.map((model) => <label className={`picker-item ${selected.includes(model.id) ? 'is-selected' : ''}`} key={model.id}><input type="checkbox" checked={selected.includes(model.id)} disabled={!selected.includes(model.id) && selected.length >= 5} onChange={() => toggle(model.id)} /><span>{model.name}</span></label>)}</div>{visibleModels.length === 0 && <p className="muted">{m.compare.noMatches}</p>}</div></div>{active.length >= 2 ? <><div className="comparison-controls"><label className="comparison-mode"><input type="checkbox" checked={onlyDifferences} onChange={(event) => setOnlyDifferences(event.target.checked)} /><span>{onlyDifferences ? m.compare.allFields : m.compare.onlyDifferences}</span></label></div>{visibleRows.length ? <div className="comparison-table-wrap"><table className="comparison-table"><caption className="sr-only">{m.compare.title}</caption><thead><tr><th scope="col">{m.compare.dimension}</th>{active.map((model) => <th scope="col" key={model.id}>{model.name}</th>)}</tr></thead>{groupedRows.map((section) => <tbody key={section.group}><tr className="comparison-group"><th scope="rowgroup" colSpan={active.length + 1}>{m.compareGroups[section.group]}</th></tr>{section.rows.map((row) => { const values = active.map(row.value); const differs = new Set(values).size > 1; return <tr key={row.label} className={differs ? 'comparison-row-diff' : undefined}><th scope="row">{row.label}{differs && <span className="diff-badge">{m.compare.diff}</span>}</th>{values.map((cell, index) => <td className={differs ? 'is-diff' : undefined} key={active[index].id}>{cell}</td>)}</tr>; })}</tbody>)}</table></div> : <div className="empty-state">{m.compare.noDifferences}</div>}</> : <div className="empty-state">{m.compare.empty}</div>}</div>;
}

type ComparisonRow = { group: 'identity' | 'architecture' | 'access' | 'research' | 'evidence'; label: string; value: (model: AtlasModel) => string };

function initialSelection(models: AtlasModel[]): string[] {
  if (typeof window === 'undefined') return models.slice(0, 2).map((model) => model.id);
  const requested = new URLSearchParams(window.location.search).get('models')?.split(',').map((id) => id.trim()).filter(Boolean) ?? [];
  const available = new Set(models.map((model) => model.id));
  const selected = requested.filter((id, index) => available.has(id) && requested.indexOf(id) === index).slice(0, 5);
  return selected.length ? selected : models.slice(0, 2).map((model) => model.id);
}
