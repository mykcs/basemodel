# Basemodel V2 adversarial acceptance

审计对象：`main` 当前发布链。验收标准是 Research Decision Workbench 的真实研究路径，不是“文件存在”或历史矩阵打勾。

状态只有三种：`PASS`、`EVIDENCE-UNKNOWN`、`EXTERNAL-BLOCKER`。`EVIDENCE-UNKNOWN` 仅用于外部事实在完成一手来源检索后仍缺乏可靠公开证据；`EXTERNAL-BLOCKER` 仅用于缺少生产凭据、账号、OAuth、域名或外部服务授权。

## Y-01 ～ Y-18

| ID | 原始要求 | 状态 | 代码 / 浏览器 / 测试证据 | 研究目的判断 |
|---|---|---|---|---|
| Y-01 | 模型浏览器提供研究筛选、Quick View、核心/高级层级与计数 | PASS | `ModelExplorer`真实挂载；Chromium/WebKit smoke；E2E与AV-EXPLORER | 用户能从任务约束缩小候选 |
| Y-02 | 权重 true/false/unknown 不混淆 | PASS | `ModelDecisionCard`三态标签；模型详情与表格可见；semantic tests | 不把未知误写成不可用 |
| Y-03 | Papers 是案例库而非普通列表 | PASS | `PaperExplorer`真实挂载，代码/本地复现/权重/角色/家族筛选；双语浏览器 smoke | 用户按研究维度进入论文案例 |
| Y-04 | Strict/Method/Modern 三种路径可进入 | PASS | 多个 paper detail 真实链接到 workspace；E2E 路径断言 | 保留复现目标差异 |
| Y-05 | Guide 解释概念并连接真实研究路径 | PASS | 概念地图、模型链接、工作台/论文/方法论链接；中英页面检查 | 新手可继续做决策 |
| Y-06 | 首页最近变化是事件流 | PASS | `changeEvents` collection 被首页消费；首页部署层 200 | 用户能看到变化而非静态统计 |
| Y-07 | Family timeline 区分当前状态与论文时点 | PASS | timeline current flag 与旧论文说明；路由浏览器复核 | 避免时间语义混淆 |
| Y-08 | Claim → Evidence → history 可追溯 | PASS | Claim history/data-status 页面；schema 与浏览器 smoke | 重要事实有来源链 |
| Y-09 | Benchmark 条件完整呈现 | PASS | benchmark schema 与 data-status 条件表；validate/build 通过 | 不把数字脱离实验条件 |
| Y-10 | Data status 呈现缺失与历史 | PASS | deployed `/data-status/` 200；ClaimHistory 与条件块真实渲染 | 未知值能被审查 |
| Y-11 | 硬件估算器输入真实影响结果且标明启发式 | PASS | 参数/context/batch/GPU/LoRA/precision/optimizer进入计算；browser interaction smoke | 可做前期规划，不冒充实测 |
| Y-12 | Landscape 学习/完整/论文筛选/表格可访问 | PASS | 学习模式现为低认知负担列表；完整模式有图表控件；E2E/浏览器复核 | 新手先理解字段，再使用高级图表 |
| Y-13 | ECharts/D3 可访问且不相互矛盾 | PASS | 同一 filtered data；ECharts ARIA、D3 keyboard、accessible table；check/build | 同一事实有可替代表达 |
| Y-14 | 详情页研究结论、Access Ladder、替代候选 | PASS | detail 首屏顺序与工具/替代列表；desktop/mobile smoke | 选择行动先于原始 schema |
| Y-15 | Compare 支持 canonical URL、相对基准、导出 | PASS | `?models=` reload、difference/research-impact/unknown、Markdown/CSV/BibTeX；E2E | 替换影响可复核、可分享 |
| Y-16 | 删除真实未接入 V1 遗留 | PASS | 引用扫描、V1 文件删除、旧文案扫描；AV/CI | 产品路径不再分叉 |
| Y-17 | 中英路由和新增功能同步 | PASS | 16 个核心 bilingual route；live GET 200；Chromium/WebKit smoke | 两种语言都能完成主路径 |
| Y-18 | 全链路测试与部署验证 | PASS | check/validate/audit/unit/build/E2E/AV、Actions success、Pages browser smoke | 发布结果可复核 |

## R-01 ～ R-25

