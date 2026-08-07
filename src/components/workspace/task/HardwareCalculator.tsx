import { useMemo, useState } from 'react';

type Precision = 'fp32' | 'bf16' | 'fp16' | 'int8' | 'int4';
type Optimizer = 'adam' | 'sgd' | 'none';

export interface HardwareEstimateInput {
  parameters: number;
  context: number;
  batch: number;
  gpuCount: number;
  rank: number;
  precision: Precision;
  optimizer: Optimizer;
}

export function estimateVram(input: HardwareEstimateInput) {
  const p = Math.max(0, input.parameters || 0);
  const c = Math.max(1, input.context || 1);
  const b = Math.max(1, input.batch || 1);
  const g = Math.max(1, Math.floor(input.gpuCount || 1));
  const r = Math.max(0, input.rank || 0);
  const bytes = { fp32: 4, bf16: 2, fp16: 2, int8: 1, int4: .5 }[input.precision];
  const weights = p * bytes;
  const kv = p * (c / 4096) * b * .08;
  const inference = (weights + kv + Math.max(1, weights * .12)) / g * (g > 1 ? 1.12 : 1);
  const adapter = p * Math.min(.2, (r / 64) * .02) * 2;
  const optimizerState = input.optimizer === 'adam' ? p * 8 : input.optimizer === 'sgd' ? p * 4 : 0;
  const training = (weights + optimizerState + p * bytes + adapter + kv) / g * (g > 1 ? 1.2 : 1);
  const adapterMemory = (weights + adapter + kv) / g * (g > 1 ? 1.12 : 1);
  return { inference: Math.ceil(inference), training: Math.ceil(training), adapter: Math.ceil(adapterMemory), gpuCount: g };
}

export function HardwareCalculator({ locale = 'zh' }: { locale?: 'zh' | 'en' }) {
  const zh = locale === 'zh';
  const [parameters, setParameters] = useState('7');
  const [context, setContext] = useState('4096');
  const [batch, setBatch] = useState('1');
  const [gpuCount, setGpuCount] = useState('1');
  const [rank, setRank] = useState('16');
  const [precision, setPrecision] = useState<Precision>('bf16');
  const [optimizer, setOptimizer] = useState<Optimizer>('adam');
  const result = useMemo(() => {
    return estimateVram({ parameters: Number(parameters), context: Number(context), batch: Number(batch), gpuCount: Number(gpuCount), rank: Number(rank), precision, optimizer });
  }, [parameters, context, batch, gpuCount, rank, precision, optimizer]);
  const field = (label: string, value: string, set: (value: string) => void, suffix?: string) => <label className="field"><span>{label}{suffix ? ` (${suffix})` : ''}</span><input type="number" min="0" value={value} onChange={(event) => set(event.target.value)} /></label>;
  return <section className="hardware-calculator" aria-labelledby="hardware-calculator-title"><div className="section-kicker">{zh ? '资源规划' : 'Resource planning'}</div><h4 id="hardware-calculator-title">{zh ? '显存估算器' : 'VRAM estimator'}</h4><p className="muted">{zh ? '用于实验前规划；这是透明的启发式估算，不是实测硬件结果。GPU 数量会改变每张卡的规划显存，并加入通信余量。' : 'For experiment planning; this is a transparent heuristic, not a measured hardware result. GPU count changes per-device planning memory and adds communication overhead.'}</p><div className="task-form-grid task-form-grid-compact">{field(zh ? '模型参数' : 'Parameters', parameters, setParameters, 'B')}{field(zh ? '上下文长度' : 'Context', context, setContext, 'tokens')}{field(zh ? '批大小' : 'Batch', batch, setBatch)}{field(zh ? 'GPU 数量' : 'GPU count', gpuCount, setGpuCount)}{field(zh ? 'LoRA rank' : 'LoRA rank', rank, setRank)}<label className="field"><span>{zh ? '权重精度' : 'Precision'}</span><select value={precision} onChange={(event) => setPrecision(event.target.value as Precision)}>{['fp32', 'bf16', 'fp16', 'int8', 'int4'].map((value) => <option key={value}>{value}</option>)}</select></label><label className="field"><span>{zh ? '优化器' : 'Optimizer'}</span><select value={optimizer} onChange={(event) => setOptimizer(event.target.value as typeof optimizer)}><option value="adam">Adam</option><option value="sgd">SGD</option><option value="none">{zh ? '仅推理' : 'Inference only'}</option></select></label></div><div className="hardware-results"><div><span>{zh ? '推理建议显存 / 卡' : 'Inference planning / GPU'}</span><strong>≈ {result.inference} GB</strong></div><div><span>{zh ? 'LoRA 建议显存 / 卡' : 'LoRA planning / GPU'}</span><strong>≈ {result.adapter} GB</strong></div><div><span>{zh ? '训练建议显存 / 卡' : 'Training planning / GPU'}</span><strong>≈ {result.training} GB</strong></div></div><small className="muted">{zh ? `按 ${result.gpuCount} 张 GPU 规划；估算包含权重、激活、KV cache 与训练状态的保守余量。请用目标框架和真实 batch 做本地复测。` : `Planned across ${result.gpuCount} GPUs; includes conservative allowances for weights, activations, KV cache, and optimizer state. Re-measure locally with the target stack and batch.`}</small></section>;
}
