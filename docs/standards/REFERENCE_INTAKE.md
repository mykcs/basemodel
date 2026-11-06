# 如何把新的参考加入 Standards

**当前阶段：仅登记与查找参考。未来如何采用、如何制定标准，等待用户另外明确提出。**

**定位：参考来源与验收索引流程，非第二套 Wish / Design / Dev 规则。**

下面的“实施、验收、升级标准”描述属于**未来可选流程**，不是本次收集参考的自动待办清单，也不意味着用户已经同意把某个模仿对象变成强制规范。现在入库只需核对名称、原始来源、用户指出的特点及尚未确认的部分。 不应为每个参考新建同名 CSS、重复的 Design 规范或未经授权的新路由。

## 每个新案例的最小卡片

| 字段 | 必须说明的内容 |
| --- | --- |
| `ID` 与主题 | WEB / SCI 等稳定 ID，Agent 可以按主题检索 |
| `User intent` | 用户**原话实际喜欢/不喜欢的细节**；单独标识 Agent 自己推测的部分 |
| `Source` 与可靠性 | 官方 URL、论文页码/TeX 源、明确截图/仓库 commit；仅点名就标 SOURCE-UNVERIFIED；不得公开私人主目录或上传私密 HTML |
| `Transferable principle` | 这类表达怎样降低阅读/选择/复现成本；不要只写“模仿某品牌” |
| `Do not copy` | 品牌皮肤、他人代码/原图/统计、营销语气、没有两份 SHA 的假 Git Diff |
| `Target and owner` | 具体 BaseModel 路由及 Reader Contract、相关 Design/Dev/current owner/在途 PR |
| `Acceptance` | 在实际源码与网页中验证什么，哪些要跑浏览器/科学收据/真人冷读 |
| `Status` | 来源身份、实际实现与用户认可**分别**写，不能仅标“完成” |

## 工作流：来源 → 学习 → 验收

1. **先存来源和用户反馈**：确切链接/页码/截图/文件名与所喜欢的点。来源未核实时保留空位，而不是猜；不向公共仓库复制受限附件。
2. **更新 [REFERENCE_LIBRARY.md](REFERENCE_LIBRARY.md)**：根据读者任务找到类似案例，在原行补充或增一行；不要为同一个现象开第二套参考列表。
3. **对照原项目 owner**：Wish 是愿望；当前 Design/Reader Contract 解释页面如何理解；Dev/代码/测试负责实现。查看正在进行的 [Design #806](https://github.com/mykcs/basemodel/pull/806)、[Starlight #860](https://github.com/mykcs/basemodel/pull/860)、[Q01 图 #856](https://github.com/mykcs/basemodel/pull/856) 与 [科学表 #827](https://github.com/mykcs/basemodel/pull/827)，不得并行复制同一实现。
4. **提出一项可检验的假说**：例如“首屏缩减次级内容后，零背景读者能先认出 WebShop 实验问题”，不是“看起来更像 Apple”。
5. **在真实代码 owner 里实施和测试**：按 [现有验收图](ACCEPTANCE_MAP.md) 做源数据、渲染、手机/桌面、深浅主题、语义可访问性及必要的真人冷读；科学结论与 caveat 不能被弱化。
6. **再决定是否升级为标准**：页面实施得到真实证据、用户明确接受后，更新现有 `docs/agents/current/` 的单一规则或 Reader Contract；Standards 只指向它，不产生一份相竞争的正式 policy。
7. **最后复核 GitHub/Provider**：PR、CI、Vercel、Production 和人工签收分别报告。成功的构建不是所有页面的视觉验收。

## 未完成参考如何诚实写状态

- WEB-07 Cloud and Slope：USER-NAMED / SOURCE-UNVERIFIED。
- WEB-08 本地 round7 HTML：USER-PREFERRED / LOCAL-ARTIFACT-NOT-READ；只能提候选，不能上传原件或声称复刻完成。
- WEB-04 Claude Code Docs：SOURCE-VERIFIED / USER-PREFERENCE；未证明 CSS 对比已满足用户偏好。
- WEB-05 Starlight：SOURCE-VERIFIED / IMPLEMENTATION-PR-OPEN（写入时）；验收后才能升为 Production。
- SCI-02 Kimi Linear：SOURCE-VERIFIED / VISUAL-GRAMMAR-REFERENCE；与 OpenEVO 真实实验结果严格隔离。

**验收不是给一个名牌网站打勾，而是给 BaseModel 当前读者的问题提供真实、可重复的改善证据。**
