#!/usr/bin/env python3
"""Second arithmetic implementation for D03; stdlib only, read-only, no inference.

This is algorithmic cross-checking, not an independent human/scientific review.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = "public/research/seed-openevo/evidence/"
SOURCE_DIGESTS = {
    "beta": "ed97e8d26fad52cdd4822fd6fb95414de30c916c16554ff415246140bddd1cde",
    "final": "29771a71343fa1e99b6210bf843aea98a4f76f84988c469d2fc588d56ec302a0",
    "post": "d1f9373230a327b2626b2c39e7c67f3a032cad855f03d764d8d9d28e48a4d80d",
}
WINDOWS = [(96, 119), (120, 139), (140, 159), (160, 179), (180, 199)]


def load(relative, expected_digest=None):
    path = (ROOT / relative).resolve()
    path.relative_to(ROOT)
    data = path.read_bytes()
    if expected_digest and hashlib.sha256(data).hexdigest() != expected_digest:
        raise ValueError("Pinned independent-verifier source hash mismatch")
    return json.loads(data)


def verify(report, post_file=None):
    errors = []

    def compare(label, actual, expected, exact=False):
        if actual is None or not isinstance(actual, (int, float)) or not math.isfinite(actual):
            raise ValueError("Missing/non-finite analysis value: " + label)
        error = abs(actual - expected)
        if error > (0 if exact else 1e-10):
            raise ValueError("Independent arithmetic mismatch: " + label)
        errors.append(error)

    rows = load(EVIDENCE + "bounded-beta-r200-round-series-20261001.json", SOURCE_DIGESTS["beta"])["rows"]
    beta = report["studies"]["betaLateTraining"]
    if len(beta["windows"]) != len(WINDOWS):
        raise ValueError("Analysis dropped published windows")
    for output, (first, last) in zip(beta["windows"], WINDOWS):
        if output["firstRound"] != first or output["lastRound"] != last:
            raise ValueError("Analysis window identities changed")
        selected = [row for row in rows if first <= row["round"] <= last]
        if len(selected) != last - first + 1:
            raise ValueError("Incomplete independent source range")
        compare("round-count", output["roundCount"], len(selected), True)
        for key, mean_key, slope_key in [("task_score", "meanTaskScore", "scoreSlopePerRound"), ("training_loss", "meanLoss", "lossSlopePerRound")]:
            n = len(selected)
            mean = math.fsum(row[key] for row in selected) / n
            x_mean = math.fsum(row["round"] for row in selected) / n
            numerator = math.fsum((row["round"] - x_mean) * (row[key] - mean) for row in selected)
            denominator = math.fsum((row["round"] - x_mean) ** 2 for row in selected)
            compare(key + "-mean", output[mean_key], mean)
            compare(key + "-slope", output[slope_key], numerator / denominator)
        compare("exact-successes", output["exactSuccessCount"], sum(row["exact_success_count"] for row in selected), True)
    extension = [row for row in rows if 160 <= row["round"] <= 199]
    compare("extension-score", beta["extension"]["meanTaskScore"], math.fsum(row["task_score"] for row in extension) / 40)
    compare("extension-loss", beta["extension"]["meanLoss"], math.fsum(row["training_loss"] for row in extension) / 40)
    final = load(EVIDENCE + "bounded-effective-state-final-snapshot-20260918.json", SOURCE_DIGESTS["final"])
    for target, source in [("directApply", "directapply"), ("off", "bounded_off"), ("on", "bounded_gdr_on")]:
        compare("frozen-final-score", report["frozenFinal"]["values"][target]["score"], final["three_way_final"][source]["task_score"] * 100)
        compare("frozen-final-exact", report["frozenFinal"]["values"][target]["exactCount"], final["three_way_final"][source]["exact_success_count"], True)
    post_checked = False
    if post_file:
        post = load(post_file, SOURCE_DIGESTS["post"])
        learning = report["studies"]["learningSignal"]
        train = post["A"]["train"]
        compare("loss-reduction", learning["training"]["relativeReduction"], 1 - train["train_loss_last"] / train["train_loss_first"])
        val = post["A"]["primary_validation"]
        for result, name in zip(learning["epochs"], ["epoch1", "epoch2", "epoch3"]):
            compare("epoch-delta", result["taskScoreDelta"], val["states"][name]["mean_task_score"] - val["states"]["initial"]["mean_task_score"])
            if [result["uncertainty"]["low"], result["uncertainty"]["high"]] != val["paired_vs_initial"][name]["bootstrap95"]:
                raise ValueError("Original reported interval was altered")
        rank = post["B"]
        diff = report["studies"]["rankCapacity"]["difference"]
        compare("rank-score-delta", diff["taskScore"], rank["rank32"]["mean_task_score"] - rank["rank128"]["mean_task_score"])
        compare("rank-exact-delta", diff["exactSuccessCount"], rank["rank32"]["exact_success_count"] - rank["rank128"]["exact_success_count"], True)
        compare("rank-rate-delta", diff["exactSuccessRate"], (rank["rank32"]["exact_success_count"] - rank["rank128"]["exact_success_count"]) / rank["paired_attempts"])
        compare("rank-payload-ratio", diff["adapterSizeRatio"], rank["rank32"]["final_adapter_bytes"] / rank["rank128"]["final_adapter_bytes"])
        compare("rank-payload-reduction", diff["adapterReductionFraction"], 1 - rank["rank32"]["final_adapter_bytes"] / rank["rank128"]["final_adapter_bytes"])
        post_checked = True
    return {"status": "PASS", "numeric_checks": len(errors), "maximum_absolute_error": max(errors), "post_advisor_checked": post_checked, "uncertainty_recomputed": False, "human_review": False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report", default="src/data/researchAnalysisSnapshot.json")
    parser.add_argument("--post-advisor")
    args = parser.parse_args()
    try:
        print(json.dumps(verify(load(args.report), args.post_advisor), allow_nan=False))
    except (ValueError, KeyError, TypeError, OSError) as error:
        parser.exit(1, "Independent verification failed: " + str(error) + "\n")


if __name__ == "__main__":
    main()
