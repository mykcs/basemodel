import { useRef } from 'react';
import { ConnectorLayer, FlowNode, type Anchor, type Carrier, type EdgeSpec, type Locale, type Tone } from './ResearchExplainerPrimitives';

export function SeedExplainer({ locale, step }: { locale: Locale; step: number }) {
  const zh = locale === 'zh';
  const sceneRef = useRef<HTMLDivElement>(null);
  const sameAction = 'click["Black"]';
  const edges: EdgeSpec[] = [
    { id: 'policy-rollout', from: 'seed-policy', to: 'seed-rollout', tone: 'state', fromAnchor: 'right', toAnchor: 'left', active: step >= 0 },
    { id: 'rollout-trajectory', from: 'seed-rollout', to: 'seed-trajectory', tone: 'env', fromAnchor: 'right', toAnchor: 'left', active: step >= 1 },
    { id: 'trajectory-hindsight', from: 'seed-trajectory', to: 'seed-hindsight', tone: 'experience', fromAnchor: 'bottom', toAnchor: 'top', active: step >= 2 },
    { id: 'policy-analyzer', from: 'seed-policy', to: 'seed-hindsight', tone: 'state', fromAnchor: 'bottom', toAnchor: 'left', shape: 'smooth', dashed: true, label: zh ? 'same checkpoint' : 'same checkpoint', active: step >= 2 },
    { id: 'trajectory-plain', from: 'seed-trajectory', to: 'seed-plain', tone: 'env', fromAnchor: 'left', toAnchor: 'top', shape: 'outside-left-down', active: step >= 3 },
    { id: 'trajectory-skill', from: 'seed-trajectory', to: 'seed-skill', tone: 'env', fromAnchor: 'right', toAnchor: 'top', shape: 'outside-right-down', active: step >= 3 },
    { id: 'hindsight-skill', from: 'seed-hindsight', to: 'seed-skill', tone: 'experience', fromAnchor: 'bottom', toAnchor: 'left', active: step >= 3 },
    { id: 'plain-opd', from: 'seed-plain', to: 'seed-opd', tone: 'signal', fromAnchor: 'bottom', toAnchor: 'left', active: step >= 4 },
    { id: 'skill-opd', from: 'seed-skill', to: 'seed-opd', tone: 'signal', fromAnchor: 'bottom', toAnchor: 'top', shape: 'between-y', active: step >= 4 },
    { id: 'trajectory-grpo', from: 'seed-trajectory', to: 'seed-grpo', tone: 'env', fromAnchor: 'right', toAnchor: 'top', shape: 'smooth', active: step >= 4 },
    { id: 'opd-optimizer', from: 'seed-opd', to: 'seed-optimizer', tone: 'signal', fromAnchor: 'bottom', toAnchor: 'left', active: step >= 4 },
    { id: 'grpo-optimizer', from: 'seed-grpo', to: 'seed-optimizer', tone: 'signal', fromAnchor: 'bottom', toAnchor: 'right', active: step >= 4 },
    { id: 'optimizer-next', from: 'seed-optimizer', to: 'seed-next', tone: 'persist', fromAnchor: 'right', toAnchor: 'left', active: step >= 5 },
    { id: 'next-loop', from: 'seed-next', to: 'seed-policy', tone: 'persist', fromAnchor: 'right', toAnchor: 'top', shape: 'loop-top', label: zh ? 'next rollout' : 'next rollout', active: step >= 5 },
  ];
  return (
    <>
      <div className="irx-diagram irx-seed-scene" ref={sceneRef} data-ui-audit="contrast layout">
        <FlowNode id="seed-policy" role="CURRENT POLICY" title="policy θt" detail={zh ? '这一轮的 actor；同一 checkpoint 也提供 hindsight analyzer 能力' : 'actor for this round; the same checkpoint also supplies hindsight analyzer capability'} tone="state" active={step === 0} complete={step > 0} className="seed-policy" />
        <FlowNode id="seed-rollout" role="ON-POLICY INTERACTION" title={zh ? '真实环境 rollout' : 'real environment rollout'} detail="observation · sampled actions · outcome" tone="env" active={step === 0} complete={step > 0} className="seed-rollout" />
        <FlowNode id="seed-trajectory" role="SEALED EPISODE" title={zh ? '完整 trajectory' : 'completed trajectory'} detail={zh ? '动作已经采样完成；后面只重打分，不重新生成“正确轨迹”' : 'actions are already sampled; later stages re-score them rather than generate a new “correct trajectory”'} tone="experience" active={step === 1} complete={step > 1} className="seed-trajectory" />
        <FlowNode id="seed-hindsight" role="HINDSIGHT ANALYZER" title="hindsight skill" detail={zh ? '同一 checkpoint 看完 episode 后提取“早知道什么会更好”' : 'the same checkpoint extracts what hindsight would have helped after seeing the whole episode'} tone="experience" active={step === 2} complete={step > 2} className="seed-hindsight" />
        <FlowNode id="seed-plain" role="CONTEXT A" title="plain context" detail={`${sameAction} · P_plain`} tone="env" active={step === 3} complete={step > 3} className="seed-plain" />
        <FlowNode id="seed-skill" role="CONTEXT B" title="skill-augmented context" detail={`${sameAction} · P_skill`} tone="experience" active={step === 3} complete={step > 3} className="seed-skill" />
        <FlowNode id="seed-opd" role="DENSE LEARNING SIGNAL" title="OPD" detail={zh ? '同一 action 在两个 context 下的概率变化' : 'probability shift of the same action under two contexts'} tone="signal" active={step === 4} complete={step > 4} className="seed-opd" />
        <FlowNode id="seed-grpo" role="OUTCOME RL SIGNAL" title="GRPO" detail={zh ? '来自 environment reward / relative outcome' : 'from environment reward / relative outcome'} tone="signal" active={step === 4} complete={step > 4} className="seed-grpo" />
        <FlowNode id="seed-optimizer" role="OPTIMIZER" title="GRPO + OPD" detail={zh ? '稀疏结果信号与稠密 hindsight 信号合并更新 policy' : 'sparse outcome signal and dense hindsight signal merge to update the policy'} tone="signal" active={step === 4} complete={step > 4} className="seed-optimizer" />
        <FlowNode id="seed-next" role="NEXT POLICY" title="policy θt+1" detail={zh ? '真正保留下来的，是更新后的参数；下一轮直接加载新 checkpoint' : 'what persists is the updated parameter state; the next rollout loads the new checkpoint'} tone="persist" active={step === 5} className="seed-next" />
        <ConnectorLayer containerRef={sceneRef} edges={edges} ariaLabel={zh ? 'SEED 双上下文重打分、OPD 与 GRPO 合流、参数更新与下一轮回环' : 'SEED dual-context re-scoring, OPD/GRPO merge, parameter update, and next-round feedback loop'} />
      </div>
      <div className="irx-probability-panel" data-active={step === 3} data-ui-audit="contrast layout">
        <div className="irx-same-action"><span>{zh ? '固定同一批 sampled action tokens' : 'hold the same sampled action tokens fixed'}</span><code>{sameAction}</code></div>
        <div className="irx-prob-row"><label>P_plain(action)</label><div><i style={{ width: '28%' }}></i></div><b>0.28</b></div>
        <div className="irx-prob-row irx-prob-row-skill"><label>P_skill(action)</label><div><i style={{ width: '62%' }}></i></div><b>0.62</b></div>
        <small>{zh ? '教学示例概率，只用于解释“同一动作、两个 context、概率变化”；不是论文或本项目实测值。' : 'Illustrative probabilities only, used to explain “same action, two contexts, probability shift”; these are not measured paper/project values.'}</small>
      </div>
    </>
  );
}

