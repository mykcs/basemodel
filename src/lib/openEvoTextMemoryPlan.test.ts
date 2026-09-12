import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { readerContractForRoute } from '../data/siteReaderContracts';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const component = read('../components/research/OpenEvoTextMemoryPlan.astro');
const deck = read('../components/research/SeedOpenEvoProgressBriefing.astro');
const evidence = JSON.parse(read('../../public/research/seed-openevo/evidence/q17-text-memory-research-20260911.json'));
const route = '/research/seed-openevo/study/capability-exploration/text-memory/';
const section = deck.slice(deck.indexOf('<section id="text-memory-redesign"'), deck.indexOf('<section id="technical-work-summary"'));

describe('Text Memory receipt-based research projection', () => {
  it('explains the task and the teacher before hashes or execution details', () => {
    const hero = component.slice(component.indexOf('<header'), component.indexOf('</header>'));
    expect(hero).toContain('让 Text Memory 写出真正有用的短笔记');
    expect(hero).toContain('模拟购物任务 WebShop');
    expect(hero).toContain('1–4 条可重复使用的经验');
    expect(hero).toContain('仍然未知');
    expect(hero).not.toContain('SHA');
    expect(component).not.toContain('当前训练');
    expect(component).not.toContain('The current run');
    expect(read('../components/research/OpenEvoTextMemoryResearchLink.astro')).not.toContain('The current run');
  });
  it('registers real bilingual pages, navigation, sitemap and reader contract', () => {
    for (const prefix of ['', 'en/']) {
      const page = read(`../pages/${prefix}research/seed-openevo/study/capability-exploration/text-memory/index.astro`);
      expect(page).toContain('OpenEvoTextMemoryPlan');
      expect(readerContractForRoute(`/${prefix}${route.slice(1)}`)?.id).toBe('capability-text-memory');
    }
    expect(read('../data/capabilityReaderRoutes.ts')).toContain('"route": "text-memory"');
    expect(read('./sitemapRoutes.ts')).toContain(`'${route}'`);
  });
  it('keeps five cases and both stages distinct', () => {
    for (const label of ['Stage1 · 2048', 'Stage1 · 2048 → 4096', 'Stage1 · 20 → 10+10', 'Stage2 · R104', 'Stage2 · R122']) expect(component).toContain(label);
    expect(component).toContain('R104 两次重复；R122 先写满，再重复');
    expect(evidence.r104.primary.exact_prior_double).toBe(true);
    expect(evidence.r104.repair.exact_prior_double).toBe(true);
    expect(evidence.r122.primary.exact_prior_double).toBe(false);
    expect(evidence.r122.primary.saturated).toBe(true);
    expect(evidence.r122.repair.saturated).toBe(false);
    expect(evidence.r122.repair.exact_prior_double).toBe(true);
  });
  it('retains failed candidates and preserves the frozen two-call boundary', () => {
    expect(evidence.r122.new_memory_adopted).toBe(false);
    expect(evidence.r122.primary.valid).toBe(false);
    expect(evidence.r122.repair.valid).toBe(false);
    for (const key of ['recovery_new_model_calls', 'rollout_replay', 'sd_retraining']) expect(evidence.r122[key]).toBe(0);
    expect(evidence.formal_run_observation.final_panel_access_count).toBe(0);
    expect(component).toContain('不能拿来回头救 R122');
    expect(component).toContain('没有人工挑几句拼成“成功”');
  });
  it('does not relabel qualification or scripted contract tests as efficacy evidence', () => {
    expect(evidence.historical_stage1.ten_plus_ten_qualification_is_webshop_result).toBe(false);
    expect(evidence.prototype.test_counts).toEqual({lineage:12,teacher_contract:21,shadow_preparation:10});
    expect(evidence.prototype.scripted_fixture_count).toBe(8);
    expect(evidence.prototype.actual_model_calls).toBe(0);
    expect(evidence.prototype.real_model_shadow_rows).toBe(0);
    expect(evidence.prototype.formal_activation).toBe(false);
    expect(component).toContain('预先写好的样例通过，不能填入真实模型的效果表');
    expect(component).toContain('这些是研究假设，不是已经找到的原因');
  });
  it('keeps explicitly rendered unknowns and a single execution authority', () => {
    for (const key of ['text-memory-failure-frequency','text-memory-shadow-results','text-memory-successor-result']) {
      expect(component).toContain(`data-placeholder="${key}"`);
      expect(section).toContain(`data-placeholder="${key}"`);
    }
    expect(component).toContain('data-blank="final-r160-score"');
    expect(Object.values(evidence.unknown_results).every(v => v === null)).toBe(true);
    expect(evidence.plan_authority).toBe('https://github.com/mykcs/openevo-experiment/blob/main/docs/experiment-tracking/Q17_TEXT_MEMORY_REDESIGN_PLAN_2026-09-11.md');
    expect(component).toContain('唯一总计划与打勾清单');
  });
  it('pins public-safe evidence without leaking server paths or pretending to be live', () => {
    expect(evidence.experiment_evidence_revision).toMatch(/^[a-f0-9]{40}$/);
    expect(evidence.receipt_bundle_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(Number.isFinite(Date.parse(evidence.observed_at_utc))).toBe(true);
    expect(evidence.formal_run_observation.last_sealed_round).toBe(125);
    expect(evidence.formal_run_observation.active_round).toBe(126);
    expect(evidence.formal_run_observation.training_complete).toBe(false);
    const raw = JSON.stringify(evidence);
    for (const secret of ['/data/home/','/Users/','wangrui_root','192.168.']) expect(raw).not.toContain(secret);
    expect(component).toContain('此时间点之后的进度不在这份快照内');
  });
  it('integrates exactly one Text Memory page into the current frontier briefing', () => {
    expect((deck.match(/<section /g) ?? []).length).toBe(24);
    expect((deck.match(/id="text-memory-redesign"/g) ?? []).length).toBe(1);
    expect(deck.indexOf('<section id="frontier-roadmap"')).toBeLessThan(deck.indexOf('<section id="text-memory-redesign"'));
    expect(section).toContain('22 / 24');
    expect(section).toContain('不追加第三次调用');
    expect(section).toContain('真实模型对照尚未开始');
    expect(section).toContain('这份快照中的正式实验保持原规则');
    expect(section).not.toContain('更像真正的方向');
  });
  it('does not retain the old cause-as-result claim on the study entry points', () => {
    for (const prefix of ['', 'en/']) {
      const page = read(`../pages/${prefix}research/seed-openevo/study/index.astro`);
      expect(page).not.toContain('都说明：我们需要');
      expect(page).not.toContain('must be separated');
      expect(page).toContain('OpenEvoExperimentIndex');
      expect(read('../components/research/OpenEvoExperimentIndex.astro')).toContain('/text-memory/');
    }
  });
});
