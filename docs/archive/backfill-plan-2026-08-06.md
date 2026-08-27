# Basemodel 图谱：数据补全与修改计划（截至 2026-08-06）

> **历史快照声明**：本文只记录 2026-08-06 的回填基线，不代表当前模型数量、未知值数量或完成状态。当前规则是：无法由来源证明的字段必须保留为 `not_disclosed`、`not_applicable`、`not_reported`、`not_verified`、`not_published` 或 `unavailable`，并由 `evidence_note` 解释；最新验收以 `audit:semantic`、`audit:v2` 和 `audit:v2:adversarial` 为准。

> 交付对象：执行 Agent。本文档是**代码级修改计划**，包含缺口清单、逐文件修改步骤和验收标准。
> 执行原则：所有事实字段必须有一手来源（官方模型卡 / 官方文档 / 技术报告 / 官方仓库），并填 `checked_at`；查不到就写语义状态，**禁止猜测填充**。

## TL;DR

- 站点数据层是 `src/content/models/*.json`（一模型一文件）+ `src/content/coverage/{families,vendors}.json`，schema 在 `src/lib/schemas.ts`。**本次修改不涉及 schema 变更，全部是数据文件的新增和改写**。
- 当前 67 个模型记录，其中 **49 条是 partial / 待核验**，全站 237 个字段处于 `not_verified` 状态。
- **Anthropic、Google 两家严重断代**：Anthropic 只有 3 条记录、最新停留在 2024-06；Google 主线上只有 Gemini 1.5 Pro。
- **xAI（Grok）、MiniMax 两个厂商整体缺失**。
- 另有 3 个**数据一致性问题**（vendor 命名分裂、families.json 代际过期、Mistral 7B 代际标签）。
- 计划新增约 **45 条模型记录**，并回填约 20 条现有记录的缺失参数。

## 1. 现状盘点

数据流：

```
src/content/models/*.json        → Astro Content Collection（Zod 校验，src/lib/schemas.ts）
src/content/coverage/families.json → 家族级"当前旗舰/当前代"声明
src/content/coverage/vendors.json  → 厂商目录与官方目录 URL
src/pages/families/index.astro    → 按 model JSON 的 vendor / family / generation 分组渲染
```

关键点：**families 页面的厂商分组直接取模型 JSON 里的 `vendor` 字符串**。字符串不一致就会产生重复分组（见 2.4）。

校验工具链（验收靠它们）：

```bash
npm run validate            # check-relations + validate-data
npm test                    # 单元测试
npm run check               # astro check
npm run build               # 构建
npm run audit:claims        # 字段级证据审计 → reports/claim-audit.{json,md,csv}
npm run audit:vendor-catalogs
npm run audit:urls          # 来源 URL 健康检查
npm run audit:semantic      # 语义缺口
```

## 2. 缺口清单

证据等级：**✅ 已核实** = 本次已用可引用来源确认；**⚠️ 待核验** = 执行时必须对官方来源二次确认后才能写入。

### 2.1 整体缺失的厂商

#### 2.1.1 xAI / Grok（需新增 vendor + family）

| 新文件 id | 名称 | 发布日期 | 关键参数 | 证据等级 |
|---|---|---|---|---|
| `grok-3` | Grok 3 | 2025-02-17 | 闭源 API；上下文待核验 | ⚠️ |
| `grok-4` | Grok 4 | 2025-07-09 | 闭源 API | ⚠️ |
| `grok-4-1` | Grok 4.1 | 2025 年底 | 待核验 | ⚠️ |
| `grok-4-3` | Grok 4.3 | 2026-04 | 待核验 | ⚠️ |
| `grok-4-5` | Grok 4.5 | 2026-07-08 | 500K 上下文；$2/$6 每百万 token；参数官方未正式披露 → `not_disclosed` | ✅(上下文/价格/日期)；参数 ⚠️ |

