import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

export type Locale = 'zh' | 'en';
export type Kind = 'webshop' | 'alfworld' | 'seed' | 'openevo' | 'compare' | 'server';
export type Carrier = 'memory' | 'artifact' | 'adapter';
export type Tone = 'env' | 'experience' | 'signal' | 'state' | 'persist' | 'neutral';
export type Anchor = 'left' | 'right' | 'top' | 'bottom';
export type EdgeShape = 'smooth' | 'orthogonal' | 'loop-top' | 'loop-right';

export interface StepMeta {
  label: string;
  narration: string;
}

export interface EdgeSpec {
  id: string;
  from: string;
  to: string;
  tone: Tone;
  fromAnchor: Anchor;
  toAnchor: Anchor;
  shape?: EdgeShape;
  dashed?: boolean;
  label?: string;
  active?: boolean;
}

interface MeasuredEdge extends EdgeSpec {
  d: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  labelX: number;
  labelY: number;
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);
  return reduced;
}

export function StepControls({
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
      <div className="irx-transport">
        <button type="button" onClick={() => onStep(step - 1)} disabled={step === 0} aria-label={zh ? '上一步' : 'Previous step'}>
          <span aria-hidden="true">←</span><span>{zh ? '上一步' : 'Previous'}</span>
        </button>
        <button
          type="button"
          className="irx-play"
          onClick={onPlay}
          disabled={reducedMotion}
          aria-pressed={playing}
          title={reducedMotion ? (zh ? '系统已启用减少动态效果' : 'Reduced motion is enabled') : undefined}
        >
          <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span><span>{reducedMotion ? (zh ? '减少动态' : 'Reduced motion') : playing ? (zh ? '暂停' : 'Pause') : (zh ? '播放' : 'Play')}</span>
        </button>
        <button type="button" onClick={() => onStep(step + 1)} disabled={step === maxStep} aria-label={zh ? '下一步' : 'Next step'}>
          <span>{zh ? '下一步' : 'Next'}</span><span aria-hidden="true">→</span>
        </button>
        <button type="button" className="irx-reset" onClick={() => onStep(0)} disabled={step === 0}>{zh ? '重置' : 'Reset'}</button>
      </div>
      <ol className="irx-stepper" aria-label={zh ? '步骤' : 'Steps'}>
        {steps.map((item, index) => (
          <li key={`${item.label}-${index}`} data-active={index === step} data-complete={index < step}>
            <button type="button" aria-current={index === step ? 'step' : undefined} aria-label={`${index + 1}. ${item.label}`} onClick={() => onStep(index)}>
              <span>{String(index + 1).padStart(2, '0')}</span><small>{item.label}</small>
            </button>
          </li>
        ))}
      </ol>
      <p className="irx-live" aria-live="polite"><b>{steps[step]?.label}</b><span aria-hidden="true">/</span>{steps[step]?.narration}</p>
    </div>
  );
}

export function ExplainerHeader({ locale, title, lede, eyebrow }: { locale: Locale; title: string; lede: string; eyebrow: string }) {
  const zh = locale === 'zh';
  return (
    <header className="irx-header">
      <div className="irx-kicker">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{lede}</p>
      <ol className="irx-depth" aria-label={zh ? '阅读深度' : 'Reading depth'}>
        <li><b>01</b><span>{zh ? '30 秒直觉' : '30-second intuition'}</span></li>
        <li><b>02</b><span>{zh ? '逐步操作' : 'step-by-step interaction'}</span></li>
        <li><b>03</b><span>{zh ? '技术边界' : 'technical boundary'}</span></li>
      </ol>
    </header>
  );
}

export function FlowNode({
  id,
  role,
  title,
  detail,
  tone,
  active = false,
  complete = false,
  className = '',
  interactive = false,
  children,
}: {
  id: string;
  role: string;
  title: string;
  detail?: string;
  tone: Tone;
  active?: boolean;
  complete?: boolean;
  className?: string;
  interactive?: boolean;
  children?: ReactNode;
}) {
  const Tag = interactive ? 'div' : 'article';
  return (
    <Tag
      className={`irx-node irx-tone-${tone} ${className}`}
      data-flow-id={id}
      data-ui-audit-item
      data-active={active}
      data-complete={complete}
    >
      <span className="irx-node-role">{role}</span>
      <strong>{title}</strong>
      {detail && <small>{detail}</small>}
      {children}
    </Tag>
  );
}

function getAnchorPoint(rect: DOMRect, root: DOMRect, anchor: Anchor) {
  const x = rect.left - root.left;
  const y = rect.top - root.top;
  if (anchor === 'left') return { x, y: y + rect.height / 2 };
  if (anchor === 'right') return { x: x + rect.width, y: y + rect.height / 2 };
  if (anchor === 'top') return { x: x + rect.width / 2, y };
  return { x: x + rect.width / 2, y: y + rect.height };
}