export function OpenEvoExplainer({ locale, step, carrier, setCarrier, onStep }: { locale: Locale; step: number; carrier: Carrier; setCarrier: (carrier: Carrier) => void; onStep: (step: number) => void }) {
  const zh = locale === 'zh';
  const sceneRef = useRef<HTMLDivElement>(null);
  const carriers: Array<{ id: Carrier; title: string; detail: string; tone: Tone }> = [
    { id: 'memory', title: 'MEMORY', detail: zh ? '经验留在模型外，后续检索 / 注入' : 'experience stays outside the model for later retrieval/injection', tone: 'experience' },
    { id: 'artifact', title: 'AGENT ARTIFACT', detail: zh ? '工具、技能、策略文件或 system state' : 'tools, skills, policy files, or system state', tone: 'experience' },
    { id: 'adapter', title: 'PARAMETRIC ADAPTER', detail: zh ? '参数化 carrier；当前 WebShop 实例使用 SD-LoRA 路径' : 'parametric carrier; the current WebShop instance uses the SD-LoRA path', tone: 'state' },
  ];
  const edges: EdgeSpec[] = [
    { id: 'head-task', from: 'evo-head', to: 'evo-task', tone: 'state', fromAnchor: 'right', toAnchor: 'left', active: step >= 0 },
    { id: 'task-evidence', from: 'evo-task', to: 'evo-evidence', tone: 'env', fromAnchor: 'right', toAnchor: 'left', active: step >= 1 },
    { id: 'evidence-method', from: 'evo-evidence', to: 'evo-method', tone: 'experience', fromAnchor: 'bottom', toAnchor: 'top', active: step >= 2 },
    ...carriers.map((item) => ({ id: `method-${item.id}`, from: 'evo-method', to: `evo-${item.id}`, tone: item.tone, fromAnchor: 'bottom' as Anchor, toAnchor: 'top' as Anchor, active: step >= 3 })),
    ...carriers.map((item) => ({ id: `${item.id}-validation`, from: `evo-${item.id}`, to: 'evo-validation', tone: item.tone, fromAnchor: 'bottom' as Anchor, toAnchor: 'top' as Anchor, active: step >= 4 })),
    { id: 'validation-successor', from: 'evo-validation', to: 'evo-successor', tone: 'persist', fromAnchor: 'bottom', toAnchor: 'top', active: step >= 5 },
    { id: 'successor-next', from: 'evo-successor', to: 'evo-next', tone: 'persist', fromAnchor: 'right', toAnchor: 'left', active: step >= 6 },
    { id: 'next-loop', from: 'evo-next', to: 'evo-head', tone: 'persist', fromAnchor: 'right', toAnchor: 'top', shape: 'loop-top', label: zh ? 'successor revision 生效' : 'successor revision activates', active: step >= 6 },
  ];
  return (
    <>
      <div className="irx-diagram irx-openevo-scene" ref={sceneRef} data-ui-audit="contrast layout">
        <FlowNode id="evo-head" role="PROJECT HEAD" title={zh ? '当前 agent revision' : 'current agent revision'} detail="Qwen2.5-3B-Instruct + current carrier state" tone="state" active={step === 0} complete={step > 0} className="evo-head" />
        <FlowNode id="evo-task" role="TASK N · ENVIRONMENT" title="WebShop / ALFWorld" detail="observation · action · outcome" tone="env" active={step === 0} complete={step > 0} className="evo-task" />
        <FlowNode id="evo-evidence" role="TASK COMPLETION BOUNDARY" title="SEALED EVIDENCE" detail={zh ? 'trajectory + outcome + metadata 先冻结，再允许演化' : 'trajectory + outcome + metadata are frozen before evolution'} tone="experience" active={step === 1} complete={step > 1} className="evo-evidence" />
        <FlowNode id="evo-method" role="EVOLUTION METHOD" title={zh ? '反思 / 提炼 / 参数演变' : 'reflection / extraction / parametric evolution'} detail={zh ? '方法读取已封存 evidence，不改写刚完成的 Task N' : 'the method reads sealed evidence and does not rewrite the completed Task N'} tone="experience" active={step === 2} complete={step > 2} className="evo-method" />
        <div className="irx-carrier-lane" data-active={step === 3}>
          {carriers.map((item) => (
            <button key={item.id} type="button" className={`irx-carrier irx-tone-${item.tone}`} data-flow-id={`evo-${item.id}`} data-ui-audit-item data-selected={carrier === item.id} onClick={() => { setCarrier(item.id); onStep(Math.max(step, 3)); }} aria-pressed={carrier === item.id}>
              <span>CARRIER</span><strong>{item.title}</strong><small>{item.detail}</small>{item.id === 'adapter' && <em>{zh ? '当前 WebShop 实例' : 'current WebShop instance'}</em>}
            </button>
          ))}
        </div>
        <section className="irx-validation" data-flow-id="evo-validation" data-ui-audit-item data-active={step === 4}>
          <span>VALIDATION GATE</span><strong>{zh ? '只有通过 gate 的状态，才能进入 successor revision' : 'only state that passes the gate can enter the successor revision'}</strong>
          <ol>{['identity', 'digest', 'fresh reload', 'behavior probe', 'scientific contract'].map((item) => <li key={item}><b>{item}</b><small>{step >= 4 ? 'REQUIRED' : '—'}</small></li>)}</ol>
        </section>
        <FlowNode id="evo-successor" role="SUCCESSOR REVISION" title={zh ? '验证通过的下一版 agent 状态' : 'validated next agent state'} detail={zh ? `当前查看 carrier: ${carrier}` : `inspecting carrier: ${carrier}`} tone="persist" active={step === 5} complete={step > 5} className="evo-successor" />
        <FlowNode id="evo-next" role="TASK N+1" title={zh ? '下一任务加载 successor revision' : 'next task loads the successor revision'} detail={zh ? '新的任务从“已经进化过的状态”开始，而不是改写已经结束的 Task N' : 'the new task starts from an evolved state rather than rewriting the completed Task N'} tone="env" active={step === 6} className="evo-next" />
        <ConnectorLayer containerRef={sceneRef} edges={edges} ariaLabel={zh ? 'OpenEvo 在任务完成后封存证据，真正分叉成多种 carrier，经 validation 合流为 successor revision，再进入 Task N+1' : 'OpenEvo seals evidence after task completion, truly fans out into multiple carriers, merges through validation into a successor revision, then enters Task N+1'} />
      </div>
      <aside className="irx-instance-strip" data-ui-audit="contrast layout">
        <div><small>{zh ? '当前 WebShop 的一个具体参数化实例' : 'one concrete parametric WebShop instance'}</small><strong>trajectory · dataset adapter · OpenEvo SD-LoRA · adapter artifact · fresh reload · real rollout</strong></div>
        <p><b>OpenEvo ≠ SD-LoRA.</b> {zh ? 'SD-LoRA 只是当前参数化 evolution carrier / method path 的一部分。' : 'SD-LoRA is only one part of the current parametric evolution carrier/method path.'}</p>
      </aside>
    </>
  );
}