注意：xAI 于 2026-02 并入 SpaceX。vendor 名建议用 `xAI`，`vendor_id: "xai"`，名称变迁写入 notes。官方目录：<https://docs.x.ai/docs/models>。**Grok 4.6 传闻 2026-08-07 发布——未发布，不录入。**

#### 2.1.2 MiniMax（需新增 vendor + family）

| 新文件 id | 名称 | 发布日期 | 关键参数 | 证据等级 |
|---|---|---|---|---|
| `minimax-m1` | MiniMax M1 | 2025-06-16 | 456B MoE / 45.9B 激活；Apache 2.0 开放权重 | ⚠️ |
| `minimax-m2` | MiniMax M2 | 2025-10-27 | 230B MoE / ~10B 激活；~200K 上下文；开放权重 | ✅ |
| `minimax-m2-7` | MiniMax M2.7 | 2026-03-18 | M2 线最新 checkpoint，同架构 | ✅ |
| `minimax-m3` | MiniMax M3 | 2026 上半年 | 428B 多模态 MoE，新注意力设计 | ⚠️（日期/参数需官方确认） |

官方目录：<https://www.minimax.io/> / <https://huggingface.co/MiniMaxAI>。M2.1/M2.5 中间 checkpoint 不单独建文件，在 `minimax-m2` 的 aliases/notes 带过。

### 2.2 断代的家族（按严重程度排序）

#### 2.2.1 Anthropic / Claude——最严重，仅 3 条记录且停在 2024-06

现有：`claude-2`、`claude-3-opus`、`claude-3-5-sonnet`。`families.json` 里 `current_generation` 还是 "Claude 3.5"，**事实错误**。

需新增（均为闭源 API 模型，`architecture.*` 大多填 `not_disclosed`）：

| 新文件 id | 发布日期 | 备注 | 证据等级 |
|---|---|---|---|
| `claude-3-7-sonnet` | 2025-02-24 | 首个 extended thinking | ⚠️ |
| `claude-opus-4` | 2025-05-22 | 已退役 → `status:"legacy"`, api_status `deprecated` | ⚠️ |
| `claude-sonnet-4` | 2025-05-22 | 同上已退役 | ⚠️ |
| `claude-opus-4-1` | 2025-08-05 | | ⚠️ |
| `claude-sonnet-4-5` | 2025-09-29 | | ⚠️ |
| `claude-haiku-4-5` | 2025-10-15 | 200K 上下文；当前在售速度档 | ✅ |
| `claude-opus-4-5` | 2025-11-24 | | ⚠️ |
| `claude-sonnet-4-6` | 2026-02 | 已被 Sonnet 5 取代 → legacy | ⚠️ |
| `claude-opus-4-6` / `claude-opus-4-7` | 2026-02~04 | 已被 4.8 取代 → legacy；存在性与日期需核验 | ⚠️ |
| `claude-opus-4-8` | 2026(02-04 与 05-28 两说冲突) | 当前 Opus 档旗舰；1M 上下文(beta)；API id `claude-opus-4-8` | ⚠️(日期必须查官方) |
| `claude-fable-5` | 2026-06-09 | 当前最顶层；1M 上下文；API id `claude-fable-5` | ✅ |
| `claude-mythos-5` | 2026-06-09 | 仅 Project Glasswing 合作方 → `status:"preview"` | ✅ |
| `claude-sonnet-5` | 2026-06-30 | 当前生产默认；新 tokenizer 写 notes | ✅ |

统一来源：<https://docs.anthropic.com/en/docs/about-claude/models>。`families.json` 中 Claude 的 `current_generation` 改为 `Claude Fable 5`。

#### 2.2.2 Google / Gemini——主线只有 1.5 Pro

需新增（闭源 API）：`gemini-2-0-flash`(2025-02-05 ⚠️)、`gemini-2-5-pro`(2025-03-25,1M ⚠️)、`gemini-2-5-flash`(2025-06 ⚠️)、`gemini-3-pro`(2025-11-18,1M ✅)、`gemini-3-flash`(2025-12-17 ✅)、`gemini-3-1-pro`(2026-02-19 ⚠️)、`gemini-3-5-flash`(2026-05,当前最新稳定档 ✅)。
来源：<https://ai.google.dev/gemini-api/docs/models>。Gemma 4 参数回填见 2.3。

