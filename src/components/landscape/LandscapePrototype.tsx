import { lazy, Suspense, useState } from 'react';
import { getMessages, type Locale } from '../../i18n';
import type { AtlasModel } from '../../lib/types';

const LandscapeD3 = lazy(() => import('./LandscapeD3'));
const LandscapeECharts = lazy(() => import('./LandscapeECharts'));

export default function LandscapePrototype({ models, paperModelIds = [], locale = 'zh' }: { models: AtlasModel[]; paperModelIds?: string[]; locale?: Locale }) {
  const m = getMessages(locale);
  const [engine, setEngine] = useState<'echarts' | 'd3'>('echarts');
  const [view, setView] = useState<'learning' | 'full'>('learning');
  const [onlyPaper, setOnlyPaper] = useState(false);
  const filtered = onlyPaper ? models.filter((model) => paperModelIds.includes(model.id)) : models;
  return <div className="landscape-prototype"><div className="landscape-controls" role="group" aria-label={locale === 'zh' ? 'Landscape 视图控制' : 'Landscape view controls'}><button className={`button ${view === 'learning' ? 'is-active' : ''}`} type="button" onClick={() => setView('learning')}>{locale === 'zh' ? '学习视图' : 'Learning view'}</button><button className={`button ${view === 'full' ? 'is-active' : ''}`} type="button" onClick={() => setView('full')}>{locale === 'zh' ? '完整视图' : 'Full view'}</button><label className="check-row"><input type="checkbox" checked={onlyPaper} onChange={(event) => setOnlyPaper(event.target.checked)} />{locale === 'zh' ? '仅显示论文采用模型' : 'Paper-used models only'}</label><div className="engine-switch"><button className={`button ${engine === 'echarts' ? 'is-active' : ''}`} type="button" onClick={() => setEngine('echarts')}>ECharts</button><button className={`button ${engine === 'd3' ? 'is-active' : ''}`} type="button" onClick={() => setEngine('d3')}>D3</button></div></div><p className="muted landscape-view-note">{view === 'learning' ? (locale === 'zh' ? '先读发布日期、推理资源和证据状态，再进入模型详情。未知值保留为待核验。' : 'Start with release date, inference resources, and evidence status; unknown values remain unverified.') : (locale === 'zh' ? '完整视图展示目录中的全部模型。' : 'Full view shows all catalog models.')}</p><Suspense fallback={<div className="empty-state" role="status">{m.landscape.chartHint}</div>}>{engine === 'echarts' ? <LandscapeECharts models={filtered} locale={locale} /> : <LandscapeD3 models={filtered} locale={locale} />}</Suspense><AccessibleLandscapeTable models={filtered} locale={locale} /></div>;
}

function AccessibleLandscapeTable({ models, locale }: { models: AtlasModel[]; locale: Locale }) {
  return <details className="accessible-landscape"><summary>{locale === 'zh' ? '打开可访问表格' : 'Open accessible data table'}</summary><div className="comparison-table-wrap"><table><caption className="sr-only">{locale === 'zh' ? '模型 Landscape 数据' : 'Landscape model data'}</caption><thead><tr><th>{locale === 'zh' ? '模型' : 'Model'}</th><th>{locale === 'zh' ? '发布日期' : 'Release'}</th><th>{locale === 'zh' ? '家族' : 'Family'}</th><th>{locale === 'zh' ? '证据状态' : 'Evidence'}</th></tr></thead><tbody>{models.map((model) => <tr key={model.id}><th scope="row">{model.name}</th><td>{model.release_date}</td><td>{model.family}</td><td>{model.data_status}</td></tr>)}</tbody></table></div></details>;
}
