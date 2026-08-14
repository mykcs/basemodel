import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import '../../styles/interactive-research-explainer.css';

type Locale = 'zh' | 'en';
type Kind = 'webshop' | 'alfworld' | 'seed' | 'openevo' | 'compare' | 'server';
type Carrier = 'memory' | 'artifact' | 'adapter';

interface Props {
  locale: Locale;
  kind: Kind;
  compact?: boolean;
}

interface StepMeta {
  label: string;
  narration: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function StepControls({
  locale,
  step,
  maxStep,
  steps,
  playing,
  reducedMotion,
  onStep,
  onPlay,
}: {
  locale: Locale;
  step: number;
  maxStep: number;
  steps: StepMeta[];
  playing: boolean;
  reducedMotion: boolean;
  onStep: (step: number) => void;
  onPlay: () => void;
}) {
  const zh = locale === 'zh';
  return (
    <div className="irx-controls" aria-label={zh ? '交互步骤控制' : 'Explainer step controls'}>
      <div className="irx-control-buttons">
        <button type="button" onClick={() => onStep(step - 1)} disabled={step === 0} aria-label={zh ? '上一步' : 'Previous step'}>
          <span aria-hidden="true">←</span> {zh ? '上一步' : 'Previous'}
        </button>
        <button type="button" onClick={onPlay} disabled={reducedMotion} aria-pressed={playing} title={reducedMotion ? (zh ? '系统已启用减少动态效果' : 'Reduced motion is enabled') : undefined}>
          {reducedMotion ? (zh ? '减少动态' : 'Reduced motion') : playing ? (zh ? '暂停' : 'Pause') : (zh ? '播放' : 'Play')}
        </button>
        <button type="button" onClick={() => onStep(step + 1)} disabled={step === maxStep} aria-label={zh ? '下一步' : 'Next step'}>
          {zh ? '下一步' : 'Next'} <span aria-hidden="true">→</span>
        </button>
        <button type="button" onClick={() => onStep(0)} disabled={step === 0}>{zh ? '重置' : 'Reset'}</button>
      </div>
      <div className="irx-stepper" role="list" aria-label={zh ? '步骤' : 'Steps'}>
        {steps.map((item, index) => (
          <button
            type="button"
            key={`${item.label}-${index}`}
            className="irx-step-dot"
            data-active={index === step}
            data-complete={index < step}
            aria-current={index === step ? 'step' : undefined}
            aria-label={`${index + 1}. ${item.label}`}
            onClick={() => onStep(index)}
          >
            <span>{index + 1}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </div>
      <p className="irx-live" aria-live="polite"><b>{steps[step]?.label}</b> · {steps[step]?.narration}</p>
    </div>
  );
}

function Node({ role, title, detail, tone, active = false, complete = false, className = '', children }: {
  role: string;
  title: string;
  detail?: string;
  tone: 'env' | 'experience' | 'signal' | 'state' | 'persist' | 'neutral';
  active?: boolean;
  complete?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <article className={`irx-node irx-tone-${tone} ${className}`} data-active={active} data-complete={complete}>
      <span className="irx-node-role">{role}</span>
      <strong>{title}</strong>
      {detail && <small>{detail}</small>}
      {children}
    </article>
  );
}

function ExplainerHeader({ locale, title, lede, eyebrow }: { locale: Locale; title: string; lede: string; eyebrow: string }) {
  const zh = locale === 'zh';
  return (
    <header className="irx-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{lede}</p>
      <div className="irx-depth" aria-label={zh ? '阅读深度' : 'Reading depth'}>
        <span><b>01</b>{zh ? '直觉' : 'intuition'}</span>
        <span><b>02</b>{zh ? '交互' : 'interaction'}</span>
        <span><b>03</b>{zh ? '技术细节' : 'technical detail'}</span>
      </div>
    </header>
  );
}

function WebShopExplainer({ locale, step }: { locale: Locale; step: number }) {
  const zh = locale === 'zh';
  const states = [
    {
      observation: zh ? '任务目标：买一件黑色、M 码、价格低于 $50 的运动衫。' : 'Goal: buy a black, size-M sports sweatshirt under $50.',
      actions: zh ? '环境已就绪；可从搜索开始。' : 'Environment ready; search can begin.',
      selected: '—',
      transition: zh ? '任务载入，网页处于首页。' : 'Task loaded; storefront is at the home page.',
      reward: 'task_score = 0',
    },
    {
      observation: zh ? '首页提供搜索框。Agent 只能基于当前 observation 选择动作。' : 'The home page exposes a search box. The agent chooses from the current observation.',
      actions: 'search[query]',
      selected: 'search["black sports sweatshirt"]',
      transition: zh ? '环境返回搜索结果页。' : 'The environment returns a results page.',
      reward: 'task_score = 0',
    },
    {
      observation: zh ? '搜索结果里出现 Core Run Hoodie，$39。' : 'Search results include Core Run Hoodie at $39.',
      actions: 'click[product] · search[new query]',
      selected: 'click["Core Run Hoodie"]',
      transition: zh ? '网页切换到商品详情页。' : 'The page transitions to product detail.',
      reward: 'task_score = 0',
    },
    {
      observation: zh ? '商品页暴露颜色与尺码选项：Black / Gray，S / M / L。' : 'The product page exposes color and size options: Black / Gray, S / M / L.',
      actions: 'click[color] · click[size] · click[buy]',
      selected: 'click["Black"] + click["M"]',
      transition: zh ? '环境保存当前商品选项。' : 'The environment stores the selected options.',
      reward: 'task_score = 0',
    },
    {
      observation: zh ? '商品、颜色、尺码、价格都满足目标。' : 'Product, color, size, and price now satisfy the goal.',
      actions: 'click[buy]',
      selected: 'click["Buy Now"]',
      transition: zh ? '进入终局评测，环境检查任务约束。' : 'Terminal evaluation checks the task constraints.',
      reward: 'DEMO: task_score = 1.0 · won = true',
    },
  ];
  const current = states[step];
  return (
    <>
      <div className="irx-flow-strip irx-five">
        {['GOAL', 'SEARCH', 'PRODUCT', 'OPTIONS', 'REWARD'].map((label, index) => (
          <Node key={label} role={`${index + 1}`} title={label} tone={index === 4 ? 'persist' : index === 0 ? 'experience' : 'env'} active={step === index} complete={step > index} />
        ))}
        <svg className="irx-strip-wires" viewBox="0 0 1000 120" role="img" aria-label={zh ? '任务通过搜索、商品页、选项与购买进入奖励' : 'Task flows through search, product, options, and purchase into reward'}>
          <title>{zh ? 'WebShop 状态转换连接线' : 'WebShop state-transition connectors'}</title>
          <defs><marker id="irx-web-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-env)" /></marker></defs>
          <path d="M160 60 H235" /><path d="M360 60 H435" /><path d="M560 60 H635" /><path d="M760 60 H835" />
        </svg>
      </div>
      <div className="irx-webshop-stage">
        <section className="irx-browser" aria-label={zh ? '简化 WebShop 页面' : 'Simplified WebShop page'}>
          <div className="irx-browser-bar"><span></span><span></span><span></span><code>webshop.local</code></div>
          <div className="irx-shop-header"><strong>WebShop</strong><label><span className="sr-only">Search</span><input readOnly value={step >= 1 ? 'black sports sweatshirt' : ''} placeholder={zh ? '搜索商品' : 'Search products'} /></label><button type="button" tabIndex={-1}>Search</button></div>
          {step === 0 && <div className="irx-shop-welcome"><span>GOAL</span><b>{zh ? '黑色 · M 码 · 运动衫 · ≤ $50' : 'Black · M · sweatshirt · ≤ $50'}</b><p>{zh ? 'Agent 不是回答一个商品名，而是要在会变化的网页里完成这一目标。' : 'The agent does not just name a product; it must complete the goal in a changing website.'}</p></div>}
          {step >= 1 && step <= 2 && <div className="irx-products">
            <article data-selected={step === 2}><div className="irx-product-image">HOODIE</div><strong>Core Run Hoodie</strong><span>$39</span><small>Black · Gray · S/M/L</small></article>
            <article><div className="irx-product-image">ZIP</div><strong>Trail Zip Jacket</strong><span>$64</span><small>Black · Navy</small></article>
            <article><div className="irx-product-image">TEE</div><strong>Training Tee</strong><span>$28</span><small>Black · White</small></article>
          </div>}
          {step >= 3 && <div className="irx-product-detail">
            <div className="irx-product-image large">HOODIE</div>
            <div><small>Core Run Hoodie</small><h3>$39</h3><p>{zh ? '颜色' : 'Color'}</p><div className="irx-options"><span data-selected>Black</span><span>Gray</span></div><p>{zh ? '尺码' : 'Size'}</p><div className="irx-options"><span>S</span><span data-selected>M</span><span>L</span></div><button type="button" tabIndex={-1} data-ready={step === 4}>Buy Now</button></div>
          </div>}
        </section>
        <aside className="irx-inspector">
          <div><span>OBSERVATION</span><p>{current.observation}</p></div>
          <div><span>AVAILABLE ACTIONS</span><code>{current.actions}</code></div>
          <div><span>AGENT SELECTED</span><code>{current.selected}</code></div>
          <div><span>ENVIRONMENT TRANSITION</span><p>{current.transition}</p></div>
          <div className="irx-reward"><span>REWARD / SCORE</span><strong>{current.reward}</strong></div>
        </aside>
      </div>
      <p className="irx-boundary-note"><b>{zh ? '研究边界' : 'Research boundary'}:</b> {zh ? '上面的 1.0 只是教学演示，不是 Phase G 测得结果。当前 OpenEvo 使用冻结 1,000-product 环境；Phase G 只消费了 promotion-dev goals 6680 / 2590，下一 Gate 是 Phase H0 Natural Success Search。' : 'The 1.0 above is a teaching demo, not a measured Phase G result. Current OpenEvo uses the frozen 1,000-product environment; Phase G consumed only promotion-dev goals 6680 / 2590, and the next gate is Phase H0 Natural Success Search.'}</p>
    </>
  );
}

function Apple({ heated }: { heated: boolean }) {
  return <span className="irx-apple" data-heated={heated} aria-label={heated ? 'heated apple' : 'apple'}><i></i>APPLE{heated ? ' · HOT' : ''}</span>;
}

function ALFWorldExplainer({ locale, step }: { locale: Locale; step: number }) {
  const zh = locale === 'zh';
  const states = [
    { action: '—', apple: 'counter', open: false, heated: false, result: zh ? '任务载入。' : 'Task loaded.' },
    { action: 'goto kitchen', apple: 'counter', open: false, heated: false, result: zh ? '进入厨房。' : 'Entered the kitchen.' },
    { action: 'pick apple', apple: 'inventory', open: false, heated: false, result: zh ? 'Apple 进入 inventory。' : 'Apple moves into inventory.' },
    { action: 'heat apple', apple: 'inventory', open: false, heated: false, result: 'PRECONDITION FAILED: apple is not in microwave' },
    { action: 'open microwave', apple: 'inventory', open: true, heated: false, result: zh ? 'Microwave 打开。' : 'Microwave opens.' },
    { action: 'put apple in microwave', apple: 'microwave', open: true, heated: false, result: zh ? 'Apple 从 inventory 移入 microwave。' : 'Apple moves from inventory into the microwave.' },
    { action: 'heat apple', apple: 'microwave', open: true, heated: true, result: zh ? 'Apple 状态变为 heated。' : 'Apple state becomes heated.' },
    { action: 'pick apple from microwave', apple: 'inventory', open: true, heated: true, result: zh ? '加热后的 apple 回到 inventory。' : 'The heated apple returns to inventory.' },
    { action: 'put apple on counter', apple: 'counter', open: true, heated: true, result: zh ? '目标状态满足：heated apple 位于 counter。' : 'Goal state satisfied: the heated apple is on the counter.' },
  ];
  const current = states[step];
  return (
    <div className="irx-alf-layout">
      <section className="irx-house" aria-label={zh ? 'ALFWorld 厨房世界状态' : 'ALFWorld kitchen world state'}>
        <header><span>KITCHEN · WORLD STATE</span><strong>{zh ? '任务：加热 apple，并把它放回 counter' : 'Task: heat the apple and place it on the counter'}</strong></header>
        <div className="irx-room-grid">
          <div className="irx-place counter"><small>COUNTER</small>{current.apple === 'counter' ? <Apple heated={current.heated} /> : <span className="irx-empty">empty</span>}</div>
          <div className="irx-place microwave" data-open={current.open}><small>MICROWAVE · {current.open ? 'OPEN' : 'CLOSED'}</small>{current.apple === 'microwave' ? <Apple heated={current.heated} /> : <span className="irx-empty">empty</span>}</div>
          <div className="irx-place fridge"><small>FRIDGE</small><span className="irx-empty">closed</span></div>
        </div>
        <div className="irx-inventory"><small>AGENT INVENTORY</small>{current.apple === 'inventory' ? <Apple heated={current.heated} /> : <span className="irx-empty">empty</span>}</div>
        <svg className="irx-house-wires" viewBox="0 0 900 360" role="img" aria-label={zh ? '物体可在环境位置与 Agent inventory 之间移动' : 'Objects can move between environment locations and agent inventory'}>
          <title>{zh ? 'ALFWorld 物体移动路径' : 'ALFWorld object movement paths'}</title>
          <defs><marker id="irx-alf-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-state)" /></marker></defs>
          <path d="M155 155 C250 245 330 265 430 275" /><path d="M445 275 C535 265 605 245 690 155" />
        </svg>
      </section>
      <aside className="irx-action-console" data-failed={step === 3} data-success={step === 8}>
        <span>STEP {step + 1} / 9</span><strong>{current.action}</strong><p>{current.result}</p>
        {step === 3 && <div className="irx-failure"><b>PRECONDITION FAILED</b><span>{zh ? '动作不是“文字上合理”就能执行；世界状态必须满足前置条件。' : 'An action is not executable just because it sounds plausible; world-state preconditions must hold.'}</span></div>}
        {step === 8 && <div className="irx-success"><b>GOAL SATISFIED</b><span>{zh ? '长期计划成功来自连续状态转换，而不是单次问答。' : 'Long-horizon success comes from a sequence of state transitions, not one answer.'}</span></div>}
        <div className="irx-action-set"><small>AVAILABLE ACTION FAMILY</small><code>goto · pick · open · put · heat · cool · clean · examine</code></div>
      </aside>
    </div>
  );
}

function SeedExplainer({ locale, step }: { locale: Locale; step: number }) {
  const zh = locale === 'zh';
  const sameAction = 'click["Black"]';
  return (
    <>
      <div className="irx-seed-scene">
        <Node role="CURRENT POLICY" title="policy θt" detail={zh ? '同一 checkpoint 在这一轮既行动，也提供 analyzer 能力' : 'The same checkpoint acts and supplies analyzer capability in this iteration'} tone="state" active={step === 0} complete={step > 0} className="seed-policy" />
        <Node role="ON-POLICY" title={zh ? '真实环境 rollout' : 'real environment rollout'} detail="observation · sampled actions · outcome" tone="env" active={step === 0} complete={step > 0} className="seed-rollout" />
        <Node role="SEALED EPISODE" title={zh ? '完整 trajectory' : 'completed trajectory'} detail={zh ? 'sampled action 已经发生；后面不会重新采样一条“正确轨迹”' : 'sampled actions already happened; later stages do not resample a “correct trajectory”'} tone="experience" active={step === 1} complete={step > 1} className="seed-trajectory" />
        <Node role="SAME CHECKPOINT · HINDSIGHT" title="hindsight skill" detail={zh ? '看完同一个 episode 后提取“早知道什么会更好”' : 'after the same episode, extract what hindsight would have helped'} tone="experience" active={step === 2} complete={step > 2} className="seed-hindsight" />
        <Node role="CONTEXT A" title="plain context" detail={`${sameAction} · P_plain`} tone="env" active={step === 3} complete={step > 3} className="seed-plain" />
        <Node role="CONTEXT B" title="skill-augmented context" detail={`${sameAction} · P_skill`} tone="experience" active={step === 3} complete={step > 3} className="seed-skill" />
        <Node role="DENSE SIGNAL" title="OPD" detail={zh ? '同一 action 在两个 context 下的概率变化' : 'probability shift of the same action under two contexts'} tone="signal" active={step === 4} complete={step > 4} className="seed-opd" />
        <Node role="OUTCOME RL" title="GRPO" detail={zh ? '来自 environment reward / relative outcome' : 'from environment reward / relative outcome'} tone="signal" active={step === 4} complete={step > 4} className="seed-grpo" />
        <Node role="OPTIMIZER" title="GRPO + OPD" detail={zh ? '两个学习分支合并更新 policy' : 'the two learning branches merge to update the policy'} tone="signal" active={step === 4} complete={step > 4} className="seed-joint" />
        <Node role="NEXT POLICY" title="policy θt+1" detail={zh ? '下一轮 rollout 直接加载更新后的 checkpoint' : 'the next rollout directly loads the updated checkpoint'} tone="persist" active={step === 5} complete={false} className="seed-next" />
        <svg className="irx-seed-wires" viewBox="0 0 1100 650" role="img" aria-label={zh ? 'SEED 的 on-policy trajectory 分到 hindsight 与 reward 两支，OPD 与 GRPO 合并更新下一版 policy' : 'SEED splits on-policy trajectory into hindsight and reward branches; OPD and GRPO merge to update the next policy'}>
          <title>{zh ? 'SEED 双分支训练与反馈回环' : 'SEED dual-branch training and feedback loop'}</title>
          <defs><marker id="irx-seed-blue" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-env)" /></marker><marker id="irx-seed-amber" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-experience)" /></marker><marker id="irx-seed-red" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-signal)" /></marker><marker id="irx-seed-violet" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-state)" /></marker><marker id="irx-seed-green" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-persist)" /></marker></defs>
          <path className="state" d="M195 85 H360" /><path className="env" d="M505 85 H650" /><path className="experience" d="M740 135 C760 190 865 195 880 240" /><path className="env" d="M710 135 C640 190 450 195 420 240" /><path className="control" d="M220 125 C310 210 800 175 845 235" />
          <path className="experience" d="M860 320 C820 360 730 365 700 395" /><path className="env" d="M430 320 C470 360 555 365 590 395" />
          <path className="signal" d="M590 470 C570 500 530 520 505 545" /><path className="signal" d="M700 470 C730 500 775 520 800 545" /><path className="reward" d="M690 135 C605 290 290 410 250 545" />
          <path className="signal" d="M340 575 H465" /><path className="signal" d="M800 575 H700" /><path className="persist" d="M650 605 H860" />
          <path className="loop" d="M960 605 C1040 605 1035 40 165 35 C105 35 95 55 95 75" />
        </svg>
      </div>
      <div className="irx-probability-panel" data-active={step === 3}>
        <div className="irx-same-action"><span>{zh ? '同一批 sampled action token' : 'the same sampled action token'}</span><code>{sameAction}</code></div>
        <div className="irx-prob-row"><label>P_plain(action)</label><div><i style={{ width: '28%' }}></i></div><b>0.28</b></div>
        <div className="irx-prob-row skill"><label>P_skill(action)</label><div><i style={{ width: '62%' }}></i></div><b>0.62</b></div>
        <small>{zh ? '教学示例概率，仅用于显示“同一动作、两个 context、概率变化”的机制；不是论文或本项目实测值。' : 'Illustrative probabilities only, used to show “same action, two contexts, probability shift”; these are not measured paper/project values.'}</small>
      </div>
    </>
  );
}

function OpenEvoExplainer({ locale, step, carrier, setCarrier, onStep }: { locale: Locale; step: number; carrier: Carrier; setCarrier: (carrier: Carrier) => void; onStep: (step: number) => void }) {
  const zh = locale === 'zh';
  const carriers: Array<{ id: Carrier; title: string; detail: string }> = [
    { id: 'memory', title: 'MEMORY', detail: zh ? '经验留在模型外，后续检索 / 注入' : 'experience stays outside the model for later retrieval/injection' },
    { id: 'artifact', title: 'AGENT ARTIFACT', detail: zh ? '工具、技能、策略文件或 system state' : 'tools, skills, policy files, or system state' },
    { id: 'adapter', title: 'PARAMETRIC ADAPTER', detail: zh ? '参数化 carrier；当前 WebShop 实例使用 SD-LoRA 路径' : 'parametric carrier; the current WebShop instance uses the SD-LoRA path' },
  ];
  return (
    <>
      <div className="irx-openevo-scene">
        <Node role="PROJECT HEAD" title={zh ? '当前 agent revision' : 'current agent revision'} detail="Qwen2.5-3B-Instruct + current carrier state" tone="state" active={step === 0} complete={step > 0} className="evo-head" />
        <Node role="TASK N · ENVIRONMENT" title="WebShop / ALFWorld" detail="observation · action · outcome" tone="env" active={step === 0} complete={step > 0} className="evo-task" />
        <Node role="TASK COMPLETION BOUNDARY" title="SEALED EVIDENCE" detail={zh ? 'trajectory + outcome + metadata 先冻结，再允许演化' : 'trajectory + outcome + metadata are frozen before evolution'} tone="experience" active={step === 1} complete={step > 1} className="evo-evidence" />
        <Node role="EVOLUTION METHOD" title={zh ? '反思 / 提炼 / 参数演变' : 'reflection / extraction / parametric evolution'} detail={zh ? '方法读取已封存 evidence，不改写刚完成的 Task N' : 'the method reads sealed evidence and does not rewrite the completed Task N'} tone="experience" active={step === 2} complete={step > 2} className="evo-method" />
        <div className="irx-carriers" data-active={step === 3}>
          {carriers.map((item) => <button key={item.id} type="button" className={`irx-carrier irx-tone-${item.id === 'adapter' ? 'state' : 'experience'}`} data-selected={carrier === item.id} onClick={() => { setCarrier(item.id); onStep(Math.max(step, 3)); }} aria-pressed={carrier === item.id}><span>CARRIER</span><strong>{item.title}</strong><small>{item.detail}</small>{item.id === 'adapter' && <em>{zh ? '当前 WebShop 实例' : 'current WebShop instance'}</em>}</button>)}
        </div>
        <section className="irx-validation" data-active={step === 4}>
          <span>VALIDATION GATE</span><strong>{zh ? '候选状态必须满足的接受条件' : 'acceptance conditions for a candidate state'}</strong>
          <div>{['identity', 'digest', 'fresh reload', 'behavior probe', 'scientific contract'].map(item => <b key={item}>{item}<small>{step >= 4 ? 'REQUIRED' : '—'}</small></b>)}</div>
        </section>
        <Node role="SUCCESSOR REVISION" title={zh ? '验证通过的下一版 agent 状态' : 'validated next agent state'} detail={zh ? `当前查看 carrier: ${carrier}` : `inspecting carrier: ${carrier}`} tone="persist" active={step === 5} complete={step > 5} className="evo-successor" />
        <Node role="TASK N+1" title={zh ? '下一任务加载 successor revision' : 'next task loads the successor revision'} detail={zh ? '新 evidence 再进入下一次 task-completion boundary' : 'new evidence will later enter the next task-completion boundary'} tone="env" active={step === 6} className="evo-next" />
        <svg className="irx-evo-wires" viewBox="0 0 1100 720" role="img" aria-label={zh ? 'OpenEvo 在任务结束后封存 evidence，分叉为多种 carrier，经 validation 合并为 successor revision，再进入下一任务' : 'OpenEvo seals evidence after task completion, fans out into carriers, merges validated state into a successor revision, and enters the next task'}>
          <title>{zh ? 'OpenEvo carrier 分叉、验证与下一任务回环' : 'OpenEvo carrier fan-out, validation, and next-task loop'}</title>
          <defs><marker id="irx-evo-blue" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-env)" /></marker><marker id="irx-evo-amber" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-experience)" /></marker><marker id="irx-evo-green" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-persist)" /></marker><marker id="irx-evo-violet" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-state)" /></marker></defs>
          <path className="state" d="M190 100 H390" /><path className="env" d="M515 100 H710" /><path className="boundary" d="M785 145 C785 205 550 200 550 250" /><path className="experience" d="M550 335 V385" />
          <path className="branch" d="M550 390 C420 430 305 430 235 465" /><path className="branch" d="M550 390 V465" /><path className="branch" d="M550 390 C680 430 800 430 865 465" />
          <path className="persist" d="M235 545 C300 580 390 590 455 610" /><path className="persist" d="M550 545 V605" /><path className="persist" d="M865 545 C800 580 710 590 645 610" /><path className="persist" d="M660 650 H820" /><path className="persist" d="M950 650 H1030" /><path className="loop" d="M1030 680 C1030 715 105 715 100 145" />
        </svg>
      </div>
      <p className="irx-boundary-note"><b>{zh ? '核心边界' : 'Core boundary'}:</b> {zh ? 'OpenEvo 规定“任务结束后如何把 evidence 变成下一任务可继承的 validated state”；它不等于 SD-LoRA，也不等于 external memory。' : 'OpenEvo defines how post-task evidence becomes validated state inherited by a later task; it is neither synonymous with SD-LoRA nor with external memory.'}</p>
    </>
  );
}

