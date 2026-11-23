import { expect, test } from "@playwright/test";

for (const viewport of [
  { name:"desktop", width:1440, height:900 },
  { name:"phone", width:440, height:956 }
]){
  test("Agent Reader context and privacy boundary — "+viewport.name, async ({ page, request }) => {
    await page.setViewportSize(viewport);
    const res=await page.goto("/agent/");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading",{level:1})).toContainText("Agent");
    await expect(page.locator('head link[rel="help"][href="/agent/SKILL.md"]')).toHaveAttribute("type","text/markdown");
    await page.locator(".agent-reader-action details summary").click();
    const value=await page.locator("#agent-research-text").inputValue();
    expect(value).toContain("SEED");
    expect(value).toContain("OpenEVO");
    expect(value).toContain(page.url().replace(/\/agent\/$/,""));
    expect(value).toContain("不能");
    const indexRes=await request.get("/agent/site.json");
    expect(indexRes.status()).toBe(200);
    const index=await indexRes.json();
    expect(index.schema).toBe("basemodel/agent-reader/v1");
    expect(index.routes.length).toBeGreaterThan(5);
    expect(value).toContain(index.routes[0].title);
    const skill=await request.get("/agent/SKILL.md");
    expect(skill.status()).toBe(200);
    expect(await skill.text()).toContain("name: basemodel-reader");
    const llms=await request.get("/llms.txt");
    expect(llms.status()).toBe(200);
    expect(await llms.text()).toContain("/agent/site.json");
    const errors:string[]=[];
    page.on("pageerror",e=>errors.push(e.message));
    await page.getByRole("button",{name:"复制站点上下文"}).click();
    await expect(page.locator("#copy-agent-result")).toContainText(/已复制|手动复制/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
    expect(errors).toEqual([]);
  });
}
