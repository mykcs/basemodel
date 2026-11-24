import assert from 'node:assert/strict';
import test from 'node:test';
import {humanDateText,rewriteVisibleHtmlDates} from './readable-date-format.mjs';
import {humanYearMonth,humanFreshnessText} from '../../src/lib/readableDate.js';

test('human dates are consistent in Chinese and English',()=>{
  assert.equal(humanDateText('十月十四日'),'10 月 14 日');
  assert.equal(humanDateText('十一月二十五日'),'11 月 25 日');
  assert.equal(humanDateText('2026年10月14日'),'2026 年 10 月 14 日');
  assert.equal(humanDateText('2026 年 10 月 14 日'),'2026 年 10 月 14 日');
  assert.equal(humanDateText('10月14日'),'10 月 14 日');
  assert.equal(humanDateText('10 月14 日'),'10 月 14 日');
  assert.equal(humanDateText('2026-10-14'),'2026 年 10 月 14 日');
  assert.equal(humanDateText('2026-10-14','en'),'2026-10-14');
  assert.equal(humanDateText('十月十四日','en'),'10-14');
  assert.equal(humanYearMonth('2026-10'),'2026 年 10 月');
  assert.equal(humanYearMonth('2026-10','en'),'2026-10');
  assert.equal(humanYearMonth('2026-13'),'2026-13');
});
test('invalid dates, IDs, sources and timestamps remain unchanged',()=>{
  for(const s of ['2026-02-30','2026-10-14.json','Q17_2026-10-14','run-2026-10-14','2026-10-14T11:30:00Z','2026-10-14/metrics','36/64','2026-10.csv','run-2026-10','2026-10/metrics','Feb 30, 2026','30 February 2026','2026年2月30日','Oct 14, 2026.json','14 October 2026.csv','October 2026.csv']){
    for(const lang of ['zh','en'])assert.equal(humanDateText(s,lang),s);
  }
});
test('named dates, precision and timezone labels use the shared calendar rule',()=>{
  for(const input of ['Oct 14, 2026','October 14th, 2026','14 October 2026','14th Oct. 2026']){
    assert.equal(humanDateText(input),'2026 年 10 月 14 日');
    assert.equal(humanDateText(input,'en'),'2026-10-14');
  }
  for(const input of ['2026-10','2026年10月','October 2026']){
    assert.equal(humanDateText(input),'2026 年 10 月');
    assert.equal(humanDateText(input,'en'),'2026-10');
  }
  assert.equal(humanDateText('2026'),'2026');
  assert.equal(humanDateText('Feb 29, 2024','en'),'2024-02-29');
  assert.equal(humanDateText('Feb 29, 2026','en'),'Feb 29, 2026');
  for(const zone of ['UTC','SGT','PT']){
    assert.equal(humanDateText('2026-10-14 23:30 '+zone),'2026 年 10 月 14 日 23:30 '+zone);
    assert.equal(humanDateText('October 14, 2026 23:30 '+zone,'en'),'2026-10-14 23:30 '+zone);
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
test('English routes normalize existing prose year-first without changing attributes',()=>{
  const src='<html lang="en"><body><p>Saved October 14, 2026.</p><time datetime="2026-10-14">2026-10-14</time><p>October 2026</p></body></html>';
  const result=rewriteVisibleHtmlDates(src);
  assert.match(result.html,/Saved 2026-10-14/);
  assert.match(result.html,/<time datetime="2026-10-14">2026-10-14<\/time>/);
  assert.match(result.html,/<p>2026-10<\/p>/);
  assert.equal(rewriteVisibleHtmlDates(result.html).html,result.html);
});

test('freshness distinguishes exact instants and recorded scientific date precision',()=>{
 assert.match(humanFreshnessText('2026-11-24T16:49:54Z'),/PT 2026年11月24日 08:49:54.*SGT 2026年11月25日 00:49:54/);
 assert.match(humanFreshnessText('2026-06-07T01:30:42Z','en'),/PT 2026-06-06 18:30:42.*UTC-7.*SGT 2026-06-07 09:30:42/);
 assert.equal(humanFreshnessText('2026-08-28','en'),'2026-08-28 (second-precision time not recorded)');
 assert.match(humanFreshnessText('2026-08-31 20:34 JST'),/20:34 JST.*秒级时间未记录/);
 assert.equal(humanFreshnessText(undefined),'时间未确认（秒级）');
});
