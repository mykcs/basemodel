import { useEffect, useRef } from 'react';
import { axisBottom, axisLeft, extent, scalePoint, scaleSqrt, scaleTime, select } from 'd3';
import { getMessages, localePath, type Locale } from '../../i18n';
import { buildLandscapePoints, landscapeDimensionIndex, landscapeDimensionLabels, type LandscapeColorBy, type LandscapeDimension, type LandscapePoint } from '../../lib/landscape';
import type { AtlasModel } from '../../lib/types';

export default function LandscapeD3({ models, locale = 'zh', dimension = 'hardware', colorBy = 'vendor' }: { models: AtlasModel[]; locale?: Locale; dimension?: LandscapeDimension; colorBy?: LandscapeColorBy }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const m = getMessages(locale);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const points = buildLandscapePoints(models, locale);
    const render = () => {
      const width = Math.max(320, root.clientWidth);
      const height = Math.max(420, Math.min(620, width * .62));
      const margin = { top: 28, right: 24, bottom: 52, left: 78 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const tiers = landscapeDimensionLabels(points, locale, dimension);
      const rootSelection = select(root);
      rootSelection.selectAll('*').remove();
      const svg = rootSelection.append('svg').attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img').attr('aria-label', m.landscape.chartAria);
      const x = scaleTime().domain(extent(points, (point) => new Date(point.releaseTimestamp)) as [Date, Date]).range([0, innerWidth]);
      const y = scalePoint<string>().domain(tiers).range([innerHeight, 0]).padding(.6);
      const max = Math.max(...points.map((point) => point.parameterB ?? 0), 1);
      const size = scaleSqrt().domain([0, max]).range([6, 17]);
      const labels = new Map(tiers.map((tier) => [tier, tier]));
      const plot = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      plot.append('g').attr('transform', `translate(0,${innerHeight})`).call(axisBottom(x).ticks(Math.min(6, points.length)).tickFormat((value) => new Date(value as Date).getUTCFullYear().toString())).selectAll('text').attr('fill', 'var(--muted)');
      plot.append('g').call(axisLeft(y).tickFormat((value) => labels.get(String(value)) ?? String(value))).selectAll('text').attr('fill', 'var(--muted)');
      plot.append('g').selectAll('line').data(tiers).join('line').attr('x1', 0).attr('x2', innerWidth).attr('y1', (tier) => y(tier) ?? 0).attr('y2', (tier) => y(tier) ?? 0).attr('stroke', 'var(--line)').attr('stroke-opacity', .42);
      const tooltip = rootSelection.append('div').attr('class', 'landscape-tooltip').style('opacity', 0);
      const positionTooltip = (event: MouseEvent) => {
        const rootRect = root.getBoundingClientRect();
        const tooltipWidth = tooltip.node()?.getBoundingClientRect().width ?? 0;
        const tooltipHeight = tooltip.node()?.getBoundingClientRect().height ?? 0;
        const left = Math.min(Math.max(event.clientX - rootRect.left + 12, 8), Math.max(8, root.clientWidth - tooltipWidth - 8));
        const top = Math.min(Math.max(event.clientY - rootRect.top + 12, 8), Math.max(8, root.clientHeight - tooltipHeight - 8));
        tooltip.style('left', `${left}px`).style('top', `${top}px`);
      };
      plot.selectAll<SVGPathElement, LandscapePoint>('path.landscape-point').data(points, (point) => point.id).join('path').attr('class', 'landscape-point').attr('transform', (point) => `translate(${x(new Date(point.releaseTimestamp))},${y(tiers[landscapeDimensionIndex(point, dimension)]) ?? 0})`).attr('d', (point) => symbolPath(point.architecture, point.parameterB === null ? 6 : size(point.parameterB))).attr('fill', (point) => colorForKey(point, colorBy)).attr('stroke', (point) => statusColor(point.dataStatus)).attr('stroke-width', 2).attr('stroke-dasharray', (point) => point.dataStatus === 'verified' ? null : point.dataStatus === 'partial' ? '5 3' : '2 3').attr('tabindex', 0).on('mouseenter focus', (event, point) => { tooltip.style('opacity', 1).html(`<strong>${point.name}</strong><br/>${point.vendor} · ${point.releaseDate}<br/>${point.hardwareLabel} · ${point.accessLabel} · ${point.dataStatusLabel}`); if (event instanceof MouseEvent) positionTooltip(event); }).on('mousemove', (event) => positionTooltip(event)).on('mouseleave blur', () => tooltip.style('opacity', 0)).on('click keydown', (event, point) => { if (event.type === 'click' || (event as KeyboardEvent).key === 'Enter') window.location.href = localePath(locale, `/models/${point.id}/`); });
    };
    render();
    const observer = new ResizeObserver(render);
    observer.observe(root);
    return () => observer.disconnect();
  }, [colorBy, dimension, locale, models, m.landscape.chartAria]);

  return <div className="landscape-chart-shell"><div className="landscape-chart-meta"><span>{m.landscape.d3Hint}</span><a className="text-link" href={localePath(locale, '/landscape/')}>{m.landscape.openPrototype}</a></div><div ref={rootRef} className="landscape-chart landscape-d3" /><p className="landscape-legend-note">{m.landscape.legendNote}</p></div>;
}

function vendorColor(vendor: string): string { let hash = 0; for (const character of vendor) hash = (hash * 31 + character.charCodeAt(0)) | 0; return ['#d7653b', '#3d6f73', '#7a5c9e', '#b4873a', '#2f7d5f', '#b14a65', '#6b7280'][Math.abs(hash) % 7]; }
function colorForKey(point: LandscapePoint, colorBy: LandscapeColorBy): string { if (colorBy === 'evidence') return statusColor(point.dataStatus); if (colorBy === 'access') return ({ weights: '#2f7d5f', api: '#4776a8', unknown: '#68706d' } as Record<string, string>)[point.accessKey] ?? '#68706d'; return vendorColor(point.vendor); }
function statusColor(status: string): string { return status === 'verified' ? '#2f7d5f' : status === 'partial' ? '#b4873a' : status === 'demo' ? '#7a5c9e' : '#68706d'; }
function symbolPath(architecture: string, radius: number): string { if (architecture === 'moe') return `M0,-${radius} L${radius},0 L0,${radius} L-${radius},0 Z`; if (architecture === 'other') return `M-${radius},-${radius} h${radius * 2} v${radius * 2} h-${radius * 2} Z`; return `M ${radius},0 A ${radius},${radius} 0 1,1 -${radius},0 A ${radius},${radius} 0 1,1 ${radius},0`; }
