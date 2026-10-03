# B02 research synthesis — claim map and argument outline

Status: implementation evidence for PR #818. B02 is intentionally stacked on BaseModel #805 so the underlying Stage1 and rank32 results are visible before the synthesis layer. D03 #824 and D04 #825 are used as analysis/decision inputs but are not copied wholesale into this branch.

## Rule

Each synthesis layer separates:

- **observed** — what the existing experiment/result owner measured;
- **inferred** — the narrow interpretation supported by those observations;
- **proposed** — which existing follow-up evidence would change the judgment.

The public synthesis does not duplicate raw scientific numbers. Those remain with the existing result owners.

## Article 1 — learning signal

**Question:** Why can supervised optimization improve while held-out WebShop capability does not?

**Observed:** the Stage1 supervised objective improves while held-out capability does not improve with it.

**Inference:** this rejects the simple story that better fitting this Stage1 supervision alone removes the capability ceiling. It does not reject the untested full SEED Stage2 loop.

**Competing explanations:**
1. the Stage1 learning signal does not convert experience into transferable decisions;
2. Stage1 is locally useful, but the missing Stage2 self-evolving / credit-assignment loop is the important mechanism.

**Judgment-changing evidence:** existing OpenEVO #629 / #630 under their frozen contracts.

## Article 2 — state capacity

**Question:** Does the rank32 screen reveal over-provisioning or a real capacity bottleneck?

**Observed:** persistent state is much smaller, while Task Score and exact success do not move in one common direction.

**Inference:** rank128 is not established as the unique useful capacity, but rank32 is not proven equivalent or strictly non-inferior.

**Competing explanations:**
1. rank128 is over-provisioned and several lower ranks will form a plateau;
2. capacity matters for retention / continued learning and degradation will become systematic below a knee.

**Guardrails:** CI crossing zero is not equivalence; posterior rank95 is not a minimum trainable rank.

**Judgment-changing evidence:** existing capacity sweep OpenEVO #631.

## Article 3 — β late training

**Question:** What does a late training rebound mean when the frozen Final is unchanged?

**Observed:** the same-panel frozen Final remains the formal endpoint; continued R160–R199 training shows that late training behavior is not monotonic, but no new Final was opened.

**Inference:** the rebound falsifies a simple monotonic-saturation story but cannot establish Final recovery, an overtake, or a better stopping round.

**Competing explanations:**
1. write magnitude / gain is the dominant issue;
2. direction selection, task distribution, or retention is more important.

**Guardrails:** DirectApply is a historical predecessor rather than a randomized matched arm; training loss and training Task Score do not replace frozen Final evidence.

**Judgment-changing evidence:** existing OpenEVO #632 / #634 / #635.

## Integration boundary

- #805 owns raw Stage1/rank32 publication.
- #812 supplies the β technical-blog reading baseline.
- #824 owns recomputable comparison logic.
- #825 owns decision notes and competing-explanation planning.
- #818 owns only the prose synthesis layer and its semantic anti-overclaim tests.
- Q01 still owns independent cold reading; B02 does not claim human comprehension from automated tests.
