import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';
import { CAPABILITY_READER_ROUTES, CAPABILITY_ROUTE_ALIASES } from '../data/capabilityReaderRoutes';

const root = '/research/seed-openevo/study/capability-exploration/';
const titles: Record<string, string> = {
  home: 'BaseModel 研究首页',
  development: '网站开发与验收',
  handbook: '技术手册',
  'handbook-harness': 'Agent Harness 操作说明',
  'handbook-gpu': 'GPU 操作规则',
  'models-index': '模型目录',
  families: '模型家族',
  compare: '比较模型',
  'papers-index': '论文目录',
  guide: 'Agent、SEED 与 OpenEVO 入门',
  'guide-today': '历史复现材料',
  landscape: '模型关系总览',
  methodology: '证据与比较方法',
  workspace: '实验工作台',
  'data-status': '数据与来源状态',
  lab: '实验资源与授权边界',
  flow: 'SEED 与 OpenEVO 流程对照',
  'flow-seed': 'SEED 方法',
  'flow-openevo': 'OpenEVO 方法',
  'flow-benchmarks': 'ALFWorld 与 WebShop 任务环境',
  'flow-webshop': 'WebShop 环境',
  'flow-alfworld': 'ALFWorld 环境',
  'flow-loops': 'SEED 与 OpenEVO 更新机制',
  'flow-sd-lora': 'Vanilla SD-LoRA 参数机制',
  'flow-server': '服务器操作参考',
  study: 'OpenEVO × WebShop 实验目录',
  'study-run': '复现实验',
  'study-results': '跨实验结果与证据',
  'study-openevo-methods': 'OpenEVO 的参数记忆方法',
  'study-advisor-ten': 'L 学长十问：问题与背景',
  'study-parameter-memory-results': '我们的回应实验',
  'study-briefing': '研究阶段汇报',
  'recent-challenges': '研究阶段复盘',
  'w-advisor-call': 'W 老师科研沟通准备',
  'capability-home': 'OpenEVO 研究专题目录',
};

export function researchSearchEntries() {
  const capabilityTitles = new Map(CAPABILITY_READER_ROUTES.map((row) => [
    row.route ? `${root}${row.route}/` : root, row.label.zh,
  ]));
  const aliasPaths = new Set(Object.keys(CAPABILITY_ROUTE_ALIASES).map((route) => `${root}${route}/`));
  const seen = new Set<string>();
  return SITE_READER_CONTRACTS.flatMap((row) => {
    // Collection records and compatibility URLs already have canonical owners.
    if (row.id === 'not-found' || row.redirectsTo || row.sourceRoute.includes('[') || aliasPaths.has(row.samplePath) || seen.has(row.samplePath)) return [];
    seen.add(row.samplePath);
    return [{
      type: 'guide',
      id: row.id,
      title: capabilityTitles.get(row.samplePath) ?? titles[row.id] ?? row.primaryTask,
      subtitle: row.primaryTask,
      aliases: [row.id, row.samplePath],
      path: row.samplePath,
    }];
  });
}