export function CompareExplainer({ locale, step }: { locale: Locale; step: number }) {
  const zh = locale === 'zh';
  const sceneRef = useRef<HTMLDivElement>(null);
  const edges: EdgeSpec[] = [
    { id: 'shared-seed', from: 'cmp-shared', to: 'cmp-seed-start', tone: 'signal', fromAnchor: 'bottom', toAnchor: 'top', active: step >= 1 },
    { id: 'shared-evo', from: 'cmp-shared', to: 'cmp-evo-start', tone: 'state', fromAnchor: 'bottom', toAnchor: 'top', active: step >= 1 },
  ];
  const seedSteps = ['hindsight', 'OPD + GRPO', 'policy θt+1', zh ? 'model parameters' : 'model parameters'];
  const evoSteps = ['sealed evidence', 'evolution method', 'carrier + validation', 'successor revision'];
  return (
    <div className="irx-diagram irx-compare-scene" ref={sceneRef} data-ui-audit="contrast layout">
      <FlowNode id="cmp-shared" role="SHARED EXPERIENCE" title="task · observations · sampled actions · outcome" detail={zh ? '两种方法从同样的一次已完成经验开始比较' : 'compare both methods from the same completed experience'} tone="experience" active={step === 0} complete={step > 0} className="cmp-shared" />
      <section className="irx-method-lane irx-method-seed" data-ui-audit-item>
        <header><span>SEED</span><strong>{zh ? '经验被训练信号化，再写回 policy 参数' : 'experience becomes learning signal, then writes back into policy parameters'}</strong></header>
        <ol>{seedSteps.map((item, index) => <li key={item} data-active={step >= Math.min(index + 1, 4)}><span>{String(index + 1).padStart(2, '0')}</span><b data-flow-id={index === 0 ? 'cmp-seed-start' : undefined}>{item}</b></li>)}</ol>
      </section>
      <section className="irx-method-lane irx-method-evo" data-ui-audit-item>
        <header><span>OpenEvo</span><strong>{zh ? '经验跨过 task boundary，经 carrier 与 validation 形成可继承状态' : 'experience crosses the task boundary and becomes reusable state through carriers and validation'}</strong></header>
        <ol>{evoSteps.map((item, index) => <li key={item} data-active={step >= Math.min(index + 1, 4)}><span>{String(index + 1).padStart(2, '0')}</span><b data-flow-id={index === 0 ? 'cmp-evo-start' : undefined}>{item}</b></li>)}</ol>
      </section>
      <div className="irx-compare-question"><small>{zh ? '中心问题' : 'Core question'}</small><strong>{zh ? '这次经验最终以什么状态保存，并在什么时候生效？' : 'In what state does this experience persist, and when does it take effect?'}</strong></div>
      <ConnectorLayer containerRef={sceneRef} edges={edges} ariaLabel={zh ? '同一 shared experience 分叉到 SEED 与 OpenEvo 两条不同的更新和持久化路径' : 'One shared experience forks into distinct SEED and OpenEvo update/persistence paths'} />
    </div>
  );
}
