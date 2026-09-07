import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import '../../styles/interactive-research-explainer.css';
import { ExplainerHeader, StepControls, clamp, useReducedMotion, type Carrier, type Kind, type Locale, type StepMeta } from './explainer/ResearchExplainerPrimitives';
import { ALFWorldExplainer, WebShopExplainer } from './explainer/EnvironmentExplainers';
import { CompareExplainer, OpenEvoExplainer, SeedExplainer } from './explainer/MethodExplainers';
import { ServerExplainer } from './explainer/ServerExplainer';

interface Props { locale: Locale; kind: Kind; compact?: boolean }

function technicalCopy(kind: Kind, locale: Locale) {
  const zh = locale === 'zh';
  const copy: Record<Kind, string> = {
    webshop: zh ? '原始 WebShop 约有 1.18M products 与 12,087 crowd-sourced instructions；冻结 1,000-product 环境属于 benchmark contract，Phase G/H0 属于带日期的历史科学边界。实时 OpenEvo 状态必须回到实际实验 branch 的 campaign 与最新 reconciliation/result。' : 'Original WebShop has about 1.18M products and 12,087 crowd-sourced instructions; the frozen 1,000-product environment is part of the benchmark contract, while Phase G/H0 are dated historical scientific boundaries. Resolve live OpenEvo state from the campaign and latest reconciliation/result on the experiment branch actually in use.',
    alfworld: zh ? 'benchmark split 包括 train / valid_seen / valid_unseen：valid_seen 的环境类型更熟悉，valid_unseen 更强调环境泛化；六类主要 household task family 属于 Level 3 技术层。第一层只解释 world state、action precondition 与长期规划。' : 'The benchmark split includes train / valid_seen / valid_unseen: valid_seen uses more familiar environment types, while valid_unseen emphasizes environment generalization; the six main household task families belong to Level 3. The first layer focuses on world state, action preconditions, and long-horizon planning.',
    seed: zh ? 'Stage 1 先由 Qwen policy 通过 SEED / verl-agent 的模型侧 interaction harness 与 Princeton WebShop 的 WebAgentTextEnv 交互，得到 1,440 条完整 episode；GLM-5.2 只在 episode 完成后离线生成 hindsight-skill 标注，再做 3-epoch SFT。Stage 2 复用同一 WebShop interaction contract，但 analyzer 改为当前 policy 自己，并用 OPD + GRPO 更新 policy 参数。GLM-5.2 不采轨迹，也不是 WebShop reward scorer。双概率条为机制示例。' : 'Stage 1 first lets the Qwen policy interact with Princeton WebShop’s WebAgentTextEnv through the SEED / verl-agent model-facing interaction harness, producing 1,440 completed episodes. GLM-5.2 only analyzes completed episodes offline before the 3-epoch SFT; it neither collects trajectories nor scores WebShop reward. Stage 2 keeps the same WebShop interaction contract but moves analysis to the current policy itself and updates policy parameters with OPD + GRPO. The dual probability bars are illustrative.',
    openevo: zh ? 'OpenEvo 规定跨任务的演化边界与可继承状态合同；memory、agent artifact、parametric adapter 都可以是 carrier。WebShop 实验里的 SD-LoRA adapter 是一个已经验证过的具体参数化路径，不等于 OpenEvo 本身。' : 'OpenEvo defines the cross-task evolution boundary and reusable-state contract; memory, agent artifacts, and parametric adapters can all be carriers. The SD-LoRA adapter used in the WebShop experiment is one validated parametric path, not OpenEvo itself.',
    compare: zh ? 'SEED 与 OpenEvo 的差异有六条可核验维度：update mechanism、task boundary、carrier、validation、what persists、activation timing。常见的误解是把差异简化为“SEED = 参数、OpenEvo = external memory”，那其实只触及了 carrier 一个维度。' : 'SEED and OpenEvo differ on six verifiable axes: update mechanism, task boundary, carrier, validation, what persists, and activation timing. A common misread is reducing the whole difference to “SEED = parameters, OpenEvo = external memory,” which only touches one of those six axes.',
    server: zh ? '控制容器和实验容器是 host Docker daemon 管理的 sibling containers。Docker socket 提供很强的技术能力，但项目授权仍然是独立边界；科研运行保持 non-root、explicit GPU、no Docker socket。' : 'The control and experiment containers are siblings managed by the host Docker daemon. The Docker socket provides strong technical capability, but project authorization is a separate boundary; scientific execution remains non-root with explicit GPU assignment and no Docker socket.',
  };
  return copy[kind];
}

