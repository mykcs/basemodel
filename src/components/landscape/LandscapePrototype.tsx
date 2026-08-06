import { useState } from 'react';
import LandscapeD3 from './LandscapeD3';
import LandscapeECharts from './LandscapeECharts';
import { getMessages, type Locale } from '../../i18n';
import type { AtlasModel } from '../../lib/types';

export default function LandscapePrototype({ models, locale = 'zh' }: { models: AtlasModel[]; locale?: Locale }) {
  const m = getMessages(locale);
  const [engine, setEngine] = useState<'echarts' | 'd3'>('echarts');
  return <div className="landscape-prototype"><div className="engine-switch" role="group" aria-label={m.landscape.engineLabel}><button className={`button ${engine === 'echarts' ? 'is-active' : ''}`} type="button" onClick={() => setEngine('echarts')}>ECharts</button><button className={`button ${engine === 'd3' ? 'is-active' : ''}`} type="button" onClick={() => setEngine('d3')}>D3</button></div>{engine === 'echarts' ? <LandscapeECharts models={models} locale={locale} /> : <LandscapeD3 models={models} locale={locale} />}</div>;
}