function CompareExplainer({ locale, step }: { locale: Locale; step: number }) {
  const zh = locale === 'zh';
  const dimensions = [
    { seed: zh ? '共同起点：真实 task、observations、sampled actions、outcome。' : 'Shared start: real task, observations, sampled actions, and outcome.', evo: zh ? '共同起点：此时还没有决定经验如何被编码。' : 'Shared start: experience has not yet been encoded.' },
    { seed: zh ? 'hindsight → same-action dual-context re-score → OPD + GRPO → optimizer。' : 'hindsight → same-action dual-context re-score → OPD + GRPO → optimizer.', evo: zh ? 'task completion → sealed evidence → evolution method。' : 'task completion → sealed evidence → evolution method.' },
    { seed: zh ? '主要持久变化是 policy θt+1 的参数。' : 'The primary persistent change is policy θt+1 parameters.', evo: zh ? 'carrier 可以是 memory、agent artifact，也可以是 parametric adapter。' : 'The carrier may be memory, an agent artifact, or a parametric adapter.' },
    { seed: zh ? 'optimizer 更新后，下一轮直接加载新 checkpoint。' : 'After optimizer update, the next round loads the new checkpoint.', evo: zh ? 'carrier 先过 validation gate，再组成 successor revision，下一任务才加载。' : 'Carriers pass a validation gate, form a successor revision, and activate on the next task.' },
    { seed: zh ? '训练期用 hindsight/OPD；推理期不需要一直携带 hindsight prompt。' : 'Hindsight/OPD are training-time machinery; inference need not carry the hindsight prompt.', evo: zh ? '下一任务需要什么取决于 carrier；当前 WebShop 路径包含 parametric adapter。' : 'What the next task needs depends on the carrier; the current WebShop path includes a parametric adapter.' },
  ];
  const current = dimensions[step];
  return (
    <div className="irx-compare-scene">
      <Node role="SHARED EXPERIENCE" title="task + observations + sampled actions + outcome" detail={zh ? '从同一类真实交互证据开始' : 'both begin from real interaction evidence'} tone="env" active={step === 0} complete={step > 0} className="cmp-shared" />
      <div className="irx-method-column seed" data-active={step > 0}>
        <header><span>SEED</span><strong>{zh ? '经验主要如何进入 policy 参数' : 'how experience is primarily internalized into policy parameters'}</strong></header>
        <Node role="UPDATE" title="hindsight → OPD + GRPO" tone="signal" active={step === 1} />
        <Node role="PERSISTS" title="policy θt+1" tone="persist" active={step === 2 || step === 4} />
        <Node role="ACTIVATES" title={zh ? '下一 RL iteration' : 'next RL iteration'} tone="state" active={step === 3} />
      </div>
      <div className="irx-method-column evo" data-active={step > 0}>
        <header><span>OpenEvo</span><strong>{zh ? '经验如何成为可继承 successor state' : 'how experience becomes inheritable successor state'}</strong></header>
        <Node role="UPDATE" title="sealed evidence → evolution method" tone="experience" active={step === 1} />
        <Node role="PERSISTS" title="memory / artifact / adapter" tone="state" active={step === 2 || step === 4} />
        <Node role="ACTIVATES" title="validation → successor revision" tone="persist" active={step === 3} />
      </div>
      <svg className="irx-compare-wires" viewBox="0 0 1000 520" role="img" aria-label={zh ? '同一 shared experience 分叉到 SEED 和 OpenEvo 的不同更新与持久化路径' : 'One shared experience forks into different SEED and OpenEvo update and persistence paths'}>
        <title>{zh ? 'SEED 与 OpenEvo 从共享经验分叉' : 'SEED and OpenEvo fork from shared experience'}</title>
        <defs><marker id="irx-cmp-red" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-signal)" /></marker><marker id="irx-cmp-violet" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-state)" /></marker></defs>
        <path className="seed" d="M500 90 C420 125 310 135 260 180" /><path className="evo" d="M500 90 C580 125 690 135 740 180" />
      </svg>
      <div className="irx-compare-question"><small>{zh ? '核心问题' : 'Core question'}</small><strong>{zh ? '这次经验最终存到哪里？' : 'Where does this experience ultimately live?'}</strong></div>
      <div className="irx-linked-inspector"><article><b>SEED</b><p>{current.seed}</p></article><article><b>OpenEvo</b><p>{current.evo}</p></article></div>
    </div>
  );
}

