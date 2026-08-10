import { useEffect, useMemo, useRef, useState } from 'react';
import type { ResourceOptimizer, ResourcePrecision } from '../../../stores/researchTask';
import { CopyButton } from '../../common/CopyButton';

type Precision = ResourcePrecision;
type Optimizer = ResourceOptimizer;

export interface HardwareEstimateInput {
  parameters: number;
  context: number;
  batch: number;
  gpuCount: number;
  rank: number;
  precision: Precision;
  optimizer: Optimizer;
  kvCacheEnabled?: boolean;
}

export function estimateVram(input: HardwareEstimateInput) {
  const p = Math.max(0, input.parameters || 0);
  const c = Math.max(1, input.context || 1);
  const b = Math.max(1, input.batch || 1);
  const g = Math.max(1, Math.floor(input.gpuCount || 1));
  const r = Math.max(0, input.rank || 0);
  const bytes = { fp32: 4, bf16: 2, fp16: 2, int8: 1, int4: .5 }[input.precision];
  const weights = p * bytes;
  const kv = input.kvCacheEnabled === false ? 0 : p * (c / 4096) * b * .08;
  const inference = (weights + kv + Math.max(1, weights * .12)) / g * (g > 1 ? 1.12 : 1);
  const adapter = p * Math.min(.2, (r / 64) * .02) * 2;
  const optimizerState = input.optimizer === 'adam' ? p * 8 : input.optimizer === 'sgd' ? p * 4 : 0;
  const training = (weights + optimizerState + p * bytes + adapter + kv) / g * (g > 1 ? 1.2 : 1);
  const adapterMemory = (weights + adapter + kv) / g * (g > 1 ? 1.12 : 1);
  return { inference: Math.ceil(inference), training: Math.ceil(training), adapter: Math.ceil(adapterMemory), gpuCount: g };
}

interface HardwareCalculatorProps {
  locale?: 'zh' | 'en';
  initial?: Partial<HardwareEstimateInput>;
  onChange?: (input: HardwareEstimateInput) => void;
}

