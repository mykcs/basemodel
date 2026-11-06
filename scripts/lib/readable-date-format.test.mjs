import assert from 'node:assert/strict';
import test from 'node:test';
import {humanDateText,rewriteVisibleHtmlDates} from './readable-date-format.mjs';
import {humanYearMonth} from '../../src/lib/readableDate.js';

test('human dates are consistent in Chinese and English',()=>{
  assert.equal(humanDateText('十月十四日'),'10 月 14 日');
  assert.equal(humanDateText('十一月二十五日'),'11 月 25 日');
  assert.equal(humanDateText('2026年10月14日'),'2026 年 10 月 14 日');
  assert.equal(humanDateText('2026 年 10 月 14 日'),'2026 年 10 月 14 日');
  assert.equal(humanDateText('10月14日'),'10 月 14 日');
  assert.equal(humanDateText('10 月14 日'),'10 月 14 日');
  assert.equal(humanDateText('2026-10-14'),'2026 年 10 月 14 日');
  assert.equal(humanDateText('2026-10-14','en'),'Oct 14, 2026');
  assert.equal(humanDateText('十月十四日','en'),'Oct 14');
  assert.equal(humanYearMonth('2026-10'),'2026 年 10 月');
  assert.equal(humanYearMonth('2026-10','en'),'Oct 2026');
  assert.equal(humanYearMonth('2026-13'),'2026-13');
});
test('invalid dates, IDs, sources and timestamps remain unchanged',()=>{
  for(const s of ['2026-02-30','2026-10-14.json','Q17_2026-10-14','run-2026-10-14','2026-10-14T11:30:00Z','2026-10-14/metrics','36/64']){
    assert.equal(humanDateText(s),s);
  }
});
test('raw markup, machine dates and code stay intact',()=>{
  const src='<html lang="zh"><body><p>十月十四日，记录于 2026-10-14。</p><time datetime="2026-10-14">2026-10-14</time><code>2026-10-14</code><pre>十月十四日</pre><a href="/records/2026-10-14.json">2026-10-14 讨论</a><script type="application/json">{"day":"2026-10-14"}</script><style>.x{content:"10月14日"}</style></body></html>';
  const next=rewriteVisibleHtmlDates(src).html;
  assert.match(next,/10 月 14 日，记录于 2026 年 10 月 14 日/);
  assert.match(next,/<time datetime="2026-10-14">2026 年 10 月 14 日<\/time>/);
  assert.match(next,/<code>2026-10-14<\/code>/);
  assert.match(next,/<pre>十月十四日<\/pre>/);
  assert.match(next,/href="\/records\/2026-10-14.json"/);
  assert.match(next,/<script type="application\/json">\{"day":"2026-10-14"\}<\/script>/);
  assert.match(next,/<style>\.x\{content:"10月14日"\}<\/style>/);
  assert.equal(rewriteVisibleHtmlDates(next).html,next);
});
test('English route gets English dates without changing attributes',()=>{
  const src='<html lang="en"><body><p>Saved 2026-10-14.</p><time datetime="2026-10-14">2026-10-14</time></body></html>';
  const result=rewriteVisibleHtmlDates(src);
  assert.match(result.html,/Saved Oct 14, 2026/);
  assert.match(result.html,/<time datetime="2026-10-14">Oct 14, 2026<\/time>/);
});
