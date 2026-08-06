import { useEffect, useMemo, useState } from 'react';
import { architectureLabel, checkpointLabel, displayBoolean, displayUnknown, licenseLabel, modalityLabel, specializationLabel, statusLabel, tierLabel } from '../lib/format';
import { getMessages, type Locale } from '../i18n';
import type { AtlasModel } from '../lib/types';

export default function ModelComparison({ models, locale = 'zh' }: { models: AtlasModel[]; locale?: Locale }) {
  const m = getMessages(locale);
  const [selected, setSelected] = useState(models.slice(0, 2).map((model) => model.id));
  const [query, setQuery] = useState('');
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('models')?.split(',').map((id) => id.trim()).filter(Boolean) ?? [];
    const valid = requested.filter((id) => models.some((model) => model.id === id)).slice(0, 5);
    if (valid.length) setSelected(valid);
  }, [models]);
  const active = useMemo(() => selected.flatMap((id) => { const model = models.find((candidate) => candidate.id === id); return model ? [model] : []; }), [models, selected]);
  const visibleModels = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return models;
    return models.filter((model) => [model.name, model.vendor, model.family, model.generation, model.id].some((value) => value.toLowerCase().includes(needle)));
  }, [models, query]);
  const canStart = selected.length >= 2;
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 5 ? [...current, id] : current);
  const joiner = locale === 'zh' ? '、' : ', ';
  const rows: [string, (model: AtlasModel) => string][] = [
    [m.compareRows.vendor, (x) => x.vendor],
    [m.compareRows.familyGen, (x) => `${x.family} / ${x.generation}`],
    [m.compareRows.release, (x) => x.release_date],
    [m.compareRows.architecture, (x) => architectureLabel(x.architecture.type, locale)],
    [m.compareRows.totalParams, (x) => displayUnknown(x.architecture.total_parameters_b, 'B', locale)],
    [m.compareRows.activeParams, (x) => displayUnknown(x.architecture.active_parameters_b, 'B', locale)],
    [m.compareRows.context, (x) => displayUnknown(x.architecture.context_length, m.detail.tokensSuffix, locale)],
    [m.compareRows.modalities, (x) => x.checkpoint.modalities.map((value) => modalityLabel(value, locale)).join(joiner)],
    [m.compareRows.specializations, (x) => x.checkpoint.specializations.map((value) => specializationLabel(value, locale)).join(joiner) || m.format.unknown],
    [m.compareRows.checkpoint, (x) => checkpointLabel(x.checkpoint.type, locale)],
    [m.compareRows.openWeights, (x) => displayBoolean(x.openness.weights_available, locale)],
    [m.compareRows.license, (x) => licenseLabel(x.openness.license_name, locale)],
    [m.compareRows.loraSftRl, (x) => `${displayBoolean(x.research.suitable_for_lora, locale)} / ${displayBoolean(x.research.suitable_for_sft, locale)} / ${displayBoolean(x.research.suitable_for_rl, locale)}`],
    [m.compareRows.inferenceTier, (x) => tierLabel(x.hardware.inference_tier, locale)],
    [m.compareRows.dataStatus, (x) => statusLabel(x.data_status, locale)],
  ];
  return <div className="comparison-shell"><div className="comparison-picker"><div><span className="section-kicker">{m.compare.selectKicker}</span><h2>{m.compare.selectTitle}</h2><p className="muted">{m.compare.selected} {selected.length} / 5 {canStart ? '' : m.compare.minTwo}</p></div><div><label className="field" htmlFor="compare-search"><span>{m.compare.searchLabel}</span><input id="compare-search" type="search" value={query} placeholder={m.compare.searchPlaceholder} onChange={(event) => setQuery(event.target.value)} /></label><div className="picker-list">{visibleModels.map((model) => <label className={`picker-item ${selected.includes(model.id) ? 'is-selected' : ''}`} key={model.id}><input type="checkbox" checked={selected.includes(model.id)} onChange={() => toggle(model.id)} /><span>{model.name}</span></label>)}</div>{visibleModels.length === 0 && <p className="muted">{m.compare.noMatches}</p>}</div></div>{active.length >= 2 ? <div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>{m.compare.dimension}</th>{active.map((model) => <th key={model.id}>{model.name}</th>)}</tr></thead><tbody>{rows.map(([label, value]) => { const values = active.map(value); const differs = new Set(values).size > 1; return <tr key={label} className={differs ? 'comparison-row-diff' : undefined}><th>{label}{differs && <span className="diff-badge">{m.compare.diff}</span>}</th>{values.map((cell, index) => <td className={differs ? 'is-diff' : undefined} key={active[index].id}>{cell}</td>)}</tr>; })}</tbody></table></div> : <div className="empty-state">{m.compare.empty}</div>}</div>;
}