function connectorPath(start: { x: number; y: number }, end: { x: number; y: number }, shape: EdgeShape, root: DOMRect) {
  if (shape === 'orthogonal') {
    const midX = start.x + (end.x - start.x) / 2;
    return `M ${start.x} ${start.y} H ${midX} V ${end.y} H ${end.x}`;
  }
  if (shape === 'loop-top') {
    const lift = Math.max(34, Math.min(90, Math.abs(end.x - start.x) * 0.12));
    const top = Math.max(12, Math.min(start.y, end.y) - lift);
    return `M ${start.x} ${start.y} C ${start.x} ${top}, ${end.x} ${top}, ${end.x} ${end.y}`;
  }
  if (shape === 'loop-right') {
    const right = Math.min(root.width - 12, Math.max(start.x, end.x) + Math.max(44, root.width * 0.07));
    return `M ${start.x} ${start.y} C ${right} ${start.y}, ${right} ${end.y}, ${end.x} ${end.y}`;
  }
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const bend = Math.max(36, Math.min(140, Math.abs(dx) * 0.42));
    const c1x = start.x + (dx >= 0 ? bend : -bend);
    const c2x = end.x - (dx >= 0 ? bend : -bend);
    return `M ${start.x} ${start.y} C ${c1x} ${start.y}, ${c2x} ${end.y}, ${end.x} ${end.y}`;
  }
  const bend = Math.max(34, Math.min(120, Math.abs(dy) * 0.4));
  const c1y = start.y + (dy >= 0 ? bend : -bend);
  const c2y = end.y - (dy >= 0 ? bend : -bend);
  return `M ${start.x} ${start.y} C ${start.x} ${c1y}, ${end.x} ${c2y}, ${end.x} ${end.y}`;
}

export function ConnectorLayer({
  containerRef,
  edges,
  ariaLabel,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  edges: EdgeSpec[];
  ariaLabel: string;
}) {
  const markerPrefix = useId().replace(/:/g, '');
  const [geometry, setGeometry] = useState<{ width: number; height: number; edges: MeasuredEdge[] } | null>(null);

  const measure = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    if (rootRect.width <= 1 || rootRect.height <= 1) return;

    const measured: MeasuredEdge[] = [];
    for (const edge of edges) {
      const from = root.querySelector<HTMLElement>(`[data-flow-id="${edge.from}"]`);
      const to = root.querySelector<HTMLElement>(`[data-flow-id="${edge.to}"]`);
      if (!from || !to) continue;
      const start = getAnchorPoint(from.getBoundingClientRect(), rootRect, edge.fromAnchor);
      const end = getAnchorPoint(to.getBoundingClientRect(), rootRect, edge.toAnchor);
      measured.push({
        ...edge,
        d: connectorPath(start, end, edge.shape ?? 'smooth', rootRect),
        startX: start.x,
        startY: start.y,
        endX: end.x,
        endY: end.y,
        labelX: (start.x + end.x) / 2,
        labelY: (start.y + end.y) / 2,
      });
    }
    setGeometry({ width: rootRect.width, height: rootRect.height, edges: measured });
  }, [containerRef, edges]);

  useLayoutEffect(() => {
    let frame = requestAnimationFrame(measure);
    const root = containerRef.current;
    if (!root) return () => cancelAnimationFrame(frame);
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(root);
    root.querySelectorAll<HTMLElement>('[data-flow-id]').forEach((node) => observer.observe(node));
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener('resize', onResize);
    void document.fonts?.ready?.then(onResize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [measure, containerRef]);

  if (!geometry) return null;
  const tones: Tone[] = ['env', 'experience', 'signal', 'state', 'persist', 'neutral'];
  return (
    <svg
      className="irx-edge-layer"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      role="img"
      aria-label={ariaLabel}
      data-flow-layer
    >
      <title>{ariaLabel}</title>
      <defs>
        {tones.map((tone) => (
          <marker key={tone} id={`${markerPrefix}-${tone}`} markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
            <path d="M0,0 L9,4.5 L0,9 Z" className={`irx-marker irx-marker-${tone}`} />
          </marker>
        ))}
      </defs>
      {geometry.edges.map((edge) => (
        <g key={edge.id} data-active={edge.active ?? true}>
          <path
            className={`irx-edge irx-edge-${edge.tone}`}
            d={edge.d}
            markerEnd={`url(#${markerPrefix}-${edge.tone})`}
            data-dashed={edge.dashed}
            data-flow-edge={edge.id}
            data-from={edge.from}
            data-to={edge.to}
            data-from-anchor={edge.fromAnchor}
            data-to-anchor={edge.toAnchor}
            data-start-x={edge.startX.toFixed(2)}
            data-start-y={edge.startY.toFixed(2)}
            data-end-x={edge.endX.toFixed(2)}
            data-end-y={edge.endY.toFixed(2)}
          />
          {edge.label && <text x={edge.labelX} y={edge.labelY - 7} className="irx-edge-label">{edge.label}</text>}
        </g>
      ))}
    </svg>
  );
}
