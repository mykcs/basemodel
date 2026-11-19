# #1026 本地实现收据

状态：**源码与本地确定性检查通过；正式双引擎渲染、CI、合并和发布待执行。** 这是规格提交 `063ad3d` 加本地变更的收据，不是该提交自身或未来提交的浏览器证据。[local-build.json](local-build.json) 保存实现文件 SHA-256、全部272路由的 HTML 哈希/实际样式依赖、源文件分组、67条例外、108条阅读宽度归属及7个动态 spacing sink。

## 结果和范围

| 检查 | 本地结果 |
| --- | --- |
| `npm run build` | PASS，272个 HTML，272个共享样式图，0个重定向豁免 |
| 独立产物检查 | 572个实际 CSS 文件/内联块；8,986条相关布局声明；无漏编译/inline 绕过 |
| 源间距盘点 | 6,288条唯一 file/block/line/column 声明，其中5,222条归一，分布于180个文件 |
| 精确源例外 | 67条：52个固定画布本体、6个数学/科学画布、5个 print、4个可访问性隐藏 |
| 阅读宽度 | 108条正文/列表/lede声明，61个文件，统一到68ch owner |
| 编译记录 | 10,163条，4,764条发生归一；包含 scoped/vendor 管线记录，不能当唯一源数量 |
| 可见日期 | 272页 PASS；218页共5,075个可见文字块标准化；5个格式器测试 PASS |
| 历史字体账本 | 原5,491条未刷新；3,283 MIGRATE、1,217 JUSTIFIED_EXCEPTION、991 DEAD_OR_SHADOWED，pending=0 |
| 当前字体声明 | 5,528条，旧科学角色保留；普通 `strong,b` 追加1条既有权重token分类 |
| 确定性门禁 | `verify:deploy` 展开的22条命令全部 PASS；只将 `tsx` CLI 换成同一 loader 的 `node --import tsx` |
| TypeScript/Astro | 751文件，0 error、0 warning、6个既有 hint |
| Vitest | structural：147文件/941例；behavior：8文件/39例，全部通过 |
| 测试发现 | 两个相关 Playwright spec 收集227例，其中16个全路由批次；只完成收集，未声称浏览器执行 |

`site.css` 的87条/91个引用只是最初的共享基础绑定，不是全站间距覆盖数。最终执行还包括真实 scoped 普通 UI、研究页普通 HTML、Starlight、Tailwind 和已识别的动态阅读层。源码 literal 仍作为公共编译层的输入保留；以上数字不表示每条源 CSS 都匹配当前 DOM，也不表示历史截图被重新观测。

## 实现决策

- 延用现有字体、字号、字重、行高和科研 ledger；普通强调不再依赖 UA `bolder`，已存在的科学 scoped 权重继续生效。
- 有限尺度实际合并18/20→16、14→12等旧差异；相对 rem/em仍保持可访问性关系。默认正文/列表直接消费语义节奏，公共壳、工作台和Tailwind也接入已有owner。
- `--reading-width` 保留此前最终生效的68ch；删掉720px/72ch的竞争定义，旧70ch的 `--type-reading-measure` 改为别名。标题、控件、表格和科学画布保留各自尺寸角色。
- 例外不按 research/figure 目录或 chart/axis 类名判断；常数calc、负/正混合值和 `not print` 的坏例会失败。固定演示文稿只保留真实画布本体，外层及普通段落归一。
- 静态CSS、全量HTML内联style、已知DOM/React style出口和浏览器实际消费是四个独立检查面。没有把声明token本身当作可见消费证明。
- 完整日期统一中文年月日、英文YYYY-MM-DD；年月/年份等来源精度原样保留，模型时间线不截掉已知日。机器属性、路径、代码和科研数据未被日期显示层改写。

## 正式渲染交接

本执行器的Chromium启动被Unix socket权限阻止；下载的WebKit缺系统依赖，安装依赖需要不可用的su。因此没有本地浏览器或截图PASS。未修改项目门禁来绕过这个限制。

正式 Public PR CI 的 `full_browser` 从同一次新构建动态发现 `test:ui:all`，以Chromium/WebKit完整分片执行：272页×2视口×2引擎共1,088次默认文档访问。每页测量body字体/行高、main内可见角色的实际spacing owner与正文阅读宽度，所有扰动和恢复均等待两帧并验证恢复值。手机当前由百分比或容器控制的宽度单列，不冒充固定阅读宽度。静态全路由上下文关闭脚本；10类代表页面另启脚本、查动态style、留明暗首屏截图，原有科学交互和日期交互测试继续执行。

需在本候选提交后执行并读取同一head的 `public-ci-gate` 和 `cloudflare-artifact-gate`，再按已有保护合并。实际发布仍按 `release-provider.yml` 的main-only、先plan后deploy流程，以部署SHA和受保护的真实页面验收为准。

复现命令：`npm run build`；`npm run verify:deploy`（正常CI直接使用原命令）；`node scripts/audit-sitewide-typography.mjs --json reports/sitewide-design/route-design.json`。构建自动生成完整的 `reports/sitewide-design/spacing-build.json`，此收据保留其唯一源分组和逐项例外，不重复提交全部编译中间记录。
