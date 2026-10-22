# Papers matrix release acceptance

Status: candidate accepted for release; final provider gate, merge and Production inspection pending.

## Preserved implementation

PR #930 integrates the accepted #916 ancestry onto main `5f2ac6dd0e96c0c07fae46a372ad571aa31aa8b2`. The source change retains all model/role data and the sticky first column, while giving each model heading a 120px minimum width and normal word wrapping. Existing no-JavaScript fallback tests are adopted, not replaced by a new solution.

## Actual pre-release evidence

- Source candidate `0d16355e313927b398695526d8cb82f5eeedd3a1`: cloud `verify:deploy`, build and four focused Chromium cases passed, including the 390px known-bad width-removal/restore control.
- [Public PR CI 39763451926](https://github.com/mykcs/basemodel/actions/runs/39763451926): deterministic, all eight Chromium shards and aggregate gate succeeded.
- [Fast Review 39763458836](https://github.com/mykcs/basemodel/actions/runs/39763458836): immutable artifact was bound to that candidate; actual hosted `/papers/` was inspected, not a login page.
- Twelve Chromium states: 390/768/1440px × light/dark × JavaScript on/off. Model headers measured 120px wide and 65.1875px tall; native local horizontal scrolling worked, document horizontal overflow was zero and robots retained noindex. All twelve target PNGs were individually opened.
- Before repair, actual Production at `5f2ac6dd` measured approximately 47px-wide, 208px-tall headings on 390px, despite zero document overflow. This is why overflow checks alone are insufficient.

These receipts qualify only their recorded source identity. This evidence-only follow-up does not change application bytes; its own current-head required CI and provider checks must still pass before merge. WebKit was not run by this task, and Review Preview is not final-gate or Production acceptance.

## Publication boundary

The owner authorized sequential merge and existing Production deployment of #930 then #931. No credentials, protection settings or typography-owner branch are changed. The initial final-gate request stopped before ref mutation because the head author email did not map to GitHub; this real evidence follow-up uses the repository's already-mapped noreply identity. No no-op/provider-wakeup commit is used.

After final gate and merge, record the actual Production successor SHA/deployment and repeat the changed-route browser inspection separately. Do not infer publication from this file or old screenshots.
