import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const synthesis = read('../components/research/OpenEvoResearchSynthesis.astro');
const stage1Route = read('../pages/research/seed-openevo/study/capability-exploration/stage1-learning-objectives/index.astro');
const capacityRoute = read('../pages/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/index.astro');
const betaRoute = read('../pages/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/index.astro');

describe('B02 research synthesis articles', () => {
  it('adds one synthesis layer to each existing scientific owner instead of duplicating result pages', () => {
    expect(stage1Route).toContain('<OpenEvoResearchSynthesis locale={locale} topic="learning-signal" />');
    expect(capacityRoute).toContain('<OpenEvoResearchSynthesis locale={locale} topic="rank-capacity" />');
    expect(betaRoute).toContain('<OpenEvoResearchSynthesis locale={locale} topic="beta-late-training" />');
    for (const route of [stage1Route, capacityRoute, betaRoute]) {
      expect((route.match(/<OpenEvoResearchSynthesis/g) ?? []).length).toBe(1);
    }
  });

  it('keeps Stage1 optimization distinct from held-out capability and full SEED Stage2', () => {
    expect(synthesis).toContain('只让 Stage1 更会拟合 hindsight-skill 监督目标，并不足以说明它已经学会了更好的 WebShop 决策');
    expect(synthesis).toContain('它没有排除完整 SEED Stage2');
    expect(synthesis).toContain('学习信号没有把经验变成可迁移决策');
    expect(synthesis).toContain('真正缺的是 Stage2 的自演化闭环');
    expect(synthesis).not.toContain('SEED 无效');
  });

  it('treats rank32 as a capacity question rather than equivalence or a rank8 conclusion', () => {
    expect(synthesis).toContain('不等于证明两种容量等价或严格 non-inferior');
    expect(synthesis).toContain('rank95 很低是几何诊断，不是“rank8 足够训练”的容量定理');
    expect(synthesis).toContain('rank128 明显过量');
    expect(synthesis).toContain('容量仍在限制保持或继续学习');
  });

  it('keeps late beta training dynamics separate from the frozen Final', () => {
    expect(synthesis).toContain('R160–R199 的训练回升');
    expect(synthesis).toContain('不能写成新的 Final、已经反超');
    expect(synthesis).toContain('DirectApply 是历史前驱，不是这次 Bounded / β 的随机匹配臂');
    expect(synthesis).toContain('冻结 Final 不因训练曲线回升自动重开');
  });

  it('marks observed, inferred and proposed layers without inventing a new result store', () => {
    for (const layer of ['observed', 'inferred', 'proposed']) expect(synthesis).toContain(`data-claim-layer="${layer}"`);
    for (const owner of ['BaseModel PR 805', 'D03 PR 824', 'D04 PR 825']) expect(synthesis).toContain(owner);
    for (const duplicatedRawValue of ['0.0369', '0.6119', '20.77 / 100', '45.98 / 100', '60.72 / 100']) {
      expect(synthesis).not.toContain(duplicatedRawValue);
    }
  });
});
