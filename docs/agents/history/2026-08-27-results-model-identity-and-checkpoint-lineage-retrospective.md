# 2026-08-27 Results model-identity and checkpoint-lineage retrospective

Status: **historical case record**. This document preserves reusable lessons from the 2026-08-27 Results-page clarification around `BASE`, `frozen`, Qwen2.5 model size, H1.38B training state, checkpoint publication, and release closeout. It does not override `docs/agents/current/*`, executable experiment truth, or live provider state.

## Scope

The page already said that PRIMARY-v1 compared two “frozen models”. That sentence was technically defensible but reader-hostile: it did not tell a first-time reader what either model actually was, whether either side had been trained by us, whether the model was 3B or 7B, or whether a reusable checkpoint existed.

The user asked for the ambiguity to be resolved from evidence before changing copy.

The final clarification shipped in BaseModel PR #290 (`docs(results): clarify exact frozen model and checkpoint lineage`) and merged as `0d69951beea27b15c38455267ac71107d54de6dd`.

The evidence chain established:

- both formal comparison arms use **`Qwen/Qwen2.5-7B-Instruct`**;
- the experiment arm named `BASE` loads **no OpenEvo adapter**;
- `BASE` is therefore an experiment-arm label, **not** Qwen’s Base checkpoint;
- the OpenEvo arm is the same 7B Instruct checkpoint plus the **H1.38B final SD-LoRA** adapter;
- the H1.38B training stream contains 16 successful rollout records over 8 task identities, 2 independent successes per task, 8 sequential increments, 1 epoch, at most 16 optimizer steps per increment, and final effective rank 32;
- the evaluated adapter is publicly available on Hugging Face at `miyuki17/openevo-qwen25-7b-webshop-sd-lora`, pinned to revision `7c836f259f32e6775f02f90e6a9880e8ef82f40c`;
- `adapter_model.safetensors` is an **adapter-only artifact**, not another full copy of the 7B model;
- the publication manifest records SHA-256 `47e63d417f85cb2defed5ff1ee934128b96e6a4f78a8f410fa052957d919190c` and a successful remote re-download/hash verification.

## Friction 1 — “frozen model” described a runtime state, not model provenance

The phrase “两边都是冻结模型” answered only one question:

```text
Did parameters keep updating during evaluation?
-> No.
```

It did **not** answer:

```text
Which model checkpoint?
Was it 3B or 7B?
Was it Qwen Base or Qwen Instruct?
Did we train it with OpenEvo?
Which training stage produced the compared state?
Can the resulting artifact be retrieved?
```

The durable distinction is:

```text
frozen
= no parameter updates during this evaluation

model provenance
= exact upstream checkpoint + exact local adapter/state lineage
```

Never use `frozen` as a substitute for provenance. Public copy should state the model identity first and use `frozen` only to describe what happened during evaluation.

## Friction 2 — `BASE` is an internal arm name and is easy to misread as a Base checkpoint

The experiment config uses the arm name `BASE`, but the actual model is `Qwen/Qwen2.5-7B-Instruct`.

That creates a dangerous ambiguity because Qwen also distinguishes Base and Instruct checkpoints at the model-product level.

The correct reader-facing translation is:

```text
BASE arm
= Qwen2.5-7B-Instruct with no OpenEvo adapter loaded

Qwen Base checkpoint
!= this BASE arm
```

When an internal experiment label collides with a model-vendor term, explain the collision on first use. Do not assume the reader knows the local naming convention.

The same rule applies to names such as `BASE`, `CONTROL`, `TEACHER`, `FROZEN`, or `REFERENCE`: they describe experimental roles until evidence proves they also name a particular upstream checkpoint.

## Friction 3 — historical 3B evidence and a legacy-looking Docker tag can pull the reader toward the wrong model

This project contains legitimate 3B history. H0 and earlier work used 3B, and the published runtime artifact still has a name such as:

```text
openevo-scientific-qwen25-3b-webshop-20260814.tar.gz
wangr/openevo-scientific:qwen25-3b-webshop-20260814
```

But the formal H1.38B / PRIMARY comparison config explicitly pins:

```text
Qwen/Qwen2.5-7B-Instruct
/workspace/models/qwen2.5-7b-instruct
```

Therefore:

> A container/image/tarball name is not authoritative evidence of the model weights evaluated inside that runtime.

Runtime packaging, historical image names, model weight mounts, and evaluated model identity are different layers.

Use this precedence for model identity:

```text
formal experiment config / frozen comparison contract
-> model/adaptor identity receipt or artifact manifest
-> actual runtime load record
-> supporting runtime/container metadata
```

Do not infer 3B vs 7B from a Docker tag when the formal experiment contract names the actual model.

