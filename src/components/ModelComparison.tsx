import { useMemo, useState } from 'react';
import { displayBoolean, displayUnknown, tierLabel } from '../lib/format';
import type { AtlasModel } from '../lib/types';

export default function ModelComparison({ models }: { models: AtlasModel[] }) {
  const [selected, setSelected] = useState(models.slice(0, 2).map((model) => model.id));
  const active = useMemo(() => models.filter((model) => selected.includes(model.id)), [models, selected]);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 5 ? [...current, id] : current);
  const rows: [string, (model: AtlasModel) => string][] = [
    ['厂商', (m) => m.vendor], ['家族 / 代际', (m) => `${m.family} / ${m.generation}`], ['发布时间', (m) => m.release_date], ['架构', (m) => m.architecture.type.toUpperCase()], ['总参数', (m) => displayUnknown(m.architecture.total_parameters_b, 'B')], ['激活参数', (m) => displayUnknown(m.architecture.active_parameters_b, 'B')], ['Context', (m) => displayUnknown(m.architecture.context_length, ' tokens')], ['模态', (m) => m.checkpoint.modalities.join('、')], ['专长', (m) => m.checkpoint.specializations.join('、') || '未知'], ['Checkpoint', (m) => m.checkpoint.type], ['开放权重', (m) => displayBoolean(m.openness.weights_available)], ['许可证', (m) => m.openness.license_name], ['LoRA / SFT / RL', (m) => `${displayBoolean(m.research.suitable_for_lora)} / ${displayBoolean(m.research.suitable_for_sft)} / ${displayBoolean(m.research.suitable_for_rl)}`], ['推理档位', (m) => tierLabel(m.hardware.inference_tier)], ['数据状态', (m) => m.data_status],
  ];
  return <div className="comparison-shell"><div className="comparison-picker"><div><span className="section-kicker">Select 2–5</span><h2>选择 checkpoint</h2></div><div className="picker-list">{models.map((model) => <label className="picker-item" key={model.id}><input type="checkbox" checked={selected.includes(model.id)} onChange={() => toggle(model.id)} /><span>{model.name}</span></label>)}</div></div>{active.length > 0 ? <div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>维度</th>{active.map((model) => <th key={model.id}>{model.name}</th>)}</tr></thead><tbody>{rows.map(([label, value]) => <tr key={label}><th>{label}</th>{active.map((model) => <td key={model.id}>{value(model)}</td>)}</tr>)}</tbody></table></div> : <div className="empty-state">至少选择一个模型。</div>}</div>;
}
