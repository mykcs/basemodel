import { useRef } from 'react';
import { ChipSequence, ConnectorLayer, DocStack, FlowNode, ParamGrid, ProbBar, type Anchor, type Carrier, type EdgeSpec, type Locale, type Tone } from './ResearchExplainerPrimitives';

const THETA_T = [0.3, 0.7, 0.5, 0.2, 0.6, 0.4, 0.8, 0.3, 0.5, 0.2, 0.6, 0.7, 0.4, 0.6, 0.3, 0.5];
const THETA_NEXT = [0.3, 0.7, 0.85, 0.2, 0.6, 0.15, 0.8, 0.3, 0.5, 0.75, 0.6, 0.7, 0.1, 0.6, 0.3, 0.5];
const THETA_CHANGED = THETA_T.map((value, index) => (value === THETA_NEXT[index] ? -1 : index)).filter((index) => index >= 0);

export function SeedExplainer({ locale, step }: { locale: Locale; step: number }) {
  const zh = locale === 'zh';
  const sceneRef = useRef<HTMLDivElement>(null);
  const moreLabel = zh ? '展开细节' : 'Expand detail';
  const sameAction = 'click["Black"]';
  // The sampled action tokens are ONE visual object: the same chip sequence is
  // rendered inside the sealed trajectory and inside both re-scoring contexts.
  const actionTokens = ['click', '[', '"Black"', ']'];
  const schematic = zh ? '参数网格为示意，非真实权重' : 'parameter grid is schematic, not real weights';
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
    { id: 'trajectory-grpo', from: 'seed-trajectory', to: 'seed-grpo', tone: 'env', fromAnchor: 'right', toAnchor: 'right', shape: 'loop-right', active: step >= 4 },
    { id: 'opd-optimizer', from: 'seed-opd', to: 'seed-optimizer', tone: 'signal', fromAnchor: 'bottom', toAnchor: 'left', active: step >= 4, weight: 'strong' },
    { id: 'grpo-optimizer', from: 'seed-grpo', to: 'seed-optimizer', tone: 'signal', fromAnchor: 'bottom', toAnchor: 'right', active: step >= 4, weight: 'strong' },
    { id: 'optimizer-next', from: 'seed-optimizer', to: 'seed-next', tone: 'persist', fromAnchor: 'right', toAnchor: 'left', active: step >= 5 },
    { id: 'next-loop', from: 'seed-next', to: 'seed-policy', tone: 'persist', fromAnchor: 'right', toAnchor: 'top', shape: 'loop-top', label: zh ? 'next rollout' : 'next rollout', active: step >= 5 },
  ];
  return (
    <>
      <div className="irx-diagram irx-seed-scene" ref={sceneRef} data-ui-audit="contrast layout">
        <FlowNode id="seed-policy" role="CURRENT POLICY" title="policy θt" detail={zh ? '这一轮的 actor；同一 checkpoint 也提供 hindsight analyzer 能力' : 'actor for this round; the same checkpoint also supplies hindsight analyzer capability'} moreLabel={moreLabel} more={zh ? 'θt 指当前训练轮次的 checkpoint；rollout 与 hindsight 分析共用同一份权重，因此“回看”不会引入另一个模型。' : 'θt is the checkpoint for this training round; rollout and hindsight analysis share the same weights, so the review never involves a second model.'} tone="state" active={step === 0} complete={step > 0} className="seed-policy">
          <ParamGrid label={`θt · ${schematic}`} cells={THETA_T} tone="state" className="seed-theta" />
        </FlowNode>
        <FlowNode id="seed-rollout" role="ON-POLICY INTERACTION" title={zh ? '真实环境 rollout' : 'real environment rollout'} detail="observation · sampled actions · outcome" moreLabel={moreLabel} more={zh ? 'on-policy 意味着动作来自当前 policy 本身，而不是旧数据或 teacher 演示。' : 'on-policy means actions come from the current policy itself, not stale data or teacher demonstrations.'} tone="env" active={step === 0} complete={step > 0} className="seed-rollout" />
        <FlowNode id="seed-trajectory" role="SEALED EPISODE" title={zh ? '完整 trajectory' : 'completed trajectory'} detail={zh ? '动作已经采样完成；后面只重打分，不重新生成“正确轨迹”' : 'actions are already sampled; later stages re-score them rather than generate a new “correct trajectory”'} moreLabel={moreLabel} more={zh ? '封存表示轨迹不再被改写；后续所有学习信号都指向这批已固定的 action token。' : 'Sealed means the trajectory is never rewritten; every later learning signal refers to these fixed action tokens.'} tone="experience" active={step === 1} complete={step > 1} className="seed-trajectory">
          <ChipSequence label={sameAction} tone="experience" tokens={actionTokens} className="seed-action-chips" />
        </FlowNode>
        <FlowNode id="seed-hindsight" role="HINDSIGHT ANALYZER" title="hindsight skill" detail={zh ? '同一 checkpoint 看完 episode 后提取“早知道什么会更好”' : 'the same checkpoint extracts what hindsight would have helped after seeing the whole episode'} moreLabel={moreLabel} more={zh ? 'skill 是文本形式的经验总结，只出现在重打分 context 中，不改写原轨迹。' : 'A skill is a textual experience summary used only inside the re-scoring context; it never rewrites the trajectory.'} tone="experience" active={step === 2} complete={step > 2} className="seed-hindsight" />
        <FlowNode id="seed-plain" role="CONTEXT A" title="plain context" detail={`${sameAction} · P_plain`} moreLabel={moreLabel} more={zh ? 'P_plain 是 policy 在原始 observation 下对同一 action 给出的概率。' : 'P_plain is the probability the policy assigns to the same action under the raw observation.'} tone="env" active={step === 3} complete={step > 3} className="seed-plain">
          <ChipSequence label={sameAction} tone="env" tokens={actionTokens} className="seed-action-chips" />
        </FlowNode>
        <FlowNode id="seed-skill" role="CONTEXT B" title="skill-augmented context" detail={`${sameAction} · P_skill`} moreLabel={moreLabel} more={zh ? 'P_skill 是加入 hindsight skill 后对同一 action 的概率；两个概率的差异就是 OPD 的信号来源。' : 'P_skill is the probability once the hindsight skill is added; the gap between the two probabilities drives the OPD signal.'} tone="experience" active={step === 3} complete={step > 3} className="seed-skill">
          <ChipSequence label={sameAction} tone="experience" tokens={actionTokens} className="seed-action-chips" />
        </FlowNode>
        <FlowNode id="seed-opd" role="DENSE LEARNING SIGNAL" title="OPD" detail={zh ? '同一 action 在两个 context 下的概率变化' : 'probability shift of the same action under two contexts'} moreLabel={moreLabel} more={zh ? 'OPD 把“早知道这个 skill 会怎样做得更好”蒸馏成 token 级稠密监督，而不是等终局奖励。' : 'OPD distills “what hindsight would have improved” into dense token-level supervision instead of waiting for a terminal reward.'} tone="signal" active={step === 4} complete={step > 4} className="seed-opd" />
        <FlowNode id="seed-grpo" role="OUTCOME RL SIGNAL" title="GRPO" detail={zh ? '来自 environment reward / relative outcome' : 'from environment reward / relative outcome'} moreLabel={moreLabel} more={zh ? 'GRPO 使用组内相对 outcome 优势，不依赖额外 value network。' : 'GRPO uses group-relative outcome advantages and does not require an extra value network.'} tone="signal" active={step === 4} complete={step > 4} className="seed-grpo" />
        <FlowNode id="seed-optimizer" role="OPTIMIZER" title="GRPO + OPD" detail={zh ? '稀疏结果信号与稠密 hindsight 信号合并更新 policy' : 'sparse outcome signal and dense hindsight signal merge to update the policy'} moreLabel={moreLabel} more={zh ? '两支信号在同一个 optimizer step 合流，一次性写回参数。' : 'Both signals merge inside a single optimizer step and are written back into the parameters.'} tone="signal" active={step === 4} complete={step > 4} className="seed-optimizer" />
        <FlowNode id="seed-next" role="NEXT POLICY" title="policy θt+1" detail={zh ? '真正保留下来的，是更新后的参数；下一轮直接加载新 checkpoint' : 'what persists is the updated parameter state; the next rollout loads the new checkpoint'} moreLabel={moreLabel} more={zh ? 'θt+1 是下一轮唯一需要加载的状态；部署时不需要永久携带额外 skill prompt。' : 'θt+1 is the only state the next round must load; no permanent skill prompt is carried at deployment.'} tone="persist" active={step === 5} className="seed-next">
          <ParamGrid label={`θt+1 · ${schematic}`} cells={THETA_NEXT} changed={step >= 5 ? THETA_CHANGED : []} tone="persist" className="seed-theta" />
        </FlowNode>
        <ConnectorLayer containerRef={sceneRef} edges={edges} ariaLabel={zh ? 'SEED 双上下文重打分、OPD 与 GRPO 合流、参数更新与下一轮回环' : 'SEED dual-context re-scoring, OPD/GRPO merge, parameter update, and next-round feedback loop'} />
      </div>
      <div className="irx-probability-panel" data-active={step === 3} data-ui-audit="contrast layout">
        <div className="irx-same-action"><span>{zh ? '固定同一批 sampled action tokens' : 'hold the same sampled action tokens fixed'}</span><ChipSequence label={sameAction} tone="signal" tokens={actionTokens} /></div>
        <ProbBar label="P_plain(action)" value={0.28} display="0.28" tone="env" />
        <ProbBar label="P_skill(action)" value={0.62} display="0.62" tone="experience" delta="Δ +0.34 → OPD" />
        <ProbBar label="GRPO advantage" value={0.74} display="0.74" tone="signal" />
        <small>{zh ? '教学示例概率，只用于解释“同一动作、两个 context、概率变化”；不是论文或本项目实测值。' : 'Illustrative probabilities only, used to explain “same action, two contexts, probability shift”; these are not measured paper/project values.'}</small>
      </div>
    </>
  );
}