## Friction 4 — “we did not train BASE” needs a precise scope

A natural sentence such as:

```text
我们一步都没训练，BASE 就已经写出了 [action]。
```

is useful because it speaks like a person. But the scientific scope must remain clear:

```text
we did not train BASE with our OpenEvo adapter path
!= Qwen2.5-7B-Instruct was never trained by anyone
```

`Qwen2.5-7B-Instruct` is itself a vendor-trained Instruct checkpoint. The page now explains that our BASE arm did not receive additional OpenEvo parameter training.

Durable copy rule:

> Translate machine states into natural language, but preserve the actor and scope of the action.

For example, prefer “我们没有再用 OpenEvo 训练这一边” over a naked “没有训练过”.

## Friction 5 — exact checkpoint lineage was available but not surfaced to the reader

The experiment publication manifest already recorded the evaluated adapter as a reusable artifact:

```text
provider: huggingface
repo: miyuki17/openevo-qwen25-7b-webshop-sd-lora
revision: 7c836f259f32e6775f02f90e6a9880e8ef82f40c
file: adapter_model.safetensors
sha256: 47e63d417f85cb2defed5ff1ee934128b96e6a4f78a8f410fa052957d919190c
base_model: Qwen/Qwen2.5-7B-Instruct
```

The website originally mentioned only a frozen SD-LoRA state. That forced readers to trust a description instead of letting them inspect or reuse the actual artifact.

The improved publication pattern is:

```text
exact upstream model identity
-> exact local training stage
-> pinned adapter/checkpoint revision
-> training config
-> artifact verification manifest / hash
```

For a public checkpoint, link the immutable revision rather than only the repository root. Also say whether the published artifact is a full model, adapter, delta, optimizer state, or runtime image.

## Friction 6 — nearby historical evidence and the actual evaluated artifact must stay separate

H1.36 is important because it had already exposed wrapper drift. But PRIMARY-v1 did not compare an H1.36 adapter. It compared the later **H1.38B final SD-LoRA**.

Keep these roles separate:

```text
H1.36
= prior knowledge that wrapper drift existed

H1.38B final SD-LoRA
= actual trained artifact loaded in the later formal comparison
```

This is the same lineage lesson as the earlier zero-context retrospective, now applied to model identity and checkpoint publication: historical relevance is not artifact identity.

## Friction 7 — sequential branch writes created avoidable Preview churn

The clarification was implemented across the Results component and two regression-test files. Because these landed as several sequential branch commits, Vercel evaluated intermediate heads before the full coherent state existed. Intermediate previews were red; the final exact branch head `c7eba6e547dafdde7adb27b15d7f00d1f1fd0687` became READY.

This did not corrupt Production, but it created unnecessary provider churn and noisy status interpretation.

The better default is:

```text
read all owners and evidence
-> prepare all intended file contents
-> create blobs/tree/commit without moving a deployable ref
-> create/move the branch once
-> open PR
-> verify the exact head
```

Shared Git refs should not be used as an incremental scratchpad when the coherent change can be assembled first.

## Friction 8 — `main` moved during the task, so “just push it” would have been unsafe

While the model-identity branch was being prepared, PR #288 advanced `main`. The feature branch became behind/diverged relative to the new current tree.

The correct response was **not** to force-update `main` or pretend the older base was still current.

The safe closeout was:

```text
refresh main
-> compare base vs feature head
-> verify the feature changes touch only the intended files
-> confirm the concurrent main change does not overwrite the same semantics
-> open PR #290 against the new main
-> let GitHub resolve mergeability
-> merge normally
```

This preserved the concurrent Results update while adding the model-lineage clarification.

Durable rule:

> If `main` moves while work is in flight, re-establish ancestry and semantic compatibility before merging. “My branch was clean when I started” is not release evidence.

## Successful pattern 1 — resolve model identity from the formal comparison contract

The decisive source was the formal held-out comparison config, which records:

```text
frozen_artifact.base_model = Qwen/Qwen2.5-7B-Instruct
arms.BASE.adapter = none
arms.BASE.model = Qwen/Qwen2.5-7B-Instruct
OPEN_EVO_SD.source_campaign = 20260820-0129-h138b-method-control
```

That immediately answers 3B vs 7B, BASE vs Instruct, and which campaign produced the trained side.

The H1.38B config then answers **how it was trained**. The artifact manifest answers **where the evaluated adapter is published and how its bytes were verified**.

This is a strong three-source pattern:

```text
formal comparison config = what was evaluated
training config          = how the trained state was produced
artifact manifest        = what public bytes correspond to that state
```

## Successful pattern 2 — explain experimental-role names before technical shorthand

The final page now tells the reader:

