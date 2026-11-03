import { useLayoutEffect, useRef } from 'react';
import { ChipSequence, ConnectorLayer, Gauge, type EdgeSpec, type Locale } from './ResearchExplainerPrimitives';

export function WebShopExplainer({ locale, step }: { locale: Locale; step: number }) {
  const zh = locale === 'zh';
  const states = [
    {
      observation: zh ? '任务目标：买一双防水、透气、9 码、价格不超过 $60 的跑鞋。' : 'Goal: buy waterproof, breathable, size-9 running shoes under $60.',
      actions: zh ? '环境已就绪；可从搜索开始。' : 'Environment ready; search can begin.',
      selected: '—',
      selectedTokens: ['—'],
      transition: zh ? '任务载入，网页处于首页。' : 'Task loaded; storefront is at the home page.',
      reward: zh ? '本步 reward = 0 · 尚无终局评分' : 'Step reward = 0 · not terminal',
    },
    {
      observation: zh ? '首页提供搜索框。Agent 只能基于当前 observation 选择动作。' : 'The home page exposes a search box. The agent chooses from the current observation.',
      actions: 'search[query]',
      selected: 'search["waterproof breathable running shoes"]',
      selectedTokens: ['search', '[', '"waterproof breathable running shoes"', ']'],
      transition: zh ? '环境返回搜索结果页。' : 'The environment returns a results page.',
      reward: zh ? '本步 reward = 0 · 尚无终局评分' : 'Step reward = 0 · not terminal',
    },
    {
      observation: zh ? '搜索结果里出现 Trail Runner 跑鞋，$55。' : 'Search results include Trail Runner shoes at $55.',
      actions: 'click[product] · search[new query]',
      selected: 'click["Trail Runner"]',
      selectedTokens: ['click', '[', '"Trail Runner"', ']'],
      transition: zh ? '网页切换到商品详情页。' : 'The page transitions to product detail.',
      reward: zh ? '本步 reward = 0 · 尚无终局评分' : 'Step reward = 0 · not terminal',
    },
    {
      observation: zh ? '商品页提供颜色 Black / Blue，尺码 8 / 9。' : 'The product offers colors Black / Blue and sizes 8 / 9.',
      actions: 'click[color] · click[size] · click[buy]',
      selected: 'click["Black"] + click["9"]',
      selectedTokens: ['click["Black"]', '+', 'click["M"]'],
      transition: zh ? '环境保存当前商品选项。' : 'The environment stores the selected options.',
      reward: zh ? '本步 reward = 0 · 尚无终局评分' : 'Step reward = 0 · not terminal',
    },
    {
      observation: zh ? '购买的跑鞋符合防水、透气、9 码和价格条件。' : 'The shoes match waterproof, breathable, size and price requirements.',
      actions: 'click[buy]',
      selected: 'click["Buy Now"]',
      selectedTokens: ['click["Buy Now"]'],
      transition: zh ? '进入终局评测，环境检查任务约束。' : 'Terminal evaluation checks the task constraints.',
      reward: 'DEMO: task_score = 1.0 · won = true',
    },
  ];
  // step is always within the states array bounds; the array is the
  // single source of truth for the explainer timeline.
  const current = states[step]!;
  return (
    <>
      <div className="irx-webshop-stage" data-ui-audit="contrast layout">
        <section className="irx-browser" aria-label={zh ? '简化 WebShop 页面' : 'Simplified WebShop page'}>
          <div className="irx-browser-bar"><i></i><i></i><i></i><code>webshop.local</code></div>
          <div className="irx-shop-header">
            <strong>WebShop</strong>
            <label><span className="sr-only">Search</span><input readOnly value={step >= 1 ? 'waterproof breathable running shoes' : ''} placeholder={zh ? '搜索商品' : 'Search products'} /></label>
            <button type="button" tabIndex={-1}>Search</button>
          </div>
          {step === 0 && (
            <div className="irx-shop-welcome">
              <span>{zh ? "购物目标" : "GOAL"}</span><b>{zh ? '防水 · 透气 · 跑鞋 9 码 · ≤ $60' : 'Waterproof · Breathable · shoes size 9 · ≤ $60'}</b>
              <p>{zh ? 'WebShop 不是问答题。Agent 必须通过一连串页面状态变化完成任务。' : 'WebShop is not a question-answer task. The agent must complete a sequence of page-state transitions.'}</p>
            </div>
          )}
          {step >= 1 && step <= 2 && (
            <div className="irx-products" data-ui-audit="contrast layout">
              <article data-ui-audit-item data-selected={step === 2}><div className="irx-product-image">SHOES</div><strong>Trail Runner</strong><span>$55</span><small>Black · Blue · 8/9</small></article>
              <article data-ui-audit-item><div className="irx-product-image">SHOES</div><strong>Premium Runner</strong><span>$75</span><small>Size 9/10</small></article>
              <article data-ui-audit-item><div className="irx-product-image">SHOES</div><strong>Daily Runner</strong><span>$45</span><small>Size 8</small></article>
            </div>
          )}
          {step >= 3 && (
            <div className="irx-product-detail">
              <div className="irx-product-image irx-product-image-large">SHOES</div>
              <div><small>Trail Runner</small><h3>$55</h3><p>{zh ? '颜色' : 'Color'}</p><div className="irx-options"><span data-selected>Black</span><span>Blue</span></div><p>{zh ? '尺码' : 'Size'}</p><div className="irx-options"><span>8</span><span data-selected>9</span></div><button type="button" tabIndex={-1} data-ready={step === 4}>Buy Now</button></div>
            </div>
          )}
        </section>
        {step === 4 && (
          <div className="irx-score-strip" data-ui-audit="contrast layout">
            <Gauge
              label="task_score"
              value={1}
              display="1.0"
              tone="persist"
              demo={zh ? 'DEMO · 教学示意，非实测' : 'DEMO · illustrative, not measured'}
            />
          </div>
        )}
        <aside className="irx-event-tape" aria-label={zh ? 'Agent 与环境事件' : 'Agent and environment events'}>
          <dl>
            <div data-active><dt>OBSERVATION</dt><dd>{current.observation}</dd></div>
            <div><dt>AVAILABLE ACTIONS</dt><dd><code>{current.actions}</code></dd></div>
            <div><dt>AGENT SELECTED</dt><dd><ChipSequence label={current.selected} tone="env" tokens={current.selectedTokens} /></dd></div>
            <div><dt>ENVIRONMENT TRANSITION</dt><dd>{current.transition}</dd></div>
            <div data-reward><dt>REWARD / SCORE</dt><dd><strong>{current.reward}</strong></dd></div>
          </dl>
        </aside>
      </div>
      <aside className="irx-boundary-note"><b>{zh ? '教学边界' : 'Teaching boundary'}</b><span>{zh ? '最后一步显示的 “DEMO: task_score = 1.0” 只是教学演示，不是测得的实验结果。此前每一步的 reward = 0 是尚未购买时的即时反馈，不能当作一次失败购买的最终 Task Score = 0。商品规模、任务划分和具体研究协议是独立实验条件，不能从这段交互示例推断。' : 'The final-step “DEMO: task_score = 1.0” is a teaching example, not a measured experiment result. Earlier reward = 0 values are nonterminal step feedback, not a final Task Score = 0 for a completed failed purchase. Product scale, task splits, and the specific research protocol are separate experimental conditions and cannot be inferred from this interaction example.'}</span></aside>
    </>
  );
}

