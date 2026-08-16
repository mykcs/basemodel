import { useCallback, useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import '../../styles/interactive-research-explainer.css';
import { ExplainerHeader, StepControls, clamp, useReducedMotion, type Carrier, type Kind, type Locale, type StepMeta } from './explainer/ResearchExplainerPrimitives';
import { ALFWorldExplainer, WebShopExplainer } from './explainer/EnvironmentExplainers';
import { CompareExplainer, OpenEvoExplainer, SeedExplainer } from './explainer/MethodExplainers';
import { ServerExplainer } from './explainer/ServerExplainer';

interface Props { locale: Locale; kind: Kind; compact?: boolean }

function technicalCopy(kind: Kind, locale: Locale) {
  const zh = locale === 'zh';
  const copy: Record<Kind, string> = {
    webshop: zh ? '原始 WebShop 约有 1.18M products 与 12,087 crowd-sourced instructions；当前 OpenEvo 页面只把冻结 1,000-product 环境与 Phase G/H0 科学边界作为当前实验事实。' : 'Original WebShop has about 1.18M products and 12,087 crowd-sourced instructions; the current OpenEvo surface treats only the frozen 1,000-product environment and Phase G/H0 boundary as current experimental facts.',
    alfworld: zh ? 'benchmark split 包括 train / valid_seen / valid_unseen：valid_seen 的环境类型更熟悉，valid_unseen 更强调环境泛化；六类主要 household task family 属于 Level 3 技术层。第一层只解释 world state、action precondition 与长期规划。' : 'The benchmark split includes train / valid_seen / valid_unseen: valid_seen uses more familiar environment types, while valid_unseen emphasizes environment generalization; the six main household task families belong to Level 3. The first layer focuses on world state, action preconditions, and long-horizon planning.',
    seed: zh ? '训练期使用 hindsight analyzer / skill / OPD 产生学习信号；推理期主要保留更新后的 policy。双概率条为机制示例，不代表真实 run 的 token probability。' : 'Training uses the hindsight analyzer / skill / OPD to create learning signal; inference mainly keeps the updated policy. The dual probability bars are illustrative rather than measured token probabilities.',
    openevo: zh ? 'OpenEvo 规定跨任务的演化边界与可继承状态合同；memory、agent artifact、parametric adapter 都可以是 carrier。当前 WebShop 的 SD-LoRA adapter 只是一个具体参数化路径。' : 'OpenEvo defines the cross-task evolution boundary and reusable-state contract; memory, agent artifacts, and parametric adapters can all be carriers. The current WebShop SD-LoRA adapter is one concrete parametric path.',
    compare: zh ? '不要把差异简化为“SEED = 参数、OpenEvo = external memory”。真正应比较 update mechanism、task boundary、carrier、validation、what persists 与 activation timing。' : 'Do not reduce the distinction to “SEED = parameters, OpenEvo = external memory.” Compare update mechanism, task boundary, carrier, validation, what persists, and activation timing.',
    server: zh ? '控制容器和实验容器是 host Docker daemon 管理的 sibling containers。Docker socket 提供很强的技术能力，但项目授权仍然是独立边界；科研运行保持 non-root、explicit GPU、no Docker socket。' : 'The control and experiment containers are siblings managed by the host Docker daemon. The Docker socket provides strong technical capability, but project authorization is a separate boundary; scientific execution remains non-root with explicit GPU assignment and no Docker socket.',
  };
  return copy[kind];
}

export default function InteractiveResearchExplainer({ locale, kind, compact = false }: Props) {
  const zh = locale === 'zh';
  const configs: Record<Kind, { title: string; eyebrow: string; lede: string; steps: StepMeta[] }> = {
    webshop: {
      eyebrow: 'WEBSHOP · INTERACTIVE ENVIRONMENT',
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
      eyebrow: 'ALFWORLD · STATEFUL HOUSEHOLD',
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
      eyebrow: 'SEED · SAME ACTIONS, TWO CONTEXTS',
      title: zh ? 'SEED 自进化训练机制' : 'SEED self-evolving training mechanism',
      lede: zh ? 'SEED 不重新生成一条“知道 hindsight 后的正确轨迹”；它固定原来已采样的 action token，在 plain 与 skill context 下重新计算概率，再把差异蒸馏回 policy 参数。' : 'SEED does not generate a new “correct trajectory with hindsight”; it holds the original sampled action tokens fixed, re-scores them under plain and skill contexts, then distills the shift back into policy parameters.',
      steps: [
        { label: 'rollout', narration: zh ? '当前 policy 做真实 on-policy interaction。' : 'The current policy performs real on-policy interaction.' },
        { label: 'trajectory', narration: zh ? '完整 episode 被封存。' : 'The completed episode is preserved.' },
        { label: 'hindsight', narration: zh ? '同一 checkpoint 回看 episode 生成 hindsight skill。' : 'The same checkpoint reviews the episode and produces a hindsight skill.' },
        { label: zh ? '重打分' : 're-score', narration: zh ? '同一 sampled action 同时进入 plain / skill 两个 context。' : 'The same sampled action enters plain and skill contexts.' },
        { label: 'OPD + GRPO', narration: zh ? '概率变化形成 OPD；环境 outcome 形成 GRPO，两支合流。' : 'Probability shift forms OPD; environment outcome forms GRPO; the branches merge.' },
        { label: 'θt+1', narration: zh ? 'Optimizer 更新 policy；下一轮使用新 checkpoint。' : 'The optimizer updates the policy; the next round uses the new checkpoint.' },
      ],
    },
    openevo: {
      eyebrow: 'OPENEVO · CROSS-TASK EVOLUTION',
      title: zh ? 'OpenEvo 跨任务演化机制' : 'OpenEvo cross-task evolution mechanism',
      lede: zh ? '先完成 Task N 并封存 evidence，再运行 evolution method；不同 carrier 真正分叉，只有通过 validation gate 的状态才能组成 successor revision，并从 Task N+1 开始生效。' : 'Finish Task N and seal evidence first, then run the evolution method; carriers truly fan out, and only state that passes validation forms a successor revision that activates from Task N+1.',
      steps: [
        { label: 'Task N', narration: zh ? '当前 Project Head 在环境里完成任务。' : 'The current Project Head completes the task in the environment.' },
        { label: zh ? '封存' : 'Seal', narration: zh ? '任务完成边界把 trajectory/outcome/metadata 封存。' : 'The task-completion boundary seals trajectory/outcome/metadata.' },
        { label: 'Evolve', narration: zh ? 'Evolution method 读取已封存 evidence。' : 'The evolution method reads sealed evidence.' },
        { label: 'Carrier', narration: zh ? '经验可以写入 memory、agent artifact 或 parametric adapter。' : 'Experience may be written into memory, agent artifacts, or a parametric adapter.' },
        { label: 'Validate', narration: zh ? 'identity、digest、reload、behavior、scientific contract 都是 gate。' : 'Identity, digest, reload, behavior, and scientific contract are gate conditions.' },
        { label: 'Revision', narration: zh ? '接受的状态组成 successor revision。' : 'Accepted state forms the successor revision.' },
        { label: 'Task N+1', narration: zh ? '下一任务从 successor revision 开始，并形成下一轮 evidence。' : 'The next task starts from the successor revision and produces the next evidence.' },
      ],
    },
    compare: {
      eyebrow: 'SEED × OPENEVO · SHARED EXPERIENCE',
      title: zh ? 'SEED 与 OpenEvo 更新机制' : 'SEED and OpenEvo update mechanisms',
      lede: zh ? '从同一份 completed experience 真正分叉，比较经验如何被处理、以什么状态保存、什么时候对下一轮或下一任务生效。' : 'Fork from the same completed experience and compare how it is processed, what persists, and when it activates in the next round or task.',
      steps: [
        { label: zh ? '共同经验' : 'Shared', narration: zh ? '两种方法都从真实 task / observations / sampled actions / outcome 开始。' : 'Both methods start from a real task / observations / sampled actions / outcome.' },
        { label: zh ? '分叉' : 'Fork', narration: zh ? '同一 experience 进入两套不同更新机制。' : 'The same experience enters two different update mechanisms.' },
        { label: zh ? '更新' : 'Update', narration: zh ? 'SEED 产生训练信号；OpenEvo 跨过 task boundary 运行 evolution method。' : 'SEED creates learning signal; OpenEvo crosses the task boundary and runs an evolution method.' },
        { label: zh ? '保存' : 'Persist', narration: zh ? 'SEED 保存 θt+1 参数；OpenEvo 保存 validated evolved state。' : 'SEED persists θt+1 parameters; OpenEvo persists validated evolved state.' },
        { label: zh ? '生效' : 'Activate', narration: zh ? '两者都改变后续行为，但生效合同与 carrier 不同。' : 'Both can change later behavior, but their activation contract and carriers differ.' },
      ],
    },
    server: {
      eyebrow: 'SERVER · AUTHORITY BOUNDARIES',
      title: zh ? 'OpenEvo 服务器权限模型' : 'OpenEvo server authority model',
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
  const [playing, setPlaying] = useState(false);
  const [carrier, setCarrier] = useState<Carrier>('adapter');
  const reducedMotion = useReducedMotion();
  const maxStep = config.steps.length - 1;

  const go = useCallback((next: number) => {
    setPlaying(false);
    setStep(clamp(next, 0, maxStep));
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
    if (event.key === 'ArrowRight') { event.preventDefault(); go(step + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(step - 1); }
    if (event.key === 'Home') { event.preventDefault(); go(0); }
    if (event.key === 'End') { event.preventDefault(); go(maxStep); }
    if (event.key === ' ' && !reducedMotion) { event.preventDefault(); setPlaying((value) => !value); }
  };

  return (
    <section
      className={`irx irx-${kind}`}
      data-interactive-research-explainer={kind}
      data-reduced-motion={reducedMotion}
      data-compact={compact}
      data-ui-audit="contrast layout"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={config.title}
    >
      <ExplainerHeader locale={locale} title={config.title} lede={config.lede} eyebrow={config.eyebrow} />
      <StepControls locale={locale} step={step} maxStep={maxStep} steps={config.steps} playing={playing} reducedMotion={reducedMotion} onStep={go} onPlay={() => setPlaying((value) => !value)} />
      <div className="irx-stage" data-step={step}>
        {kind === 'webshop' && <WebShopExplainer locale={locale} step={step} />}
        {kind === 'alfworld' && <ALFWorldExplainer locale={locale} step={step} />}
        {kind === 'seed' && <SeedExplainer locale={locale} step={step} />}
        {kind === 'openevo' && <OpenEvoExplainer locale={locale} step={step} carrier={carrier} setCarrier={setCarrier} onStep={go} />}
        {kind === 'compare' && <CompareExplainer locale={locale} step={step} />}
        {kind === 'server' && <ServerExplainer locale={locale} step={step} onStep={go} />}
      </div>
      <details className="irx-tech">
        <summary><span>Level 3</span>{zh ? '技术边界与复现提示' : 'Technical boundary and reproduction notes'}</summary>
        <p>{technicalCopy(kind, locale)}</p>
      </details>
    </section>
  );
}