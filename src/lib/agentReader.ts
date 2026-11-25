import { SITE_READER_CONTRACTS } from "../data/siteReaderContracts";
import { researchSearchEntries } from "./researchSearch";

// Reader-safe navigation metadata. Source remains the existing editorial contract.
// Never make a second mutable experiment, benchmark or model catalog.
const featureIds = [
  "home", "flow", "study", "study-openevo-methods",
  "study-advisor-ten", "study-parameter-memory-results", "study-results",
  "study-run", "models-index", "papers-index", "methodology", "data-status",
] as const;

const titles = new Map(researchSearchEntries().map((x) => [x.path, x.title]));
const curated = featureIds.map((id) => {
  const entry=SITE_READER_CONTRACTS.find((x) => x.id === id);
  if (!entry) throw new Error("Agent reader missing reader contract: "+id);
  return {
    id,
    path:entry.samplePath,
    title:titles.get(entry.samplePath) ?? entry.primaryTask,
    purpose:entry.primaryTask,
    evidenceBoundary:entry.mustStayVisible,
  };
});

export const readerIndex = {
  schema: "basemodel/agent-reader/v1",
  site: "OpenEVO",
  audience: "具有站点阅读权限的研究者；网站当前 Production 受登录保护",
  status: "依据当前网站阅读合同整理的导航快照，不是实时实验状态或正式科研结论",
  routes:curated,
  sourceOwners:{
    navigation:"src/data/siteReaderContracts.ts + src/lib/researchSearch.ts",
    catalog:"Astro collections; /search-index.json",
    science:"原有研究页与证据 owner；导航不能推翻实验记录",
  },
  readingRules:[
    "先阅读具体研究页和原始科学证据；目录中的标题、摘要及边界不能单独支持实验成功结论。",
    "SEED 论文报告与 OpenEVO 本地实验不是同协议胜负比较。",
    "必须区分真实执行、回放、CPU smoke、历史快照、已完成和未运行。",
    "实际网页、科研资产与服务器访问遵守现有授权；不得绕过 SSO、索要令牌或因能读目录而启动实验。",
    "答案引用具体页面链接，标注实验证据、适用范围与未知。",
  ],
} as const;

export const readerSkill = [
  "---",
  "name: openevo-reader",
  "description: 用于在已有访问权限下检索和理解 OpenEVO 网站的模型、论文、SEED/OpenEVO、WebShop 科研与证据边界。只负责阅读，不授权修改或运行。",
  "---",
  "# OpenEVO · Agent 阅读指南",
  "",
  "先读 /llms.txt 与 /agent/site.json，按问题选择原始研究页面、证据和参考论文。",
  "此指南仅提供导航，真实科学事实仍由研究页和科研原件拥有。",
  "",
  "## 阅读规则",
  ...readerIndex.readingRules.map((x) => "- "+x),
  "",
  "## 核心目录",
  ...curated.map((x) => "- "+x.path+" — "+x.title+"："+x.purpose),
  "",
  "## 机器端点",
  "- /llms.txt — 精简阅读地图",
  "- /agent/site.json — 结构化科研导航与证据边界",
  "- /search-index.json — 已有的模型、论文和研究检索索引",
  "",
].join("\n")+"\n";

export const readerPrompt = [
  "请用以下 OpenEVO 网站摘要理解科研方向、导航与证据限制。当前网站 Production 受 Vercel 登录保护。",
  "只能使用已有授权阅读；没有权限时说明你只有用户主动提供的目录，不能假称已浏览网站正文。",
  "站点：{{SITE_ORIGIN}}",
  "",
  "## 研究入口",
  ...curated.map((x) => "- "+x.title+"（{{SITE_ORIGIN}}"+x.path+"）："+x.purpose+"。证据限制："+x.evidenceBoundary),
  "",
  "## 使用和权限限制",
  ...readerIndex.readingRules.map(x => "- "+x),
  "",
  "请在有权时查 {{SITE_ORIGIN}}/agent/site.json 与 {{SITE_ORIGIN}}/search-index.json；不要自动将私人阅读内容上传公共索引。",
].join("\n") + "\n";

export function llmsText(){
  return [
    "# OpenEVO",
    "",
    "> 模型、Agent 经验学习与 SEED / OpenEVO WebShop 的证据工作台。导航不等于科研成功或公开传播许可。",
    "",
    "## Agent 入口",
    "- [给 Agent 读](/agent/)：主动复制精选科研目录和证据边界",
    "- [Agent SKILL](/agent/SKILL.md)：阅读路径、引用与权限",
    "- [结构化目录](/agent/site.json)：来自现有 Reader Contract",
    "- [既有搜索索引](/search-index.json)：模型、论文与研究条目",
    "",
    "## 科研入口",
    ...curated.map(x => "- ["+x.title+"]("+x.path+")："+x.purpose),
    "",
    "## 证据边界",
    ...readerIndex.readingRules.map(x => "- "+x),
    "",
  ].join("\n");
}