function ServerExplainer({ locale, step, onStep }: { locale: Locale; step: number; onStep: (step: number) => void }) {
  const zh = locale === 'zh';
  const details = [
    { title: 'Host Docker daemon', body: zh ? '宿主服务负责真正创建、停止和管理容器。它与 dev-wangr 不是父子容器关系。' : 'The host service actually creates, stops, and manages containers. It is not a parent container of dev-wangr.' },
    { title: 'dev-wangr / wangr-dev', body: zh ? '这里的 shell 是 root UID 0；root 身份描述控制容器内部，不等于已验证的 physical-host root。' : 'The shell here is root UID 0; that identity is inside the control container and is not verified physical-host root.' },
    { title: '/var/run/docker.sock', body: zh ? 'Docker socket 把 Docker CLI 请求送到 host daemon，因此提供很强的技术控制能力；能力不等于获准操作所有 sibling resources。' : 'The Docker socket sends CLI requests to the host daemon and provides strong technical control capability; capability is not authorization over all sibling resources.' },
    { title: 'isolated experiment container', body: zh ? '科研任务以 non-root UID/GID 1001:1001、explicit GPU、no Docker socket 运行，把控制面与科学执行面分开。' : 'Scientific work runs non-root as UID/GID 1001:1001 with explicit GPU assignment and no Docker socket, separating control from execution.' },
    { title: '/data/home/wangr/workspace', body: zh ? '容器是可替换执行壳；代码身份、数据、adapter、日志、Run Manifest 等长期状态写到持久 workspace。' : 'Containers are replaceable execution shells; durable state such as code identity, data, adapters, logs, and Run Manifests lives in the persistent workspace.' },
    { title: zh ? '其他用户 sibling containers' : 'other users’ sibling containers', body: zh ? '同一个 daemon 技术上可见 dev-guozy / dev-huzh 等容器，不代表项目授权进入、停止或清理它们。' : 'The same daemon can technically see containers such as dev-guozy / dev-huzh; that does not authorize entering, stopping, or cleaning them.' },
  ];
  const nodeButton = (index: number, role: string, title: string, detail: string, className: string, tone: string) => (
    <button type="button" className={`irx-server-node ${className} irx-tone-${tone}`} data-active={step === index} aria-pressed={step === index} onClick={() => onStep(index)}><span>{role}</span><strong>{title}</strong><small>{detail}</small></button>
  );
  return (
    <div className="irx-server-layout">
      <figure className="irx-host-boundary">
        <figcaption><span>{zh ? '物理 / 云宿主边界' : 'Physical / cloud host boundary'}</span><strong>OpenEvo Server Host</strong></figcaption>
        {nodeButton(0, 'HOST SERVICE', 'Docker daemon', 'Engine 29.1.3', 'srv-daemon', 'neutral')}
        {nodeButton(1, 'MY CONTROL PLANE', 'dev-wangr / wangr-dev', 'root UID 0 · Docker CLI', 'srv-dev', 'state')}
        {nodeButton(2, 'CONTROL CHANNEL', '/var/run/docker.sock', 'Docker API → host daemon', 'srv-socket', 'state')}
        {nodeButton(3, 'SCIENCE RUNTIME', 'isolated experiment container', 'UID/GID 1001:1001 · explicit GPU · no Docker socket', 'srv-exp', 'env')}
        {nodeButton(4, 'PERSISTENT STATE', '/data/home/wangr/workspace', 'repos · data · models · runs · manifests', 'srv-workspace', 'persist')}
        {nodeButton(5, 'SIBLING USERS', 'dev-guozy · dev-huzh · …', zh ? '可见 ≠ 获授权操作' : 'visible ≠ authorized to operate', 'srv-siblings', 'neutral')}
        <svg className="irx-server-wires" viewBox="0 0 1000 560" role="img" aria-label={zh ? 'dev-wangr 通过 Docker socket 控制 host daemon；daemon 创建实验和其他 sibling containers；实验容器与控制容器都可挂载持久 workspace' : 'dev-wangr controls the host daemon through the Docker socket; the daemon creates experiment and other sibling containers; control and experiment containers can mount persistent workspace'}>
          <title>{zh ? '服务器控制、sibling container 与持久状态关系' : 'Server control, sibling-container, and persistent-state relationships'}</title>
          <defs><marker id="irx-server-violet" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-state)" /></marker><marker id="irx-server-blue" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-env)" /></marker><marker id="irx-server-neutral" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-neutral)" /></marker><marker id="irx-server-green" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--irx-persist)" /></marker></defs>
          <path className="control" d="M270 280 C300 190 390 160 470 150" /><path className="control" d="M305 310 C360 300 420 260 465 205" /><path className="create" d="M530 185 V300" /><path className="sibling" d="M570 170 C735 190 840 230 865 300" /><path className="persist" d="M270 395 C320 455 370 475 440 490" /><path className="persist" d="M555 395 C535 445 510 470 485 490" />
        </svg>
      </figure>
      <aside className="irx-authority-inspector"><span>AUTHORITY INSPECTOR</span><strong>{details[step].title}</strong><p>{details[step].body}</p><div><b>{zh ? '必须同时记住' : 'Keep both distinctions'}:</b><code>container root ≠ physical-host ownership</code><code>technical capability ≠ authorization scope</code></div></aside>
    </div>
  );
}

