# 全站字体、排版、间距与日期交付

> Draft · Task spec only · Implementation: NOT DONE
> Workstream: website-wide presentation · Size: L · Confidence: medium

## 目标与来源

2026年11月20日，站点维护者要求所有页面实际引用同站的一套字体、字号、字重、行距、间距和年月日规范。站点保留现有 Research Editorial × Experimental Workbench 风格；其他网站不共享视觉数值。

## 已核实的基础与去重

- 现有唯一字号 owner 是 `src/styles/tokens.css`，阅读模式由现有共享 CSS 拥有。
- `sitewide-typography-standard.md`、历史 typography ledger、全站日期规范和浏览器检查已存在；复用这些 owner。
- 当前 #816 处理有限科研 section/figure CSS 归属；本工作覆盖整站实际消费、剩余声明与年月日一致性，不合入其历史内容或其他研究工作。
- 现有日期投影须保留原始数据、URL、代码、`datetime` 和科学证据字节。

## 范围与实施

1. 从生成 HTML 枚举全部路由（含英文、Starlight、独立 HTML/重定向）；核实每种页面的共享样式加载。
2. 在已有 owner 完成语义字体、字号、字重、行高和间距收敛；迁移真正的重复定义，给图表/公式/演示文稿等必要例外明确角色。
3. 统一读者可见的完整日期为年→月→日：中文 `YYYY年M月D日`，英文 `YYYY-MM-DD`；原本只有年/月的信息保留精度，不虚构日期。时间保留明确 UTC/SGT/PT 身份，不自动把日历日期当 UTC 时间换算。
4. 保留科学数据、功能、主题与可访问性；使现有校验检查真实调用方，而非只查规则文件存在。

## 验收合同

- [ ] 每个生成的 HTML 路由都能找到实际生效的全站字体/排版 owner；重定向等例外逐条列入清单。
- [ ] 字体、同角色字号/字重/行高/段落与区域间距来自共享 owner，局部差异有真实页面角色说明；剩余未实施项不得被标成完成。
- [ ] 完整可见日期统一年月日顺序，客户端更新也一致；代码、URL、原始数据、`time datetime` 不受改写。
- [ ] 构建、现有内容/隐私/typography ledger 门禁通过；新断言有已知坏例证明会拒绝漏接页面/不一致日期。
- [ ] 全部路由做渲染覆盖，440×956 CSS px 手机模拟与1440px桌面检查字体计算值/溢出；各页面类型及明暗主题留可读截图。
- [ ] 当前 head 的 `public-ci-gate`、`cloudflare-artifact-gate` 通过，PR 从 Draft 转 Ready 后合并 main，核实 merge SHA。
- [ ] 网站发布按既有保护和手动发布流程推进，核对实际部署身份；将已合并与已上线分别报告。

## 执行、依赖与恢复

唯一写入者为本工作线执行者。优先级：本轮第一站；无其他站点依赖。先读取 `AGENTS.md`、现有 typography/date owner 和实际 audit 输出。不改科学语义、私密范围、账户权限或部署保护；回退使用本 PR 的逆向变更。用户已授权实现、验收、合并本工作线，现有必要门禁保持有效。

## 证据

规格已建立；实现 NOT DONE；当前候选构建/浏览器验收 NOT RUN。实施时在本文件补上最终命令、覆盖数量、结果和证据入口。