```text
BASE
= official Qwen2.5-7B-Instruct, no OpenEvo adapter

OpenEvo arm
= same Qwen2.5-7B-Instruct + H1.38B final SD-LoRA
```

Only after that does it talk about freezing, adapter receipts, optimizer steps, or wrapper drift.

This makes the later attribution easier to understand because the reader knows what objects are being compared.

## Successful pattern 3 — make checkpoint links reproducible, not decorative

The final page links:

1. the official Qwen2.5-7B-Instruct checkpoint/model card;
2. the **pinned** H1.38B adapter revision on Hugging Face;
3. the H1.38B training config;
4. the artifact verification manifest.

This lets a reader move from explanation to exact artifact identity without guessing.

A bare “Hugging Face checkpoint” link is weaker if it points at mutable `main`/latest state. Prefer immutable revision URLs plus recorded hashes when the artifact enters a scientific claim.

## Successful pattern 4 — regression tests protect semantics rather than one old sentence

The Results tests were extended to protect the newly clarified boundaries:

- `Qwen2.5-7B-Instruct（7B，不是 3B）`;
- `BASE` means no OpenEvo adapter and is not the Qwen Base checkpoint;
- the OpenEvo side uses the H1.38B final SD-LoRA;
- the pinned Hugging Face revision is present;
- the public checkpoint is adapter-only;
- ambiguous “both sides are frozen models” wording cannot silently return as the only description.

This is the right use of copy tests: protect scientific identity and reader meaning, not incidental punctuation.

## Successful pattern 5 — release acceptance used exact-head Production and public HTML

The final PR merged as `0d69951beea27b15c38455267ac71107d54de6dd`.

Vercel Production then ran the full browser gates. The visible build log showed the 91-test main UI suite continuing cleanly and the 12-test Lab browser suite finishing `12 passed`; the deployment reached READY.

The final acceptance was not the READY badge alone. The public URL was fetched after READY and returned HTTP 200 with the intended rendered text and links, including:

```text
Qwen2.5-7B-Instruct（7B，不是 3B）
同一个 7B Instruct + H1.38B final SD-LoRA
H1.38B final adapter checkpoint
训练配置
checkpoint 校验记录
```

Keep the state distinction:

```text
source changed
!= branch Preview READY
!= PR merged
!= Production READY
!= public HTML contains intended exact-head content
```

## Reusable SOP for future model/checkpoint wording on Results pages

```text
1. identify the exact formal comparison/campaign first
2. read the formal config for model ID, arm role, adapter presence, and source campaign
3. do not infer model size or checkpoint type from historical experiments, branch names, Docker tags, or filenames
4. distinguish experiment-arm labels such as BASE from vendor checkpoint names such as Base/Instruct
5. state whether each arm received project-side training, and by whom/which stage
6. resolve the exact trained artifact from its source campaign
7. if a public artifact exists, link a pinned revision and record whether it is full model / adapter / delta / runtime image
8. attach training config and verification/hash evidence when the checkpoint enters a scientific claim
9. define `frozen` as “no updates during this evaluation”, never as provenance shorthand
10. keep natural reader wording while preserving the scope of “we trained / did not train”
11. add semantic regression tests for model size, arm identity, checkpoint lineage, and artifact kind
12. assemble coherent repository changes before moving a deployment-eligible ref
13. if main moves, refresh ancestry and semantic overlap before merge; do not force the old base onto main
14. verify exact-head Preview/Production separately and confirm public HTML after Production READY
```

## Trigger for future Agents

Load this case after current policy when any of these are true:

- a Results page says only `BASE`, `frozen`, `control`, or another internal arm name without naming the actual checkpoint;
- the reader asks whether a model was 3B or 7B, Base or Instruct, original or project-trained;
- historical experiments used a different model scale from the current formal comparison;
- a Docker/runtime image name appears to disagree with the formal model config;
- an evaluated adapter/checkpoint may already be public but the page does not link it;
- a checkpoint link is mutable or does not say whether the artifact is adapter-only/full-model;
- several branch writes are creating Vercel churn for one coherent copy change;
- `main` advances while a Results branch is being prepared or verified.

Current owners for the durable rules remain:

- `docs/agents/current/audience-centered-technical-copy.md` — reader context, model/training/evaluation scale, exact artifact-lineage requirement;
- `docs/agents/current/experiment-result-publication-workflow.md` — source ownership, pinned evidence, immutable revision, release verification;
- `docs/agents/current/project-agent-operating-principles.md` — repository-write hygiene and narrow execution surface;
- `docs/agents/current/multi-pr-semantic-integration-playbook.md` — concurrent-main / overlapping-PR integration;
- `docs/agents/README.md` — task discovery route.
