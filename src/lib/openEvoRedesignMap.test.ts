import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const map = read('../components/research/OpenEvoRedesignMap.astro');
const zh = read('../pages/research/seed-openevo/study/capability-exploration/openevo-2-0/index.astro');
const en = read('../pages/en/research/seed-openevo/study/capability-exploration/openevo-2-0/index.astro');

describe('OpenEvo redesign successor map', () => {
  it('makes Harness201.1 the new scientific boundary instead of a continuation node', () => {
    expect(map).toContain('HARNESS201.1 · NEW SCIENTIFIC BOUNDARY');
    expect(map).toContain('data-node-kind="scientific-amendment" data-node-state="current"');
    expect(map).toContain('reasoning soft · action hard');
    expect(map).toContain('dynamic set of WebShop actions');
    expect(map).toContain('fuzzy repair');
    expect(map).toContain('5/64');
    expect(map).toContain('maximum of 11');
  });

  it('restarts from a fresh 1,440-trajectory Stage 1 with no old learned state', () => {
    expect(map).toContain('FLOOR 1 · FRESH STAGE 1');
    expect(map).toContain('202609021800');
    expect(map).toContain('不会把“合同已冻结”冒充成“两个 arm 都已经完成并 seal 了 1,440 条”');
    expect(map).toContain('180 tasks × 8 rollouts each = 1,440 fresh trajectories');
    expect(map).toContain('No old Memory / Skill / Agent');
    expect(map).toContain('No old OPSD / Stage2 state');
    expect(map).toContain('qualification rows cannot be counted inside the formal 1,440');
  });

  it('keeps MiniMax post-hoc and visibly ends the teacher budget at the sealed pool', () => {
    expect(map).toContain('MINIMAX ANALYSIS');
    expect(map).toContain('202609022300');
    expect(map).toContain('它没有宣告 MiniMax 已经 1,440/1,440 完成');
    expect(map).toContain('analysis-authorized');
    expect(map).toContain('post-hoc analyzer');
    expect(map).toContain('TEACHER EVIDENCE POOL SEAL');
    expect(map).toContain('From here onward: external teacher calls = 0');
    expect(map).toContain('closeout still requires all 1,440 source identities to be parse_ok');
  });

  it('keeps fresh Stage-1 downstream locked instead of inheriting older successor completion', () => {
    for (const label of ['OPSD', 'Text Memory', 'Skill Bundle', 'Agent System']) expect(map).toContain(label);
    expect(map).toContain('downstream_not_authorized_here');
    expect(map).toContain('更早的 3B successor');
    expect(map).toContain('自己的合法 trigger');
    expect(map).not.toContain('record count is 18,490');
    expect(map).not.toContain('A1 saturation → bounded A2');
    expect((map.match(/class=\"downstream-card[^\"]*\" data-node-kind=\"(?:mainline|scientific-amendment)\" data-node-state=\"future\"/g) || []).length).toBe(4);
    expect(map).not.toMatch(/<article class="[^"]*downstream-card--complete[^"]*"/);
    expect(map).not.toContain('BOUND TO NEW CORPUS');
    expect(map).not.toContain('SAME-CORPUS SUCCESSOR');
  });

  it('keeps Stage-2 origin, new Stage 2, and final evaluation future-locked', () => {
    expect(map).toContain('STAGE 2 ORIGIN SEAL');
    expect(map).toContain('NEW STAGE 2');
    expect(map).toContain('FINAL EVALUATION');
    expect((map.match(/data-node-state="future"/g) || []).length).toBeGreaterThanOrEqual(3);
    expect(map).toContain('redesign-connector--future');
    expect(map).toContain('The old 7-vs-8 and 256-window rules do not return');
  });

  it('shows Qwen3-1.7B as a parallel branch rather than replacing the 3B successor', () => {
    expect(map).toContain('Qwen3-1.7B');
    expect(map).toContain('data-node-kind="branch" data-node-state="current"');
    expect(map).toContain('0/64');
    expect(map).toContain('maximum of 29');
    expect(map).toContain('downstream data and carriers remain model-specific');
  });

  it('uses progressive disclosure with desktop positioning and a mobile dialog', () => {
    expect(map).toContain('data-redesign-detail-layer');
    expect(map).toContain('role="dialog"');
    expect(map).toContain("window.matchMedia('(max-width: 720px)')");
    expect(map).toContain("event.key === 'Escape'");
    expect(map).toContain('trigger?.focus()');
  });

  it('mounts the shared successor map on both locale routes', () => {
    expect(zh).toContain('OpenEvoRedesignMap');
    expect(en).toContain('OpenEvoRedesignMap');
    expect(zh).not.toContain('OpenEvo2Strategy');
    expect(en).not.toContain('OpenEvo2Strategy');
  });
});
