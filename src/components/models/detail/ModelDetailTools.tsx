import { useState } from 'react';
import type { AtlasModel } from '../../../lib/types';

const MODEL_REVISION_FIELD = 'reproducibility.model_revision';

function verifiedModelRevision(model: AtlasModel): string | null {
  const source = model.sources.find((item) => item.revision && item.supports?.includes(MODEL_REVISION_FIELD));
  return source?.revision ?? null;
}

export default function ModelDetailTools({ model, locale }: { model: AtlasModel; locale: 'zh' | 'en' }) {
  const [notice, setNotice] = useState('');
  const zh = locale === 'zh';
  const citation = `@misc{${model.id.replace(/[^a-zA-Z0-9]/g, '-')},\n  title = {${model.name}},\n  author = {{${model.vendor}}},\n  year = {${model.release_date.slice(0, 4)}},\n  note = {Catalog record; verify official revision and license before use}\n}`;
  const copy = async (value: string, message: string) => { await navigator.clipboard.writeText(value); setNotice(message); };
  const revision = verifiedModelRevision(model);

  const reportDataIssue = () => {
    const source = model.sources[0]?.url ?? '';
    const body = [
      '## Data issue',
      '',
      `- Model: ${model.name} (${model.id})`,
      `- Page: ${window.location.href}`,
      `- Current source: ${source || 'not recorded'}`,
      '',
      zh ? '请说明需要核对的字段、当前值、期望值以及新的证据来源。' : 'Please describe the field, current value, expected value, and the evidence that should be checked.',
    ].join('\n');
    const issueUrl = new URL('https://github.com/mykcs/basemodel/issues/new');
    issueUrl.searchParams.set('title', `[data] ${model.id}: `);
    issueUrl.searchParams.set('body', body);
    window.open(issueUrl.toString(), '_blank', 'noopener,noreferrer');
  };

  return <div className="detail-tools">
    <button type="button" className="button button-secondary" onClick={() => copy(citation, zh ? '模型引用已复制' : 'Model citation copied')}>{zh ? '复制模型引用' : 'Copy model citation'}</button>
    <button type="button" className="button button-secondary" disabled={!revision} onClick={() => revision && copy(revision, zh ? '固定版本已复制' : 'Pinned revision copied')}>{zh ? '复制固定版本' : 'Copy pinned revision'}</button>
    {!revision && <span className="muted">{zh ? '模型版本尚未固定' : 'Model revision is not pinned'}</span>}
    {model.sources[0]?.url && <button type="button" className="button button-secondary" onClick={() => copy(`@misc{${model.id}-source,\n  title = {${model.name} official source},\n  url = {${model.sources[0].url}},\n  year = {${model.sources[0].checked_at.slice(0, 4)}}\n}`, zh ? '来源 BibTeX 已复制' : 'Source BibTeX copied')}>{zh ? '复制来源 BibTeX' : 'Copy source BibTeX'}</button>}
    <button type="button" className="button button-secondary" onClick={reportDataIssue}>{zh ? '报告数据问题' : 'Report data issue'}</button>
    {notice && <span className="muted" role="status">{notice}</span>}
  </div>;
}