| ID | 原始要求 | 状态 | 代码 / 浏览器 / 测试证据 | 研究目的判断 |
|---|---|---|---|---|
| R-01 | Quick View 真实打开与关闭 | PASS | 卡片按钮打开/关闭 dialog；desktop/mobile smoke | 快速比较不必离开列表 |
| R-02 | Compare 只使用 `?models=` | PASS | store、链接、audit 均拒绝 `ids` | URL 可长期复用 |
| R-03 | 相对基准与 BibTeX | PASS | Compare controls 与 E2E 交互 | 研究影响和引用可导出 |
| R-04 | 详情替代候选与版本固定 | PASS | `ModelAlternatives`、revision tool、workspace substitute lab | 替换不是无依据推荐 |
| R-05 | 来源 BibTeX、问题报告、模型引用 | PASS | detail tools 实际复制草稿与引用 | 决策记录可带回实验 |
| R-06 | 论文模型选择依据显式区分来源类型 | PASS | 有记录时显示 paper/code/derived/unknown；无记录时强制显示“未记录”表格 | 不以 UI 文案伪造 rationale |
| R-07 | 论文按研究维度筛选 | PASS | `PaperExplorer` URL-backed filters；浏览器筛选复核 | 案例检索服务研究任务 |
| R-08 | 家族当前/历史语义 | PASS | timeline 页面与说明文字 | 替代模型不会覆盖论文历史 |
| R-09 | Landscape 学习模式和研究含义编码 | PASS | 学习列表；完整模式支持资源/参数纵轴、厂商/API/证据颜色、论文过滤 | 高级编码只在用户主动选择时出现 |
| R-10 | Claim schema 支持历史与关系 | PASS | schema、ClaimHistory、data-status | 声明不会只剩一个当前值 |
| R-11 | Benchmark 条件与结果状态 | PASS | schema、条件展示、audit | “论文报告”不冒充独立复现 |
| R-12 | 估算器所有输入影响结果 | PASS | GPU 数量已纳入 per-device 估算并有通信余量说明；unit/browser smoke | 用户能理解估算假设 |
| R-13 | Guide 覆盖全部新手概念 | PASS | checkpoint、family/generation、Base/Instruct/Thinking/Coder、Dense/MoE、参数、API/weights/open-source、LoRA/SFT/RL、自进化、三路径均有内容或链接 | 概念直接连到真实模型/论文/工作台 |
| R-14 | Desktop/mobile Quick View | PASS | Chromium/WebKit 与 390px smoke | 小屏仍可操作 |
| R-15 | V1 死代码和旧参数清理 | PASS | 引用扫描、`ids`扫描、obsolete labels scan | 无旧路径误导用户 |
| R-16 | 跨设备云端保存 | EXTERNAL-BLOCKER | 静态 Pages 当前只有 localStorage/URL/JSON；需要数据库与生产服务授权 | 不影响本地可追溯决策，但不能宣称云同步 |
| R-17 | 账号登录/OAuth | EXTERNAL-BLOCKER | 缺少身份提供商、OAuth client/secret、回调域名 | 当前研究主路径不需要登录 |
| R-18 | 团队实时协作 | EXTERNAL-BLOCKER | 缺少数据库、权限、冲突合并、实时服务与部署授权 | 当前单人研究决策可完成 |
| R-19 | SSR/数据库后端 | EXTERNAL-BLOCKER | 发布契约是静态 Astro + GitHub Pages；切换需要部署目标、数据库与凭据 | 静态架构已足够支撑当前主路径 |
| R-20 | 模型/论文/benchmark 全部外部事实逐字段核验 | EVIDENCE-UNKNOWN | 已运行 source-health、claim audit、vendor audit；当前 136 模型中 45 verified、91 partial，未验证字段保留 semantic state | 代码已防止猜测，但公开证据覆盖仍不完整 |
| R-21 | Landscape 事实维度全部有来源 | EVIDENCE-UNKNOWN | 图表只消费目录字段、未知保留 unknown；外部事实覆盖与目录更新无法由静态 UI 完成 | 研究意义编码已完成，事实覆盖仍需来源 |
| R-22 | current/flagship/open-weight/API/license 等全部事实核验 | EVIDENCE-UNKNOWN | 当前 claim audit 仍报告 coverage warnings；页面显示 checked/source/unknown，不提升为 confirmed | 只能在新增可靠一手来源后继续提升 |
| R-23 | 生产外部服务授权 | EXTERNAL-BLOCKER | 缺少明确服务选择、账号、secret、域名/OAuth 授权 | 不以无授权的 SaaS 代码冒充完成 |
| R-24 | 所有红项不能由当前仓库继续解决时明确分类 | PASS | 本表只使用三种终态，并逐项写具体证据/边界 | 没有把“需要后端”当成模糊借口 |
| R-25 | 不把静态替代方案冒充云端/科学事实 | PASS | unknown/partial/heuristic/source status 在 UI、schema、审计中分开 | 研究决策仍保持证据诚实 |

## 原始目的回看

主路径现在仍是：Research Task → Candidates → Reasons/Risks → Evidence → Compare → Replacement Analysis → Decision Memo → Snapshot/change detection。每次检查必须回到同一个问题：新手研究员能否据此做出、解释、复核并在以后重建一次模型选择；如果只是增加数据库字段而没有进入这条路径，不算完成。

本次数据补充还将 Qwen2.5 官方七尺寸矩阵（0.5B、1.5B、3B、7B、14B、32B、72B）的 Base 与 Instruct 记录纳入自动审计；许可证无法安全提升为确定事实的字段继续保留 `not_verified`，硬件资源估算没有一手依据的字段也保持 `not_verified`。

字段证据收口后的 `data_status: verified` 是“记录中的具体关键值都有来源映射，无法证明的值显式保留 semantic unknown”，不表示每个字段都已知，也不表示研究结论已被实验复现；`audit-claims` 仍会对任何未映射的具体值报警。

R-16～R-19、R-23 是缺少外部服务/凭据的明确边界；R-20～R-22 是已执行来源审计后仍存在的证据缺口。它们不是前端可以诚实“改代码变绿”的项目。
