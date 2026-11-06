import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const hub = read("src/components/research/SeedOpenEvoResearchHub.astro");
const training = read(
  "src/components/research/SeedOpenEvoTrainingDesignOverview.astro",
);
const comparisonData = read('src/data/seedOpenEvoIntelligenceComparison.ts');
const missionHero = read('src/components/research/SeedOpenEvoMissionHero.astro');
const disclosure = read(
  "src/components/research/ResearchTechnicalDisclosure.astro",
);
const nav = read("src/components/research/SeedOpenEvoResearchNav.astro");
const study = read("src/components/research/SeedOpenEvoStudyOverview.astro");
const analysisPlan = read(
  "src/components/research/OpenEvoExperimentAnalysisPlan.astro",
);
const resultsScaffold = read(
  "src/components/research/OpenEvoExperimentResultsScaffold.astro",
);
const zhPage = read("src/pages/research/seed-openevo/study/design/index.astro");
const enPage = read(
  "docs/archive/site-en/src/pages/en/research/seed-openevo/study/design/index.astro.archive",
);

describe("integrated SEED × OpenEvo training design", () => {
  it("belongs to the flow map instead of owning a second study page", () => {
    expect(hub).toContain('id="training-design"');
    expect(hub).toContain(
      "<SeedOpenEvoTrainingDesignOverview locale={locale} />",
    );
    expect(hub).toContain('<h2 id="training-design-title">');
    expect(training).not.toContain("<h1");
    expect(training).not.toContain("<h2");
    expect(study).toContain("const flowOverview = p('/research/seed-openevo/flow/');");
    expect(study).not.toContain("p('/research/seed-openevo/flow/#training-design')");
    expect(study).not.toContain("p('/research/seed-openevo/study/design/')");
  });

  it("keeps the Stage-1 operational boundary and parameter protocol visible", () => {
    expect(missionHero).toContain('Qwen2.5-3B-Instruct');
    for (const term of ['采集 WebShop 任务轨迹', '调用外部高能力教师模型 API', '不在执行任务时替 Qwen 选动作', '监督微调（SFT）· 3 轮', '初始参数蒸馏（OPSD）', '形成 Stage 2 的初始状态']) {
      expect(comparisonData).toContain(term);
    }
    expect(comparisonData).not.toContain('GLM / Kimi / MiniMax');
    expect(comparisonData).toContain('本阶段不再调用 Stage 1 的外部高能力教师模型 API。');
    for (const term of [
      "temperature",
      "0.4",
      "top-p / top-k",
      "15 / 512",
      "history length",
      "malformed regeneration",
    ]) {
      expect(training).toContain(term);
    }
  });
  it("reuses the shared disclosure and navigation language instead of local tabs", () => {
    expect(training).toContain("ResearchTechnicalDisclosure");
    expect(training).toContain("eyebrow={false}");
    expect(training).not.toContain('role="tablist"');
    expect(training).not.toContain("chapter-nav");
    expect(nav).toContain("p('/research/seed-openevo/flow/#training-design')");
    expect(nav).not.toContain("p('/research/seed-openevo/study/design/')");
    expect(disclosure).toContain("eyebrow?: string | false");
  });

  it("uses the shared typography and shape tokens for the moved UI", () => {
    for (const source of [hub, training, nav, disclosure]) {
      expect(source).not.toContain("font-editorial");
      expect(source).not.toContain(
        "ui-monospace,SFMono-Regular,Menlo,monospace",
      );
      expect(source).not.toContain("border-radius:13px");
      expect(source).not.toContain("border-radius:14px");
    }
    expect(training).toContain("var(--font-mono)");
    expect(training).toContain("--iui-edge:#343436");
    expect(training).toContain("font-size:var(--type-section)");
    expect(nav).toContain("var(--radius-panel)");
    expect(nav).not.toContain("border-radius:var(--radius-feature)");
    expect(disclosure).toContain("var(--radius-control)");
  });

  it("generalizes the typography rule to adjacent experiment views", () => {
    for (const source of [analysisPlan, resultsScaffold]) {
      expect(source).not.toContain("Times New Roman");
      expect(source).not.toContain("ui-sans-serif");
      expect(source).not.toContain(
        "ui-monospace,SFMono-Regular,Menlo,monospace",
      );
    }
    expect(analysisPlan).toContain("var(--font-interface)");
    expect(resultsScaffold).toContain("var(--font-interface)");
    expect(resultsScaffold).toContain("var(--radius-panel)");
  });

  it("keeps the old design URLs only as localized compatibility redirects", () => {
    expect(zhPage).toContain(
      "const target = '/research/seed-openevo/flow/#training-design'",
    );
    expect(enPage).toContain(
      "const target = '/en/research/seed-openevo/flow/#training-design'",
    );
    for (const page of [zhPage, enPage]) {
      expect(page).toContain("window.location.replace(target)");
      expect(page).not.toContain("SeedOpenEvoTrainingDecisionLab");
    }
  });
  it("removes the retired page-specific design-system owner", () => {
    const retired = new URL(
      "../components/research/SeedOpenEvoTrainingDecisionLab.astro",
      import.meta.url,
    );
    expect(existsSync(retired)).toBe(false);
  });
});
