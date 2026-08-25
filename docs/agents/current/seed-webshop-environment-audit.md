# SEED WebShop 环境与数据设定核验指南

Last reviewed: **2026-08-24**

Evidence snapshot for SEED code: [`jinyangwu/SEED@2cf2fad`](https://github.com/jinyangwu/SEED/tree/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c)

## 这份文档是干什么的

这不是一份“WebShop 是什么”的入门介绍，也不是一份 SEED 训练方法说明。

它只解决一个非常具体的问题：

> **如果一个 Agent 已经跑过 WebShop，并且它以为自己跑的是 SEED 论文/公开代码所对应的 WebShop 设定，那么它应该如何检查：自己到底跑对了没有，差在哪里？**

这份文档优先核验的是 **WebShop environment / data setting（WebShop 环境与数据设定）**：

- 商品世界是不是同一个；
- goal / task space（购物任务空间）是不是同一种生成方式；
- goal 数量是不是一致；
- train / held-out boundary（训练 / 保留边界）是不是一致；
- goal ordering（任务编号顺序）是否因为 seed 或入口不同而发生变化；
- 如果声称“完整复现 SEED WebShop 实验”，reward wrapper（奖励封装）是否也一致。

这份文档**刻意不核验** SEED 的训练算法、180/8/16 之类 rollout 规模、模型参数更新过程等训练细节。那些是另一层问题。

---

## 一页结论：SEED 使用的 WebShop 到底是什么

先记住下面这条链：

```text
Original WebShop
  ├─ 1.18M real-world products（约 118 万真实商品）
  └─ 12,087 crowd-sourced text instructions（12,087 条人工收集购物指令）

WebShop 官方 small 配置
  └─ 1,000-product subset（1,000 商品子集）

SEED released code 默认 / 明确使用 small WebShop 文件
  ├─ items_shuffle_1000.json
  └─ items_ins_v2_1000.json

WebAgentTextEnv
  └─ human_goals = 0 / False
      └─ synthetic goals（程序根据商品属性与选项生成的购物任务）

1,000 products
  └─ 6,910 goals

SEED wrapper
  ├─ held-out / eval candidate pool: goal indices 0–499
  └─ train candidate pool: goal indices 500–end

当 len(goals) = 6,910 时：
  ├─ held-out = 0–499 = 500 goals
  └─ train = 500–6909 = 6,410 goals
```

最重要的误区是：

> **不要把 `12,087 → 6,910` 理解成“SEED 从 WebShop 的 12,087 条原始任务中筛掉一部分，剩下 6,910 条”。**

这两个数字不是同一种来源：

- **12,087** 是原始 WebShop README 所说的 crowd-sourced text instructions（人工收集指令）；
- **6,910** 是 1,000-product small WebShop 在 synthetic goal generation（合成任务生成）路径下得到的 goal 数量。

WebShop 官方 README 同时给出了原始规模、`-d small` 的 1,000-product 子集，以及 small 环境启动后 `Loaded 6910 goals.` 的示例输出：

- [WebShop official README](https://github.com/princeton-nlp/WebShop/blob/master/README.md)
- [WebShop official `setup.sh`](https://github.com/princeton-nlp/WebShop/blob/master/setup.sh)

---

## 1. 先确认你是不是跑了同一个“商品世界”

### SEED-compatible 的核心检查

你应该看到 small WebShop 的两个文件：

```text
items_shuffle_1000.json
items_ins_v2_1000.json
```

SEED vendored WebShop 的 `setup.sh` 明确支持：

```bash
./setup.sh -d small
```

并说明 `small` 下载的是 1,000-product 数据文件：

- [`SEED/.../webshop/setup.sh`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/setup.sh)

SEED vendored WebShop 的默认路径也直接指向这两个 `_1000` 文件：

```python
DEFAULT_ATTR_PATH = '../data/items_ins_v2_1000.json'
DEFAULT_FILE_PATH = '../data/items_shuffle_1000.json'
```

- [`SEED/.../web_agent_site/utils.py`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/web_agent_site/utils.py)

SEED 的 SFT WebShop 数据准备入口还进一步把：

```bash
WEBSHOP_USE_SMALL=1
```

设为默认值：

- [`SEED/scripts/sft/webshop/prepare_data.sh`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/scripts/sft/webshop/prepare_data.sh)
- [`SEED/scripts/sft/webshop/pipeline.py`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/scripts/sft/webshop/pipeline.py)

### 如果你之前是下面这些情况

| 你实际跑的情况 | 结论 |
| --- | --- |
| `items_shuffle_1000.json` + `items_ins_v2_1000.json` | 商品世界与 SEED released code 对齐的强证据 |
| `items_shuffle.json` + `items_ins_v2.json` | **不对齐**：你跑的是 full WebShop 商品世界 |
| 自己重新随机抽了 1,000 个商品 | **不能自动视为对齐**：必须证明与 WebShop 官方 small 文件是同一批商品 |
| 只设置 `num_products=1000`，但数据文件仍是 full data | **不能自动视为对齐**：这不是与官方 small snapshot 等价的充分证据 |

### 判定

如果你的商品文件不是官方 `_1000` 这组，先不要继续说“与 SEED WebShop setting 相同”。

---

## 2. 再确认你是不是用了同一种 goal / task 生成方式

这里最容易混淆。

WebShop 代码里 `get_goals(...)` 有两条路径：

```python
if human_goals:
    return get_human_goals(...)
else:
    return get_synthetic_goals(...)
```

其中：

- `human goals（人工任务）`：读取人工指令；
- `synthetic goals（合成任务）`：程序根据商品的 instruction、attributes、options、price 等信息生成可执行购物目标。

官方代码：

- [`SEED/.../web_agent_site/engine/goal.py`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/web_agent_site/engine/goal.py)

SEED vendored `WebAgentTextEnv` 的 `SimServer` 默认参数是：

```python
human_goals=0
```

然后显式调用：

```python
self.goals = get_goals(self.all_products, self.product_prices, human_goals)
```

- [`SEED/.../web_agent_site/envs/web_agent_text_env.py`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/web_agent_site/envs/web_agent_text_env.py)

SEED 的 SFT 数据准备入口也默认：

```bash
WEBSHOP_HUMAN_GOALS=0
```

- [`SEED/scripts/sft/webshop/prepare_data.sh`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/scripts/sft/webshop/prepare_data.sh)

### 所以应该怎么理解 12,087 和 6,910

原始 WebShop 官方 README 说：

- 约 1.18M products；
- 12,087 crowd-sourced text instructions。

但是 small + synthetic-goal 路径的官方示例输出是：

```text
1000/1000
Loaded 6910 goals.
```

- [WebShop official README](https://github.com/princeton-nlp/WebShop/blob/master/README.md)

因此：

```text
12,087 human instructions
        ≠
6,910 synthetic goals
```

不要画成：

```text
12,087
  ↓ filter
6,910
```

更准确的是：

```text
WebShop 官方商品数据
      ↓ official small
1,000 products
      ↓ synthetic goal generation（合成任务生成）
6,910 goals
```

### 如果你之前是下面这些情况

| 你实际跑的情况 | 结论 |
| --- | --- |
| `human_goals=0` / `False`，small 数据加载出 6,910 goals | 与 SEED released setup 高度一致 |
| `human_goals=1` / `True` | **不对齐**：你走了 human-goal 路径 |
| 直接把 12,087 条原始人工 instruction 当作 SEED task pool | **不对齐** |
| 自己过滤出 6,910 条，但不是 WebShop synthetic generator 生成 | 数字相同也**不等于对齐** |

---

## 3. 检查实际 goal 数量：应该看到 6,910

在正确的 small + synthetic-goal 路径下，WebShop 官方 README 的示例运行直接打印：

```text
Loaded 6910 goals.
```

- [WebShop official README](https://github.com/princeton-nlp/WebShop/blob/master/README.md)

SEED 的文本环境也会在 `SimServer` 初始化后打印：

```python
print(f'Loaded {len(self.goals)} goals.')
```

- [`SEED/.../web_agent_text_env.py`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/web_agent_site/envs/web_agent_text_env.py)

### 最低限度的运行时证据

请保存你的日志，并确认至少存在下面的信息：

```text
product data: items_shuffle_1000.json
attribute data: items_ins_v2_1000.json
human_goals: 0 / False
Loaded 6910 goals.
```

如果 `len(goals) != 6910`，不要继续假设自己跑的是同一个 task space（任务空间）。先查清：

1. 数据文件是否正确；
2. `human_goals` 是否正确；
3. 是否做了额外 `filter_goals` / `limit_goals`；
4. 是否改过 WebShop / SEED vendored environment code。

---

## 4. 检查 SEED 对 goal pool 的划分

SEED 的 WebShop wrapper 明确写了：

```python
if not self.is_train:
    self.goal_idxs = range(500)
else:
    self.goal_idxs = range(500, len(goals))
```

官方链接：

- [`SEED/agent_system/environments/env_package/webshop/envs.py`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/envs.py)

因此当：

```text
len(goals) = 6910
```

时，SEED released wrapper 的边界是：

```text
held-out / eval candidate pool
0–499
= 500 goals

train candidate pool
500–6909
= 6,410 goals
```

### 这和原始 WebShop baseline split 不一样

原始 WebShop baseline wrapper 的 full-data split 是：

```python
test  -> range(500)
eval  -> range(500, 1500)
train -> range(1500, len(goals))
```

官方链接：

- [WebShop original `baseline_models/env.py`](https://github.com/princeton-nlp/WebShop/blob/master/baseline_models/env.py)

SEED 的 wrapper 在源码中甚至保留了这段原始 split 作为注释，然后把实际逻辑改成：

```text
0–499        -> non-train / held-out
500–end      -> train
```

### 如果你之前是下面这些情况

| 你实际跑的 split | 结论 |
| --- | --- |
| held-out `0–499`, train `500–end` | 与 SEED released wrapper 对齐 |
| test `0–499`, eval `500–1499`, train `1500–end` | 这是 WebShop original baseline split，**不是 SEED released wrapper 的实际划分** |
| train 从 0 开始 | **不对齐，并且可能发生 train / held-out 污染** |
| 自己重新随机划分 90/10 或 80/20 | **不对齐** |

---

## 5. 非常重要：goal ID 的“具体内容”还取决于 seed

不要只看到：

```text
0–499
500–6909
```

就认为你的 exact goals（具体任务）一定和 SEED 相同。

SEED vendored `WebAgentTextEnv` 的 `SimServer` 会这样做：

```python
random.seed(seed)
random.shuffle(self.goals)
```

也就是说，**goal index 是 shuffle 之后的位置**。

官方链接：

- [`SEED/.../web_agent_text_env.py`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/web_agent_site/envs/web_agent_text_env.py)

### SEED released code 里存在不同入口的不同默认 seed

公开 GRPO WebShop launcher 写的是：

```bash
env.seed=0
```

- [`SEED/examples/grpo_trainer/run_webshop.sh`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/examples/grpo_trainer/run_webshop.sh)

而 SFT WebShop 数据准备脚本默认是：

```bash
SEED=2026
```

并把这个 seed 传入 WebShop worker：

- [`SEED/scripts/sft/webshop/prepare_data.sh`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/scripts/sft/webshop/prepare_data.sh)
- [`SEED/scripts/sft/webshop/pipeline.py`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/scripts/sft/webshop/pipeline.py)

### 结论

**6,910 这个总量可以一致，但 `goal_idx = 17` 到底是哪条具体购物任务，只有在 goal generation + seed + shuffle 入口一致时才可认为一致。**

因此，任何声称“我和 SEED 使用完全相同 goal IDs”的实验，都必须记录：

```text
entry point / script
seed
data files
human_goals
len(goals)
```

不要只记录一个 `goal_idx`。

> 注意：WebShop 的 Flask `app.py` 里还能看到 `random.seed(233)` 的固定 shuffle，但 SEED 用于文本 / RL 的 `WebAgentTextEnv -> SimServer` 路径是按传入的 runtime `seed` shuffle。不要把 `233` 误当成 SEED 所有入口的统一 goal-order seed。

---

## 6. 如果你声称“完整 SEED WebShop 实验对齐”，还要额外检查 reward wrapper

这一项不是“数据集本身”，但它会直接影响实验结果，所以如果你已经跑了实验并声称与 SEED 可比，就不能忽略。

原始 WebShop 的 `get_reward(...)` 返回的是连续 task score（任务匹配得分），它综合商品类型、属性、options（商品选项）、价格等因素：

- [`SEED vendored WebShop goal.py`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/web_agent_site/engine/goal.py)

SEED 的 `WebshopWorker.step()` 会先保留：

```python
info['task_score'] = reward
```

然后把训练 reward 改成：

```python
if done and reward == 1.0:
    reward = 10.0
else:
    reward = 0
```

官方链接：

- [`SEED/agent_system/environments/env_package/webshop/envs.py`](https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/envs.py)

因此要区分：

```text
WebShop continuous task score
≠ exact success
≠ SEED training reward (10 / 0)
```

如果你只是声称“数据 / 环境对齐”，reward wrapper 可以单独报告。

如果你声称“完整 SEED WebShop experiment setting 对齐”，reward wrapper 也必须明确。

---

## 7. 另一个 Agent 应该怎样审计自己已经跑过的实验

不要凭记忆回答。请直接从实际代码、配置、日志和产物中取证。

### Step A — 先找出你真正运行的入口

记录：

```text
repository:
commit SHA:
entry script:
launch command:
config file(s):
```

如果这些都找不到，实验暂时不能声称“可复现地对齐 SEED”。

### Step B — 报告真实 WebShop 数据文件

记录：

```text
product file:
attribute file:
```

目标值应是：

```text
items_shuffle_1000.json
items_ins_v2_1000.json
```

最好进一步记录：

```text
absolute path:
file size:
SHA256:
```

这样以后可以做 byte-level（字节级）核验。

### Step C — 报告 goal generation 配置

记录：

```text
human_goals:
filter_goals:
limit_goals:
num_products:
```

SEED-compatible 核心条件：

```text
human_goals = 0 / False
no unreported filtering that changes the canonical pool
```

### Step D — 报告运行时实际加载数量

记录：

```text
loaded products:
len(goals):
```

目标：

```text
products = 1000
len(goals) = 6910
```

### Step E — 报告 goal ordering / seed

记录：

```text
runtime seed:
where seed is passed:
first 10 goal IDs + instruction text hashes:
```

如果要做严格 exact-ID 比较，建议保存每个 goal 的稳定 hash，而不是只保存整数 ID。

### Step F — 报告 split

记录：

```text
held-out indices:
train indices:
```

SEED released wrapper：

```text
held-out: 0–499
train: 500–len(goals)-1
```

在 6,910-goal small world 下就是：

```text
held-out: 0–499
train: 500–6909
```

### Step G — 如果要声称完整实验对齐，再报告 reward wrapper

记录：

```text
raw task_score:
training reward:
exact-success rule:
```

---

## 8. 请用这个模板给出最终审计结果

另一个 Agent 完成审计后，应当输出下面这份最小报告，而不是只说“我用的是 WebShop small”。

```markdown
# WebShop alignment audit

## Run identity
- repo:
- commit:
- entry script:
- launch command:

## Product world
- product file:
- attribute file:
- product count:
- SHA256 (if available):

## Goal generation
- human_goals:
- filter_goals:
- limit_goals:
- generated goal count:
- runtime seed:

## Split
- held-out goal index range:
- train goal index range:

## Reward (only if claiming full SEED-setting alignment)
- raw WebShop task score preserved?:
- success definition:
- training reward mapping:

## Verdict
- product world: MATCH / PARTIAL / MISMATCH / UNKNOWN
- goal generation: MATCH / PARTIAL / MISMATCH / UNKNOWN
- goal count: MATCH / MISMATCH / UNKNOWN
- split: MATCH / PARTIAL / MISMATCH / UNKNOWN
- exact goal-ID semantics: MATCH / PARTIAL / MISMATCH / UNKNOWN
- reward wrapper: MATCH / PARTIAL / MISMATCH / NOT_CHECKED

## Final claim
Choose exactly one:
1. SEED-compatible WebShop environment/data setting reproduced.
2. Partially aligned with SEED WebShop; differences listed below.
3. Not aligned with SEED WebShop setting; prior scores should not be compared as same-condition results.
4. Insufficient evidence; cannot determine alignment yet.

## Differences
- ...
```

---

## 9. 快速判定表

如果你没有时间看完整文档，至少用这一张表。

| 检查项 | SEED-compatible 目标 | 如果不满足 |
| --- | --- | --- |
| 商品文件 | `items_shuffle_1000.json` | 商品世界不一致 |
| 属性文件 | `items_ins_v2_1000.json` | 商品 / goal 生成输入不一致 |
| `human_goals` | `0 / False` | task generation 路径不一致 |
| `len(goals)` | `6910` | task space 不一致或被额外过滤 |
| held-out range | `0–499` | 评估候选池不一致 |
| train range | `500–6909`（在 6910 goals 下） | 训练候选池不一致 |
| goal-order seed | 必须显式记录并与所声称的 SEED 入口一致 | exact goal IDs 不可直接比较 |
| original WebShop `1500+` train split | **不要当作 SEED wrapper split** | 用错 split |
| 12,087 human instructions | **不要当作 SEED 的 6,910-goal pool** | 用错 task universe |

---

## 10. 证据层级

以后更新这份文档时，所有结论都按下面四种状态标记思考：

### PAPER EXPLICIT（论文明确）
论文正文 / appendix 直接说明。

### RELEASED-CODE EXPLICIT（公开代码明确）
SEED 或 WebShop 官方公开代码直接执行 / 指定。

### OUR INFERENCE（我们的推导）
例如：

```text
6910 total goals
- 500 held-out
= 6410 train candidates
```

这是由代码范围和总数推出来的算术结论。

### UNKNOWN（未知）
没有公开证据时就明确写未知，不自己补齐。

特别是：

> **不要因为 released code 有一个默认值，就自动声称论文最终主表一定使用了这个 exact runtime state；也不要因为论文写了某个数字，就自动假设 released code 的所有入口都完全一致。**

---

## 11. 官方代码索引

### Original WebShop

- Repository: <https://github.com/princeton-nlp/WebShop>
- README / scale / small setup / `Loaded 6910 goals`: <https://github.com/princeton-nlp/WebShop/blob/master/README.md>
- Official setup script: <https://github.com/princeton-nlp/WebShop/blob/master/setup.sh>
- Original baseline split: <https://github.com/princeton-nlp/WebShop/blob/master/baseline_models/env.py>

### SEED evidence snapshot

Pinned commit used by this document:

- <https://github.com/jinyangwu/SEED/tree/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c>

Key files:

- WebShop setup: <https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/setup.sh>
- Default small data paths: <https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/web_agent_site/utils.py>
- Text environment / `SimServer` / goal shuffle: <https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/web_agent_site/envs/web_agent_text_env.py>
- Goal generation and original WebShop score: <https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/webshop/web_agent_site/engine/goal.py>
- SEED WebShop wrapper / split / reward remapping: <https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/agent_system/environments/env_package/webshop/envs.py>
- Public GRPO WebShop launcher (`env.seed=0`): <https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/examples/grpo_trainer/run_webshop.sh>
- SFT WebShop defaults (`WEBSHOP_USE_SMALL=1`, `WEBSHOP_HUMAN_GOALS=0`, default `SEED=2026`): <https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/scripts/sft/webshop/prepare_data.sh>
- SFT path resolution / goal sampling: <https://github.com/jinyangwu/SEED/blob/2cf2fadca3c5aba28da68e8e1405182ba8d90e6c/scripts/sft/webshop/pipeline.py>

---

## 12. 最终判断原则

另一个 Agent 如果已经跑了 WebShop，最重要的不是问：

> “你是不是用了 WebShop？”

而是问：

> **“你运行时实际加载了哪两个商品文件、走的是 human 还是 synthetic goal 路径、最终有多少 goals、这些 goals 用什么 seed 排序、训练/保留区间怎么划？”**

只要这几个问题中有一个关键项答不上来，就还不能把已有结果标成：

> **same-condition SEED WebShop comparison（与 SEED 同条件的 WebShop 对比）**。

最小可信声明应该建立在实际运行证据上，而不是建立在配置名、文件夹名或“我记得我开了 small”上。
