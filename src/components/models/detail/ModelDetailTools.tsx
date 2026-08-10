import type { AtlasModel } from '../../../lib/types';
import { CopyButton } from '../../common/CopyButton';

const MODEL_REVISION_FIELD = 'reproducibility.model_revision';

function verifiedModelRevision(model: AtlasModel): string | null {
  const source = model.sources.find((item) => item.revision && item.supports?.includes(MODEL_REVISION_FIELD));
  return source?.revision ?? null;
}

export default function ModelDetailTools({ model, locale }: { model: AtlasModel; locale: 'zh' | 'en' }) {
  const zh = locale === 'zh';
  const citation = `@misc{${model.id.replace(/[^a-zA-Z0-9]/g, '-')},\n  title = {${model.name}},\n  author = {{${model.vendor}}},\n  year = {${model.release_date.slice(0, 4)}},\n  note = {Catalog record; verify official revision and license before use}\n}`;
  const revision = verifiedModelRevision(model);
  const sourceBibtex = model.sources[0]?.url ? `@misc{${model.id}-source,\n  title = {${model.name} official source},\n  url = {${model.sources[0].url}},\n  year = {${model.sources[0].checked_at.slice(0, 4)}}\n}` : '';

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

  return <div className="detail-tools actionable-copy-group">
    <CopyButton value={citation} label={zh ? '复制模型引用' : 'Copy model citation'} copiedLabel={zh ? '模型引用已复制' : 'Model citation copied'} />
    <CopyButton value={revision ?? ''} disabled={!revision} label={zh ? '复制固定版本' : 'Copy pinned revision'} copiedLabel={zh ? '固定版本已复制' : 'Pinned revision copied'} />
    {!revision && <span className="muted">{zh ? '模型版本尚未固定' : 'Model revision is not pinned'}</span>}
    {sourceBibtex && <CopyButton value={sourceBibtex} label={zh ? '复制来源 BibTeX' : 'Copy source BibTeX'} copiedLabel={zh ? '来源 BibTeX 已复制' : 'Source BibTeX copied'} />}
    {model.sources[0]?.url && <a className="button button-secondary" href={model.sources[0].url} target="_blank" rel="noreferrer">{zh ? '打开主要来源 ↗' : 'Open primary source ↗'}</a>}
    <button type="button" className="button button-secondary" onClick={reportDataIssue}>{zh ? '报告数据问题' : 'Report data issue'}</button>
  </div>;
}