#### 2.2.3 OpenAI / GPT——停在 5.2

需新增（除注明外闭源 API；5.4 起上下文 1M~1.05M，最大输出 128K）：
`o1`(2024-12-17 ⚠️)、`o3`(2025-04-16 ⚠️)、`o4-mini`(2025-04-16 ⚠️)、`gpt-4-5`(2025-02-27,可能 legacy ⚠️)、`gpt-5-3-codex`(2026-02-05 ✅)、`gpt-5-4`(2026-03-05,首个主线 native computer use ✅)、`gpt-5-5`(2026-04-23,完整重训底座 ✅)、`gpt-5-6-sol`/`gpt-5-6-terra`/`gpt-5-6-luna`(均 2026-07-09；sol 旗舰 1.05M ✅)。
来源：<https://platform.openai.com/docs/models>。`max` 推理/`ultra` 多智能体为产品能力，不编造架构参数。

#### 2.2.4 DeepSeek——缺 V3 原始版、V3.1、R1-0528、V4 全系（均 MIT 开放权重）

| 新文件 id | 发布日期 | 关键参数 | 证据等级 |
|---|---|---|---|
| `deepseek-v3` | 2024-12-26 | 671B MoE/37B 激活；128K | ⚠️ |
| `deepseek-r1-0528` | 2025-05-28 | R1 刷新；上下文扩至 164K | ✅ |
| `deepseek-v3-1` | 2025-08-21 | 671B/37B；混合推理 | ⚠️ |
| `deepseek-v3-2-exp` | 2025-09-29 | DSA 稀疏注意力实验版（可与 v3-2 合并） | ⚠️ |
| `deepseek-v3-2-speciale` | 2025-12 | agentic 变体 | ✅(存在)；参数 ⚠️ |
| `deepseek-v4-pro` | 2026-04-24 | 1.6T 总参/49B 激活；1M；MIT；官方口径仍 "Preview" | ✅ |
| `deepseek-v4-flash` | 2026-04-24 | 284B/13B 激活；1M；2026-07-31 有 `V4-Flash-0731` build | ✅ |

来源：<https://huggingface.co/deepseek-ai>、<https://api-docs.deepseek.com/>。**DeepSeek R2 未发布，不录入。**

#### 2.2.5 GLM / Z.ai——停在 4.7（均 MIT 开放权重）

| 新文件 id | 发布日期 | 关键参数 | 证据等级 |
|---|---|---|---|
| `glm-4-5-air` | 2025-07-28 | 106B MoE/12B 激活 | ⚠️ |
| `glm-5` | 2026 初 | 待核验 | ⚠️ |
| `glm-5-1` | 2026 上半年 | 待核验 | ⚠️ |
| `glm-5-2` | 2026-06-13(Coding Plan)/06-16(API) | ~744–753B 总参(两源不一致,以官方模型卡为准)/~40B 激活；1M；MIT | ✅(存在/日期/许可)；参数 ⚠️ |

来源：<https://huggingface.co/zai-org>、<https://z.ai/>。**GLM-5.5 仅传闻，不录入。**

#### 2.2.6 Meta / Llama

需新增：`llama-3-8b-instruct` / `llama-3-70b-instruct`(2024-04-18 ⚠️，Llama 3 原始代整条缺失)；`llama-4-behemoth`(**未发布**——只在 scout/maverick notes 提及，不单独建文件)；`muse-spark`(2026-04-08，Meta 首个闭源前沿模型，private-preview API，`access.api_status:"preview"`，开放性全 `not_disclosed`/`false` ✅)。
来源：<https://www.llama.com/models/>。

#### 2.2.7 Mistral AI

