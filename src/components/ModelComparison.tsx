import { useMemo, useState } from 'react';
import { displayBoolean, displayUnknown, statusLabel, tierLabel } from '../lib/format';
import { getMessages, type Locale } from '../i18n';
import type { AtlasModel } from '../lib/types';

export default function ModelComparison({ models, locale = 'zh' }: { models: AtlasModel[]; locale?: Locale }) {
  const m = getMessages(locale);
  const [selected, setSelected] = useState(models.slice(0, 2).map((model) => model.id));
  const active = useMemo(() => models.filter((model) => selected.includes(model.id)), [models, selected]);
  const canStart = selected.length >= 2;
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 5 ? [...current, id] : current);
  const joiner = locale === 'zh' ? '、' : ', ';
  const rows: [string, (model: AtlasModel) => string][] = [
    [m.compareRows.vendor, (x) => x.vendor],
    [m.compareRows.familyGen, (x) => `${x.family} / ${x.generation}`],
    [m.compareRows.release, (x) => x.release_date],
    [m.compareRows.architecture, (x) => x.architecture.type.toUpperCase()],
    [m.compareRows.totalParams, (x) => displayUnknown(x.architecture.total_parameters_b, 'B', locale)],
    [m.compareRows.activeParams, (x) => displayUnknown(x.architecture.active_parameters_b, 'B', locale)],
    [m.compareRows.context, (x) => displayUnknown(x.architecture.context_length, m.detail.tokensSuffix, locale)],
    [m.compareRows.modalities, (x) => x.checkpoint.modalities.join(joiner)],
    [m.compareRows.specializations, (x) => x.checkpoint.specializations.join(joiner) || m.format.unknown],
    [m.compareRows.checkpoint, (x) => x.checkpoint.type],
    [m.compareRows.openWeights, (x) => displayBoolean(x.openness.weights_available, locale)],
    [m.compareRows.license, (x) => x.openness.license_name],
    [m.compareRows.loraSftRl, (x) => `${displayBoolean(x.research.suitable_for_lora, locale)} / ${displayBoolean(x.research.suitable_for_sft, locale)} / ${displayBoolean(x.research.suitable_for_rl, locale)}`],
    [m.compareRows.inferenceTier, (x) => tierLabel(x.hardware.inference_tier, locale)],
    [m.compareRows.dataStatus, (x) => statusLabel(x.data_status, locale)],
  ];
  return <div className="comparison-shell"><div className="comparison-picker"><div><span className="section-kicker">{m.compare.selectKicker}</span><h2>{m.compare.selectTitle}</h2><p className="muted">{m.compare.selected} {selected.length} / 5 {canStart ? '' : m.compare.minTwo}</p></div><div className="picker-list">{models.map((model) => <label className="picker-item" key={model.id}><input type="checkbox" checked={selected.includes(model.id)} onChange={() => toggle(model.id)} /><span>{model.name}</span></label>)}</div></div>{active.length >= 2 ? <div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>{m.compare.dimension}</th>{active.map((model) => <th key={model.id}>{model.name}</th>)}</tr></thead><tbody>{rows.map(([label, value]) => <tr key={label}><th>{label}</th>{active.map((model) => <td key={model.id}>{value(model)}</td>)}</tr>)}</tbody></table></div> : <div className="empty-state">{m.compare.empty}</div>}</div>;
}