function Lock({ open, label }: { open: boolean; label: string }) {
  return (
    <span className="irx-lock" data-open={open} role="img" aria-label={label}>
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path className="irx-lock-shackle" d={open ? 'M5 7V5a3 3 0 0 1 6-.4' : 'M5 7V5a3 3 0 0 1 6 0v2'} />
        <rect className="irx-lock-body" x="3.4" y="7" width="9.2" height="6.4" rx="1.4" />
      </svg>
    </span>
  );
}

export function ALFWorldExplainer({ locale, step }: { locale: Locale; step: number }) {
  const zh = locale === 'zh';
  const worldRef = useRef<HTMLDivElement>(null);
  const appleRef = useRef<HTMLSpanElement>(null);
  const states = [
    { action: '—', apple: 'counter', previous: null, open: false, heated: false, result: zh ? '任务载入。' : 'Task loaded.' },
    { action: 'goto kitchen', apple: 'counter', previous: null, open: false, heated: false, result: zh ? '进入厨房。' : 'Entered the kitchen.' },
    { action: 'pick apple', apple: 'inventory', previous: 'counter', open: false, heated: false, result: zh ? 'Apple 进入 inventory。' : 'Apple moves into inventory.' },
    { action: 'heat apple', apple: 'inventory', previous: null, open: false, heated: false, result: 'PRECONDITION FAILED: apple is not in microwave' },
    { action: 'open microwave', apple: 'inventory', previous: null, open: true, heated: false, result: zh ? 'Microwave 打开。' : 'Microwave opens.' },
    { action: 'put apple in microwave', apple: 'microwave', previous: 'inventory', open: true, heated: false, result: zh ? 'Apple 从 inventory 移入 microwave。' : 'Apple moves from inventory into the microwave.' },
    { action: 'heat apple', apple: 'microwave', previous: null, open: true, heated: true, result: zh ? 'Apple 状态变为 heated。' : 'Apple state becomes heated.' },
    { action: 'pick apple from microwave', apple: 'inventory', previous: 'microwave', open: true, heated: true, result: zh ? '加热后的 apple 回到 inventory。' : 'The heated apple returns to inventory.' },
    { action: 'put apple on counter', apple: 'counter', previous: 'inventory', open: true, heated: true, result: zh ? '目标状态满足：heated apple 位于 counter。' : 'Goal state satisfied: the heated apple is on the counter.' },
  ] as const;
  // step is always within the states array bounds; the array is the
  // single source of truth for the explainer timeline.
  const current = states[step]!;

  // Object constancy: ONE apple chip lives for the whole episode and slides
  // between zones (counter → inventory → microwave → …) instead of being
  // re-drawn as separate per-zone cards. Position is measured from live DOM.
  useLayoutEffect(() => {
    const canvas = worldRef.current;
    const appleEl = appleRef.current;
    if (!canvas || !appleEl) return;
    const place = () => {
      const zone = canvas.querySelector<HTMLElement>(`[data-flow-id="${current.apple}"]`);
      if (!zone) return;
      const c = canvas.getBoundingClientRect();
      const z = zone.getBoundingClientRect();
      appleEl.style.left = `${z.left - c.left + z.width / 2}px`;
      appleEl.style.top = `${z.top - c.top + z.height / 2 + 12}px`;
      appleEl.style.visibility = 'visible';
    };
    const frame = requestAnimationFrame(place);
    const observer = new ResizeObserver(place);
    observer.observe(canvas);
    canvas.querySelectorAll('[data-flow-id]').forEach((el) => observer.observe(el));
    window.addEventListener('resize', place);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [current.apple, current.open, step]);

  const movementEdges: EdgeSpec[] = current.previous ? [{
    id: `move-${step}`,
    from: current.previous,
    to: current.apple,
    tone: 'state',
    fromAnchor: current.previous === 'counter' ? 'bottom' : current.previous === 'microwave' ? 'bottom' : 'top',
    toAnchor: current.apple === 'counter' || current.apple === 'microwave' ? 'bottom' : 'top',
    shape: 'smooth',
    label: zh ? 'object state change' : 'object state change',
    active: true,
  }] : [];
  return (
    <div className="irx-alf-layout" data-ui-audit="contrast layout">
      <section className="irx-world" aria-label={zh ? 'ALFWorld 厨房世界状态' : 'ALFWorld kitchen world state'}>
        <header><span>{zh ? "家庭环境状态" : "HOUSEHOLD WORLD STATE"}</span><strong>{zh ? '任务：加热 apple，并把它放回 counter' : 'Task: heat the apple and place it on the counter'}</strong></header>
        <div className="irx-world-canvas" ref={worldRef}>
          <div className="irx-zone irx-zone-counter" data-flow-id="counter" data-ui-audit-item><small>COUNTER</small></div>
          <div className="irx-zone irx-zone-microwave" data-flow-id="microwave" data-open={current.open} data-failed={step === 3} data-ui-audit-item>
            <small>MICROWAVE · {current.open ? 'OPEN' : 'CLOSED'}</small>
            <Lock open={current.open} label={current.open ? (zh ? 'microwave 已打开' : 'microwave open') : (zh ? 'microwave 上锁关闭' : 'microwave locked closed')} />
          </div>
          <div className="irx-zone irx-zone-fridge" data-ui-audit-item>
            <small>FRIDGE</small>
            <Lock open={false} label={zh ? 'fridge 关闭' : 'fridge closed'} />
          </div>
          <div className="irx-zone irx-zone-inventory" data-flow-id="inventory" data-ui-audit-item><small>{zh ? "Agent 当前携带物品" : "AGENT INVENTORY"}</small></div>
          <span ref={appleRef} className="irx-apple" data-heated={current.heated} style={{ visibility: 'hidden' }} aria-label={current.heated ? 'heated apple' : 'apple'}>
            <i aria-hidden="true"></i><b>APPLE</b>{current.heated && <small>HEATED</small>}
          </span>
          <ConnectorLayer containerRef={worldRef} edges={movementEdges} ariaLabel={zh ? '当前动作导致的物体状态移动' : 'Object-state movement caused by the current action'} />
        </div>
      </section>
      <aside className="irx-action-console" data-failed={step === 3} data-success={step === 8}>
        <div className="irx-console-index">STEP {String(step + 1).padStart(2, '0')} / 09</div>
        <strong>{current.action}</strong><p>{current.result}</p>
        {step === 3 && <div className="irx-failure"><b>PRECONDITION FAILED</b><span>{zh ? '动作不是“文字上合理”就能执行；世界状态必须满足前置条件。' : 'An action is not executable just because it sounds plausible; world-state preconditions must hold.'}</span></div>}
        {step === 8 && <div className="irx-success"><b>GOAL SATISFIED</b><span>{zh ? '长期计划成功来自连续状态转换，而不是单次问答。' : 'Long-horizon success comes from a sequence of state transitions, not one answer.'}</span></div>}
        <div className="irx-action-set"><small>{zh ? "当前可用动作类型" : "AVAILABLE ACTION FAMILY"}</small><code>goto · pick · open · put · heat · cool · clean · examine</code></div>
      </aside>
    </div>
  );
}
