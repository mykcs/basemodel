import { useRef } from 'react';
import { ChipSequence, ConnectorLayer, DocStack, FlowNode, ParamGrid, ProbBar, type Carrier, type EdgeSpec, type Locale, type Tone } from './ResearchExplainerPrimitives';

const THETA_T = [0.3, 0.7, 0.5, 0.2, 0.6, 0.4, 0.8, 0.3, 0.5, 0.2, 0.6, 0.7, 0.4, 0.6, 0.3, 0.5];
const THETA_NEXT = [0.3, 0.7, 0.85, 0.2, 0.6, 0.15, 0.8, 0.3, 0.5, 0.75, 0.6, 0.7, 0.1, 0.6, 0.3, 0.5];
const THETA_CHANGED = THETA_T.map((value, index) => (value === THETA_NEXT[index] ? -1 : index)).filter((index) => index >= 0);

function ParameterUpdateFlame({ label }: { label: string }) {
  return (
    <span className="irx-parameter-update" title={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M13.2 2.5c.7 4.2-2.6 5.5-2.3 8.2.1.9.7 1.7 1.6 2.1-.1-2 1-3.7 2.8-4.7 2.4 2 3.8 4.4 3.8 7.1A7.1 7.1 0 0 1 12 22a7.1 7.1 0 0 1-7.1-6.8c0-3.8 2.1-6.5 5.8-9.4.2 2.2.8 3.5 1.9 4.2.1-3.1.7-5.4.6-7.5Z" />
        <path className="irx-parameter-update-core" d="M12 13.1c1.8 1.3 2.6 2.7 2.6 4.2A2.6 2.6 0 0 1 12 19.8a2.6 2.6 0 0 1-2.6-2.5c0-1.4.8-2.8 2.6-4.2Z" />
      </svg>
      <b>{label}</b>
    </span>
  );
}

const GLM_OFFICIAL_LOGO = 'https://raw.githubusercontent.com/zai-org/GLM-5/414ad9eb891b05b5d7d51d573939bfe9ce538223/resources/logo.svg';

export function SeedExplainer({
  locale,
  step,
}: {
  locale: Locale;
  step: number;
}) {
  const zh = locale === "zh";
  const sceneRef = useRef<HTMLDivElement>(null);
  const moreLabel = zh ? "展开细节" : "Expand detail";
  const sameAction = 'click["Black"]';
  const actionTokens = ["click", "[", '"Black"', "]"];
  const schematic = zh
    ? "参数网格为示意，非真实权重"
    : "parameter grid is schematic, not real weights";
  const edges: EdgeSpec[] = [
    {
      id: "policy-harness",
      from: "seed-policy",
      to: "seed-harness",
      tone: "state",
      fromAnchor: "right",
      toAnchor: "left",
      active: step >= 0,
      label: zh ? "raw model completion" : "raw model completion",
    },
    {
      id: "environment-trajectory",
      from: "seed-environment",
      to: "seed-trajectory",
      tone: "experience",
      fromAnchor: "right",
      toAnchor: "left",
      active: step >= 1,
      label: zh ? "episode evidence" : "episode evidence",
    },
    {
      id: "trajectory-hindsight",
      from: "seed-trajectory",
      to: "seed-hindsight",
      tone: "experience",
      fromAnchor: "bottom",
      toAnchor: "top",
      active: step >= 2,
    },
    {
      id: "policy-analyzer",
      from: "seed-policy",
      to: "seed-hindsight",
      tone: "state",
      fromAnchor: "bottom",
      toAnchor: "left",
      shape: "smooth",
      dashed: true,
      label: "same checkpoint",
      active: step >= 2,
    },
    {
      id: "trajectory-plain",
      from: "seed-trajectory",
      to: "seed-plain",
      tone: "env",
      fromAnchor: "left",
      toAnchor: "top",
      shape: "outside-left-down",
      active: step >= 3,
    },
    {
      id: "trajectory-skill",
      from: "seed-trajectory",
      to: "seed-skill",
      tone: "env",
      fromAnchor: "right",
      toAnchor: "top",
      shape: "outside-right-down",
      active: step >= 3,
    },
    {
      id: "hindsight-skill",
      from: "seed-hindsight",
      to: "seed-skill",
      tone: "experience",
      fromAnchor: "bottom",
      toAnchor: "left",
      active: step >= 3,
    },
    {
      id: "plain-opd",
      from: "seed-plain",
      to: "seed-opd",
      tone: "signal",
      fromAnchor: "bottom",
      toAnchor: "left",
      active: step >= 4,
    },
    {
      id: "skill-opd",
      from: "seed-skill",
      to: "seed-opd",
      tone: "signal",
      fromAnchor: "bottom",
      toAnchor: "top",
      shape: "between-y",
      active: step >= 4,
    },
    {
      id: "trajectory-grpo",
      from: "seed-trajectory",
      to: "seed-grpo",
      tone: "env",
      fromAnchor: "right",
      toAnchor: "right",
      shape: "loop-right",
      active: step >= 4,
      label: zh ? "environment outcome" : "environment outcome",
    },
    {
      id: "opd-optimizer",
      from: "seed-opd",
      to: "seed-optimizer",
      tone: "signal",
      fromAnchor: "bottom",
      toAnchor: "left",
      active: step >= 4,
      weight: "strong",
    },
    {
      id: "grpo-optimizer",
      from: "seed-grpo",
      to: "seed-optimizer",
      tone: "signal",
      fromAnchor: "bottom",
      toAnchor: "right",
      active: step >= 4,
      weight: "strong",
    },
    {
      id: "optimizer-next",
      from: "seed-optimizer",
      to: "seed-next",
      tone: "persist",
      fromAnchor: "right",
      toAnchor: "left",
      active: step >= 5,
    },
    {
      id: "next-loop",
      from: "seed-next",
      to: "seed-policy",
      tone: "persist",
      fromAnchor: "right",
      toAnchor: "top",
      shape: "loop-top",
      label: zh ? "next rollout" : "next rollout",
      active: step >= 5,
    },
  ];
  return (
    <>
      <section
        className="irx-seed-stage irx-seed-bootstrap"
        data-ui-audit="contrast layout"
        aria-labelledby="seed-stage1-title"
      >
        <header className="irx-seed-stage__head">
          <div>
            <span>STAGE 1 · HINDSIGHT-SKILL SFT</span>
            <strong id="seed-stage1-title">
              {zh
                ? "先用 SEED 的交互层驱动 Qwen 做题，再让 GLM-5.2 离线复盘"
                : "SEED first drives Qwen through its interaction layer; GLM-5.2 analyzes only after the episode"}
            </strong>
          </div>
          <div className="irx-seed-stage__boundary-copy">
            <p>
              {zh
                ? "模型侧由 SEED / verl-agent harness 负责 prompt、history 与 action projection。"
                : "SEED / verl-agent owns the model-facing prompt, history, and action projection."}
            </p>
            <p>
              {zh
                ? "底层由 Princeton WebShop 的 WebAgentTextEnv 执行 search[] / click[]，返回 observation 与 score。"
                : "Princeton WebShop’s WebAgentTextEnv executes search[] / click[] and returns observations and score."}
            </p>
          </div>
        </header>

        <div
          className="irx-stage1-collection"
          aria-label={
            zh
              ? "Stage 1 WebShop 轨迹采集责任链"
              : "Stage 1 WebShop rollout responsibility chain"
          }
        >
          <section
            className="irx-seed-runtime-boundary"
            data-ui-audit="contrast layout"
          >
            <header>
              <small>AGENT RUNTIME</small>
              <strong>SEED / verl-agent</strong>
              <span>
                {zh ? "模型侧交互合同" : "model-facing interaction contract"}
              </span>
            </header>
            <article
              className="irx-seed-role irx-seed-role-model"
              data-ui-audit-item
            >
              <small>POLICY MODEL</small>
              <strong>Qwen2.5-3B-Instruct</strong>
              <span>
                {zh
                  ? "根据当前 prompt 产生原始 completion"
                  : "produces the raw completion from the current prompt"}
              </span>
            </article>
            <div className="irx-seed-runtime-arrow" aria-hidden="true">
              <span>raw completion</span>
              <i />
            </div>
            <article
              className="irx-seed-role irx-seed-role-harness"
              data-ui-audit-item
            >
              <small>SEED / verl-agent HARNESS</small>
              <strong>
                {zh
                  ? "组装 observation → 解析 action"
                  : "build observation → project action"}
              </strong>
              <ul aria-label={zh ? "Harness 责任" : "Harness responsibilities"}>
                <li>prompt + history</li>
                <li>available actions</li>
                <li>&lt;think&gt; / &lt;action&gt;</li>
                <li>webshop_projection</li>
              </ul>
            </article>
          </section>

          <div
            className="irx-seed-exchange"
            aria-label={
              zh
                ? "Harness 与环境之间的双向通道"
                : "Two-way channel between harness and environment"
            }
          >
            <span className="irx-seed-exchange-action">
              {zh ? "执行动作" : "executed action"} <b>search[] / click[]</b>
              <i aria-hidden="true">→</i>
            </span>
            <span className="irx-seed-exchange-return">
              <i aria-hidden="true">←</i>
              <b>observation · available actions · score</b>
            </span>
          </div>

          <section className="irx-seed-benchmark" data-ui-audit-item>
            <small>PRINCETON WEBSHOP ENVIRONMENT</small>
            <strong>WebAgentTextEnv</strong>
            <span>
              {zh
                ? "商品 / goal / 页面状态 / 环境转移 / WebShop score"
                : "products / goals / page state / transitions / WebShop score"}
            </span>
            <code>gym.make('WebAgentTextEnv-v0')</code>
          </section>
        </div>

        <div className="irx-stage1-output">
          <span>
            {zh
              ? "重复交互，最多 15 steps / episode"
              : "repeat interaction, up to 15 steps / episode"}
          </span>
          <b aria-hidden="true">↓</b>
        </div>

        <ol
          className="irx-seed-offline-pipeline"
          aria-label={
            zh
              ? "Stage 1 离线后见监督流程"
              : "Stage 1 offline hindsight-supervision flow"
          }
        >
          <li className="irx-seed-trajectory-source" data-ui-audit-item>
            <small>COMPLETED EPISODES</small>
            <b>180 tasks × 8 rollouts</b>
            <span>
              {zh
                ? "= 1,440 条完整 trajectory + outcome"
                : "= 1,440 completed trajectories + outcomes"}
            </span>
          </li>
          <li className="irx-glm-model" data-ui-audit-item>
            <span className="irx-glm-icon" aria-hidden="true">
              <img src={GLM_OFFICIAL_LOGO} alt="" width="30" height="30" />
            </span>
            <div>
              <small>EXTERNAL OFFLINE ANALYZER</small>
              <b>GLM-5.2</b>
              <span>
                {zh
                  ? "只读已完成 episode；不负责轨迹采集，也不是 reward scorer"
                  : "reads completed episodes only; it neither collects trajectories nor scores WebShop reward"}
              </span>
            </div>
          </li>
          <li data-ui-audit-item>
            <small>ANNOTATION</small>
            <b>trajectory → hindsight skill</b>
            <span>
              {zh
                ? "把完整经历转成可监督的复盘样本"
                : "turn completed experience into supervised hindsight records"}
            </span>
          </li>
          <li data-ui-audit-item>
            <small>SUPERVISED UPDATE</small>
            <b>3-epoch SFT</b>
            <span>
              {zh
                ? "把 analyzer 能力写入 checkpoint"
                : "write analyzer capability into the checkpoint"}
            </span>
          </li>
          <li data-ui-audit-item>
            <small>STAGE-2 INITIAL STATE</small>
            <b>policy θ0</b>
            <span>
              {zh
                ? "同一 checkpoint 之后既 acting，也 analyzing"
                : "the same checkpoint can now act and analyze"}
            </span>
          </li>
        </ol>
      </section>

      <div className="irx-seed-stage-divider" data-ui-audit="contrast layout">
        <div>
          <span>STAGE 2 · SELF-EVOLVING OPD + GRPO</span>
          <strong>
            {zh
              ? "交互合同不换：当前 policy 仍经同一 harness 进入 Princeton WebShop；变化的是 analyzer 来源与被更新的参数"
              : "The interaction contract stays fixed: the current policy still reaches Princeton WebShop through the same harness; what changes is the analyzer source and the learned parameter state"}
          </strong>
        </div>
        <small>
          {zh
            ? "外部 GLM-5.2 已退出；下面逐步追踪一次 Stage 2。"
            : "External GLM-5.2 is gone; the trace below follows one Stage-2 iteration."}
        </small>
      </div>

      <div
        className="irx-seed-responsibility-key"
        aria-label={
          zh ? "SEED 责任边界图例" : "SEED responsibility-boundary key"
        }
      >
        <span data-kind="model">
          <b>MODEL</b>
          {zh
            ? "产生 completion / 被训练"
            : "generates completion / is trained"}
        </span>
        <span data-kind="harness">
          <b>HARNESS</b>
          {zh ? "组装上下文 / 解析动作" : "builds context / projects action"}
        </span>
        <span data-kind="environment">
          <b>ENVIRONMENT</b>
          {zh
            ? "执行动作 / 返回 observation 与 score"
            : "executes actions / returns observation and score"}
        </span>
        <span data-kind="evidence">
          <b>EVIDENCE</b>
          {zh ? "episode 完成后固定" : "fixed after episode completion"}
        </span>
      </div>

      <div
        className="irx-diagram irx-seed-scene"
        ref={sceneRef}
        data-ui-audit="contrast layout"
      >
        <FlowNode
          id="seed-policy"
          role="CURRENT POLICY · MODEL"
          title="policy θt"
          detail={
            zh
              ? "这一轮真正产生 completion、也会被 optimizer 更新的 Qwen checkpoint"
              : "the Qwen checkpoint that generates completions this round and is later updated by the optimizer"
          }
          moreLabel={moreLabel}
          more={
            zh
              ? "θt 是 Stage 2 当前 checkpoint。它提供 actor 与 hindsight analyzer 两种能力，但 benchmark interaction contract 本身不属于模型参数。"
              : "θt is the current Stage-2 checkpoint. It provides both actor and hindsight-analyzer capability, while the benchmark interaction contract itself is not part of the learned model parameters."
          }
          tone="state"
          active={step === 0}
          complete={step > 0}
          className="seed-policy"
        >
          <ParamGrid
            label={`θt · ${schematic}`}
            cells={THETA_T}
            tone="state"
            className="seed-theta"
          />
        </FlowNode>

        <section
          className="irx-seed-interaction-contract"
          data-ui-audit="contrast layout"
          aria-label={
            zh
              ? "Stage 2 WebShop 交互边界"
              : "Stage 2 WebShop interaction boundary"
          }
        >
          <header>
            <span>FIXED BENCHMARK INTERACTION CONTRACT</span>
            <strong>
              {zh
                ? "SEED / verl-agent harness ↔ Princeton WebShop"
                : "SEED / verl-agent harness ↔ Princeton WebShop"}
            </strong>
          </header>
          <div className="irx-seed-interaction-body">
            <article
              className="irx-seed-role irx-seed-role-harness"
              data-flow-id="seed-harness"
              data-ui-audit-item
              data-active={step === 0}
              data-complete={step > 0}
            >
              <small>AGENT HARNESS</small>
              <strong>SEED / verl-agent</strong>
              <span>
                prompt · history · available actions · &lt;action&gt; projection
              </span>
            </article>
            <div
              className="irx-seed-exchange"
              aria-label={
                zh
                  ? "动作与环境反馈通道"
                  : "Action and environment-feedback channel"
              }
            >
              <span className="irx-seed-exchange-action">
                <b>search[] / click[]</b>
                <i aria-hidden="true">→</i>
              </span>
              <span className="irx-seed-exchange-return">
                <i aria-hidden="true">←</i>
                <b>observation · score</b>
              </span>
            </div>
            <article
              className="irx-seed-role irx-seed-role-environment"
              data-flow-id="seed-environment"
              data-ui-audit-item
              data-active={step === 0}
              data-complete={step > 0}
            >
              <small>BENCHMARK ENVIRONMENT</small>
              <strong>Princeton WebShop · WebAgentTextEnv</strong>
              <span>
                {zh
                  ? "执行合法环境动作并改变页面状态"
                  : "executes environment actions and changes page state"}
              </span>
            </article>
          </div>
        </section>

        <FlowNode
          id="seed-trajectory"
          role="SEALED EPISODE · EVIDENCE"
          title={
            zh ? "完整 on-policy trajectory" : "completed on-policy trajectory"
          }
          detail={
            zh
              ? "observation + executed actions + outcome；动作已经固定"
              : "observation + executed actions + outcome; sampled actions are now fixed"
          }
          moreLabel={moreLabel}
          more={
            zh
              ? "后面的 analyzer、OPD 和 GRPO 都读取这份已经完成的 episode；它们不会回头替换已经执行过的 WebShop action。"
              : "The analyzer, OPD, and GRPO branches all read this completed episode; none rewrites the WebShop actions that were already executed."
          }
          tone="experience"
          active={step === 1}
          complete={step > 1}
          className="seed-trajectory"
        >
          <ChipSequence
            label={sameAction}
            tone="experience"
            tokens={actionTokens}
            className="seed-action-chips"
          />
        </FlowNode>

        <FlowNode
          id="seed-hindsight"
          role="ANALYZER · SAME MODEL"
          title="hindsight skill"
          detail={
            zh
              ? "Stage 2 由同一 θt checkpoint 看完整 episode 后自己复盘"
              : "in Stage 2 the same θt checkpoint analyzes the completed episode itself"
          }
          moreLabel={moreLabel}
          more={
            zh
              ? "这里与 Stage 1 的关键差别是 analyzer 来源：外部 GLM-5.2 已经离开；但 analyzer 仍不负责 WebShop 环境转移或 reward 计算。"
              : "The key change from Stage 1 is analyzer ownership: external GLM-5.2 has left the loop. The analyzer still does not own WebShop transitions or reward calculation."
          }
          tone="experience"
          active={step === 2}
          complete={step > 2}
          className="seed-hindsight"
        />
        <FlowNode
          id="seed-plain"
          role="RE-SCORE · CONTEXT A"
          title="plain context"
          detail={`${sameAction} · P_plain`}
          moreLabel={moreLabel}
          more={
            zh
              ? "P_plain 是当前 policy 在普通历史下，对已采样同一 action token 的概率。"
              : "P_plain is the current policy probability of the already-sampled action tokens under the ordinary history."
          }
          tone="env"
          active={step === 3}
          complete={step > 3}
          className="seed-plain"
        >
          <ChipSequence
            label={sameAction}
            tone="env"
            tokens={actionTokens}
            className="seed-action-chips"
          />
        </FlowNode>
        <FlowNode
          id="seed-skill"
          role="RE-SCORE · CONTEXT B"
          title="skill-augmented context"
          detail={`${sameAction} · P_skill`}
          moreLabel={moreLabel}
          more={
            zh
              ? "只是在 context 中加入 hindsight skill，再给同一 action token 重打分；不是生成一条 teacher 轨迹。"
              : "The hindsight skill is added only to the context and the same action tokens are re-scored; no teacher trajectory is generated."
          }
          tone="experience"
          active={step === 3}
          complete={step > 3}
          className="seed-skill"
        >
          <ChipSequence
            label={sameAction}
            tone="experience"
            tokens={actionTokens}
            className="seed-action-chips"
          />
        </FlowNode>
        <FlowNode
          id="seed-opd"
          role="DENSE LEARNING SIGNAL"
          title="OPD"
          detail={
            zh
              ? "P_skill − P_plain 的行为偏移 → token-level distillation signal"
              : "P_skill − P_plain behavioral shift → token-level distillation signal"
          }
          moreLabel={moreLabel}
          more={
            zh
              ? "OPD 属于训练信号层，不是环境 reward，也不是额外记忆。"
              : "OPD belongs to the learning-signal layer; it is neither environment reward nor external memory."
          }
          tone="signal"
          active={step === 4}
          complete={step > 4}
          className="seed-opd"
        />
        <FlowNode
          id="seed-grpo"
          role="OUTCOME RL SIGNAL"
          title="GRPO"
          detail={
            zh
              ? "读取同一 episode 的 environment outcome / group-relative advantage"
              : "uses the same episode’s environment outcome / group-relative advantage"
          }
          moreLabel={moreLabel}
          more={
            zh
              ? "WebShop score 来自 benchmark environment；GRPO 把 outcome 变成 RL 优势信号。两者不是同一个职责层。"
              : "The WebShop score comes from the benchmark environment; GRPO converts outcome into an RL advantage signal. They are distinct responsibility layers."
          }
          tone="signal"
          active={step === 4}
          complete={step > 4}
          className="seed-grpo"
        />
        <FlowNode
          id="seed-optimizer"
          role="TRAINING UPDATE"
          title="GRPO + OPD"
          detail={
            zh
              ? "两支训练信号合流，更新的对象是 policy 参数"
              : "the two learning signals merge; the object being updated is the policy parameter state"
          }
          moreLabel={moreLabel}
          more={
            zh
              ? "Harness、Princeton WebShop 环境和已经完成的 trajectory 都不会在这个 optimizer step 里被改写。"
              : "The harness, Princeton WebShop environment, and completed trajectory are not rewritten by this optimizer step."
          }
          tone="signal"
          active={step === 4}
          complete={step > 4}
          className="seed-optimizer"
        />
        <FlowNode
          id="seed-next"
          role="PERSISTED MODEL STATE"
          title="policy θt+1"
          detail={
            zh
              ? "真正跨轮保留的是更新后的 checkpoint；下一轮继续通过同一 interaction contract 做题"
              : "what persists across rounds is the updated checkpoint; the next round uses the same interaction contract"
          }
          moreLabel={moreLabel}
          more={
            zh
              ? "部署时只需要更新后的 policy 配合 benchmark / serving harness；不需要 GLM-5.2、hindsight analyzer prompt 或持久 skill bank。"
              : "Deployment uses the updated policy with the benchmark/serving harness; it does not need GLM-5.2, the hindsight-analyzer prompt, or a persistent skill bank."
          }
          tone="persist"
          active={step === 5}
          className="seed-next"
        >
          <div className="irx-parameter-result">
            <ParameterUpdateFlame
              label={zh ? "参数更新" : "parameter update"}
            />
            <ParamGrid
              label={`θt+1 · ${schematic}`}
              cells={THETA_NEXT}
              changed={step >= 5 ? THETA_CHANGED : []}
              tone="persist"
              className="seed-theta"
            />
          </div>
        </FlowNode>
        <ConnectorLayer
          containerRef={sceneRef}
          edges={edges}
          ariaLabel={
            zh
              ? "SEED：policy 经 harness 与 Princeton WebShop 交互，episode 再进入 hindsight、OPD、GRPO 与参数更新"
              : "SEED: the policy interacts with Princeton WebShop through the harness; the completed episode then feeds hindsight, OPD, GRPO, and the parameter update"
          }
        />
      </div>

      <div
        className="irx-probability-panel"
        data-active={step === 3}
        data-ui-audit="contrast layout"
      >
        <div className="irx-same-action">
          <span>
            {zh
              ? "固定同一批 sampled action tokens"
              : "hold the same sampled action tokens fixed"}
          </span>
          <ChipSequence
            label={sameAction}
            tone="signal"
            tokens={actionTokens}
          />
        </div>
        <ProbBar
          label="P_plain(action)"
          value={0.28}
          display="0.28"
          tone="env"
        />
        <ProbBar
          label="P_skill(action)"
          value={0.62}
          display="0.62"
          tone="experience"
          delta="Δ +0.34 → OPD"
        />
        <ProbBar
          label="GRPO advantage"
          value={0.74}
          display="0.74"
          tone="signal"
        />
        <small>
          {zh
            ? "教学示例概率，只用于解释“同一动作、两个 context、概率变化”；不是论文或本项目实测值。"
            : "Illustrative probabilities only, used to explain “same action, two contexts, probability shift”; these are not measured paper/project values."}
        </small>
      </div>

      <aside className="irx-inference-strip" data-ui-audit="contrast layout">
        <div>
          <small>TRAINING</small>
          <strong>
            {zh
              ? "Stage 1：Qwen → SEED/verl-agent harness ↔ Princeton WebShop → trajectory → GLM-5.2 → SFT；Stage 2：θt → 同一 harness ↔ WebShop → self-hindsight + OPD + GRPO → θt+1"
              : "Stage 1: Qwen → SEED/verl-agent harness ↔ Princeton WebShop → trajectory → GLM-5.2 → SFT; Stage 2: θt → same harness ↔ WebShop → self-hindsight + OPD + GRPO → θt+1"}
          </strong>
        </div>
        <div>
          <small>TEST / INFERENCE</small>
          <strong>
            {zh
              ? "更新后的 policy → serving / benchmark harness → WebShop；GLM-5.2 与 hindsight skill 不进入部署路径"
              : "updated policy → serving / benchmark harness → WebShop; GLM-5.2 and hindsight skills are absent from deployment"}
          </strong>
        </div>
      </aside>
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
    { id: 'method-adapter', from: 'evo-method', to: 'evo-adapter', tone: 'state', fromAnchor: 'bottom', toAnchor: 'top', active: step >= 3 },
    { id: 'adapter-validation', from: 'evo-adapter', to: 'evo-validation', tone: 'persist', fromAnchor: 'bottom', toAnchor: 'top', active: step >= 4 },
    { id: 'validation-successor', from: 'evo-validation', to: 'evo-successor', tone: 'persist', fromAnchor: 'bottom', toAnchor: 'top', active: step >= 5 },
    { id: 'successor-next', from: 'evo-successor', to: 'evo-next', tone: 'persist', fromAnchor: 'right', toAnchor: 'left', active: step >= 6 },
    { id: 'next-loop', from: 'evo-next', to: 'evo-head', tone: 'persist', fromAnchor: 'right', toAnchor: 'top', shape: 'loop-top', label: zh ? 'successor revision 生效' : 'successor revision activates', active: step >= 6 },
  ];
  return (
    <>
      <div className="irx-diagram irx-openevo-scene" ref={sceneRef} data-ui-audit="contrast layout">
        <FlowNode id="evo-head" role="PROJECT HEAD" title={zh ? '当前 agent revision' : 'current agent revision'} detail="Qwen2.5-3B-Instruct + current carrier state" moreLabel={moreLabel} more={zh ? 'Project Head 是任务开始时锁定的执行身份：base model、已激活 carrier 与 context revision 的组合。' : 'The Project Head is the execution identity pinned at task start: base model plus activated carriers and context revision.'} tone="state" active={step === 0} complete={step > 0} className="evo-head" />
        <FlowNode id="evo-task" role="TASK N · WEBSHOP" title={zh ? '完成 WebShop Task N' : 'complete WebShop Task N'} detail="observation · action · outcome" moreLabel={moreLabel} more={zh ? '任务在冻结的 benchmark contract 下完成，产生可复现的 observation / action / outcome 记录。演化不会在这一 episode 中途发生。' : 'The task completes under one frozen benchmark contract and produces reproducible observation / action / outcome records. Evolution never happens mid-episode.'} tone="env" active={step === 0} complete={step > 0} className="evo-task" />
        <FlowNode id="evo-evidence" role="TASK COMPLETION BOUNDARY" title="SEALED EVIDENCE" detail={zh ? 'trajectory + outcome + metadata 先冻结，再允许演化' : 'trajectory + outcome + metadata are frozen before evolution'} moreLabel={moreLabel} more={zh ? '封存包含 identity 与 digest，之后可以验证这份 evidence 没有被改写。' : 'Sealing records identity and digest, so later stages can verify the evidence was never rewritten.'} tone="experience" active={step === 1} complete={step > 1} className="evo-evidence">
          <DocStack label="sealed evidence" items={['trajectory', 'outcome', 'metadata']} strapped={step >= 1} tone="experience" />
        </FlowNode>
        <FlowNode id="evo-method" role="EVOLUTION METHOD" title={zh ? '反思 / 提炼 / 参数演变' : 'reflection / extraction / parametric evolution'} detail={zh ? '方法读取已封存 evidence，不改写刚完成的 Task N' : 'the method reads sealed evidence and does not rewrite the completed Task N'} moreLabel={moreLabel} more={zh ? '演化方法只读 evidence、输出声明类型的候选状态；它不直接在线改写正在服役的 policy。' : 'The evolution method only reads evidence and emits a candidate state of a declared type; it never rewrites the serving policy in place.'} tone="experience" active={step === 2} complete={step > 2} className="evo-method" />
        <FlowNode id="evo-adapter" role="CURRENT WEBSHOP PATH" title="PARAMETRIC ADAPTER" detail={zh ? 'OpenEvo SD-LoRA · 把已封存经验写入参数化 carrier' : 'OpenEvo SD-LoRA · write sealed experience into a parametric carrier'} moreLabel={moreLabel} more={zh ? '这是当前 WebShop 实验的主路径：adapter 是被验证、持久化并由下一任务加载的具体 carrier。' : 'This is the current WebShop experiment main path: the adapter is the concrete carrier that is validated, persisted, and loaded by the next task.'} tone="state" active={step === 3} complete={step > 3} className="evo-adapter">
          <div className="irx-parameter-result"><ParameterUpdateFlame label={zh ? '参数更新' : 'parameter update'} /><ParamGrid label={zh ? 'SD-LoRA adapter（示意）' : 'SD-LoRA adapter (schematic)'} cells={THETA_NEXT} changed={step >= 3 ? THETA_CHANGED : []} tone="state" /></div>
        </FlowNode>
        <section className="irx-validation" data-flow-id="evo-validation" data-ui-audit-item data-active={step === 4}>
          <span>VALIDATION GATE</span><strong>{zh ? 'PASS 后才能进入 successor revision' : 'PASS is required before successor revision'}</strong>
          <div className="irx-gate-funnel" data-pass={step >= 4} aria-hidden="true"><i /><i /><i /></div>
          <small>{zh ? '展开层保留 identity、digest、reload、behavior 与科学合同。' : 'Identity, digest, reload, behavior, and scientific-contract checks remain in the expanded layer.'}</small>
        </section>
        <FlowNode id="evo-successor" role="SUCCESSOR REVISION" title={zh ? '验证通过的下一版 agent 状态' : 'validated next agent state'} detail={zh ? `当前查看 carrier: ${carrier}` : `inspecting carrier: ${carrier}`} moreLabel={moreLabel} more={zh ? 'successor revision 是由通过 gate 的 carrier 状态组成的新 agent 身份，可以被后续任务整体加载。' : 'A successor revision is the new agent identity assembled from gate-passed carrier state, loadable as a whole by later tasks.'} tone="persist" active={step === 5} complete={step > 5} className="evo-successor">
          {/* R1 → R2: the successor revision sits on top of the previous one. */}
          <span className="irx-revision-stack" data-active={step >= 5} aria-hidden="true"><i className="irx-revision-r1">R1</i><i className="irx-revision-r2">R2</i></span>
        </FlowNode>
        <FlowNode id="evo-next" role="TASK N+1" title={zh ? '下一任务加载 successor revision' : 'next task loads the successor revision'} detail={zh ? '新的任务从“已经进化过的状态”开始，而不是改写已经结束的 Task N' : 'the new task starts from an evolved state rather than rewriting the completed Task N'} moreLabel={moreLabel} more={zh ? 'Task N+1 从 successor revision 启动，并产生下一轮可以再次封存的新 evidence。' : 'Task N+1 starts from the successor revision and produces fresh evidence that can be sealed again.'} tone="env" active={step === 6} className="evo-next" />
        <ConnectorLayer containerRef={sceneRef} edges={edges} ariaLabel={zh ? 'OpenEvo 在任务完成后封存证据，经当前 WebShop 的参数化 adapter 路径和 validation 形成 successor revision，再进入 Task N+1' : 'OpenEvo seals evidence after task completion, follows the current WebShop parametric-adapter path through validation into a successor revision, then enters Task N+1'} />
      </div>
      <details className="irx-carrier-details">
        <summary>{zh ? '展开：OpenEvo 的其他 carrier 与完整 validation 合同' : 'Expand: other OpenEvo carriers and the full validation contract'}</summary>
        <p>{zh ? 'OpenEvo 不等于 SD-LoRA。memory 与 agent artifact 也可以是跨任务 carrier；它们保留在这里，是为了不把当前 WebShop 的参数化主路径误画成 OpenEvo 的定义。' : 'OpenEvo is not SD-LoRA. Memory and agent artifacts can also be cross-task carriers; they stay here so the current parametric WebShop main path is not mistaken for OpenEvo’s definition.'}</p>
        <div className="irx-carrier-lane" data-active={step === 3}>
          {carriers.map((item) => (
            <button key={item.id} type="button" className={`irx-carrier irx-carrier-${item.id} irx-tone-${item.tone}`} data-ui-audit-item data-selected={carrier === item.id} onClick={() => { setCarrier(item.id); onStep(Math.max(step, 3)); }} aria-pressed={carrier === item.id}>
              <i className="irx-carrier-glyph" aria-hidden="true"><i /><i /><i /></i>
              <span>CARRIER</span><strong>{item.title}</strong><small>{item.detail}</small>{item.id === 'adapter' && <em>{zh ? '当前 WebShop 实例' : 'current WebShop instance'}</em>}
            </button>
          ))}
        </div>
        <ol className="irx-validation-contract">{['identity', 'digest', 'fresh reload', 'behavior probe', 'scientific contract'].map((item) => <li key={item}>{item}</li>)}</ol>
      </details>
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