export default function InteractiveResearchExplainer({ locale, kind, compact = false }: Props) {
  const zh = locale === 'zh';
  const configs: Record<Kind, { title: string; eyebrow: string; lede: string; steps: StepMeta[] }> = {
    webshop: {
      eyebrow: '',
      title: zh ? 'WebShop 环境模型' : 'WebShop environment model',
      lede: zh ? '把一次购物任务按真实 Agent 循环逐步播放：observation → action → 页面状态变化 → 新 observation → score。' : 'Play one shopping task as an agent loop: observation → action → page transition → new observation → score.',
      steps: [
        { label: zh ? '目标' : 'Goal', narration: zh ? '任务约束进入环境，尚未采取动作。' : 'Task constraints enter the environment before any action.' },
        { label: zh ? '搜索' : 'Search', narration: zh ? 'Agent 根据当前 observation 选择 search。' : 'The agent selects search from the current observation.' },
        { label: zh ? '商品' : 'Product', narration: zh ? '点击搜索结果后，网页状态切换。' : 'Clicking a result changes the page state.' },
        { label: zh ? '选项' : 'Options', narration: zh ? '颜色与尺码选择继续改变环境状态。' : 'Color and size selections continue to change environment state.' },
        { label: zh ? '评测' : 'Reward', narration: zh ? '终局 evaluator 检查任务约束并产生 score。' : 'The terminal evaluator checks task constraints and produces a score.' },
      ],
    },
    alfworld: {
      eyebrow: '',
      title: zh ? 'ALFWorld 环境模型' : 'ALFWorld environment model',
      lede: zh ? '物体位置、容器开关和 heated 状态都会约束下一步动作；一次失败动作不会被“语言合理性”自动纠正。' : 'Object locations, receptacle state, and heated state constrain the next action; a plausible sentence does not bypass world preconditions.',
      steps: [
        { label: zh ? '任务' : 'Task', narration: zh ? 'Apple 起初在 counter。' : 'The apple starts on the counter.' },
        { label: 'goto', narration: zh ? 'Agent 进入厨房。' : 'The agent enters the kitchen.' },
        { label: 'pick', narration: zh ? 'Apple 进入 inventory。' : 'The apple enters inventory.' },
        { label: zh ? '失败' : 'Failure', narration: zh ? '直接 heat 不满足前置条件。' : 'Heating now violates a precondition.' },
        { label: 'open', narration: zh ? 'Microwave 被打开。' : 'The microwave opens.' },
        { label: 'put', narration: zh ? 'Apple 被放入 microwave。' : 'The apple moves into the microwave.' },
        { label: 'heat', narration: zh ? '世界状态记录 apple 已加热。' : 'World state records that the apple is heated.' },
        { label: 'pick', narration: zh ? '取出 heated apple。' : 'The heated apple is picked up.' },
        { label: zh ? '完成' : 'Goal', narration: zh ? 'Heated apple 被放回 counter，目标满足。' : 'The heated apple returns to the counter and satisfies the goal.' },
      ],
    },
    seed: {
      eyebrow: 'FIGURE 04 · SEED × WEBSHOP',
      title: zh ? 'SEED 的两阶段 WebShop 学习循环' : 'SEED’s two-stage WebShop learning loop',
      lede: zh ? 'Stage 1 先由 Qwen 通过 SEED / verl-agent harness 与 Princeton WebShop 环境交互采轨迹，再由外部 GLM-5.2 离线生成 hindsight skill 并做 SFT；Stage 2 保持同一 interaction contract，改由当前 policy 自己复盘，并把 OPD 与 GRPO 写回下一版参数。' : 'Stage 1 first collects Qwen trajectories through the SEED / verl-agent harness over the Princeton WebShop environment, then uses external GLM-5.2 offline for hindsight-skill SFT; Stage 2 keeps the same interaction contract, moves analysis to the current policy, and writes OPD plus GRPO into the next parameter state.',
      steps: [
        { label: 'rollout', narration: zh ? 'Stage 2：当前 policy → SEED / verl-agent harness ↔ Princeton WebShop，做真实 on-policy interaction。' : 'Stage 2: current policy → SEED / verl-agent harness ↔ Princeton WebShop for real on-policy interaction.' },
        { label: 'trajectory', narration: zh ? '完整 episode 被封存，原 action 不再改写。' : 'The completed episode is preserved and its sampled actions are no longer rewritten.' },
        { label: 'hindsight', narration: zh ? 'Stage 2：同一 checkpoint 自己复盘；外部 GLM 已退出。' : 'Stage 2: the same checkpoint analyzes its own episode; external GLM is out of the loop.' },
        { label: zh ? '重打分' : 're-score', narration: zh ? '同一 sampled action 同时进入 plain / skill 两个 context。' : 'The same sampled action enters plain and skill contexts.' },
        { label: 'OPD + GRPO', narration: zh ? '概率变化形成 OPD；环境 outcome 形成 GRPO，两支合流。' : 'Probability shift forms OPD; environment outcome forms GRPO; the branches merge.' },
        { label: 'θt+1', narration: zh ? 'Optimizer 更新 policy；下一轮使用新 checkpoint。' : 'The optimizer updates the policy; the next round uses the new checkpoint.' },
      ],
    },
    openevo: {
      eyebrow: 'FIGURE 05 · OPENEVO × WEBSHOP',
      title: zh ? 'OpenEvo 如何把一次 WebShop 经验变成下一版 Agent' : 'How OpenEvo turns one WebShop experience into the next agent revision',
      lede: zh ? '先完成 WebShop Task N 并封存 evidence；演化只在 task boundary 之后发生。当前参数化路径把经验写入 SD-LoRA adapter，通过 validation 后才形成 Task N+1 使用的 successor revision。' : 'Finish WebShop Task N and seal its evidence first; evolution happens only after the task boundary. The current parametric path writes experience into an SD-LoRA adapter, which becomes the Task N+1 successor revision only after validation.',
      steps: [
        { label: 'Task N', narration: zh ? '当前 Project Head 在环境里完成任务。' : 'The current Project Head completes the task in the environment.' },
        { label: zh ? '封存' : 'Seal', narration: zh ? '任务完成边界把 trajectory/outcome/metadata 封存。' : 'The task-completion boundary seals trajectory/outcome/metadata.' },
        { label: 'Evolve', narration: zh ? 'Evolution method 读取已封存 evidence。' : 'The evolution method reads sealed evidence.' },
        { label: 'Adapter', narration: zh ? '当前 WebShop 主路径把经验写入 parametric adapter（SD-LoRA）。' : 'The current WebShop main path writes experience into a parametric adapter (SD-LoRA).' },
        { label: 'Validate', narration: zh ? '只有通过 validation gate 的 adapter 状态才能进入 successor revision。' : 'Only adapter state that passes the validation gate can enter the successor revision.' },
        { label: 'Revision', narration: zh ? '接受的状态组成 successor revision。' : 'Accepted state forms the successor revision.' },
        { label: 'Task N+1', narration: zh ? '下一任务从 successor revision 开始，并形成下一轮 evidence。' : 'The next task starts from the successor revision and produces the next evidence.' },
      ],
    },
    compare: {
      eyebrow: 'SEED × OPENEVO',
      title: zh ? 'SEED 与 OpenEvo 更新机制' : 'SEED and OpenEvo update mechanisms',
      lede: zh ? '从同一份 completed experience 出发，分别比较 SEED 与 OpenEvo 怎样处理经验、保存什么状态，以及变化何时生效。' : 'Start from the same completed experience and compare how SEED and OpenEvo process it, what each persists, and when each change activates.',
      steps: [
        { label: zh ? '共同经验' : 'Shared', narration: zh ? '两种方法都从真实 task / observations / sampled actions / outcome 开始。' : 'Both methods start from a real task / observations / sampled actions / outcome.' },
        { label: zh ? '分别处理' : 'Separate', narration: zh ? '同一 experience 分别进入 SEED 与 OpenEvo 的更新机制。' : 'The same experience enters the SEED and OpenEvo update mechanisms separately.' },
        { label: zh ? '更新' : 'Update', narration: zh ? 'SEED 产生训练信号；OpenEvo 跨过 task boundary 运行 evolution method。' : 'SEED creates learning signal; OpenEvo crosses the task boundary and runs an evolution method.' },
        { label: zh ? '保存' : 'Persist', narration: zh ? 'SEED 保存 θt+1 参数；OpenEvo 保存 validated evolved state。' : 'SEED persists θt+1 parameters; OpenEvo persists validated evolved state.' },
        { label: zh ? '生效' : 'Activate', narration: zh ? '两者都改变后续行为，但生效合同与 carrier 不同。' : 'Both can change later behavior, but their activation contract and carriers differ.' },
      ],
    },
    server: {
      eyebrow: '',
      title: zh ? '实验室服务器权限模型' : 'Laboratory server authority model',
      lede: zh ? '控制容器、科研运行容器与其他用户容器是 host Docker daemon 管理的 sibling containers。技术能力、宿主机所有权和项目授权是三个不同概念。' : 'The control container, scientific runtime, and other users’ containers are siblings managed by the host Docker daemon. Technical capability, host ownership, and project authorization are distinct concepts.',
      steps: [
        { label: 'daemon', narration: zh ? 'Host daemon 才是容器生命周期的实际管理者。' : 'The host daemon actually owns container lifecycle management.' },
        { label: 'control', narration: zh ? '当前开发容器中的 root UID 0 只是该控制容器内部身份。' : 'root UID 0 in the current development container is an identity inside that control container.' },
        { label: 'socket', narration: zh ? 'Docker socket 把 CLI 请求送到 host daemon。' : 'The Docker socket sends CLI requests to the host daemon.' },
        { label: 'runtime', narration: zh ? '科研执行进入 non-root、explicit GPU、no-socket 实验容器。' : 'Scientific execution moves into a non-root, explicit-GPU, no-socket experiment container.' },
        { label: 'workspace', narration: zh ? '长期状态写入持久 workspace，而不是容器临时 home。' : 'Durable state is written to the persistent workspace rather than container-local home.' },
        { label: 'siblings', narration: zh ? '其他用户容器技术可见，不代表获授权操作。' : 'Other users’ containers may be technically visible without being authorized targets.' },
      ],
    },
  };
  const config = configs[kind];
  const [step, setStep] = useState(0);
  const [overview, setOverview] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [carrier, setCarrier] = useState<Carrier>('adapter');
  const reducedMotion = useReducedMotion();
  const maxStep = config.steps.length - 1;
  const rootRef = useRef<HTMLElement>(null);

  const go = useCallback((next: number) => {
    setOverview(false);
    setPlaying(false);
    setStep(clamp(next, 0, maxStep));
  }, [maxStep]);

  const showOverview = useCallback(() => {
    setPlaying(false);
    setOverview(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (reducedMotion) return;
    if (overview) {
      setOverview(false);
      setStep(0);
      setPlaying(true);
      return;
    }
    setPlaying((value) => !value);
  }, [overview, reducedMotion]);

  // Article sections may dispatch `irx:scroll-step` (see ExplainerScrollLink.astro).
  // This passive synchronization changes selection only; it must not move the document.
  useEffect(() => {
    const onReveal = (event: Event) => {
      const raw = (event as CustomEvent<{ step?: number }>).detail?.step;
      if (typeof raw !== 'number' || Number.isNaN(raw)) return;
      const target = raw < 0 ? maxStep : clamp(Math.round(raw), 0, maxStep);
      setOverview(false);
      setPlaying(false);
      setStep((current) => current === target ? current : target);
    };
    window.addEventListener('irx:scroll-step', onReveal);
    return () => window.removeEventListener('irx:scroll-step', onReveal);
  }, [maxStep]);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= maxStep) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1450);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion, maxStep]);

  useEffect(() => {
    if (reducedMotion) setPlaying(false);
  }, [reducedMotion]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(overview ? 0 : step + 1); }
    if (event.key === 'ArrowLeft' && !overview) { event.preventDefault(); go(step - 1); }
    if (event.key === 'Home') { event.preventDefault(); go(0); }
    if (event.key === 'End') { event.preventDefault(); go(maxStep); }
    if (event.key === ' ' && !reducedMotion) { event.preventDefault(); togglePlay(); }
  };

  const activeStep = config.steps[step] ?? config.steps[0]!;
  const overviewCopy = zh
    ? '总览模式保留完整拓扑。颜色区分角色，形状区分数据类型，实线表示数据流，虚线表示控制或回环。'
    : 'Overview mode preserves the complete topology. Color separates roles, shape separates data types, solid lines carry data, and dashed lines show control or feedback.';

  return (
    <section
      ref={rootRef}
      className={`irx irx-${kind}`}
      data-interactive-research-explainer={kind}
      data-overview={overview}
      data-reduced-motion={reducedMotion}
      data-compact={compact}
      data-ui-audit="contrast layout"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={config.title}
    >
      <ExplainerHeader id={`irx-${kind}-title`} locale={locale} title={config.title} lede={config.lede} eyebrow={config.eyebrow} />
      <StepControls locale={locale} step={step} maxStep={maxStep} steps={config.steps} overview={overview} playing={playing} reducedMotion={reducedMotion} onStep={go} onPlay={togglePlay} onOverview={showOverview} />
      <figure className="irx-paper-figure" data-overview={overview}>
        <div className="irx-stage" data-step={step}>
          {kind === 'webshop' && <WebShopExplainer locale={locale} step={step} />}
          {kind === 'alfworld' && <ALFWorldExplainer locale={locale} step={step} />}
          {kind === 'seed' && <SeedExplainer locale={locale} step={step} />}
          {kind === 'openevo' && <OpenEvoExplainer locale={locale} step={step} carrier={carrier} setCarrier={setCarrier} onStep={go} />}
          {kind === 'compare' && <CompareExplainer locale={locale} step={step} />}
          {kind === 'server' && <ServerExplainer locale={locale} step={step} onStep={go} />}
        </div>
        <figcaption className="irx-paper-caption">
          <div><span>FIGURE · {overview ? 'SYSTEM MAP' : `TRACE ${String(step + 1).padStart(2, '0')}`}</span><strong>{overview ? (zh ? '先读全局结构，再追踪一次运算' : 'Read the whole structure, then trace one computation') : activeStep.label}</strong><p>{overview ? overviewCopy : activeStep.narration}</p></div>
          <ul className="irx-visual-key" aria-label={zh ? '框架图视觉图例' : 'Framework figure visual key'}>
            <li data-tone="env">{zh ? '环境 / 输入' : 'Environment / input'}</li>
            <li data-tone="experience">{zh ? '经验 / 证据' : 'Experience / evidence'}</li>
            <li data-tone="signal">{zh ? '学习信号' : 'Learning signal'}</li>
            <li data-tone="state">{zh ? '模型 / 状态' : 'Model / state'}</li>
            <li data-tone="persist">{zh ? '持久化结果' : 'Persisted result'}</li>
            <li data-tone="flow">{zh ? '实线数据 · 虚线控制' : 'Solid data · dashed control'}</li>
          </ul>
        </figcaption>
      </figure>
      <aside className="irx-inspector" aria-label={zh ? '当前模块说明' : 'Current module explanation'}>
        <div className="irx-inspector-current"><span>{overview ? 'MAP' : `STEP ${String(step + 1).padStart(2, '0')}`}</span><div><strong>{overview ? (zh ? '完整框架' : 'Complete framework') : activeStep.label}</strong><p>{overview ? overviewCopy : activeStep.narration}</p></div></div>
        <details>
          <summary>{zh ? '查看全部模块说明' : 'View every module note'}</summary>
          <ol>{config.steps.map((item, index) => <li key={`note-${index}`} data-active={!overview && index === step}><button type="button" onClick={() => go(index)}><span>{String(index + 1).padStart(2, '0')}</span><b>{item.label}</b><small>{item.narration}</small></button></li>)}</ol>
        </details>
      </aside>
      <details className="irx-tech">
        <summary><span>Level 3</span>{zh ? '技术边界与复现提示' : 'Technical boundary and reproduction notes'}</summary>
        <p>{technicalCopy(kind, locale)}</p>
      </details>
    </section>
  );
}
