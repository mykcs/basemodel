import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import {
  ADVISOR_QUESTIONS, ADVISOR_Q03_CUSTOM_PANEL,
  ADVISOR_Q04_CAPACITY, ADVISOR_Q05_FROZEN, ADVISOR_Q09_UPDATES,
  ADVISOR_RESEARCH_AS_OF,
} from '../data/openEvoAdvisorTenQuestions';
import { OPEN_EVO_ADVISOR_MEETING } from '../data/openEvoAdvisorMeeting';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';

const read = (path:string) => readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const prefix='src/pages/research/seed-openevo/study/';
const methods=read(prefix+'openevo-methods/index.astro');
const questions=read(prefix+'advisor-questions/index.astro');
const responses=read(prefix+'parameter-memory-results/index.astro');
const methodComponent=read('src/components/research/AdvisorTenMethodExplainer.astro');
const navigation=read('src/components/research/OpenEvoArticleNavigation.astro');

describe('OpenEVO blog roles: method, ten questions, response experiments', () => {
  it('preserves original meeting and all ten research questions without rewriting raw evidence',()=>{
    expect(OPEN_EVO_ADVISOR_MEETING.points).toHaveLength(6);
    expect(OPEN_EVO_ADVISOR_MEETING.date).toBe('2026-09-22');
    expect(OPEN_EVO_ADVISOR_MEETING.rawHref).toBe('https://github.com/mykcs/openevo-experiment/blob/85ee773d04f9949db369c8dd928dbbae12c68c8d/docs/evidence/advisor/liaochang/2026-09-22-meeting-transcript.raw.md');
    expect(OPEN_EVO_ADVISOR_MEETING.reconciliationHref).toContain('ADVISOR_RESEARCH_RECONCILIATION_2026-09-28.md');
    expect(ADVISOR_QUESTIONS).toHaveLength(10);
    expect(ADVISOR_QUESTIONS.map(q=>q.id)).toEqual(Array.from({length:10},(_,i)=>'q'+String(i+1).padStart(2,'0')));
    for(const q of ADVISOR_QUESTIONS) {
      for(const k of ['opening','experiment','finding','interpretation','unknown'] as const)
        expect(q[k].length).toBeGreaterThan(12);
      expect(q.evidence.length).toBeGreaterThanOrEqual(1);
      for(const e of q.evidence) expect(e.href).toMatch(/^https:\/\/github\.com\/mykcs\//);
    }
    expect(ADVISOR_QUESTIONS[9]?.unknown).toContain('会后');
    expect(ADVISOR_RESEARCH_AS_OF).toBe('2026-10-09');
  });
  it('names the actual meeting before Q-numbering and links RAW at first mention',()=>{
    const intro = responses.match(/<p class="evo-article__lede" data-reader-purpose>([\s\S]*?)<\/p>/)?.[1] ?? '';
    expect(intro).toContain('2026 年 9 月 22 日，我们和学长开了一次 OpenEVO 研究讨论会');
    expect(intro).toContain('href={OPEN_EVO_ADVISOR_MEETING.rawHref}');
    expect(intro).toContain('会议原始逐字记录（RAW）');
    expect(responses).not.toContain('9 月 22 日会议的逐字记录见本文开头。');
    expect(intro.indexOf('会议原始逐字记录')).toBeLessThan(intro.indexOf('Q01–Q09'));
    expect(intro).toContain('Q10');
    expect(intro).toContain('不是学长当时逐字提出的十句话');
    expect(questions).toContain('href={OPEN_EVO_ADVISOR_MEETING.rawHref}');
    expect(questions).toContain('href={OPEN_EVO_ADVISOR_MEETING.reconciliationHref}');
    expect(questions).toContain('后续分析（非 RAW）');
    expect(questions).not.toContain('OPEN_EVO_ADVISOR_MEETING.sourceHref');
    const index=read('src/components/research/OpenEvoExperimentIndex.astro');
    expect(index).toContain('OPEN_EVO_ADVISOR_MEETING.rawHref');
    expect(index).toContain('OPEN_EVO_ADVISOR_MEETING.reconciliationHref');
    expect(index).not.toContain('OPEN_EVO_ADVISOR_MEETING.sourceHref');
  });
  it('uses the exact owner-requested reading order: methods, questions, our responses',()=>{
    const paths=['openevo-methods/','advisor-questions/','parameter-memory-results/'];
    const positions=paths.map(p=>navigation.indexOf("path:'/research/seed-openevo/study/"+p));
    expect(positions.every(x=>x>=0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a,b)=>a-b));
    expect(navigation).toContain('学长十问：问题与背景');
    expect(navigation).toContain('我们的回应实验');
    for(const [id,route] of [
      ['study-openevo-methods','openevo-methods'],
      ['study-advisor-ten','advisor-questions'],
      ['study-parameter-memory-results','parameter-memory-results']
    ]) {
      const c=SITE_READER_CONTRACTS.find(x=>x.id===id);
      expect(c?.sourceRoute).toBe('/research/seed-openevo/study/'+route+'/');
      expect(c?.firstViewportSelector).toBe('.evo-article__lede');
    }
  });
  it('leaves detailed mathematical mechanisms in article one',()=>{
    expect(methods).toContain('BUNDLE');
    expect(methods).toContain('<AdvisorTenMethodExplainer />');
    expect(methods).toContain('Delta Rule');
    expect(methods).toContain('Gated Delta');
    expect(methodComponent).toContain('data-rank8-disclosure');
    expect(methodComponent).toContain('rank4');
    expect(methodComponent).toContain('rank128');
    expect(methodComponent).not.toContain("name: '按学习信号调节写入（Gated Delta）'");
  });
  it('protects article two as questions only; no findings, scores or experimental charts',()=>{
    expect(questions).toContain('data-question-only');
    expect(questions).toContain('OPEN_EVO_ADVISOR_MEETING.points.map');
    expect(questions).toContain('data-research-question={q.id}');
    expect(questions).toContain('q.title');
    expect(questions).toContain('q.opening');
    expect(questions).toContain('responseHref(q.id)');
    expect(questions).toContain('会后新增');
    for(const forbidden of ['q.finding','q.experiment','q.interpretation','q.unknown','AdvisorTenEvidenceVisual','data-report-finding','31.09','20.77','第 156 轮'])
      expect(questions).not.toContain(forbidden);
  });
  it('numbers all response headings as subsections 3.Q1–3.Q10 while preserving canonical q01–q10 anchors',()=>{
    const index=read('src/components/research/OpenEvoQuestionIndex.astro');
    expect(responses).toContain("const responseHeadingNumber = (id: string) => '3.Q'+Number(id.slice(1));");
    expect(responses).toContain('>{responseHeadingNumber(q.id)} {q.title}</a>');
    expect(responses).toContain('headingNumber:responseHeadingNumber(q.id)');
    expect(responses).toContain('<span class="evo-article__qnum">{responseHeadingNumber(q.id)}</span> {q.title}');
    expect(index).toContain('question.headingNumber ?? question.id.toUpperCase()');
    const audit=read('scripts/audit-rendered-human-expression.mjs');
    expect(audit).toContain("relative === 'research/seed-openevo/study/parameter-memory-results/index.html'");
    expect(audit).toContain("match[1] === '3' && responseId");
    expect(audit).toContain('contentForInternalIdAudit = heading.slice(prefix.length)');
    expect(responses).toContain("id={'response-'+q.id}");
    expect(questions).toContain("id={q.id}");
  });
  it('makes article three answer all ten problems with experiment, observations, limits, raw sources',()=>{
    expect(responses).toContain('data-response-experiments');
    expect(responses).toContain('data-experiment-response={q.id}');
    expect(responses).toContain('q.experiment');
    expect(responses).toContain('q.finding');
    expect(responses).toContain('q.interpretation');
    expect(responses).toContain('q.unknown');
    expect(responses).toContain('q.evidence.map');
    expect(responses).toContain("id={'source-'+q.id}");
    expect(responses).toContain('查看第二篇的');
    for(const v of ['31.09','2.02','74.78','56.25','1,024','−3.68','+0.12','10.06'])
      expect(responses).toContain(v);
    expect(ADVISOR_Q03_CUSTOM_PANEL.map(x=>x.score)).toEqual(['3.71','6.43','0.69','6.62']);
    expect(ADVISOR_Q04_CAPACITY.map(x=>x.score)).toEqual(['62.98','61.19']);
    expect(ADVISOR_Q05_FROZEN.map(x=>x.score)).toEqual(['60.72','45.98','20.77']);
    expect(ADVISOR_Q05_FROZEN.map(x=>x.exact)).toEqual(['50 / 128','32 / 128','10 / 128']);
    expect(ADVISOR_Q09_UPDATES.map(x=>x.parametric)).toEqual([159,158,154]);
  });
  it('preserves scientific uncertainty while reassigning article roles',()=>{
    expect(responses).toContain('普通 OpenEVO 是更早的历史前序路线');
    expect(responses).toContain('rank32 的平均 Task Score 低 1.79 分');
    expect(responses).toContain('还没有足够证据确认 rank32');
    expect(responses).toContain('不是同一个测量');
    expect(responses).toContain('独立研究');
    expect(questions).toContain('不能当作学长当时逐字提出的十句话');
  });
  it('keeps evaluation scope, unique booktabs numbers and primary source proximity',()=>{
    const capacity=read('src/components/research/AdvisorTenEvidenceVisual.astro');
    expect(responses).toContain('2 我们做了哪些实验，分别想回答什么？');
    expect(responses).toContain('evo-article__experiment-guide');
    expect(responses).not.toContain('aria-label="研究问题与具体测量对应表"');
    expect(responses).not.toContain('六类证据的评测口径');
    expect(responses).not.toContain('四种测量不能混成一次对照');
    expect(responses).toContain('十个研究问题的证据');
    expect(responses).not.toContain('逐项回答学长十问');
    const allReportTables=responses+capacity+read('src/components/research/OpenEvoSeedWorld4Reproduction.astro');
    for(const label of ['表 1｜','表 2｜','表 3｜','表 4｜','表 5｜','表 6｜','表 7｜'])
      expect(allReportTables.split(label).length-1).toBe(1);
    for(const label of ['补充表 S1｜','补充表 S2｜','补充表 S3｜','补充表 S4｜'])
      expect(allReportTables).toContain(label);
    expect(responses).not.toContain('<AdvisorTenEvidenceVisual variant="q05" />');
    for(const source of ['checkpointEvidence.directFinal','checkpointEvidence.boundedFinal','checkpointEvidence.resourceAnalysis','checkpointEvidence.capacity','checkpointEvidence.direction'])
      expect(responses).toContain('href={'+source+'}');
    expect(responses).not.toContain('原始记录 ↗</a>');
    expect(responses).toContain('研究记录 ↗');
    expect(questions).toContain('问题编目源码');
    const kBlock=responses.split('aria-label="R159 重复八次的 Success at k"')[1]?.split('</table>')[0] ?? '';
    expect(kBlock).toContain('scope="row">1 次');
    expect(kBlock).toContain('scope="row">8 次');
  });
  it('uses 33 real Q01 curve points, preserves the science CSV bytes, and exposes second-article question bodies',()=>{
    const visual=read('src/components/research/AdvisorTenEvidenceVisual.astro');
    const csv=read('src/data/research-evidence/advisor-q01-three-way-curve.csv');
    const blobHash=createHash('sha1').update('blob '+Buffer.byteLength(csv)+String.fromCharCode(0)+csv).digest('hex');
    expect(blobHash).toBe('7d9fb607879848acd66c1c998015c6ccc251cfbb');
    const rows=csv.trim().split(/\r?\n/).slice(1).map((line)=>line.split(','));
    expect(rows).toHaveLength(33);
    for(const key of ['ordinary_openevo','bounded_state','delta_beta_family'])
      expect(rows.filter(row=>row[0]===key)).toHaveLength(11);
    for(const [key,round,score] of [
      ['ordinary_openevo',120,60.40192663239539],
      ['ordinary_openevo',160,60.10876059704184],
      ['bounded_state',150,67.24696744227994],
      ['delta_beta_family',130,58.16392158189033],
      ['delta_beta_family',160,45.23648877164502],
    ] as const){
      const row=rows.find(r=>r[0]===key && Number(r[2])===round);
      expect(Number(row?.[4])*100).toBeCloseTo(score,7);
    }
    expect(ADVISOR_QUESTIONS[0]?.title).toBe('训练 160 轮会不会太多了？');
    expect(ADVISOR_QUESTIONS[0]?.experiment).not.toContain('而不是拿最后的训练损失当答案');
    expect(visual).toContain('data-evidence-shape="measured-score-curves"');
    expect(visual).not.toContain('data-evidence-shape="platform-position"');
    expect(visual).toContain('q01Series.map');
    expect(visual).toContain('11 个保存点的原始 CSV');
    expect(responses).toContain('第二篇的 {q.id.toUpperCase()} 问题正文与背景');
    expect(responses).toContain('data-question-origin-link={q.id}');
    expect(responses).toContain('Q10');
    expect(responses).toContain('原始逐字');
  });
  it('keeps each advisor heading within the scientific question actually tested',()=>{
    const visual=read('src/components/research/AdvisorTenEvidenceVisual.astro');
    const intended: Record<string,string> = {
      q01: '训练 160 轮会不会太多了？',
      q02: '开始逐轮学习之前，怎样训练出一个更好的初始模型？',
      q03: '我们的 SEED 实验成绩，能直接和论文比较吗？',
      q04: '把长期参数容量从 rank128 缩到 rank32，做题成绩会怎样？',
      q05: '增加参数写入控制后，模型做题成绩有什么变化？',
      q06: '模型选择商品时有多拿不准？',
      q07: '把某轮参数更新的方向反过来，成绩会怎样？',
      q08: '训练很多轮后，模型还会做以前学过的购物题吗？',
      q09: '改变模型收到的文字经验提示，会影响做题吗？',
      q10: '换一批真正新的任务，这些判断还能成立吗？',
    };
    for(const [id,title] of Object.entries(intended))
      expect(ADVISOR_QUESTIONS.find(q=>q.id===id)?.title).toBe(title);
    const q02=ADVISOR_QUESTIONS.find(q=>q.id==='q02')!;
    const q03=ADVISOR_QUESTIONS.find(q=>q.id==='q03')!;
    const q05=ADVISOR_QUESTIONS.find(q=>q.id==='q05')!;
    const q09=ADVISOR_QUESTIONS.find(q=>q.id==='q09')!;
    expect(q02.opening).toContain('逐轮学习');
    expect(q02.experiment).toContain('第一阶段怎样训练初始模型');
    expect(q02.finding).toContain('36.01/100');
    expect(q02.finding).toContain('34.96/100');
    expect(q02.unknown).toContain('长期逐轮学习');
    expect(q03.opening).toContain('64 道购物题');
    expect(q03.opening).toContain('87 分');
    expect(q03.interpretation).toContain('不能直接判断方法优劣');
    expect(q03.unknown).toContain('正式 Stage2 为 0/160');
    expect(q05.finding).toContain('20.77');
    expect(q05.unknown).toContain('新的简单 β');
    expect(q09.evidenceState).toBe('partial');
    expect(q09.experiment).toContain('保持三个载体的使用权限');
    expect(q09.finding).toContain('三个平均得分差的 95% 区间均包含零');
    expect(q09.unknown).toContain('完整消融还没有完成');
    expect(q09.evidence.some(x=>x.href.includes('q17-checkpoint-diagnostics-20261015.json'))).toBe(true);
    expect(ADVISOR_QUESTIONS[9]?.evidenceState).toBe('unrun');
    for(const phrase of ['实用平台','普通 SFT 和 OPSD 能替代持续学习吗','为什么我们的 SEED 分数只有','Text Memory、Skill、Agent System 真的有用吗'])
      expect(JSON.stringify(ADVISOR_QUESTIONS)+visual).not.toContain(phrase);
    expect(visual).toContain('原始英文收据把它称作 practical plateau');
    expect(visual).toContain('平均分都没有比它高出超过 2 分');
    expect(visual).toContain('历史 β/GDR 在第 130 轮后成绩下降');
    expect(responses).toContain('这样的固定题在研究中叫“开发题”');
    expect(responses).toContain('同题比较');
    expect(responses).toContain('逐轮学习开始前，初始模型怎么训练？');
    expect(responses).toContain('历史 SEED 实验能直接与论文比较吗？');
    expect(responses).toContain('训练后压缩');
    expect(responses).toContain('已测结果：');
    expect(questions).toContain('SFT 和 OPSD 怎样训练初始模型');
    expect(questions).toContain('Q10 是会后另行增加的独立复现问题');
    expect(questions).not.toContain('themes[q.family]');
    expect(questions).toContain('会后新增的独立复现问题');
    expect(questions).toContain('OPEN_EVO_ADVISOR_MEETING.points.map');
    expect(responses).toContain('会议原始逐字记录（RAW）');
  });
  it('keeps the checkpoint addendum separate from historical conclusions',()=>{
    expect(responses).toContain('data-checkpoint-evidence');
    for(const v of ['60.1088/100','18/64','53/64','31/64','6/64','33/64','4/32、3/32、1/32','186','1,014','0/13','39/78','38/78','PARTIAL','2026-10-14'])
      expect(responses).toContain(v);
    expect(responses).toContain('不是留出的新任务');
    expect(responses).toContain('没有运行压缩版的 WebShop Task Score');
    expect(responses).toContain('1bc2f7f6');
    expect(responses).toContain('18032c5c');
    expect(responses).toContain('data-q17-diagnostics');
    expect(responses).toContain('78 项处置闭合不等于 78 项数值全部测得');
    expect(responses).toContain('没有测得紧凑部署的加速或显存节省');
    expect(responses).toContain('完整关闭三种载体权限的消融仍未完成');
    expect(responses).toContain('独立单位是 12 或 8 道题');
    expect(questions).not.toContain('60.1088');
    expect(methods).not.toContain('39/78');
  });
  it('publishes complete Oct 16 Q03 engineering diagnostics without claiming formal results',()=>{
    const q03=read('src/components/research/OpenEvoSeedWorld4Reproduction.astro');
    const item=ADVISOR_QUESTIONS.find(q=>q.id==='q03');
    expect(item?.unknown).toContain('正式 Stage2 为 0/160');
    expect(item?.evidence.some(e=>e.href.includes('c930744044c4e648f5daf54514a23f2d188c268e'))).toBe(true);
    expect(questions).toContain('查看公开 SEED 复现的工程测量与限制');
    expect(questions).not.toContain('384 / 512');
    expect(questions).not.toContain('20.4 GiB');
    expect(responses).toContain('<OpenEvoSeedWorld4Reproduction />');
    expect(responses).toContain('2026-10-15');
    expect(responses).toContain('三组工程模型共完成 1,536 次冻结开发题评测');
    expect(responses).toContain('于 <time datetime="2026-10-16">2026-10-16</time> 00:45');
    expect(responses).not.toContain('17:43（新加坡时间）');
    expect(q03).toContain('data-evidence-as-of="2026-10-16"');
    expect(q03).toContain('data-seed-eight-progress');
    for(const v of ['1,440 条','1,200 条','296 秒和 309 秒','20.4 GiB','1,536 次','512 / 512','4.07','3.97','4.28','1 / 512','3 / 512','28.66 GB','5/7','正式 Stage2 为 0/160 轮','95% 区间都跨过零'])
      expect(q03).toContain(v);
    expect(item?.evidence.some(e=>e.href.includes('31693e914487c9f210f93e3b4019037f9d5f0e06'))).toBe(true);
    for(const outdated of ['128 / 512','384 / 512','192 / 512','40.45 GB','4/7'])
      expect(q03).not.toContain(outdated);
    expect(q03).toContain('工程 SFT 第三轮尚未完成，正式数据上的 SFT 尚未启动');
    expect(q03).toContain('十月十四日两次四卡实测');
    expect(q03).toContain('完整八卡保存、加载、继续取新题并更新仍未验收');
    expect(q03).not.toContain('接下来验证六卡方案');
  });
  it('keeps newer Q17 experiment identities and uncertainties alongside their original advisor questions',()=>{
    for(const id of ['q04','q07','q08','q09']) expect(responses).toContain('data-q17-inline="'+id+'"');
    for(const id of ['q04-posthoc','q07-zero-latest','q08-old-queue','q09-context','rank32-paired']) expect(responses).toContain('id="'+id+'"');
    for(const v of ['estimate:-0.87,low:-3.91,high:1.65','estimate:-0.85,low:-2.17,high:0','estimate:-9.38,low:-23.96,high:4.17','estimate:-26.60,low:-37.41,high:-15.64','estimate:-1.79,low:-3.68,high:0.12']) expect(responses).toContain(v);
    expect(responses).toContain('不是同一模型、同一干预');
    expect(responses).toContain('训练后压缩');
    expect(responses).toContain('640 是全部新旧队列');
    expect(responses).toContain('完整关闭载体权限的因果消融仍未完成');
    const plot=read('src/components/research/PaperIntervalPlot.astro');
    expect(plot).toContain('data-paper-effect={id}');
    expect(plot).toContain('e.low > e.estimate');
    expect(plot).toContain('paper-effect__zero');
    expect(plot).toContain('95% 置信区间');
    expect(plot).not.toContain('setTimeout');
    expect(read('src/styles/openevo-seed-world4-repro.css')).not.toContain('tbody { display: block; }');
  });
  it('reuses subdued-green paper typography only on the three blog pages',()=>{
    const css=read('src/styles/openevo-research-blogs.css');
    expect(css).toContain(':has(.evo-blog)');
    expect(css).toContain('#f6f7f5');
    expect(css).toContain('--paper:#fff');
    expect(css).toContain('font-size:17px');
    expect(css).toContain('font-size:16.5px');
    for(const page of [methods,questions,responses]){
      expect(page).toContain('OpenEvoArticleNavigation');
      expect(page).toContain('openevo-research-blogs.css');
      expect(page).toContain('evo-article__toc');
      expect(page).toContain('evo-article__sources');
    }
    expect(read('src/styles/tokens.css')).toContain('--color-bg: #f7f3eb;');
  });
});
