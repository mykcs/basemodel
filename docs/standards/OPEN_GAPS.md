# Open acceptance gaps and owner worklines

**状态核对：2026-11-09（SGT），基于 GitHub PR metadata 与 `main` 源码。** 此页仅负责将未闭环问题指向现有 owner，不是第二套设计、CI 或科研规范；PR 合并也不能证明网站 Production 已发布。每次操作前重新核对 live main、PR、CI 和部署。

| Current situation | Evidence / owner | Next required check |
| --- | --- | --- |
| **Design System 重复写入风险** | [#806](https://github.com/mykcs/basemodel/pull/806) 和 [#895](https://github.com/mykcs/basemodel/pull/895) 均已 **closed / not merged**；[#976](https://github.com/mykcs/basemodel/pull/976) 的 Intelligence UI 规则及 [#841](https://github.com/mykcs/basemodel/pull/841) 的阅读路径已 **merged**。正式样式仍由 [CSS architecture](../agents/current/css-architecture.md) 所列现有 tokens、app.css 和语义 owner 负责。 | 不重新打开两套宽泛设计规范或复制 tokens；新交互从现有 owner、组件与实际渲染出发。 |
| **CSS 所有权去重尚未合并** | [#816](https://github.com/mykcs/basemodel/pull/816) 仍 **Draft / unmerged**，涉及共享段落标题与 WebShop 图形外壳；其历史通过的 CI 属旧 HEAD/基线。 | 先核对当前源码与其他 PR，只有合法写入能力及 fresh exact-head 全套测试后才考虑合并；旧分支不得覆盖新 owner 或改写科研图几何。 |
| **WebShop 阅读层次尚未合并** | [#840](https://github.com/mykcs/basemodel/pull/840) 仍 **Draft / unmerged**，涉及 WebShop reader map 与排版审计；[#841](https://github.com/mykcs/basemodel/pull/841) 的已合阅读路径不是 #840 已发布的证明。 | 保留新 main 已合排版／可访问性证据，重新核对真实浏览器与两道门禁；不能强合旧 Draft 或绕过此前针对该对象的明确拒绝。 |
| **Searchable Starlight handbook — source merged** | [#860](https://github.com/mykcs/basemodel/pull/860) 已 **merged**；Starlight 已有实际消费点。 | 不再重复安装／开第二个 handbook PR；若要判断读者能否访问，仍需受保护 Production 的部署 SHA 与登录后路由验收。 |
| **OpenEVO 三篇博客首屏门 — old candidate closed** | [#855](https://github.com/mykcs/basemodel/pull/855) 已 **closed / not merged**，旧 PR 的几何检查不能自动算入 main。 | 仅按当前 [Reader Attention Contract](../agents/current/site-reader-attention-contract.md) 和真实源代码／浏览器验收是否存在同一缺口再行动。 |
| **Scientific table HTML / CSV / LaTeX parity — Draft** | [#827](https://github.com/mykcs/basemodel/pull/827) 保持 **Draft / unmerged**。 | 保留原科研数据和实验分母；不要另建第二套 ScientificTable；需要同源证据与新的 exact-head 验收。 |
| **Root README release/privacy drift — corrected in this candidate** | [README](../../README.md) 现在写明公开仓库、GitHub 双门禁及 Vercel 默认／Cloudflare standby 的**手动受保护发布**，不再把 Vercel Preview 写成必需 PR 检查，或把旧私有化愿望当现行决定。 | 通过 CI 并合并本次文档变更后，依 [hosting architecture](../agents/current/hosting-architecture.md) 和实时 provider 独立核对 Production；不把文档修正误报为已发布。 |
| **Universal human comprehension — not verified** | [Reader Contract](../agents/current/site-reader-attention-contract.md) 与 [UI visual gate](../agents/current/ui-change-visual-acceptance-gate.md) 是自动化代理指标，不是完整真人冷读。 | 对 Home、Flow、Results 的代表性页面进行真实上下文测试，保留误解、截图和修复证据；不可拿 CI PASS 冒充全部人类阅读验收。 |

## Closing an entry

重读当前 PR／源码／provider → 在**现有语义 owner** 中修复 → 实际测试与独立验收 → 凭确切已合并证据移除或调整对应行。未核实仍保持 UNKNOWN。

**Out of scope here:** 新 Design CSS、再次安装 Starlight/Tailwind、改科研结论、GPU/训练、发布生产站、替换现行 Agent 规范或建立第二套 CI。
