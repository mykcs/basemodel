import { useEffect, useState } from 'react';
import type { Locale } from '../../i18n';
import ExternalBrandMark from '../common/ExternalBrandMark';
import { initialRewardMatches, scoreRewardExample, type RewardMatches } from '../../lib/webshopRewardExample';
import '../../styles/components/webshop-reward-explorer.css';

type Props = { locale: Locale };
const requirements = [
  { key: 'waterproof', zh: '防水属性符合要求', en: 'Waterproof attribute matches' },
  { key: 'breathable', zh: '透气属性符合要求', en: 'Breathable attribute matches' },
  { key: 'size', zh: '尺码 9 选项正确', en: 'Size 9 option matches' },
  { key: 'price', zh: '价格不超过 60 美元', en: 'Price is at most $60' },
] as const;

export default function WebShopRewardExplorer({ locale }: Props) {
  const t = (cn: string, en: string) => locale === 'zh' ? cn : en;
  const [matches, setMatches] = useState<RewardMatches>(initialRewardMatches);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);
  const score = scoreRewardExample(matches);
  return (
    <section className="webshop-reward-explorer" data-webshop-reward-explorer aria-labelledby="webshop-reward-explorer-title">
      <header>
        <span className="wre-kicker">{t('可操作的评分示例', 'INTERACTIVE SCORING EXAMPLE')}</span>
        <h3 id="webshop-reward-explorer-title">{t('四项购物要求，逐项检查', 'Four shopping requirements, checked one by one')}</h3>
        <p>{t('要买一双防水、透气、尺码为 9 的鞋，预算不超过 60 美元。初始结果满足三项。改变勾选，观察分数与完整成功怎样一起变化。',
          'Buy waterproof, breathable shoes in size 9 for at most $60. The initial result matches three conditions. Change the checkboxes to see the score and full success update.')}</p>
      </header>
      <div className="wre-grid">
        <div className="wre-choices">
          <fieldset disabled={!interactive}>
            <legend>{t('最终买到的商品符合哪些条件', 'Which requirements the purchased item satisfies')}</legend>
            {requirements.map((r) => (
              <label key={r.key} className="wre-choice">
                <input
                  type="checkbox" checked={matches[r.key]}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setMatches((previous) => ({ ...previous, [r.key]: checked }));
                  }}
                />
                <span>{t(r.zh, r.en)}</span>
              </label>
            ))}
          </fieldset>
          <div className="wre-actions">
            <button type="button" disabled={!interactive} onClick={() => setMatches({
              waterproof: true, breathable: true, size: true, price: true,
            })}>{t('全部符合', 'Match all')}</button>
            <button type="button" disabled={!interactive} onClick={() => setMatches(initialRewardMatches)}>
              {t('恢复初始示例', 'Reset example')}
            </button>
          </div>
          {!interactive && <p className="wre-hint">{t('当前展示初始结果；启用 JavaScript 后可以修改条件。',
            'The initial score is shown. Enable JavaScript to change the conditions.')}</p>}
        </div>
        <div className="wre-result" aria-live="polite" aria-atomic="true">
          <p className="wre-label">{t('任务完成度（教学示例）', 'Task score (teaching example)')}</p>
          <div className="wre-number">
            <output data-testid="webshop-reward-score" aria-label={t('示例任务分数', 'Example task score')}>
              {score.taskScore.toFixed(2)}
            </output>
            <span>{t('满分 1.00', 'out of 1.00')}</span>
          </div>
          <div className="wre-meter" role="meter" aria-label={t('已满足要求的比例', 'Requirements met')}
            aria-valuemin={0} aria-valuemax={1} aria-valuenow={score.taskScore}
            aria-valuetext={t('满足 ' + score.matched + ' / 4 项', score.matched + ' of 4 requirements')}>
            <span style={{ width: score.taskScore * 100 + '%' }} />
          </div>
          <p className="wre-subscore">{t('已满足 ' + score.matched + ' / 4 项', score.matched + ' / 4 requirements met')}</p>
          <p className="wre-success" data-testid="webshop-exact-success" data-complete={score.complete}>
            <strong>{t('完整成功：' + (score.complete ? '是' : '否'),
              'Exact success: ' + (score.complete ? 'yes' : 'no'))}</strong>
            <span>{score.complete ? t('四项都满足。', 'All four match.') :
              t('还有 ' + (4 - score.matched) + ' 项没有满足；部分完成不等于完整成功。',
                (4 - score.matched) + ' condition(s) remain; partial credit is not exact success.')}</span>
          </p>
        </div>
      </div>
      <p className="wre-caveat">
        <strong>{t('计算边界：', 'Calculation boundary: ')}</strong>
        {t('这里只演示商品类型已经匹配（r_type = 1）的情况，四项匹配各占 1/4。真实 WebShop 还会检查商品类型和模糊匹配。这里不是完整评估器，也不是 SEED / OpenEVO 实验的实测结果；实际完整成功须以真实评测记录为准。',
          'This holds product-type reward at r_type = 1 and gives each match 1/4 weight. Real WebShop also checks product type and fuzzy matches. This is neither a full evaluator nor a SEED / OpenEVO measured result; actual success must follow the evaluation record.')}{' '}
        <a href="https://github.com/princeton-nlp/WebShop/blob/master/web_agent_site/engine/goal.py" target="_blank" rel="noreferrer">
          <ExternalBrandMark href="https://github.com/princeton-nlp/WebShop/blob/master/web_agent_site/engine/goal.py" />
          {t('官方评分代码 ↗', 'Official reward code ↗')}
        </a>
      </p>
    </section>
  );
}
