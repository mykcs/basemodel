import { useMemo, useState } from 'react';
import { recommendModels } from '../lib/recommendation';
import type { AtlasModel, ExperimentMode, Goal, ResourceTier, TaskDirection } from '../lib/types';

type Props = { models: AtlasModel[] };

const modes: [ExperimentMode, string][] = [['inference', '仅推理 / Prompt'], ['lora', 'LoRA'], ['sft', 'SFT'], ['rl', 'RL / 自进化参数训练'], ['harness', '外部 Memory / Harness']];
const tasks: [TaskDirection, string][] = [['general', '通用 Agent'], ['webshop', 'WebShop / Web navigation'], ['alfworld', 'ALFWorld'], ['coding', 'Coding Agent'], ['research', 'Search / Deep Research'], ['math', '数学推理'], ['gui', 'GUI / 多模态 Agent'], ['chinese', '中文任务'], ['multilingual', '多语言任务']];
const resources: [ResourceTier, string][] = [['cpu_mac', 'CPU / Mac'], ['16gb', '16GB GPU'], ['24gb', '24GB GPU'], ['48gb', '48GB GPU'], ['80gb', '80GB GPU'], ['multi_gpu', '多卡 GPU'], ['api_only', 'API only']];
const goals: [Goal, string][] = [['comparability', '论文可比性'], ['current', '当前代模型'], ['low_cost', '低成本'], ['open_weights', '开放权重'], ['chinese', '中文能力'], ['tool_use', 'Agent / Tool use'], ['rl', '容易进行 RL']];
const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

export default function ExperimentSelector({ models }: Props) {
  const [mode, setMode] = useState<ExperimentMode>('inference');
  const [task, setTask] = useState<TaskDirection>('general');
  const [resource, setResource] = useState<ResourceTier>('24gb');
  const [goal, setGoal] = useState<Goal>('open_weights');
  const candidates = useMemo(() => recommendModels(models, { mode, task, resource, goal }), [models, mode, task, resource, goal]);

  return <div className="selector-shell">
    <div className="selector-fields">
      <Select label="实验方式" value={mode} onChange={(value) => setMode(value as ExperimentMode)} options={modes} />
      <Select label="任务方向" value={task} onChange={(value) => setTask(value as TaskDirection)} options={tasks} />
      <Select label="资源条件" value={resource} onChange={(value) => setResource(value as ResourceTier)} options={resources} />
      <Select label="优先目标" value={goal} onChange={(value) => setGoal(value as Goal)} options={goals} />
    </div>
    <div className="selector-result-head"><div><span className="section-kicker">Candidate set</span><h2>候选模型组合</h2></div><span className="result-count">{candidates.filter((item) => item.candidate).length} 个候选</span></div>
    <p className="muted">这是基于元数据和用户条件的规则筛选，不是性能排行榜；未知条件会被明确保留。</p>
    <div className="candidate-list">
      {candidates.slice(0, 4).map((item) => <article className={`candidate-row ${item.candidate ? 'is-candidate' : ''}`} key={item.model.id}>
        <div><strong>{item.model.name}</strong><span>{item.model.architecture.type.toUpperCase()} · {item.model.family}</span></div>
        <div className="candidate-evidence">{item.matched.slice(0, 3).map((value, index) => <span className="check-chip" key={`matched-${index}-${value}`}>✓ {value}</span>)}{item.missing.slice(0, 2).map((value, index) => <span className="unknown-chip" key={`missing-${index}-${value}`}>? {value}</span>)}</div>
        <a className="text-link" href={`${base}models/${item.model.id}/`}>查看 →</a>
      </article>)}
    </div>
  </div>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}</select></label>;
}