export function HardwareCalculator({ locale = 'zh', initial, onChange }: HardwareCalculatorProps) {
  const zh = locale === 'zh';
  const [parameters, setParameters] = useState(String(initial?.parameters ?? 7));
  const [context, setContext] = useState(String(initial?.context ?? 4096));
  const [batch, setBatch] = useState(String(initial?.batch ?? 1));
  const [gpuCount, setGpuCount] = useState(String(initial?.gpuCount ?? 1));
  const [rank, setRank] = useState(String(initial?.rank ?? 16));
  const [precision, setPrecision] = useState<Precision>(initial?.precision ?? 'bf16');
  const [optimizer, setOptimizer] = useState<Optimizer>(initial?.optimizer ?? 'adam');
  const [kvCacheEnabled, setKvCacheEnabled] = useState(initial?.kvCacheEnabled ?? true);
  const lastNotified = useRef('');
  const initialized = useRef(false);
  const result = useMemo(() => estimateVram({ parameters: Number(parameters), context: Number(context), batch: Number(batch), gpuCount: Number(gpuCount), rank: Number(rank), precision, optimizer, kvCacheEnabled }), [parameters, context, batch, gpuCount, rank, precision, optimizer, kvCacheEnabled]);
  const summary = useMemo(() => zh
    ? [`显存规划估算（不是硬件实测）`, `模型参数: ${parameters}B`, `上下文: ${context} tokens`, `Batch: ${batch}`, `GPU: ${result.gpuCount}`, `精度: ${precision}`, `优化器: ${optimizer}`, `LoRA rank: ${rank}`, `KV cache: ${kvCacheEnabled ? '计入' : '不计入'}`, `推理建议显存/卡: ≈ ${result.inference} GB`, `LoRA 建议显存/卡: ≈ ${result.adapter} GB`, `训练建议显存/卡: ≈ ${result.training} GB`].join('\n')
    : [`VRAM planning estimate (not a measured hardware result)`, `Parameters: ${parameters}B`, `Context: ${context} tokens`, `Batch: ${batch}`, `GPUs: ${result.gpuCount}`, `Precision: ${precision}`, `Optimizer: ${optimizer}`, `LoRA rank: ${rank}`, `KV cache: ${kvCacheEnabled ? 'included' : 'excluded'}`, `Inference planning/GPU: ≈ ${result.inference} GB`, `LoRA planning/GPU: ≈ ${result.adapter} GB`, `Training planning/GPU: ≈ ${result.training} GB`].join('\n'), [batch, context, gpuCount, kvCacheEnabled, optimizer, parameters, precision, rank, result, zh]);

  useEffect(() => {
    const input = { parameters: Number(parameters), context: Number(context), batch: Number(batch), gpuCount: Number(gpuCount), rank: Number(rank), precision, optimizer, kvCacheEnabled };
    const serialized = JSON.stringify(input);
    if (!initialized.current) { initialized.current = true; lastNotified.current = serialized; return; }
    if (onChange && serialized !== lastNotified.current) { lastNotified.current = serialized; onChange(input); }
  }, [parameters, context, batch, gpuCount, rank, precision, optimizer, kvCacheEnabled, onChange]);

  const field = (label: string, value: string, set: (value: string) => void, suffix?: string) => <label className="field"><span>{label}{suffix ? ` (${suffix})` : ''}</span><input type="number" min="0" value={value} onChange={(event) => set(event.target.value)} /></label>;

  return <section className="hardware-calculator" aria-labelledby="hardware-calculator-title">
    <div className="section-kicker">{zh ? '资源规划' : 'Resource planning'}</div>
    <h4 id="hardware-calculator-title">{zh ? '显存估算器' : 'VRAM estimator'}</h4>
    <p className="muted">{zh ? '用于实验前规划；这是透明的启发式估算，不是实测硬件结果。GPU 数量会改变每张卡的规划显存，并加入通信余量。' : 'For experiment planning; this is a transparent heuristic, not a measured hardware result. GPU count changes per-device planning memory and adds communication overhead.'}</p>
    <div className="task-form-grid task-form-grid-compact">{field(zh ? '模型参数' : 'Parameters', parameters, setParameters, 'B')}{field(zh ? '上下文长度' : 'Context', context, setContext, 'tokens')}{field(zh ? '批大小' : 'Batch', batch, setBatch)}{field(zh ? 'GPU 数量' : 'GPU count', gpuCount, setGpuCount)}{field(zh ? 'LoRA rank' : 'LoRA rank', rank, setRank)}<label className="field"><span>{zh ? '权重精度' : 'Precision'}</span><select value={precision} onChange={(event) => setPrecision(event.target.value as Precision)}>{['fp32', 'bf16', 'fp16', 'int8', 'int4'].map((value) => <option key={value}>{value}</option>)}</select></label><label className="field"><span>{zh ? '优化器' : 'Optimizer'}</span><select value={optimizer} onChange={(event) => setOptimizer(event.target.value as typeof optimizer)}><option value="adam">Adam</option><option value="sgd">SGD</option><option value="none">{zh ? '仅推理' : 'Inference only'}</option></select></label></div>
    <label className="check-row"><input type="checkbox" checked={kvCacheEnabled} onChange={(event) => setKvCacheEnabled(event.target.checked)} /> <span>{zh ? '计入 KV cache' : 'Include KV cache'}</span></label>
    <div className="hardware-results"><div><span>{zh ? '推理建议显存 / 卡' : 'Inference planning / GPU'}</span><strong>≈ {result.inference} GB</strong></div><div><span>{zh ? 'LoRA 建议显存 / 卡' : 'LoRA planning / GPU'}</span><strong>≈ {result.adapter} GB</strong></div><div><span>{zh ? '训练建议显存 / 卡' : 'Training planning / GPU'}</span><strong>≈ {result.training} GB</strong></div></div>
    <div className="actionable-result-actions"><CopyButton value={summary} label={zh ? '复制这组规划结果' : 'Copy planning result'} copiedLabel={zh ? '规划结果已复制' : 'Planning result copied'} /></div>
    <small className="muted">{zh ? `按 ${result.gpuCount} 张 GPU 规划；估算包含权重、激活、${kvCacheEnabled ? 'KV cache' : '不含 KV cache'} 与训练状态的保守余量。请用目标框架和真实 batch 做本地复测。` : `Planned across ${result.gpuCount} GPUs; includes conservative allowances for weights, activations, ${kvCacheEnabled ? 'KV cache' : 'no KV cache'}, and optimizer state. Re-measure locally with the target stack and batch.`}</small>
  </section>;
}
