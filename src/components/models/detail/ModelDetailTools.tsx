import { useState } from 'react';
import type { AtlasModel } from '../../../lib/types';

export default function ModelDetailTools({ model, locale }: { model: AtlasModel; locale: 'zh' | 'en' }) {
  const [notice, setNotice] = useState('');
  const zh = locale === 'zh';
  const citation = `@misc{${model.id.replace(/[^a-zA-Z0-9]/g, '-')},\n  title = {${model.name}},\n  author = {{${model.vendor}}},\n  year = {${model.release_date.slice(0, 4)}},\n  note = {Catalog record; verify official revision and license before use}\n}`;
  const copy = async (value: string, message: string) => { await navigator.clipboard.writeText(value); setNotice(message); };
  const revision = model.reproducibility?.model_revision_required === true ? `${model.id}@${model.release_date}` : '';
  return <div className="detail-tools"><button type="button" className="button button-secondary" onClick={() => copy(citation, zh ? '模型引用已复制' : 'Model citation copied')}>{zh ? '复制模型引用' : 'Copy model citation'}</button><button type="button" className="button button-secondary" disabled={!revision} onClick={() => copy(revision, zh ? '固定版本已复制' : 'Pinned revision copied')}>{zh ? '复制固定版本' : 'Copy pinned revision'}</button>{model.sources[0]?.url && <button type="button" className="button button-secondary" onClick={() => copy(`@misc{${model.id}-source,\n  title = {${model.name} official source},\n  url = {${model.sources[0].url}},\n  year = {${model.sources[0].checked_at.slice(0, 4)}}\n}`, zh ? '来源 BibTeX 已复制' : 'Source BibTeX copied')}>{zh ? '复制来源 BibTeX' : 'Copy source BibTeX'}</button>}<button type="button" className="button button-secondary" onClick={() => copy(`${window.location.href}\n\n${zh ? '请核对字段、来源与状态。' : 'Please check the field, source, and semantic status.'}`, zh ? '错误报告草稿已复制' : 'Error-report draft copied')}>{zh ? '报告数据问题' : 'Report data issue'}</button>{notice && <span className="muted" role="status">{notice}</span>}</div>;
}