export function OpenEvoExplainer({ locale, step, carrier, setCarrier, onStep }: { locale: Locale; step: number; carrier: Carrier; setCarrier: (carrier: Carrier) => void; onStep: (step: number) => void }) {
  const zh = locale === 'zh';
  const sceneRef = useRef<HTMLDivElement>(null);
  const moreLabel = zh ? '展开细节' : 'Expand detail';
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
        <FlowNode id="evo-head" role="PROJECT HEAD" title={zh ? '当前 agent revision' : 'current agent revision'} detail="Qwen2.5-3B-Instruct + current carrier state" moreLabel={moreLabel} more={zh ? 'Project Head 是任务开始时锁定的执行身份：base model、已激活 carrier 与 context revision 的组合。' : 'The Project Head is the execution identity pinned at task start: base model plus activated carriers and context revision.'} tone="state" active={step === 0} complete={step > 0} className="evo-head" />
        <FlowNode id="evo-task" role="TASK N · ENVIRONMENT" title="WebShop / ALFWorld" detail="observation · action · outcome" moreLabel={moreLabel} more={zh ? '任务在同一个 benchmark contract 下运行，产生可复现的 observation / action / outcome 记录。' : 'The task runs under one benchmark contract and produces reproducible observation / action / outcome records.'} tone="env" active={step === 0} complete={step > 0} className="evo-task" />
        <FlowNode id="evo-evidence" role="TASK COMPLETION BOUNDARY" title="SEALED EVIDENCE" detail={zh ? 'trajectory + outcome + metadata 先冻结，再允许演化' : 'trajectory + outcome + metadata are frozen before evolution'} moreLabel={moreLabel} more={zh ? '封存包含 identity 与 digest，之后可以验证这份 evidence 没有被改写。' : 'Sealing records identity and digest, so later stages can verify the evidence was never rewritten.'} tone="experience" active={step === 1} complete={step > 1} className="evo-evidence">
          <DocStack label="sealed evidence" items={['trajectory', 'outcome', 'metadata']} strapped={step >= 1} tone="experience" />
        </FlowNode>
        <FlowNode id="evo-method" role="EVOLUTION METHOD" title={zh ? '反思 / 提炼 / 参数演变' : 'reflection / extraction / parametric evolution'} detail={zh ? '方法读取已封存 evidence，不改写刚完成的 Task N' : 'the method reads sealed evidence and does not rewrite the completed Task N'} moreLabel={moreLabel} more={zh ? '演化方法只读 evidence、输出声明类型的候选状态；它不直接在线改写正在服役的 policy。' : 'The evolution method only reads evidence and emits a candidate state of a declared type; it never rewrites the serving policy in place.'} tone="experience" active={step === 2} complete={step > 2} className="evo-method" />
        <div className="irx-carrier-lane" data-active={step === 3}>
          {carriers.map((item) => (
            <button key={item.id} type="button" className={`irx-carrier irx-carrier-${item.id} irx-tone-${item.tone}`} data-flow-id={`evo-${item.id}`} data-ui-audit-item data-selected={carrier === item.id} onClick={() => { setCarrier(item.id); onStep(Math.max(step, 3)); }} aria-pressed={carrier === item.id}>
              {/* Shape encodes carrier type: memory = document stack,
                  artifact = code page, adapter = parameter grid. */}
              <i className="irx-carrier-glyph" aria-hidden="true"><i /><i /><i /></i>
              <span>CARRIER</span><strong>{item.title}</strong><small>{item.detail}</small>{item.id === 'adapter' && <em>{zh ? '当前 WebShop 实例' : 'current WebShop instance'}</em>}
            </button>
          ))}
        </div>
        <section className="irx-validation" data-flow-id="evo-validation" data-ui-audit-item data-active={step === 4}>
          <span>VALIDATION GATE</span><strong>{zh ? '只有通过 gate 的状态，才能进入 successor revision' : 'only state that passes the gate can enter the successor revision'}</strong>
          <div className="irx-gate-funnel" data-pass={step >= 4} aria-hidden="true"><i /><i /><i /></div>
          <ol>{['identity', 'digest', 'fresh reload', 'behavior probe', 'scientific contract'].map((item) => <li key={item}><b>{item}</b><small>{step >= 4 ? 'REQUIRED' : '—'}</small></li>)}</ol>
        </section>
        <FlowNode id="evo-successor" role="SUCCESSOR REVISION" title={zh ? '验证通过的下一版 agent 状态' : 'validated next agent state'} detail={zh ? `当前查看 carrier: ${carrier}` : `inspecting carrier: ${carrier}`} moreLabel={moreLabel} more={zh ? 'successor revision 是由通过 gate 的 carrier 状态组成的新 agent 身份，可以被后续任务整体加载。' : 'A successor revision is the new agent identity assembled from gate-passed carrier state, loadable as a whole by later tasks.'} tone="persist" active={step === 5} complete={step > 5} className="evo-successor">
          {/* R1 → R2: the successor revision sits on top of the previous one. */}
          <span className="irx-revision-stack" data-active={step >= 5} aria-hidden="true"><i className="irx-revision-r1">R1</i><i className="irx-revision-r2">R2</i></span>
        </FlowNode>
        <FlowNode id="evo-next" role="TASK N+1" title={zh ? '下一任务加载 successor revision' : 'next task loads the successor revision'} detail={zh ? '新的任务从“已经进化过的状态”开始，而不是改写已经结束的 Task N' : 'the new task starts from an evolved state rather than rewriting the completed Task N'} moreLabel={moreLabel} more={zh ? 'Task N+1 从 successor revision 启动，并产生下一轮可以再次封存的新 evidence。' : 'Task N+1 starts from the successor revision and produces fresh evidence that can be sealed again.'} tone="env" active={step === 6} className="evo-next" />
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
      <FlowNode id="cmp-shared" role="SHARED EXPERIENCE" title="task · observations · sampled actions · outcome" detail={zh ? '两种方法从同样的一次已完成经验开始比较' : 'compare both methods from the same completed experience'} moreLabel={zh ? '展开细节' : 'Expand detail'} more={zh ? '比较的前提是同一 completed experience：同一任务、同一批 sampled actions、同一 outcome；只有更新机制不同。' : 'The comparison starts from one completed experience: same task, same sampled actions, same outcome; only the update mechanism differs.'} tone="experience" active={step === 0} complete={step > 0} className="cmp-shared">
        {/* One shared experience object — the same chip shape is then tracked
            through both lanes so the two mechanisms stay visually comparable. */}
        <ChipSequence label="shared experience" tone="experience" tokens={['task', 'obs', 'act', 'outcome']} />
      </FlowNode>
      <section className="irx-method-lane irx-method-seed" data-ui-audit-item>
        <header><span>SEED</span><strong>{zh ? '经验被训练信号化，再写回 policy 参数' : 'experience becomes learning signal, then writes back into policy parameters'}</strong></header>
        <ol>{seedSteps.map((item, index) => <li key={item} data-active={step >= Math.min(index + 1, 4)}><span>{String(index + 1).padStart(2, '0')}</span><b data-flow-id={index === 0 ? 'cmp-seed-start' : undefined}>{item}</b></li>)}</ol>
        {/* SEED: the experience chip is consumed at the boundary; what crosses
            into the next round is a parameter grid, not the chip itself. */}
        <div className="irx-boundary-cross" data-crossed={step >= 3} data-mode="absorbed">
          <span className="irx-boundary-line"><em>{zh ? '训练边界' : 'training boundary'}</em></span>
          <ChipSequence label="experience consumed" tone="experience" tokens={['task', 'obs', 'act', 'outcome']} className="irx-cross-chip" />
          <ParamGrid label={zh ? 'θt+1 参数（示意）' : 'θt+1 parameters (schematic)'} cells={THETA_NEXT} changed={step >= 4 ? THETA_CHANGED : []} tone="persist" className="irx-cross-grid" />
        </div>
      </section>
      <section className="irx-method-lane irx-method-evo" data-ui-audit-item>
        <header><span>OpenEvo</span><strong>{zh ? '经验跨过 task boundary，经 carrier 与 validation 形成可继承状态' : 'experience crosses the task boundary and becomes reusable state through carriers and validation'}</strong></header>
        <ol>{evoSteps.map((item, index) => <li key={item} data-active={step >= Math.min(index + 1, 4)}><span>{String(index + 1).padStart(2, '0')}</span><b data-flow-id={index === 0 ? 'cmp-evo-start' : undefined}>{item}</b></li>)}</ol>
        {/* OpenEvo: the SAME chip physically crosses the task boundary line. */}
        <div className="irx-boundary-cross" data-crossed={step >= 3} data-mode="crosses">
          <span className="irx-boundary-line"><em>task boundary</em></span>
          <ChipSequence label="experience crosses" tone="experience" tokens={['task', 'obs', 'act', 'outcome']} className="irx-cross-chip" />
        </div>
      </section>
      <div className="irx-compare-question"><small>{zh ? '中心问题' : 'Core question'}</small><strong>{zh ? '这次经验最终以什么状态保存，并在什么时候生效？' : 'In what state does this experience persist, and when does it take effect?'}</strong></div>
      <ConnectorLayer containerRef={sceneRef} edges={edges} ariaLabel={zh ? '同一 shared experience 分叉到 SEED 与 OpenEvo 两条不同的更新和持久化路径' : 'One shared experience forks into distinct SEED and OpenEvo update/persistence paths'} />
    </div>
  );
}