export default function InteractiveResearchExplainer({ locale, kind, compact = false }: Props) {
  const zh = locale === 'zh';
  const configs: Record<Kind, { title: string; eyebrow: string; lede: string; steps: StepMeta[] }> = {
    webshop: {
      eyebrow: 'WEB SHOP · INTERACTIVE ENVIRONMENT',
      title: zh ? 'WebShop 交互环境' : 'WebShop interactive environment',
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
      title: zh ? 'ALFWorld 家务世界状态' : 'ALFWorld household world state',
      lede: zh ? '物体位置、容器开关和 heated 状态都会约束下一步动作；一次失败动作不会“被语言合理性自动纠正”。' : 'Object locations, receptacle state, and heated state constrain the next action; a plausible sentence does not bypass world preconditions.',
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
      title: zh ? 'SEED 双上下文重打分' : 'SEED dual-context re-scoring',
      lede: zh ? '重点不是再生成一条“知道 hindsight 后的正确轨迹”，而是对同一批已经 sampled 的 action token，在 plain 与 skill-augmented context 下重新计算概率。' : 'The key is not to generate a new “correct trajectory with hindsight,” but to re-score the same already-sampled action tokens under plain and skill-augmented contexts.',
      steps: [
        { label: 'rollout', narration: zh ? '当前 policy 做真实 on-policy interaction。' : 'The current policy performs real on-policy interaction.' },
        { label: 'trajectory', narration: zh ? '完整 episode 被保留下来。' : 'The completed episode is preserved.' },
        { label: 'hindsight', narration: zh ? '同一 checkpoint 回看完整 episode 生成 hindsight skill。' : 'The same checkpoint reviews the completed episode and produces a hindsight skill.' },
        { label: zh ? '重打分' : 're-score', narration: zh ? '同一 sampled action 同时进入 plain / skill 两个 context。' : 'The same sampled action enters plain and skill contexts.' },
        { label: 'OPD + GRPO', narration: zh ? '概率差形成 OPD；环境 outcome 形成 GRPO，两支合并。' : 'Probability shift forms OPD; environment outcome forms GRPO; the branches merge.' },
        { label: 'θt+1', narration: zh ? 'Optimizer 更新 policy；下一轮使用新 checkpoint。' : 'The optimizer updates the policy; the next round uses the new checkpoint.' },
      ],
    },
    openevo: {
      eyebrow: 'OPENEVO · CROSS-TASK EVOLUTION',
      title: zh ? 'OpenEvo 跨任务演化边界' : 'OpenEvo cross-task evolution boundary',
      lede: zh ? '先完成 Task N 并封存 evidence，再运行 evolution method；carrier 通过 validation 后组成 successor revision，并从 Task N+1 开始生效。' : 'Finish Task N and seal evidence first, then run the evolution method; validated carriers form a successor revision that activates from Task N+1.',
      steps: [
        { label: 'Task N', narration: zh ? '当前 Project Head 在环境里完成任务。' : 'The current Project Head completes the task in the environment.' },
        { label: zh ? '封存' : 'Seal', narration: zh ? '任务完成边界把 trajectory/outcome/metadata 封存。' : 'The task-completion boundary seals trajectory/outcome/metadata.' },
        { label: 'Evolve', narration: zh ? 'Evolution method 读取已封存 evidence。' : 'The evolution method reads sealed evidence.' },
        { label: 'Carrier', narration: zh ? '经验可以写入 memory、agent artifact 或 parametric adapter。' : 'Experience may be written into memory, agent artifacts, or a parametric adapter.' },
        { label: 'Validate', narration: zh ? '身份、digest、reload、behavior、scientific contract 都是 gate。' : 'Identity, digest, reload, behavior, and scientific contract are gate conditions.' },
        { label: 'Revision', narration: zh ? '接受的状态组成 successor revision。' : 'Accepted state forms the successor revision.' },
        { label: 'Task N+1', narration: zh ? '后续任务才加载新 revision。' : 'Only the later task loads the new revision.' },
      ],
    },
    compare: {
      eyebrow: 'SEED × OPENEVO · LINKED COMPARISON',
      title: zh ? 'SEED 与 OpenEvo 更新机制' : 'SEED and OpenEvo update mechanisms',
      lede: zh ? '从共同的任务经验开始，逐项联动比较 update mechanism、task boundary、carrier、validation 与最终持久状态。' : 'Begin from shared task experience and compare update mechanism, task boundary, carrier, validation, and persistent state with linked highlighting.',
      steps: [
        { label: zh ? '共同经验' : 'Shared', narration: zh ? '两种机制都从真实任务证据出发。' : 'Both mechanisms begin from real task evidence.' },
        { label: zh ? '更新机制' : 'Update', narration: zh ? 'SEED 是 hindsight re-score + OPD/GRPO；OpenEvo 是 post-task evolution method。' : 'SEED uses hindsight re-score + OPD/GRPO; OpenEvo uses a post-task evolution method.' },
        { label: zh ? '持久载体' : 'Carrier', narration: zh ? 'SEED 主要更新 policy 参数；OpenEvo carrier 既可外部也可参数化。' : 'SEED primarily updates policy parameters; OpenEvo carriers may be external or parametric.' },
        { label: zh ? '生效边界' : 'Activation', narration: zh ? '两者让改变进入下一轮的条件不同。' : 'The conditions for activating change in the next round differ.' },
        { label: zh ? '推理状态' : 'Inference', narration: zh ? '比较最终下一轮真正需要携带什么。' : 'Compare what the next round actually needs to carry.' },
      ],
    },
    server: {
      eyebrow: 'SERVER · AUTHORITY INSPECTOR',
      title: zh ? 'OpenEvo 服务器权限关系' : 'OpenEvo server authority relationships',
      lede: zh ? '用同一张 host 边界图查看 Docker daemon、dev-wangr、Docker socket、实验容器、workspace 与其他用户 sibling containers 的权限关系。' : 'Inspect the host daemon, dev-wangr, Docker socket, experiment runtime, workspace, and other users’ sibling containers inside one authority map.',
      steps: [
        { label: 'daemon', narration: zh ? '真正的容器生命周期由 host Docker daemon 管理。' : 'Container lifecycle is managed by the host Docker daemon.' },
        { label: 'dev-wangr', narration: zh ? 'root UID 0 位于控制容器内。' : 'root UID 0 is inside the control container.' },
        { label: 'socket', narration: zh ? 'Socket 提供 daemon 控制通道。' : 'The socket provides a control channel to the daemon.' },
        { label: zh ? '实验容器' : 'runtime', narration: zh ? '科学执行保持 non-root、explicit GPU、no socket。' : 'Scientific execution remains non-root with explicit GPU assignment and no socket.' },
        { label: 'workspace', narration: zh ? '长期状态写入 persistent workspace。' : 'Durable state is written to the persistent workspace.' },
        { label: zh ? '授权边界' : 'authorization', narration: zh ? '技术上可见 sibling container 不等于有权操作。' : 'Technical visibility of sibling containers is not authorization to operate them.' },
      ],
    },
  };

  const config = configs[kind];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [carrier, setCarrier] = useState<Carrier>('adapter');
  const maxStep = config.steps.length - 1;
  const go = (next: number) => { setPlaying(false); setStep(clamp(next, 0, maxStep)); };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { setReducedMotion(media.matches); if (media.matches) setPlaying(false); };
    sync();
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= maxStep) { setPlaying(false); return current; }
        return current + 1;
      });
    }, 1800);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion, maxStep]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(step + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(step - 1); }
    if (event.key === 'Home') { event.preventDefault(); go(0); }
    if (event.key === 'End') { event.preventDefault(); go(maxStep); }
  };

  return (
    <section className={`irx irx-${kind}`} data-interactive-research-explainer={kind} data-reduced-motion={reducedMotion} data-compact={compact} tabIndex={0} onKeyDown={onKeyDown} aria-label={config.title}>
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
        <summary>{zh ? 'Level 3 · 技术边界与复现提示' : 'Level 3 · technical boundaries and reproduction notes'}</summary>
        {kind === 'webshop' && <p>{zh ? '原始 WebShop 约 1.18M products、12,087 crowd-sourced instructions。当前 OpenEvo 实验使用冻结 1,000-product environment。SEED wrapper 的 goal 0–499 为 evaluation，500–end 为 training。' : 'Original WebShop has about 1.18M products and 12,087 crowd-sourced instructions. Current OpenEvo uses a frozen 1,000-product environment. In the SEED wrapper, goals 0–499 are evaluation and 500–end are training.'}</p>}
        {kind === 'alfworld' && <p>{zh ? 'ALFWorld 环境 split 是 train / valid_seen / valid_unseen；valid_seen 与 valid_unseen 的核心差别是环境泛化难度，不应被网页自定义的 train/dev/test 命名覆盖。六类主要 task family 应按原 benchmark identity 保留。' : 'ALFWorld environment splits are train / valid_seen / valid_unseen. Seen versus unseen reflects environment generalization difficulty and should not be overwritten by custom train/dev/test naming. Preserve the six benchmark task families.'}</p>}
        {kind === 'seed' && <p>{zh ? '训练期的 hindsight analyzer / skill / OPD 用于产生学习信号；推理期主要保留更新后的 policy。双概率条是机制示例，不代表任何真实 run 的 token probability。' : 'The hindsight analyzer, skill, and OPD are training-time machinery; inference primarily retains the updated policy. The two probability bars are mechanism illustrations, not token probabilities from a real run.'}</p>}
        {kind === 'openevo' && <p>{zh ? 'OpenEvo Core 规定跨任务演化流程；具体 carrier 由 evolution method 产生并经验证。当前 WebShop 实例的 parametric path 使用 SD-LoRA，但这只是一个实现路径。' : 'OpenEvo Core defines the cross-task evolution flow; evolution methods produce concrete carriers that must be validated. The current WebShop instance uses SD-LoRA on its parametric path, but that is one implementation path.'}</p>}
        {kind === 'compare' && <p>{zh ? '不要把两者简化成“SEED=参数，OpenEvo=外部 memory”。当前 OpenEvo WebShop 路径本身就包含 parametric adapter。更稳定的比较轴是 update mechanism、task boundary、carrier、validation 与 activation time。' : 'Do not reduce the comparison to “SEED=parameters, OpenEvo=external memory.” The current OpenEvo WebShop path itself includes a parametric adapter. More stable axes are update mechanism, task boundary, carrier, validation, and activation time.'}</p>}
        {kind === 'server' && <p>{zh ? '服务器资产可见 GPU 数、Docker 管理能力、实验分配和项目授权是四类不同事实。科研运行容器应继续保持 non-root、显式 GPU 绑定与 no Docker socket。' : 'Visible GPU inventory, Docker administration capability, experiment allocation, and project authorization are four different facts. Scientific runtimes should remain non-root with explicit GPU binding and no Docker socket.'}</p>}
      </details>
    </section>
  );
}
