import { useLayoutEffect, useRef } from 'react';
import { ChipSequence, ConnectorLayer, Gauge, type EdgeSpec, type Locale } from './ResearchExplainerPrimitives';

export function WebShopExplainer({ locale, step }: { locale: Locale; step: number }) {
  const zh = locale === 'zh';
  const states = [
    {
      observation: zh ? '任务目标：买一件黑色、M 码、价格低于 $50 的运动衫。' : 'Goal: buy a black, size-M sports sweatshirt under $50.',
      actions: zh ? '环境已就绪；可从搜索开始。' : 'Environment ready; search can begin.',
      selected: '—',
      selectedTokens: ['—'],
      transition: zh ? '任务载入，网页处于首页。' : 'Task loaded; storefront is at the home page.',
      reward: 'task_score = 0',
    },
    {
      observation: zh ? '首页提供搜索框。Agent 只能基于当前 observation 选择动作。' : 'The home page exposes a search box. The agent chooses from the current observation.',
      actions: 'search[query]',
      selected: 'search["black sports sweatshirt"]',
      selectedTokens: ['search', '[', '"black sports sweatshirt"', ']'],
      transition: zh ? '环境返回搜索结果页。' : 'The environment returns a results page.',
      reward: 'task_score = 0',
    },
    {
      observation: zh ? '搜索结果里出现 Core Run Hoodie，$39。' : 'Search results include Core Run Hoodie at $39.',
      actions: 'click[product] · search[new query]',
      selected: 'click["Core Run Hoodie"]',
      selectedTokens: ['click', '[', '"Core Run Hoodie"', ']'],
      transition: zh ? '网页切换到商品详情页。' : 'The page transitions to product detail.',
      reward: 'task_score = 0',
    },
    {
      observation: zh ? '商品页暴露颜色与尺码选项：Black / Gray，S / M / L。' : 'The product page exposes color and size options: Black / Gray, S / M / L.',
      actions: 'click[color] · click[size] · click[buy]',
      selected: 'click["Black"] + click["M"]',
      selectedTokens: ['click["Black"]', '+', 'click["M"]'],
      transition: zh ? '环境保存当前商品选项。' : 'The environment stores the selected options.',
      reward: 'task_score = 0',
    },
    {
      observation: zh ? '商品、颜色、尺码、价格都满足目标。' : 'Product, color, size, and price now satisfy the goal.',
      actions: 'click[buy]',
      selected: 'click["Buy Now"]',
      selectedTokens: ['click["Buy Now"]'],
      transition: zh ? '进入终局评测，环境检查任务约束。' : 'Terminal evaluation checks the task constraints.',
      reward: 'DEMO: task_score = 1.0 · won = true',
    },
  ];
  const current = states[step];
  return (
    <>
      <div className="irx-webshop-stage" data-ui-audit="contrast layout">
        <section className="irx-browser" aria-label={zh ? '简化 WebShop 页面' : 'Simplified WebShop page'}>
          <div className="irx-browser-bar"><i></i><i></i><i></i><code>webshop.local</code></div>
          <div className="irx-shop-header">
            <strong>WebShop</strong>
            <label><span className="sr-only">Search</span><input readOnly value={step >= 1 ? 'black sports sweatshirt' : ''} placeholder={zh ? '搜索商品' : 'Search products'} /></label>
            <button type="button" tabIndex={-1}>Search</button>
          </div>
          {step === 0 && (
            <div className="irx-shop-welcome">
              <span>GOAL</span><b>{zh ? '黑色 · M 码 · 运动衫 · ≤ $50' : 'Black · M · sweatshirt · ≤ $50'}</b>
              <p>{zh ? '这里不是问答题。Agent 必须通过一连串页面状态变化完成任务。' : 'This is not a question-answer task. The agent must complete a sequence of page-state transitions.'}</p>
            </div>
          )}
          {step >= 1 && step <= 2 && (
            <div className="irx-products" data-ui-audit="contrast layout">
              <article data-ui-audit-item data-selected={step === 2}><div className="irx-product-image">HOODIE</div><strong>Core Run Hoodie</strong><span>$39</span><small>Black · Gray · S/M/L</small></article>
              <article data-ui-audit-item><div className="irx-product-image">ZIP</div><strong>Trail Zip Jacket</strong><span>$64</span><small>Black · Navy</small></article>
              <article data-ui-audit-item><div className="irx-product-image">TEE</div><strong>Training Tee</strong><span>$28</span><small>Black · White</small></article>
            </div>
          )}
          {step >= 3 && (
            <div className="irx-product-detail">
              <div className="irx-product-image irx-product-image-large">HOODIE</div>
              <div><small>Core Run Hoodie</small><h3>$39</h3><p>{zh ? '颜色' : 'Color'}</p><div className="irx-options"><span data-selected>Black</span><span>Gray</span></div><p>{zh ? '尺码' : 'Size'}</p><div className="irx-options"><span>S</span><span data-selected>M</span><span>L</span></div><button type="button" tabIndex={-1} data-ready={step === 4}>Buy Now</button></div>
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
      <aside className="irx-boundary-note"><b>{zh ? '教学边界' : 'Teaching boundary'}</b><span>{zh ? '最后一步显示的 “DEMO: task_score = 1.0” 只是教学演示，不是测得的实验结果。商品规模、任务划分和具体研究协议由页面前面的静态图分别说明。' : 'The final-step “DEMO: task_score = 1.0” is a teaching example, not a measured experiment result. Product scale, task splits, and a specific research protocol are explained separately by the static figures earlier on the page.'}</span></aside>
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
  const current = states[step];

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
        <header><span>HOUSEHOLD WORLD STATE</span><strong>{zh ? '任务：加热 apple，并把它放回 counter' : 'Task: heat the apple and place it on the counter'}</strong></header>
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
          <div className="irx-zone irx-zone-inventory" data-flow-id="inventory" data-ui-audit-item><small>AGENT INVENTORY</small></div>
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
        <div className="irx-action-set"><small>AVAILABLE ACTION FAMILY</small><code>goto · pick · open · put · heat · cool · clean · examine</code></div>
      </aside>
    </div>
  );
}