需新增：`mistral-medium-3`(2025-05-07 ⚠️，闭源/API)、`magistral-small`/`magistral-medium`(2025-06-10 ⚠️，Small 为 Apache 2.0)、`devstral-small`/`devstral-medium`(2025-05~07 ⚠️，Small Apache 2.0)。未命名新 MoE（2026-07 早期访问）**等官方命名再录**。
来源：<https://docs.mistral.ai/getting-started/models/>。

#### 2.2.8 Qwen——专线和尺寸档有缺

建议新增（优先级从高到低）：`qwen3-next-80b-a3b-instruct`(2025-09 ⚠️)、`qwen3-coder-480b-a35b-instruct`(2025-07-22 ⚠️)、`qwen3-vl-235b-a22b-instruct`(2025-09 ⚠️)、`qwen3-max`(2025-09 ⚠️ API-only 旗舰)、`qwen2-72b-instruct`(代际锚点 ⚠️)、`qwen3-6-27b`(需确认是否存在 ⚠️)。
来源：<https://github.com/QwenLM>、<https://huggingface.co/Qwen>。

#### 2.2.9 Moonshot / Kimi——基本最新

K3 已收录且 verified。核验 "K2.7 Code" 是否真实存在；若无官方记录不录入。确认 `kimi-k3.json` 的 `access.weights_status` 已更新为 `released` 并补 `weights_url`（权重已于 2026-07-26/27 放出）。

### 2.3 现有记录的参数缺口（回填清单）

| 文件 | 缺口 | 回填方向 |
|---|---|---|
| `deepseek-v3-2.json` | `active_parameters_b: not_reported` | 37B（技术报告/HF）；上下文 128K（164K 扩展写 notes） |
| `deepseek-v3-2.json` | 总参 685.397B 精度异常 | 官方口径 685B，核对模型卡 |
| `gemma-4.json` | 全部参数 `not_reported` | 查 <https://ai.google.dev/gemma> |
| `qwen3-5-27b.json` / `qwen3-6-35b-a3b.json` | 多项 `not_verified` | Qwen 官方仓库 README 与 HF 模型卡 |
| `kimi-k3.json` | weights 状态 | 权重已发布 → `released` + `weights_url`；Modified MIT |
| `gpt-5-2.json` 等 OpenAI 记录 | 上下文窗口 | 官方 models 页有明确上下文；参数量保持 `not_disclosed` |
| Claude 三条旧记录 | 上下文、API id、退役状态 | Claude 3 代已退役 → `legacy` + `deprecated` |
| 全部 67 条旧记录 | 缺 `access`/`reproducibility`/`openness.classification` | 逐条按官方来源补齐；补不了保持显式缺口 |
| `mistral-7b-instruct-v0-3.json` | `generation` 显示为 2024-05-22 | `generation` 标注 "Mistral 7B (v0.3)" 避免误读为原始发布日 |

### 2.4 数据一致性问题（必须修）

1. **vendor 字符串分裂**（families 页重复厂商组根因）：
   - `"Zhipu AI / Z.ai"` 与 `"Zhipu AI"` → 统一为 `GLM / Z.ai`
   - `"Moonshot AI / Kimi"` 与 `"Moonshot AI"` → 统一为 `Moonshot AI`
   - `"Alibaba"` 与 `"Alibaba / Qwen"` → 统一为 `Qwen / Alibaba`
2. **`families.json` 代际过期**：Claude `current_generation` 仍 "Claude 3.5"（应 "Claude Fable 5"）；其他家族按 2.2 结果逐个更新。除 kimi 外其他家族都缺 `current_flagship_model_id`/`current_api_model_ids`/`official_catalog_urls`，按 kimi 条目格式补齐。
3. **LMSYS / Vicuna**：标 `status:"legacy"` 保留，不删除。

## 3. 覆盖范围决策（默认采用，无需再问）

