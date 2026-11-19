# 全站字体、排版、间距与日期交付

> #1026 · Implementation: SOURCE COMPLETE · Local deterministic: PASS
> Full-route browser / exact-head CI / merge / deployment: PENDING
> Workstream: website-wide presentation · Size: L

## 目标与来源

2026年11月20日，站点维护者要求所有页面实际引用同站的一套字体、字号、字重、行距、间距和年月日规范。站点保留现有 Research Editorial × Experimental Workbench 风格；其他网站不共享视觉数值。

## 已核实的基础与去重

- 现有唯一字号 owner 是 `src/styles/tokens.css`，阅读模式由现有共享 CSS 拥有。
- `sitewide-typography-standard.md`、历史 typography ledger、全站日期规范和浏览器检查已存在；复用这些 owner。
- 当前 #816 处理有限科研 section/figure CSS 归属；本工作覆盖整站实际消费、剩余声明与年月日一致性，不合入其历史内容或其他研究工作。
- 现有日期投影须保留原始数据、URL、代码、`datetime` 和科学证据字节。

## 范围与实施

1. 从生成 HTML 枚举全部路由（当前272个中文页面，含Starlight、404和独立阅读页）；核实每种页面的共享样式加载。英文格式器有回归，当前没有英文路由，不虚构其渲染覆盖。
2. 在已有 owner 完成语义字体、字号、字重、行高和间距收敛；迁移真正的重复定义，给图表/公式/演示文稿等必要例外明确角色。
3. 统一读者可见的完整日期为年→月→日：中文 `YYYY 年 M 月 D 日`，英文 `YYYY-MM-DD`；原本只有年/月的信息保留精度，不虚构日期。时间保留明确 UTC/SGT/PT 身份，不自动把日历日期当 UTC 时间换算。
4. 保留科学数据、功能、主题与可访问性；使现有校验检查真实调用方，而非只查规则文件存在。

## 验收合同

- [x] 272个生成HTML实际link/style/@import图接入全站字体/排版owner；0个重定向豁免。真实computed消费由下一条浏览器合同单独验收。
- [x] 既有字体、字号、行高角色与历史科学分类保留；新增普通强调owner、共享有限间距执行层和阅读宽度owner。67条实际几何例外逐项记录，源码literal仍是编译迁移输入，不声称全部删除。
- [x] 完整可见日期统一年月日顺序；静态输出和交互组件共用函数，模型时间线保留完整来源精度。代码、URL、原始数据、`time datetime`不受改写；交互实际渲染仍随正式CI验收。
- [x] 本地构建、现有内容/隐私/typography ledger门禁通过；22条确定性命令均通过；负例覆盖漏CSS入口、未匹配selector、孤立main、普通research正文、calc/负号/print边界和动态style。
- [ ] 全部路由做渲染覆盖，440×956 CSS px 手机模拟与1440px桌面检查字体计算值/溢出；各页面类型及明暗主题留可读截图。
- [ ] 当前 head 的 `public-ci-gate`、`cloudflare-artifact-gate` 通过，PR 从 Draft 转 Ready 后合并 main，核实 merge SHA。
- [ ] 网站发布按既有保护和手动发布流程推进，核对实际部署身份；将已合并与已上线分别报告。

## 执行、依赖与恢复

唯一写入者为本工作线执行者。优先级：本轮第一站；无其他站点依赖。先读取 `AGENTS.md`、现有 typography/date owner 和实际 audit 输出。不改科学语义、私密范围、账户权限或部署保护；回退使用本 PR 的逆向变更。用户已授权实现、验收、合并本工作线，现有必要门禁保持有效。

## 证据

[本地实现收据](../agents/evidence/sitewide-design/2026-11-20/README.md)及同目录`local-build.json`保留实际路由、HTML/源码哈希、角色/例外和命令结果。源间距6,291条、归一5,217条；正文阅读宽度108条；7个DOM/React动态spacing出口；所有272页日期和CSS图检查通过。源声明与编译记录分别计数，历史5,491条ledger未重写。

正式浏览器已接现有`test:ui:all`双引擎完整分片：两视口各16批枚举全部页面（17页/批、180秒/批，按已观测的34页批次超时拆分），main分角色消费与真实宽度扰动均等待两帧、验证恢复；10类代表页面留明暗截图。此执行器不能启动浏览器。首次正式候选d4d93442的双引擎CI发现4处首屏回归；定点修复与精确源码证明已完成、重新构建通过，新head正式渲染仍待验收。当前没有完整浏览器PASS，也没有合并或上线声明。独立只读复审已闭合已发现的边界、main/inline、reading width和恢复问题；由root推送当前代码后取得正式精确head证据。
