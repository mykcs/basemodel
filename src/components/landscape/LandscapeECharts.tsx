import { useEffect, useRef } from 'react';
import type { EChartsCoreOption } from 'echarts/core';
import type * as EChartsCore from 'echarts/core';
import { getMessages, localePath, type Locale } from '../../i18n';
import { buildLandscapePoints, LANDSCAPE_HARDWARE_ORDER } from '../../lib/landscape';
import type { AtlasModel } from '../../lib/types';

const vendorColors = ['#d7653b', '#3d6f73', '#7a5c9e', '#b4873a', '#2f7d5f', '#b14a65', '#6b7280', '#4776a8'];
const architectureSymbols: Record<string, string> = { dense: 'circle', moe: 'diamond', other: 'rect' };
const statusDash: Record<string, 'solid' | 'dashed' | 'dotted'> = { verified: 'solid', partial: 'dashed', demo: 'dotted', unknown: 'dotted' };

export default function LandscapeECharts({ models, locale = 'zh' }: { models: AtlasModel[]; locale?: Locale }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let chart: ReturnType<typeof EChartsCore.init> | null = null;
    let observer: ResizeObserver | null = null;
    let resizeHandler: (() => void) | null = null;

    void (async () => {
      const [echarts, { GridComponent, LegendComponent, TooltipComponent }, { ScatterChart }, { SVGRenderer }] = await Promise.all([
        import('echarts/core'),
        import('echarts/components'),
        import('echarts/charts'),
        import('echarts/renderers'),
      ]);
      if (disposed || !chartRef.current) return;

      echarts.use([GridComponent, LegendComponent, TooltipComponent, ScatterChart, SVGRenderer]);
      chart = echarts.init(chartRef.current, undefined, { renderer: 'svg' });
      const points = buildLandscapePoints(models, locale);
      const vendors = [...new Set(points.map((point) => point.vendor))];
      const styles = getComputedStyle(document.documentElement);
      const ink = styles.getPropertyValue('--ink').trim() || '#1e2728';
      const muted = styles.getPropertyValue('--muted').trim() || '#68706d';
      const line = styles.getPropertyValue('--line').trim() || '#dcd9d1';
      const surface = styles.getPropertyValue('--surface').trim() || '#fffdf9';
      const tierLabels = [...LANDSCAPE_HARDWARE_ORDER, 'unknown'].map((tier) => {
        const point = points.find((candidate) => candidate.hardwareIndex === [...LANDSCAPE_HARDWARE_ORDER, 'unknown'].indexOf(tier));
        return tier === 'unknown' ? (locale === 'zh' ? '待核验' : 'Unknown') : point?.hardwareLabel ?? tier;
      });
      const option: EChartsCoreOption = {
        animationDuration: 350,
        color: vendors.map((_, index) => vendorColors[index % vendorColors.length]),
        grid: { left: 78, right: 24, top: 44, bottom: 52 },
        legend: { type: 'scroll', top: 0, textStyle: { color: muted, fontSize: 11 } },
        tooltip: {
          trigger: 'item',
          backgroundColor: surface,
          borderColor: line,
          textStyle: { color: ink },
          formatter: (raw: unknown) => {
            const params = Array.isArray(raw) ? raw[0] : raw;
            const point = (params as { data?: { point?: (typeof points)[number] } }).data?.point;
            if (!point) return '';
            const parameter = point.parameterB === null ? (locale === 'zh' ? '待核验' : 'Unknown') : `${point.parameterB}B (${point.parameterSource})`;
            return `<strong>${escapeHtml(point.name)}</strong><br/>${escapeHtml(point.vendor)} · ${escapeHtml(point.releaseDate)}<br/>${escapeHtml(point.architectureLabel)} · ${escapeHtml(point.hardwareLabel)}<br/>${locale === 'zh' ? '参数' : 'Parameters'}: ${escapeHtml(parameter)}<br/>${locale === 'zh' ? '证据状态' : 'Evidence'}: ${escapeHtml(point.dataStatusLabel)}<br/><span style="color:${muted}">${locale === 'zh' ? '点击打开模型详情' : 'Click to open model details'}</span>`;
          },
        },
        xAxis: { type: 'time', name: locale === 'zh' ? '发布日期' : 'Release date', nameLocation: 'middle', nameGap: 30, axisLabel: { color: muted }, axisLine: { lineStyle: { color: line } }, splitLine: { lineStyle: { color: line, opacity: .45 } } },
        yAxis: { type: 'category', data: tierLabels, axisLabel: { color: muted }, axisLine: { lineStyle: { color: line } }, splitLine: { lineStyle: { color: line, opacity: .35 } } },
        series: vendors.map((vendor) => ({
          name: vendor,
          type: 'scatter',
          data: points.filter((point) => point.vendor === vendor).map((point) => ({
            value: [point.releaseTimestamp, point.hardwareIndex],
            name: point.name,
            symbol: architectureSymbols[point.architecture],
            symbolSize: point.symbolSize,
            point,
            itemStyle: { borderColor: statusColor(point.dataStatus), borderWidth: 2, borderType: statusDash[point.dataStatus] ?? 'dotted', opacity: .92 },
          })),
          emphasis: { focus: 'series', scale: true },
        })),
      };
      chart.setOption(option);
      chart.on('click', (params) => {
        const point = (params as { data?: { point?: (typeof points)[number] } }).data?.point;
        if (point) window.location.href = localePath(locale, `/models/${point.id}/`);
      });
      resizeHandler = () => chart?.resize();
      window.addEventListener('resize', resizeHandler);
      observer = new ResizeObserver(resizeHandler);
      observer.observe(chartRef.current);
    })();

    return () => {
      disposed = true;
      observer?.disconnect();
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      chart?.dispose();
    };
  }, [locale, models]);

  const m = getMessages(locale);
  return <div className="landscape-chart-shell">
    <div className="landscape-chart-meta"><span>{m.landscape.chartHint}</span><a className="text-link" href={localePath(locale, '/landscape/')}>{m.landscape.openPrototype}</a></div>
    <div ref={chartRef} className="landscape-chart" role="img" aria-label={m.landscape.chartAria} />
    <p className="landscape-legend-note">{m.landscape.legendNote}</p>
  </div>;
}

function statusColor(status: string): string {
  return status === 'verified' ? '#2f7d5f' : status === 'partial' ? '#b4873a' : status === 'demo' ? '#7a5c9e' : '#68706d';
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}
