import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import {
  ADVISOR_QUESTIONS, ADVISOR_Q03_CUSTOM_PANEL,
  ADVISOR_Q04_CAPACITY, ADVISOR_Q05_FROZEN, ADVISOR_SEED_PAPER_WEBSHOP_REFERENCE, ADVISOR_Q09_UPDATES,
  ADVISOR_RESEARCH_AS_OF,
} from '../data/openEvoAdvisorTenQuestions';
import { OPEN_EVO_ADVISOR_MEETING } from '../data/openEvoAdvisorMeeting';
import { ADVISOR_REVIEWED_COPY } from '../data/openEvoAdvisorReviewedCopy';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';

const read = (path:string) => readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const prefix='src/pages/research/seed-openevo/study/';
const methods=read(prefix+'openevo-methods/index.astro');
const questions=read(prefix+'advisor-questions/index.astro');
const responses=read(prefix+'parameter-memory-results/index.astro');
const intervalData=JSON.parse(read('src/data/advisorConfidenceIntervals.json')) as {figures:{id:string;effects:{estimate:number}[]}[]};
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
      for(const e of q.evidence) expect(e.href).toMatch(q.id==='q10' ? /^https:\/\/(?:github\.com\/mykcs\/|arxiv\.org\/abs\/)/ : /^https:\/\/github\.com\/mykcs\//);
    }
    expect(ADVISOR_QUESTIONS[9]?.experiment).toContain('会后问题');
    expect(ADVISOR_RESEARCH_AS_OF).toBe('2026-10-09');
  });
  it('names the actual meeting before Q-numbering and links RAW at first mention',()=>{
    const intro = responses.match(/<p class="evo-article__lede" data-reader-purpose>([\s\S]*?)<\/p>/)?.[1] ?? '';
    const provenance = responses.match(/<p class="evo-article__note" data-meeting-provenance>([\s\S]*?)<\/p>/)?.[1] ?? '';
    expect(intro).toContain('这里先告诉你：十个研究问题已经测到什么');
    expect(provenance).toContain('2026 年 9 月 22 日，我们和学长开了一次 OpenEVO 研究讨论会');
    expect(provenance).toContain('href={OPEN_EVO_ADVISOR_MEETING.rawHref}');
    expect(provenance).toContain('会议原始逐字记录（RAW）');
    expect(responses).not.toContain('9 月 22 日会议的逐字记录见本文开头。');
    expect(provenance.indexOf('会议原始逐字记录')).toBeLessThan(provenance.indexOf('Q01–Q09'));
    expect(provenance).toContain('Q10');
    expect(provenance).toContain('不是学长当时逐字提出的十句话');
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
  it('keeps Q01–Q10 as quiet reference labels outside natural question headings',()=>{
    const index=read('src/components/research/OpenEvoQuestionIndex.astro');
    const style=read('src/styles/advisor-ten-approved-reader.css');
    expect(responses).toContain("const responseQuestionRef = (id: string) => id.toUpperCase();");
    expect(responses).toContain('>{responseQuestionRef(q.id)} · {q.title}</a>');
    expect(responses).toContain('headingNumber:responseQuestionRef(q.id)');
    expect(responses).toContain('<span class="advisor-approved-question-ref" data-question-number={q.id}>{responseQuestionRef(q.id)}</span>');
    expect(responses).toContain("<h3 id={'response-'+q.id+'-title'}>{q.title}</h3>");
    expect(responses).not.toContain("const responseHeadingNumber =");
    expect(responses).not.toContain("3.Q'+");
    expect(style).toContain('.evo-approved-reader .advisor-approved-question-ref');
    expect(style).toContain('font-variant-numeric: normal;');
    expect(index).toContain('question.headingNumber ?? question.id.toUpperCase()');
    const audit=read('scripts/audit-rendered-human-expression.mjs');
    expect(audit).toContain("relative === 'research/seed-openevo/study/parameter-memory-results/index.html'");
    expect(audit).toContain('HUMAN-EXPRESSION-ADVISOR-LEGACY-NUMBER');
    expect(audit).not.toContain('contentForInternalIdAudit = heading.slice(prefix.length)');
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
    for(const v of ['31.09 小时','2.02 小时','74.78 小时','56.25 小时','1,024','下降 3.68 分到提高 0.12 分','10.06'])
      expect(responses).toContain(v);
    expect(ADVISOR_Q03_CUSTOM_PANEL.map(x=>x.score)).toEqual(['3.71','6.43','0.69','6.62']);
    expect(ADVISOR_Q04_CAPACITY.map(x=>x.score)).toEqual(['62.98','61.19']);
    expect(ADVISOR_Q05_FROZEN.map(x=>x.score)).toEqual(['60.72','45.98','20.77']);
    expect(ADVISOR_Q05_FROZEN.map(x=>x.exact)).toEqual(['50 / 128','32 / 128','10 / 128']);
    expect(ADVISOR_Q09_UPDATES.map(x=>x.parametric)).toEqual([159,158,154]);
  });
  it('adds SEED paper WebShop numbers as a separate-source reference, never a fourth frozen arm',()=>{
    expect(ADVISOR_Q05_FROZEN).toHaveLength(3);
    expect(ADVISOR_Q05_FROZEN.map(x=>x.score)).toEqual(['60.72','45.98','20.77']);
    expect(ADVISOR_Q05_FROZEN.map(x=>x.exact)).toEqual(['50 / 128','32 / 128','10 / 128']);
    expect(ADVISOR_SEED_PAPER_WEBSHOP_REFERENCE).toMatchObject({
      score: '87.1',
      succPercent: '77.3',
      taskCount: 128,
      exactSuccessCount: null,
      paperTable: 'Table 1',
      source: 'https://arxiv.org/html/2607.14777v1',
      pairedWithOurFrozenTasks: false,
    });
    expect(ADVISOR_SEED_PAPER_WEBSHOP_REFERENCE.method).toContain('Qwen3-1.7B-Instruct');
    const relevant=responses.split('data-webshop-seed-paper-comparison')[1]?.split('</table>')[0] ?? '';
    expect(relevant).toContain('data-score-origin="our-frozen-128"');
    expect(relevant).toContain('data-score-origin="paper-reported-128"');
    expect(relevant).toContain('ADVISOR_Q05_FROZEN.map');
    expect(relevant).toContain('ADVISOR_SEED_PAPER_WEBSHOP_REFERENCE.succPercent');
    expect(relevant).toContain('historicalSuccPercent(item.exact)');
    expect(relevant).toContain('—（论文仅报告成功率）');
    expect(responses).toContain('data-seed-paper-evaluation-boundary');
    expect(responses).toContain('不能把这张表直接当作方法公平排名');
    expect(responses).toContain('href={ADVISOR_SEED_PAPER_WEBSHOP_REFERENCE.source}');
    expect(responses).not.toContain('99 / 128');
  });
  it('preserves scientific uncertainty while reassigning article roles',()=>{
    expect(responses).toContain('普通 OpenEVO 是更早的历史前序路线');
    expect(responses).toContain('rank32 的平均 Task Score 低 1.79 分');
    expect(responses).toContain('还没有足够证据确认 rank32');
    expect(responses).toContain('不是同一个测量');
    expect(responses).toContain('独立研究');
    expect(questions).toContain('不能当作学长当时逐字提出的十句话');
  });
  it('protects conversation-reference prose and unframed answer navigation',()=>{
    // Q01 is directly user-requoted; Q02-Q10 are historically discussed reference drafts.
    // Any deliberate editorial change must update this regression with evidence.
    const expected={
      "q01": "6303bdeaae1d0364eaff316dee9597f92a03a244f1de50d2a9610548945ece5f",
      "q02": "285e1a5b4e8ec565bda7e70c62d235b7aadfcf9bd6ea861a5ecdafad729fa65b",
      "q03": "59d081e75d8ce2dcab40a319891e69243b6a5bf5e27e0a389bc59d3a4b7dd03f",
      "q04": "193911af621d09cfe25c328f58adf35856035774425a480e006bb2a173b1a180",
      "q05": "f7160cacf83f72882404c1b38210b2f8dbafc6da6c4e0c8989964984d8bfc569",
      "q06": "362ad9cd6447440270c26dec555d6297cb2f6c976ffe182883e4c0c70ead211b",
      "q07": "78d47d8ee66af198ace9f9d35b71a0898449e4ec3d532dc4163e660f10b4359b",
      "q08": "8ae27f42eee8a2ece6cc169de6e9e1c497f7d582f11beb5a7d9a08a10ce23eb7",
      "q09": "5e93b81c874d0d687e9f08bdf3fbecd327ab033eae3c7a532370de94850941a9",
      "q10": "109a67a40028a82378bd9c75b18780bf7bfee9c880f7dfadffc37daeebea7925"
    } as const;
    for(const [id,hash] of Object.entries(expected)){
      const item=ADVISOR_REVIEWED_COPY[id as keyof typeof ADVISOR_REVIEWED_COPY];
      expect(createHash('sha256').update(item.summary).digest('hex')).toBe(hash);
      expect(item.nextResearch.length).toBeGreaterThan(20);
    }
    expect(ADVISOR_REVIEWED_COPY.q01.provenance).toBe('user-quoted-exact');
    expect(ADVISOR_REVIEWED_COPY.q02.provenance).toBe('chatgpt-discussed-draft');
    expect(read('src/components/research/OpenEvoQuestionIndex.astro')).not.toContain('[data-experiment-response]:target');
    expect(read('src/styles/openevo-research-blogs.css')).not.toContain('.evo-article__next-work{border-left');
  });
  it('keeps evaluation scope, unique booktabs numbers and primary source proximity',()=>{
    const capacity=read('src/components/research/AdvisorTenEvidenceVisual.astro');
    expect(responses).toContain('2 十问速览与后续工作');
    expect(responses).toContain('evo-article__experiment-guide');
    const tlDr=responses.split('data-ten-question-tldr')[1]?.split('</section>')[0] ?? '';
    expect(tlDr).toContain('data-review-source="single"');
    expect(tlDr).toContain('responseQuestions.map(q =>');
    expect(tlDr).toContain('data-review-summary={q.id}');
    for(const field of ['summary','nextResearch']) expect(tlDr).toContain('{q.reviewed.'+field+'}');
    expect(Object.keys(ADVISOR_REVIEWED_COPY)).toEqual(Array.from({length:10},(_,i)=>'q'+String(i+1).padStart(2,'0')));
    expect(ADVISOR_REVIEWED_COPY.q01.summary).toBe('我们比较了普通 OpenEVO、Bounded 和历史 β/GDR 在不同训练轮次的做题成绩。结果发现：普通方法到约 120 次更新后提升不明显，Bounded 到第 150 轮仍有进步，而历史 β/GDR 在后期出现掉分。');
    expect(tlDr).toContain('data-conversation-summary={q.id}');
    expect(tlDr).toContain('data-conversation-next={q.id}');
    expect(responses).not.toContain('data-conversation-detail={q.id}');
    expect(ADVISOR_REVIEWED_COPY.q06.summary).toContain('action-family entropy');
    expect(ADVISOR_REVIEWED_COPY.q06.nextResearch).toContain('token-level entropy');
    expect(ADVISOR_REVIEWED_COPY.q07.summary).toContain('完整、未干预的 Bounded');
    expect(ADVISOR_REVIEWED_COPY.q10.nextResearch).toContain('ALFWorld');
    expect(ADVISOR_REVIEWED_COPY.q02.summary).toContain('SFT 直接学习示范，OPSD 利用额外经验指导模型学习');
    expect(ADVISOR_REVIEWED_COPY.q09.summary).toContain('文字很少改写');
    // The detailed response reuses the same core paragraph without an extra result/finished-work box.
    expect(responses).not.toContain('data-reviewed-completion={q.id}');
    expect(responses).not.toContain('data-reviewed-finding={q.id}');
    expect(responses).toContain('GPU 数量');
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
    // Keep the actual evidence action while removing the rejected ↗ decoration.
    expect(responses).not.toContain('原始记录 ↗</a>');
    expect(responses).toContain('研究记录</a>');
    expect(responses).not.toContain('研究记录 ↗');
    expect(questions).toContain('问题编目源码');
    const kBlock=responses.split('aria-label="R159 重复八次的 Success at k"')[1]?.split('</table>')[0] ?? '';
    expect(kBlock).toContain('scope="row">1 次');
    expect(kBlock).toContain('scope="row">8 次');
  });
  it('explains x-axis unit mismatch, round versus epoch, and same-task reruns without overstating proof',()=>{
    const visual=read('src/components/research/AdvisorTenEvidenceVisual.astro');
    const q01=ADVISOR_QUESTIONS.find(x=>x.id==='q01')!;
    expect(q01.opening).toContain('不是把同一份固定训练集完整遍历一次的 epoch');
    expect(q01.opening).toContain('有些轮次没有真正更新参数');
    expect(visual).toContain('data-q01-axis-scope');
    expect(visual).toContain('横轴数字相同，不代表实际更新次数或计算成本相同');
    expect(visual).toContain('普通 OpenEVO 按实际参数更新次数统计');
    expect(visual).toContain('Bounded 和历史 β/GDR 按已完成的 Stage2 轮数');
    expect(visual).toContain('不应据此进行等成本排名');
    expect(responses).toContain('训练末尾八轮的容量筛选与配对统计');
    expect(responses).toContain('这个比例不包括基础模型权重');
    expect(responses).toContain('rank128 的文件约为 205.6 MB，rank32 的文件约为 51.4 MB');
    expect(responses).toContain('同题换随机设置复测');
    expect(responses).toContain('仍然测试同一批 64 道题');
    expect(responses).not.toContain('独立种子确认');
    expect(responses).toContain('第二组只是更换随机设置');
    expect(responses).toContain('95% 置信区间');
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
    expect(ADVISOR_QUESTIONS[0]?.title).toBe('训练 160 轮会不会太多？');
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
      q01: '训练 160 轮会不会太多？',
      q02: '开始长期学习前，SFT 和 OPSD 哪种方法更好？',
      q03: '我们的 SEED 实验成绩为什么比论文低这么多？',
      q04: '长期参数容量需要 rank128 这么大吗，缩小一点怎么样？',
      q05: 'β 写入控制会让模型学得更好吗？',
      q06: '模型做选择时有多犹豫？能用熵来衡量吗？',
      q07: '参数更新的方向，会影响模型的做题能力吗？',
      q08: 'OpenEVO 训练很多轮以后，会忘记以前学会的任务吗？',
      q09: '模型外部保存的文字经验，究竟有多大作用？',
      q10: '换一批新任务，OpenEVO 的实验结论还成立吗？',
    };
    for(const [id,title] of Object.entries(intended))
      expect(ADVISOR_QUESTIONS.find(q=>q.id===id)?.title).toBe(title);
    const q02=ADVISOR_QUESTIONS.find(q=>q.id==='q02')!;
    const q03=ADVISOR_QUESTIONS.find(q=>q.id==='q03')!;
    const q05=ADVISOR_QUESTIONS.find(q=>q.id==='q05')!;
    const q09=ADVISOR_QUESTIONS.find(q=>q.id==='q09')!;
    expect(q02.opening).toContain('逐轮学习');
    expect(responses).toContain("data-response-background={q.id}");
    expect(responses).toContain("data-supported-answer={q.id}");
    expect(questions).toContain('const researchTargets = {');
    expect(questions).toContain('data-question-research-target={q.id}');
    expect(questions).toContain('data-question-q10-environment');
    expect(questions).toContain('arxiv.org/abs/2607.14777');
    const targets=questions.split('const researchTargets = {')[1]?.split('} as const;')[0] ?? '';
    for(let n=1;n<=10;n++) expect(targets).toContain('q'+String(n).padStart(2,'0')+':');
    expect((targets.match(/\bq\d\d:/g)??[])).toHaveLength(10);
    expect(questions).not.toContain('data-experiment-finding={q.id}');
    expect(questions).not.toContain('data-supported-answer={q.id}');

    expect(responses).toContain('2026-10-19</time> 核对对应训练或评测收据');
    expect(ADVISOR_QUESTIONS[5]?.experiment).toContain('action-family entropy');
    expect(ADVISOR_QUESTIONS[5]?.finding).toContain('NOT_CONFIRMED');
    expect(ADVISOR_QUESTIONS[6]?.finding).toContain('完整、未干预的 Bounded');
    expect(ADVISOR_QUESTIONS[7]?.finding).toContain('960 次');
    expect(ADVISOR_QUESTIONS[9]?.interpretation).toContain('ALFWorld');

    expect(q02.experiment).toContain('两种方法、三组随机设置');
    expect(q02.finding).toContain('36.01 分');
    expect(q02.finding).toContain('34.96 分');
    expect(q02.unknown).toContain('长期逐轮学习');
    expect(q03.opening).toContain('64 道购物题');
    expect(q03.opening).toContain('87 分');
    expect(q03.interpretation).toContain('不能直接判断方法优劣');
    expect(q03.unknown).toContain('计划进行 160 轮的正式 Stage2 尚未启动');
    expect(q05.finding).toContain('20.77');
    expect(q05.unknown).toContain('新的简单 β');
    expect(q09.evidenceState).toBe('partial');
    const q04=ADVISOR_QUESTIONS.find(q=>q.id==='q04')!;
    const q06=ADVISOR_QUESTIONS.find(q=>q.id==='q06')!;
    expect(q02.finding).toContain('15 个模型版本');
    expect(q04.finding).toContain('全部 640 次');
    expect(q05.finding).toContain('512 次评测');
    expect(q06.finding).toContain('NOT_CONFIRMED');
    expect(q09.finding).toContain('40 轮对照的完整科学验收');
    expect(q09.unknown).toContain('完整消融还没有完成');

    expect(q09.experiment).toContain('保留三类载体权限');
    expect(q09.finding).toContain('95% 区间都包含零');
    expect(q09.unknown).toContain('完整消融还没有完成');
    expect(q09.evidence.some(x=>x.href.includes('q17-checkpoint-diagnostics-20261015.json'))).toBe(true);
    expect(ADVISOR_QUESTIONS[9]?.evidenceState).toBe('unrun');
    for(const phrase of ['实用平台','普通 SFT 和 OPSD 能替代持续学习吗','为什么我们的 SEED 分数只有','Text Memory、Skill、Agent System 真的有用吗'])
      expect(JSON.stringify(ADVISOR_QUESTIONS)+visual).not.toContain(phrase);
    expect(visual).toContain('原始英文收据把它称作 practical plateau');
    expect(visual).toContain('平均分都没有比它高出超过 2 分');
    expect(visual).toContain('历史 β/GDR 在第 130 轮后成绩下降');
    expect(ADVISOR_QUESTIONS[0]?.experiment).toContain('64 道');
    expect(responses).toContain('同题比较');
    expect(ADVISOR_QUESTIONS[1]?.title).toBe('开始长期学习前，SFT 和 OPSD 哪种方法更好？');
    expect(ADVISOR_QUESTIONS[2]?.title).toBe('我们的 SEED 实验成绩为什么比论文低这么多？');
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
    expect(responses).toContain('data-q17-ledger-appendix');
    for(const v of ['60.1088 分','18 道完整成功','53 道获得正奖励','31 道至少成功过一次','6 道题','33 道题','K64 压缩状态有','K80 有','K96 有','186','1,014','13 份模型中还没有任何','39 项','38 项','PARTIAL','2026-10-14'])
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
    expect(item?.unknown).toContain('计划进行 160 轮的正式 Stage2 尚未启动');
    expect(item?.evidence.some(e=>e.href.includes('c930744044c4e648f5daf54514a23f2d188c268e'))).toBe(true);
    expect(questions).toContain('查看 {q.id.toUpperCase()} 已完成的实验、结果与未解问题');
    expect(questions).not.toContain('384 / 512');
    expect(questions).not.toContain('20.4 GiB');
    expect(responses).toContain('<OpenEvoSeedWorld4Reproduction />');
    expect(responses).toContain('2026-10-15');
    expect(responses).toContain('三组工程模型共完成 1,536 次冻结开发题评测');
    expect(responses).toContain('于 <time datetime="2026-10-16">2026-10-16</time> 00:45');
    expect(responses).not.toContain('17:43（新加坡时间）');
    expect(q03).toContain('data-evidence-as-of="2026-10-16"');
    expect(q03).toContain('data-seed-eight-progress');
    for(const v of ['1,440 条','1,200 条','296 秒和 309 秒','20.4 GiB','1,536 次','512 次','4.07 分','3.97 分','4.28 分','1 次','3 次','28.66 GB','5 项','正式 Stage2 计划训练 160 轮，目前尚未开始','95% 置信区间均包含零'])
      expect(q03).toContain(v);
    expect(item?.evidence.some(e=>e.href.includes('31693e914487c9f210f93e3b4019037f9d5f0e06'))).toBe(true);
    for(const outdated of ['128 / 512','384 / 512','192 / 512','40.45 GB','4/7'])
      expect(q03).not.toContain(outdated);
    expect(q03).toContain('工程 SFT 第三轮尚未完成，正式数据上的 SFT 尚未启动');
    expect(q03).toContain('10 月 14 日两次四卡实测');
    expect(q03).toContain('<summary>工程细节，你可能感兴趣...</summary>');
    expect(q03).toContain('data-seed-gpu-explainer');
    expect(q03).toContain('负责给这些进程安排任务的工具叫 Ray');
    expect(q03).not.toContain('四个 Ray 训练 worker 的 CPU 时间持续增长');
    expect(q03).toContain('GPU 可能等待');
    expect(q03).not.toContain('大显存条件下的简化路径');
    expect(q03).toContain('完整八卡保存、加载、继续取新题并更新仍未验收');
    expect(q03).not.toContain('接下来验证六卡方案');
  });
  it('keeps newer Q17 experiment identities and uncertainties alongside their original advisor questions',()=>{
    for(const id of ['q04','q07','q08','q09']) expect(responses).toContain('data-q17-inline="'+id+'"');
    for(const id of ['q04-posthoc','q07-zero-latest','q08-old-queue','q09-context','rank32-paired']) expect(responses).toContain('id="'+id+'"');
    for(const id of ['q04-posthoc','q07-zero-latest','q08-old-queue','q09-context','rank32-paired','q07-inversion']) expect(intervalData.figures.find(figure=>figure.id===id)).toBeTruthy();
    const rank32=intervalData.figures.find(figure=>figure.id==='rank32-paired')!.effects[0]!;
    expect(rank32.estimate).toBeCloseTo(-1.790623872655121,12);
    expect(responses).toContain('不是同一模型、同一干预');
    expect(responses).toContain('训练后压缩');
    expect(responses).toContain('640 是全部新旧队列');
    expect(responses).toContain('完整关闭载体权限的因果消融仍未完成');
    const plot=read('src/components/research/PaperIntervalPlot.astro');
    expect(plot).toContain('data-paper-effect={id}');
    expect(plot).toContain('e.low > e.estimate');
    expect(plot).toContain('<PublicationPlot id={id}');
    expect(plot).toContain('publication-plot');
    expect(read('src/components/research/PublicationPlot.astro')).toContain('data-pgfplot={id}');
    expect(plot).toContain('95% 置信区间');
    expect(plot).toContain('paper-effect__comparison');
    expect(plot).toContain('paper-effect__directions');
    expect(plot).toContain('paper-effect__interval');
    expect(plot).toContain('paper-effect__takeaway');
    expect(plot).toContain('border:1px solid var(--research-evidence-frame');
    expect(responses).toContain('压缩后 − 原模型');
    expect(responses).toContain('训练后压缩');
    expect(plot).not.toContain('setTimeout');
    expect(read('src/styles/openevo-seed-world4-repro.css')).not.toContain('tbody { display: block; }');
  });
  it('uses the owner-selected reading treatment while preserving the three article roles',()=>{
    const css=read('src/styles/research-article.css');
    expect(css).toContain(':has(.evo-approved-reader)');
    expect(css).toContain('--paper: #fcfcfb');
    expect(css).toContain('font: 400 14px/1.8');
    expect(css).toContain('min(750.4px, calc(100% - 24px))');
    for(const page of [methods,questions,responses]){
      expect(page).toContain('OpenEvoArticleNavigation');
      expect(page).toContain('openevo-research-blogs.css');
      expect(page).toContain('evo-article__toc');
      expect(page).toContain('evo-article__sources');
    }
    expect(read('src/styles/tokens.css')).toContain('--color-bg: #f7f3eb;');
  });
  it('rejects the owner-identified cold-read failures in the report and keeps a scoped green/yellow/red scientific ledger',()=>{
    // Negative probes: a previously-green page must not pass with these known bad claims.
    const knownBad = [
      '这些历史结果不构成完全受控的三臂试验',
      '在正文就地链接',
      '三条长期路线在同一冻结 128 题上的 Task Score 分别为',
      '第 152–159 轮的 rank32 容量筛选使参数文件缩小约 75%',
    ];
    for(const bad of knownBad) expect(responses).not.toContain(bad);
    for(const repaired of [
      '我们做了三组长期学习实验',
      '固定 state 的 Bounded',
      '这些实验不是完全严格的对照',
      '快结束的第 152–159 轮',
      '不能据此声称整个 160 轮都得到同样结果',
      'href={checkpointEvidence.capacity}',
      'data-research-status={q.progress.tone}',
      'data-next-work={q.id}',
      '工作量粗估：',
    ]) expect(responses).toContain(repaired);
    expect(responses).toContain('responseQuestions.map(q => (');
    const progressSource = responses.split('const researchProgress = {')[1]?.split('} as const;')[0] ?? '';
    const tones=[...progressSource.matchAll(/tone:'(green|yellow|red)'/g)].map(match=>match[1]);
    expect(tones).toHaveLength(10);
    expect(tones.filter(t=>t==='green')).toHaveLength(2);
    expect(tones.filter(t=>t==='yellow')).toHaveLength(6);
    expect(tones.filter(t=>t==='red')).toHaveLength(2);
    for(let n=1;n<=10;n++) expect(progressSource).toContain('q'+String(n).padStart(2,'0')+':');
    expect(progressSource).toContain('GPU 小时');
    const q04=ADVISOR_QUESTIONS.find(q=>q.id==='q04')!;
    expect(q04.experiment).toContain('末尾八轮（第 152–159 轮）');
    expect(q04.unknown).toContain('rank128、rank64、rank32');
    // Legitimate limits remain visible: 'red' means core verification missing,
    // not that completed engineering evidence has disappeared.
    expect(responses).toContain('1,536 次冻结开发题评测');
    expect(responses).toContain('160 轮正式 Stage2 训练也尚未开始');
  });
  it('anchors per-question red/yellow/green workload to current experiment sources, not old green receipts',()=>{
    const q02=ADVISOR_QUESTIONS.find(q=>q.id==='q02')!;
    expect(q02.finding).toContain('SFT 和 OPSD 各有 3 组完成并通过检查');
    expect(q02.finding).toContain('不能代替最终的逐题配对统计');
    expect(q02.unknown).toContain('3 格缺少可验收');
    expect(q02.evidence[0]?.href).toBe('https://github.com/mykcs/openevo-experiment/pull/629');
    expect(ADVISOR_QUESTIONS.find(q=>q.id==='q05')?.unknown).toContain('1,280 次同题评估');
    const progress=responses.split('const researchProgress = {')[1]?.split('} as const;')[0] ?? '';
    for(let n=1;n<=10;n++) {
      const q='q'+String(n).padStart(2,'0');
      expect(progress).toMatch(new RegExp('\\b'+q+': \\{[^\\n]*source:'));
    }
    expect(progress).toContain("source:'https://github.com/mykcs/openevo-experiment/pull/629'");
    expect(progress).toContain("source:'https://github.com/mykcs/openevo-experiment/pull/632'");
    expect(progress).toContain('计划的 6 组训练均已通过检查');
    expect(progress).toContain('40,960 次训练任务和 1,664 次评估');
    expect(progress).toContain('122,880 次训练任务和 4,224 次评估');
    expect(responses).toContain('data-question-plan-source={q.id}');
    expect(responses).toContain('2026 年 10 月 19 日只读核对');
    expect(progress).toContain('GPU 小时');
  });
  it('presents plots and research tables with one documented visual hierarchy without making every table a card',()=>{
    const blog=read('src/styles/openevo-research-blogs.css') + read('src/styles/research-article.css');
    const booktabs=read('src/styles/research-booktabs.css');
    const plot=read('src/components/research/PaperIntervalPlot.astro');
    for(const token of ['--research-evidence-frame','--research-evidence-title-size','--research-evidence-caption-size','--research-evidence-single-width','--research-evidence-double-width']) {
      expect(blog).toContain(token);
      expect(plot).toContain(token);
    }
    expect(blog).toContain('.evo-blog .advisor-viz:not(figure)');
    expect(blog).toContain('border:0;');
    expect(booktabs).toContain('caption-side:top');
    expect(booktabs).toContain('font-family:"Times New Roman",Times');
    expect(booktabs).toContain('font-size:clamp(.75rem, .65rem + .45vw, 1rem)');
    expect(booktabs).not.toContain('tbody tr + tr > *');
    expect(plot).toContain('box-shadow:none');
    expect(plot).toContain('width:min(100%,var(--research-evidence-single-width,38rem))');
    expect(plot).toContain('width:min(100%,var(--research-evidence-double-width,55.625rem))');
    expect(responses).toContain('data-capacity-ci');
  });

  it('uses owner examples to guard the reading sequence, not cosmetic bold as a stand-in for explanation',()=>{
    const summary=responses.split('<div class="evo-article__abstract">')[1]?.split('</div>')[0] ?? '';
    const intro=responses.split('<section id="context"')[1]?.split('</section>')[0] ?? '';
    const plain=(source:string)=>source.replaceAll('<strong>','').replaceAll('</strong>','');
    // Real known-bad example: bare score first, method identity is missing.
    // Same owner-reported known-bad witness, now correctly rejected.
    const badNumeric='Task Score 依次为 60.72、45.98、20.77/100，完整成功分别为 50、32、10 题';
    const clearNumeric='普通 OpenEVO 的 Task Score 为 60.72 分，完整做对 50 题；固定容量的 Bounded 为 45.98 分，完整做对 32 题；历史 β/GDR 为 20.77 分，完整做对 10 题。';
    const packed=(source:string)=>/(?:\d+(?:\.\d+)?[、，]){2,}\d|(?:\d+(?:\.\d+)?\s*\/\s*(?:100|128|64|32|512|78|117|160))/.test(source);
    expect(packed(badNumeric)).toBe(true);
    expect(packed(clearNumeric)).toBe(false);
    expect(packed(plain(summary))).toBe(false);
    for(const method of ['普通 OpenEVO','Bounded','历史 β/GDR']){
      expect(summary).toContain(method);
    }
    expect(summary).toContain('60.72 分');
    expect(summary).toContain('45.98 分');
    expect(summary).toContain('20.77 分');
    expect(summary).toContain('128 道购物题');
    expect(summary).toContain('不是完全严格的对照');
    expect(summary).toContain('第 152–159 轮');
    expect(summary).toContain('rank128 用已经封存的同轮次历史结果');
    // The first screen should retain the primary meeting RAW and the compact
    // TOC. Detailed capacity evidence stays linked under its own Q04 answer.
    expect(summary).not.toContain('href={checkpointEvidence.capacity}');
    expect(responses).toContain('href={checkpointEvidence.capacity}');

    // Negative visual witness: making the method words heavier is no substitute
    // for orientation. Keep meaningful numerical emphasis and existing scientific labels.
    expect(summary).not.toContain('<strong>普通 OpenEVO</strong>');
    expect(summary).not.toContain('<strong>固定 state 的 Bounded</strong>');
    expect(intro).not.toContain('<strong>第一，');
    expect(summary).not.toContain('60.72、45.98、20.77/100');
    expect(responses).toContain('data-research-status={q.progress.tone}');

    // Same-family sibling scan: article two should tell the reader where to find
    // measured evidence instead of using bold on a narrator sentence.
    expect(questions).toContain('这篇文章说明这些问题从哪里来、会后怎样拆分成十问');
    expect(questions).toContain('逐项介绍实际完成的实验、结果和仍缺少的证据');
    expect(questions).not.toContain('<strong>为什么要做这些实验</strong>');
    // Legitimate boundary: method definitions still mark technical terminology.
    expect(methods).toContain('<strong>SD-LoRA</strong>');
    expect(methods).toContain('<MathFormula');
  });

  it('names the exact historical compute arms and decodes the shared BUNDLE state for a cold reader',()=>{
    // Two independent context-isolated source readers flagged these reader-risk
    // hypotheses; they are NOT evidence that real humans actually misunderstood.
    const oldTable='<th scope="col" data-numeric>历史方案 / h</th><th scope="col" data-numeric>改进方案 / h</th>';
    const oldHeader='<h2>8 BUNDLE 的文字载体更新次数较少</h2>';
    expect(responses).not.toContain(oldTable);
    expect(responses).not.toContain(oldHeader);
    expect(responses).toContain('普通 OpenEVO（小时）</th>');
    expect(responses).toContain('Bounded（无历史 β，小时）</th>');
    expect(responses).toContain('31.09 小时</td><td data-numeric>2.02 小时');
    expect(responses).toContain('74.78 小时</td><td data-numeric>56.25 小时');
    expect(responses).toContain('三条长期路线的文字状态改写次数');
    expect(responses).toContain('OpenEVO 把每轮学习后留下的经验状态合称为 BUNDLE');
    expect(responses).toContain('这些次数不等于读取次数');
    expect(responses).toContain('Text Memory、Skill 和 Agent System');
    // Do not fix an explanatory gap by newly bolding a technical term.
    expect(responses).not.toContain('<strong>BUNDLE</strong>');
    // Scientific claim boundaries must survive the editorial change.
    expect(responses).toContain('这些实验不是完全严格对照');
    expect(responses).toContain('不能替代 128 题终评');
  });

});
