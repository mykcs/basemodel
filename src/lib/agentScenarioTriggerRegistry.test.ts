import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = readFileSync(new URL('../../AGENTS.md', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../../docs/agents/README.md', import.meta.url), 'utf8');
const principles = readFileSync(new URL('../../docs/agents/current/project-agent-operating-principles.md', import.meta.url), 'utf8');
const engineering = readFileSync(new URL('../../docs/agents/current/website-engineering-standard.md', import.meta.url), 'utf8');
const hpl = readFileSync(new URL('../../docs/agents/current/human-preference-learning-system.md', import.meta.url), 'utf8');
const ingestion = readFileSync(new URL('../../docs/agents/current/human-feedback-ingestion-closeout.md', import.meta.url), 'utf8');
const registry = readFileSync(new URL('../../docs/agents/current/scenario-trigger-registry.md', import.meta.url), 'utf8');
const repositoryMap = readFileSync(new URL('../../docs/agents/current/repository-map.md', import.meta.url), 'utf8');
const seedWorkflow = readFileSync(new URL('../../docs/agents/current/seed-guided-research-workflow.md', import.meta.url), 'utf8');
const websiteSpec = readFileSync(new URL('../../docs/agents/current/website-design-spec.md', import.meta.url), 'utf8');
const copyCases = readFileSync(new URL('../../docs/agents/current/website-copy-cases.md', import.meta.url), 'utf8');
const history = readFileSync(new URL('../../docs/agents/history/2026-08-11-seed-preview-and-agent-workflow-lessons.md', import.meta.url), 'utf8');
const attentionHistory = readFileSync(new URL('../../docs/agents/history/2026-09-07-reader-attention-contract-and-apple-cognition-retrospective.md', import.meta.url), 'utf8');
const briefingPreviewHistory = readFileSync(new URL('../../docs/agents/history/2026-09-10-briefing-fast-preview-pr-workline-and-hpl-closeout-retrospective.md', import.meta.url), 'utf8');
const conversationCloseoutEntry = readFileSync(new URL('../../docs/operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md', import.meta.url), 'utf8');

describe('Agent scenario-trigger discovery', () => {
  it('routes future non-trivial work through the trigger registry', () => {
    for (const file of [root, readme]) expect(file).toContain('scenario-trigger-registry.md');
    expect(root).toContain('scan scenario-trigger-registry');
    expect(readme).toContain('load the matched bundle below');
    expect(registry).toContain('just-in-time attention router');
    expect(registry).toContain('Re-scan when the task changes state');
    expect(principles).toContain('Make recurring lessons triggerable');
    expect(principles).toContain('re-scanned when the task changes state');
  });

  it('keeps the reusable conversation-closeout trigger resolvable without duplicating protocol authority', () => {
    expect(registry).toContain('../../operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md');
    expect(conversationCloseoutEntry).toContain('navigation-only compatibility entrypoint');
    expect(conversationCloseoutEntry).toContain('mykcs/openevo-experiment/docs/operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md');
    expect(conversationCloseoutEntry).toContain('does **not** copy the protocol body');
  });

  it('routes advisor briefings through live experiment authority and presentation-role checks', () => {
    expect(registry).toContain('Advisor briefing / slides / projected-deck specialization');
    expect(registry).toContain('the current website is publication state, not experiment-inventory authority');
    expect(registry).toContain('engineering validity as a prerequisite rather than an automatic research highlight');
    expect(registry).toContain('`HTML` is an implementation medium, not a visual-style reset');
  });

  it('binds provider writes to the intended object and changes surface after repeated mismatch', () => {
    expect(principles).toContain('bind the target object to the exact mutation action/schema before dispatch');
    expect(principles).toContain('open PR -> create_pull_request');
    expect(principles).toContain('stop retrying that mutation surface');
    expect(principles).toContain('`gh pr create` for opening a PR');
  });

  it('protects the recurring high-cost situations from this project', () => {
    for (const trigger of [
      'TRIGGER: remembered plan or current doc may be stale',
      'TRIGGER: Preview, Production, release, hosting, or Cloudflare',
      'TRIGGER: exact-head acceptance / pending-check watch / `main` moved / provider says READY',
      'TRIGGER: deterministic Gate fails and weakening it looks tempting',
      'TRIGGER: SEED / OpenEvo / ALFWorld / WebShop / reproduction / GPU choice',
      'TRIGGER: offline lab server / SSH / SFTP / rsync / no outbound internet',
      'TRIGGER: time estimate, GPU rental cost, or current compute catalog',
      'TRIGGER: user-visible copy, beginner explanation, research narrative, or broad UI rewrite',
      'TRIGGER: actionable content / commands / generated artifacts',
      'TRIGGER: blocked tool, unavailable connector, credentials, or secret injection',
      'TRIGGER: hosting/platform modernization or legacy-provider reactivation',
      'TRIGGER: overlapping PRs / large cross-site change',
      'TRIGGER: reusable lesson discovered',
      'TRIGGER: retrospective, handoff, or experience retention',
    ]) expect(registry).toContain(trigger);
  });

  it('keeps provider build-budget boundaries explicit', () => {
    expect(registry).toContain('Do not intentionally trigger a Cloudflare Pages Git build');
    expect(registry).toContain('never silently substitute a Git-connected Pages build');
    expect(registry).toContain('Do not quote exact provider quota/price counters without authoritative current evidence');
    expect(registry).toContain('Treat Vercel as the only ordinary Preview + Production authority');
    expect(registry).toContain('hosted target route / anchor / slide');
    expect(registry).toContain('old Preview URL');
    expect(registry).toContain('not permission to rerun the unrelated full 205-case final matrix');
  });

  it('requires stale remembered plans to refresh against current truth', () => {
    expect(registry).toContain('Treat remembered/chat state as a hypothesis');
    expect(registry).toContain('If live/executable truth contradicts a `current/` doc, update or demote that doc');
  });

  it('protects exact-head validation and honest Preview evidence', () => {
    expect(registry).toContain('Compare the candidate head with current intended `main`');
    expect(registry).toContain('Keep one live semantic candidate through independent drift');
    expect(registry).toContain('read the provider\'s real execution state');
    expect(registry).toContain('`ignored/skipped/canceled` is not Preview acceptance');
    expect(registry).toContain('provider READY remains separate from visual/product acceptance');
  });

  it('keeps valid Gates stronger than convenience', () => {
    expect(registry).toContain('fix the implementation/content if it does');
    expect(registry).toContain('change the Gate only when evidence proves the Gate itself is stale');
    expect(registry).toContain('rather than weakening research or release safety');
  });

  it('keeps offline execution and hardware substitution evidence-bounded', () => {
    expect(registry).toContain('SFTP is transport, not version control');
    expect(registry).toContain('Prefer already-authorized hardware when it answers the scientific question');
    expect(registry).toContain('method effect measured');
    expect(seedWorkflow).toContain('A successful smaller-hardware method reproduction is not automatically paper-hardware reproduction');
  });

  it('requires measured timing and current market evidence before paid-compute claims', () => {
    expect(registry).toContain('public catalog');
    expect(registry).toContain('logged-in inventory');
    expect(registry).toContain('do not call a planning range a measurement');
    expect(registry).toContain('replace priors with measured throughput');
  });

  it('preserves actionable-content and holistic-writing lessons', () => {
    expect(registry).toContain('ask what the user needs to click at the content location');
    expect(registry).toContain('Review the whole affected reading journey');
    expect(seedWorkflow).toContain('what observable evidence counts as PASS');
  });

  it('keeps retrospective capability discovery read-only at the use site', () => {
    expect(registry).toContain('Tool/connector capability discovery must stay read-only');
    expect(registry).toContain('never call `create` / `update` / `delete` merely to prove a connector works');
  });

  it('binds permitted closeout mutations to the exact target action before dispatch', () => {
    expect(registry).toContain('Before any permitted closeout mutation, bind the target noun to the exact action');
    expect(registry).toContain('open PR -> create_pull_request');
    expect(registry).toContain('A nearby write capability is not an acceptable substitute');
  });

  it('escalates repeated closeout action mismatch by changing mutation surface', () => {
    expect(registry).toContain('Escalate repeated action-selection mismatch by changing execution surface');
    expect(registry).toContain('Do not keep retrying the same connector mutation');
    expect(registry).toContain('`gh pr create` for opening a PR');
  });

  it('keeps HPL and conversation-lessons closeout from double-counting the same feedback', () => {
    expect(registry).toContain('Do not double-ingest a conversation that already ran Human Preference Learning closeout');
    expect(registry).toContain('machine-readable HPL ledger/events/trajectory as predecessor evidence');
    expect(ingestion).toContain('If the source window has **no real product PR**');
    expect(ingestion).toContain('Never invent a PR number');
  });

  it('requires HPL closeout bootstrap and end-to-end activation-cue parity', () => {
    expect(ingestion).toContain('Before the first local/RDC/terminal command');
    expect(ingestion).toContain('set the outer shell/interpreter explicitly (for example `/bin/bash`)');
    expect(ingestion).toContain('activation-cue parity');
    expect(ingestion).toContain('scope as a semantic contract, not a knob for making the receipt pass');
    expect(ingestion).toContain('a green focused unit-test subset is not a substitute');
    expect(hpl).toContain('Activation cues are one end-to-end contract');
    expect(hpl).toContain('positive activation');
    expect(hpl).toContain('negative activation');
    expect(registry).toContain('HPL / feedback-learning retrieval parity');
    expect(registry).toContain('Do not require unrelated `Preview/build` words');
  });

  it('turns named visual references into cognition witnesses and protects scroll intent', () => {
    expect(hpl).toContain('Named design references need a cognition-translation witness');
    expect(hpl).toContain('reference-surface-imitation');
    expect(engineering).toContain('Initial visibility is not scroll intent');
    expect(engineering).toContain('initial load preserves the declared starting state');
    expect(engineering).toContain('Protect the semantic behavior, not an incidental CSS token');
  });

  it('routes advisor briefing work through scientific-story and experiment-inventory preflight', () => {
    expect(registry).toContain('Advisor briefing / slides / projected-deck specialization');
    expect(registry).toContain('the current website is publication state, not experiment-inventory authority');
    expect(registry).toContain('engineering validity as a prerequisite rather than an automatic research highlight');
    expect(registry).toContain('`HTML` is an implementation medium, not a visual-style reset');
  });

  it('turns owner copy feedback into case-cluster generalization and cross-site repair', () => {
    for (const token of ['case cluster', 'at least two nearby cases', 'high-confidence same-family', 'semantic positions']) expect(registry).toContain(token);
    for (const token of ['案例簇', '至少包含当前最接近案例 + 2 个同类/相邻案例', '高置信同类', 'sibling routes']) expect(websiteSpec).toContain(token);
    expect(registry).toContain('site-reader-attention-contract.md');
    expect(registry).toContain('product/repository work');
    expect(registry).toContain('Repository persistence and long-term memory are separate receipts');
    expect(copyCases).toContain('案例簇总结：CASE-061–071');
    expect(copyCases).toContain('当前最接近案例 + 至少 2 个同类/相邻案例');
    expect(copyCases).toContain('案例不是墓碑，而是训练样本');
  });

  it('keeps the attention-contract retrospective discoverable without confusing repository persistence with memory', () => {
    expect(readme).toContain('2026-09-07-reader-attention-contract-and-apple-cognition-retrospective.md');
    expect(registry).toContain('2026-09-07-reader-attention-contract-and-apple-cognition-retrospective.md');
    expect(attentionHistory).toContain('本次实际账户级写入');
    expect(attentionHistory).toContain('**0 条。**');
    expect(attentionHistory).toContain('Fish parser failure');
  });

  it('protects secret and hosting-modernization boundaries', () => {
    for (const token of [
      'Never commit a live bearer token as ordinary Git content',
      'Do not assume GitHub secret APIs return decrypted values',
      'Do not rewrite Astro/React merely because deployment ownership changes',
      'A historical Cloudflare/Workers shadow or pilot is evidence, not a pending migration step',
      'Reactivating legacy Production is a new architecture/release decision',
    ]) expect(registry).toContain(token);
  });

  it('preserves the ML-to-Agent beginner bridge in its current teaching owner', () => {
    for (const token of [
      'known ML concepts',
      'Agent runtime loop',
      'runtime vs training',
      'minimum RL vocabulary',
      'map those concepts into SEED',
    ]) expect(seedWorkflow).toContain(token);
    expect(seedWorkflow).not.toContain('PR #104 is the active implementation path');
    expect(seedWorkflow).toContain('Vercel Pro deterministic + risk-based browser acceptance on automatic PR Previews');
    expect(seedWorkflow).toContain('CircleCI automatic PR/main workflows disabled and only explicit API-triggered fallback retained');
  });

  it('does not silently restore Direct Upload as the ordinary Preview default', () => {
    expect(repositoryMap).toContain('GitHub PR / release candidate          -> automatic Vercel Pro acceptance Preview');
    expect(repositoryMap).toContain('GitHub non-main Preview ref               -> Vercel Preview real acceptance (token-independent)');
    expect(repositoryMap).toContain('GitHub main                              -> Vercel Production with the same acceptance contract');
    expect(repositoryMap).toContain('Production identity                     -> https://basemodel-preview.vercel.app');
    expect(repositoryMap).toContain('CircleCI                                -> automatic PR/main disabled; explicit API fallback only');
    expect(repositoryMap).toContain('Cloudflare production-smoke Worker       -> post-deploy monitoring only');
    expect(repositoryMap).toContain('Cloudflare Pages/Direct Upload/shadow     -> rollback or provider-specific fallback only');
    expect(repositoryMap).toContain('Vercel Pro is the ordinary CI and deployment authority');
    expect(repositoryMap).not.toContain('default to local build + Direct Upload public Preview');
  });

  it('indexes the briefing Preview/workline closeout while keeping transient state historical', () => {
    expect(readme).toContain('2026-09-10-briefing-fast-preview-pr-workline-and-hpl-closeout-retrospective.md');
    expect(briefingPreviewHistory).toContain('one survivor product PR');
    expect(briefingPreviewHistory).toContain('designated product PR');
    expect(briefingPreviewHistory).toContain('open hosted target route/anchor');
    expect(briefingPreviewHistory).toContain('Temporary information intentionally not promoted');
    expect(briefingPreviewHistory).toContain('live No-GDR round, Score, loss');
    expect(briefingPreviewHistory).toContain('temporary Vercel share URLs');
    expect(briefingPreviewHistory).toContain('First RDC discovery command again used a Bash compound loop under the default Fish shell');
    expect(briefingPreviewHistory).toContain('Scope is semantic evidence selection, not a PASS knob');
    expect(briefingPreviewHistory).toContain('HPL retrieval activation is a pipeline contract');
  });

  it('keeps the historical case reusable without freezing transient state', () => {
    for (const token of ['Build-budget lesson','Research-guide lesson','Offline-server lesson','Time/cost lesson','Actionable-content lesson','Credential lesson','Provider-ownership lesson','Workers-shadow lesson','Cross-repository lesson','Agent-knowledge lesson','Workflow-drift lesson','Exact-head lesson','Gate-integrity lesson','Beginner-bridge lesson']) expect(history).toContain(token);
    expect(history).toContain('avoids preserving temporary Preview share URLs');
    expect(history).toContain('conversation memory is a hypothesis');
  });
});


// Protect discoverability only; these checks do not measure reader comprehension
// or prove that a future executor actually performed a use-site check.
describe('retained correction use-site routing', () => {
  it('keeps the first shell and checkout discovery safeguards on the fast path', () => {
    expect(root).toContain('Before the first compound shell call');
    expect(root).toContain('/bin/bash');
    expect(principles).toContain('Do not guess a local checkout path');
    expect(principles).toContain('resolved root, branch, `HEAD`, dirty state, and intended remote/ref');
  });

  it('keeps repeat-correction witnesses reachable from startup and task triggers', () => {
    expect(root).toContain('REPEAT-CORRECTION');
    expect(root).toContain('project-agent-operating-principles.md#correction-to-action-witness');
    expect(principles).toContain('### Correction-to-action witness');
    expect(principles).toContain('trigger -> current owner -> checked artifact -> allowed next action -> invalidation cue');
    expect(registry).toContain('REPEAT-CORRECTION');
  });
  it('keeps first-screen acceptance scoped and dated snapshots historical', () => {
    const expression = readFileSync(new URL('../../docs/agents/current/human-thinking-web-expression-contract.md', import.meta.url), 'utf8');
    const snapshot = readFileSync(new URL('../../docs/agents/current/mechanism-site-authority-snapshot-202609062000.md', import.meta.url), 'utf8');
    expect(expression).toContain('### 10.10 Five questions are a reader aid, not a new authority');
    expect(expression).toContain('desktop');
    expect(expression).toContain('mobile scrolling layout');
    expect(snapshot).toContain('Historical publication snapshot, not current execution authority');
    expect(snapshot).toContain('OPEN_EVO_MECHANISM_1.0_CURRENT.md');
  });
});
