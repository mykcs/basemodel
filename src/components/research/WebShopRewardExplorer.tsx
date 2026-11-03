import { useEffect, useState } from 'react';
import type { Locale } from '../../i18n';
import ExternalBrandMark from '../common/ExternalBrandMark';
import {
  exampleProducts,
  inspectExamplePurchase,
  initialExamplePurchase,
  type ExampleProductId,
  type ExamplePurchase,
  type ExampleSize,
} from '../../lib/webshopRewardExample';
import '../../styles/components/webshop-reward-explorer.css';

type Props = { locale: Locale };
const allSizes: readonly ExampleSize[] = ['8', '9', '10'];

export default function WebShopRewardExplorer({ locale }: Props) {
  const t = (cn: string, en: string) => locale === 'zh' ? cn : en;
  const [purchase, setPurchase] = useState<ExamplePurchase>(initialExamplePurchase);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);
  const product = exampleProducts[purchase.productId];
  const inspection = inspectExamplePurchase(purchase);
  const missingDesiredSize = !product.sizes.includes('9');

  const chooseProduct = (raw: string) => {
    if (!(raw in exampleProducts)) return;
    const productId = raw as ExampleProductId;
    const firstAvailableSize = exampleProducts[productId].sizes[0];
    if (!firstAvailableSize) return;
    // A different product has a different option list: reset dependent size
    // and invalidate the previous terminal result.
    setPurchase({ productId, size: firstAvailableSize, purchased: false });
  };

  const chooseSize = (raw: string) => {
    if (!product.sizes.includes(raw as ExampleSize)) return;
    setPurchase((previous) => ({
      ...previous, size: raw as ExampleSize, purchased: false,
    }));
  };

  return (
    <section className="webshop-reward-explorer" data-webshop-reward-explorer aria-labelledby="webshop-reward-explorer-title">
      <header className="wre-header">
        <span className="wre-kicker">{t('有因果约束的购物示例', 'PURCHASE-DEPENDENT EXAMPLE')}</span>
        <h3 id="webshop-reward-explorer-title">
          {t('选错商品，后面可能没有正确尺码', 'The wrong product may not offer the required size')}
        </h3>
        <p>{t(
          '购物目标：买一双防水、透气、9 码的跑鞋，价格不超过 60 美元。商品决定它有哪些属性、价格和可选尺码；只有完成购买后，才根据最终结果评分。',
          'Goal: buy waterproof, breathable running shoes in size 9 for at most $60. The product determines its attributes, price and available sizes; only the final purchase is scored.'
        )}</p>
      </header>

      <div className="wre-grid">
        <div className="wre-choices">
          <label htmlFor="wre-product">{t('① 选择商品', '① Select a product')}</label>
          <select id="wre-product" value={purchase.productId} disabled={!interactive}
            onChange={(event) => chooseProduct(event.currentTarget.value)}>
            {Object.values(exampleProducts).map((candidate) => (
              <option value={candidate.id} key={candidate.id}>
                {t(candidate.zh, candidate.en)} · ${candidate.price}
              </option>
            ))}
          </select>

          <dl className="wre-product-facts" data-testid="webshop-product-facts">
            <div><dt>{t('实际属性', 'Attributes')}</dt><dd>
              {t(
                [product.waterproof ? '防水' : '不防水', product.breathable ? '透气' : '不透气'].join(' · '),
                [product.waterproof ? 'waterproof' : 'not waterproof', product.breathable ? 'breathable' : 'not breathable'].join(' · ')
              )}
            </dd></div>
            <div><dt>{t('标价', 'Price')}</dt><dd>${product.price}</dd></div>
            <div><dt>{t('提供尺码', 'Sizes')}</dt><dd>{product.sizes.join(' / ')}</dd></div>
          </dl>

          <label htmlFor="wre-size">{t('② 选择这款商品提供的尺码', '② Choose an available size')}</label>
          <select id="wre-size" value={purchase.size} disabled={!interactive}
            onChange={(event) => chooseSize(event.currentTarget.value)}>
            {allSizes.map((size) => {
              const available = product.sizes.includes(size);
              return (
                <option value={size} key={size} disabled={!available}>
                  {t('尺码 ', 'Size ')}{size}{available ? '' : t('（不提供）', ' (unavailable)')}
                </option>
              );
            })}
          </select>

          <p className="wre-dependency" data-testid="webshop-dependency">
            {missingDesiredSize
              ? t('这款跑鞋没有 9 码。即使最后完成购买，也不能让它凭空出现 9 码；要满足目标，必须返回重新选择商品。',
                  'This shoe has no size 9. Buying cannot create a missing option; you need to go back and choose another product.')
              : purchase.size !== '9'
                ? t('这款有 9 码，但目前选的是 8 码。购买前改成 9 码，才可能满足全部要求。',
                    'Size 9 is available, but size 8 is selected. Change it before purchase to satisfy the size requirement.')
                : product.price > 60
                  ? t('尺码正确，但这款售价超出 60 美元预算；仅仅完成购买不能解决价格问题。',
                      'The size matches, but the price exceeds $60; completing the purchase cannot fix the price.')
                  : t('这款商品有正确尺码且在预算内。购买后再核对全部条件。',
                      'The size is available and the price is within budget. Purchase to inspect all final requirements.')}
          </p>
          <div className="wre-actions">
            <button type="button" disabled={!interactive || purchase.purchased}
              onClick={() => setPurchase((previous) => ({ ...previous, purchased: true }))}>
              {t('③ 完成购买并评分', '③ Purchase and score')}
            </button>
            <button type="button" disabled={!interactive}
              onClick={() => setPurchase(initialExamplePurchase)}>
              {t('恢复初始案例', 'Reset example')}
            </button>
          </div>
          {!interactive && <p className="wre-hint">
            {t('当前是已购买的静态案例；启用 JavaScript 后可以更换商品、尺码并重新购买。',
              'This static purchased example remains readable without JavaScript; enable it to try other choices.')}
          </p>}
        </div>

        <div className="wre-result" aria-live="polite" aria-atomic="true">
          <p className="wre-label">{t('完成购买后的 Task Score', 'Task Score after purchase')}</p>
          <div className="wre-number">
            <output data-testid="webshop-reward-score" aria-label={t('终局任务得分', 'Terminal task score')}>
              {inspection.score === null ? '—' : inspection.score.toFixed(2)}
            </output>
            <span>{t('满分 1.00', 'out of 1.00')}</span>
          </div>
          {inspection.status === 'scored' && inspection.matched !== null && inspection.score !== null
            ? <>
              <div className="wre-meter" role="meter" aria-label={t('任务分数', 'Task score')}
                aria-valuemin={0} aria-valuemax={1} aria-valuenow={inspection.score}
                aria-valuetext={inspection.score.toFixed(2)}>
                <span style={{ width: inspection.score * 100 + '%' }} />
              </div>
              <p className="wre-subscore">{t(
                '最终满足 ' + inspection.matched + ' / 4 项要求',
                inspection.matched + ' of 4 final requirements met'
              )}</p>
            </>
            : <p className="wre-subscore">{t(
              '尚未完成这次购买，因此没有终局分数。这里的“—”不是 0 分。',
              'No terminal reward until this purchase is complete. The dash means unscored, not zero.'
            )}</p>}
          <p className="wre-success" data-testid="webshop-exact-success" data-complete={inspection.exact === true}>
            <strong>{inspection.status !== 'scored'
              ? t('完整成功：尚未评分', 'Exact success: not scored')
              : t('完整成功：' + (inspection.exact ? '是' : '否'),
                  'Exact success: ' + (inspection.exact ? 'yes' : 'no'))}</strong>
          </p>
          {inspection.status === 'scored' && inspection.checks && (
            <div className="wre-breakdown">
              <p>{t('评分依据：最终买到了什么', 'Why this result was scored')}</p>
              <ul>
                <li>{inspection.checks.waterproof ? '✓' : '✕'} {t('防水', 'Waterproof')}</li>
                <li>{inspection.checks.breathable ? '✓' : '✕'} {t('透气', 'Breathable')}</li>
                <li>{inspection.checks.size ? '✓' : '✕'} {t('9 码', 'Size 9')}</li>
                <li>{inspection.checks.price ? '✓' : '✕'} {t('不超过 $60', 'Price at most $60')}</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <p className="wre-meaning">
        <strong>{t('分数和行动的关系：', 'What these points mean: ')}</strong>
        {t(
          '评分检查的是购买后的四项要求，不是搜索、点击、选尺码、购买各赚 0.25 分。换商品会同时改变属性、价格和能选的尺码，因此四个结果不能随意独立勾选。',
          'The four units are terminal goal conditions, NOT 0.25 points for search, click, size selection and purchase. Changing the product changes attributes, price and available sizes together.'
        )}
      </p>
      <p className="wre-caveat">
        <strong>{t('示例边界：', 'Example boundary: ')}</strong>
        {t(
          '三款跑鞋均是虚构案例，统一假定商品类型匹配系数 r_type = 1，且四项匹配已被正确识别。这里的 0.25 是这种特定题设下的分母权重。官方评分器还有商品类型的乘数、模糊属性与选项匹配；现实任务各项要求数量也会变化。这个示例不运行真正的 WebShop，也不是 SEED / OpenEVO 实测结果。',
          'These three shoes are fictional, with product-type factor r_type = 1 and already-determined match decisions. The 0.25 is only the denominator weight for this specific goal. The official scorer also applies a product-type multiplier and fuzzy attribute/option matching, and the number of requirements can vary. This is not a running WebShop environment or a SEED / OpenEVO result.'
        )}{' '}
        <a href="https://github.com/princeton-nlp/WebShop/blob/master/web_agent_site/engine/goal.py"
          target="_blank" rel="noreferrer">
          <ExternalBrandMark href="https://github.com/princeton-nlp/WebShop/blob/master/web_agent_site/engine/goal.py" />
          {t('官方 get_reward 源码 ↗', 'Official get_reward source ↗')}
        </a>
      </p>
    </section>
  );
}