- **D1 覆盖粒度 = B（代际锚点 + 当前代全档）**：收录①当前在售/最新代全档位，②历代首发锚点，③papers 实际引用的模型。
- **D2 rumored 纪律 = 严格**：GLM-5.5/R2/Grok 4.6/Llama 5 等未发布一律不建文件。
- **D3 受限模型 = 收录但标注**：Muse Spark/Mythos 5 等 `access` 标 `preview`/受限，开放性如实填闭源。
- **D4 第三梯队 = 本轮不扩**：Step/Phi/Nemotron/Seed/Hunyuan/Inkling 下轮单独立项。

## 4. 代码级修改步骤

### Step 0：基线
```bash
git checkout -b data/backfill-2026-08
npm install
npm run validate && npm test && npm run build
npm run audit:claims && npm run audit:semantic   # 保存为修改前基线
```

### Step 1：vendor 命名归一化（先于新增）
对 `src/content/models/` 下所有 JSON 字符串替换（见 2.4.1）。跑 `npm run validate && npm run build`，确认 families 页不再重复厂商组。**单独一个 commit**。

### Step 2：新增厂商条目（vendors.json + families.json）
`vendors.json` 追加 `xai`、`minimax`（含 official_catalog_urls / refresh_days / model_types）。
`families.json` 追加 `grok`、`minimax`，并按 kimi 条目完整格式重写全部 10 个已有家族条目。`checked_at`/`as_of` 用执行当天。

### Step 3：新增模型 JSON（约 45 个文件）
位置 `src/content/models/<id>.json`，id 满足 `^[a-z0-9]+(?:-[a-z0-9]+)*$`。
**填写纪律**：
1. `sources` ≥1 条一手来源，优先 `official_model_card`/`official_docs`/`official_announcement`/`technical_report`；每条带 `checked_at`（执行当天）和 `supports`（字段级映射）。
2. 闭源 API：参数/`expert_count` 填 `not_disclosed`；`weights_available:false`；`license_name:"proprietary"`；`access.api_status:"available"` + `api_model_ids`；`hardware.*_tier:"api_only"`。
3. 开放权重：`weights_available:true`；`license_name` 实际许可证；`access.weights_status:"released"`+`weights_url`；`classification` 区分 `open_source`(OSI 认可) vs `open_weight`(自定义许可)。
4. `research.*` 只在官方文档明确时填 `true`，否则 `not_verified`。
5. 查不到一律语义状态，不猜数字。
6. `data_status`：关键字段全有一手来源 → `verified`，否则 `partial`。

新增顺序（每批一个 commit）：Anthropic → Google → OpenAI → DeepSeek → GLM → Meta+Mistral → xAI+MiniMax → Qwen。

### Step 4：回填现有记录（2.3 清单）
逐文件改写，`checked_at` 更新为执行当天。改完跑 `npm run audit:claims` 对比基线，`not_verified` 必须显著下降。

### Step 5：校验流水线（全绿才算完）
```bash
npm run validate && npm test && npm run check && npm run build
npm run audit:claims && npm run audit:vendor-catalogs && npm run audit:urls
```

### Step 6：页面抽查
- `/families/`：无重复厂商；xAI/MiniMax 出现；各家族 `current_generation` 正确
- `/models/`：总数 = 67 + 实际新增数
- `/data-status/`：新厂商出现；`verified` 计数上升
- 抽 5 个新模型详情页：来源可点、缺口字段显示语义标签而非 0/false

### Step 7：提交与部署
按 Step 1–4 拆 commit，合并为一个 PR `data: backfill model coverage as of 2026-08-06`。merge 后 GitHub Actions 自动部署。

## 5. 验收标准

1. 所有校验命令通过。
2. 新增记录 100% 满足：≥1 条一手来源、`checked_at` 当天、无猜测值。
3. families 页：无重复厂商；xAI/MiniMax 存在；Claude 当前代 ≠ "Claude 3.5"。
4. ✅ 模型全部有对应文件；⚠️ 字段经官方确认后填入或保持语义状态——**不允许把 ⚠️ 直接当真值**。
5. 未发布模型无对应文件。
6. `verified` 记录数从 18 显著上升；全站 `not_verified` 字段数从 237 下降。
