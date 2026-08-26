import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = readFileSync(new URL('../../AGENTS.md', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../../docs/agents/README.md', import.meta.url), 'utf8');
const principles = readFileSync(new URL('../../docs/agents/current/project-agent-operating-principles.md', import.meta.url), 'utf8');
const registry = readFileSync(new URL('../../docs/agents/current/scenario-trigger-registry.md', import.meta.url), 'utf8');
const repositoryMap = readFileSync(new URL('../../docs/agents/current/repository-map.md', import.meta.url), 'utf8');
const seedWorkflow = readFileSync(new URL('../../docs/agents/current/seed-guided-research-workflow.md', import.meta.url), 'utf8');
const history = readFileSync(new URL('../../docs/agents/history/2026-08-11-seed-preview-and-agent-workflow-lessons.md', import.meta.url), 'utf8');

describe('Agent scenario-trigger discovery', () => {
  it('routes future non-trivial work through the trigger registry', () => {
    for (const file of [root, readme]) expect(file).toContain('scenario-trigger-registry.md');
    expect(root).toContain('scan scenario-trigger-registry');
    expect(readme).toContain('scan the task and load the matched bundle below');
    expect(registry).toContain('Do not wait for the owner to repeat these reminders');
    expect(principles).toContain('Make recurring lessons triggerable');
    expect(principles).toContain('re-scanned when the task changes state');
  });

  it('protects the recurring high-cost situations from this project', () => {
    for (const trigger of [
      'TRIGGER: previous plan / handoff / current doc may be stale',
      'TRIGGER: deployment-budget / Preview / Cloudflare',
      'TRIGGER: exact-head Preview / `main` moved / provider says READY',
      'TRIGGER: deterministic Gate fails / weakening the check looks tempting',
      'TRIGGER: SEED / ALFWorld / WebShop / reproduction / GPU choice',
      'TRIGGER: offline lab server / SFTP / no outbound internet',
      'TRIGGER: time estimate / GPU rental cost / current compute catalog',
      'TRIGGER: beginner-facing technical writing / broad UI rewrite',
      'TRIGGER: actionable content / code blocks / generated artifacts',
      'TRIGGER: blocked Agent / unavailable tool / failed approach',
      'TRIGGER: credential / token / secret injection / private repository',
      'TRIGGER: hosting/platform modernization / “should we change stack?”',
      'TRIGGER: Workers shadow complete / Production cutover / provider behavior differences',
      'TRIGGER: cross-repository architecture reuse',
      'TRIGGER: overlapping PRs / large cross-site change',
      'TRIGGER: reusable lesson discovered',
    ]) expect(registry).toContain(trigger);
  });

  it('keeps Cloudflare build budget as a hard pre-authorization boundary', () => {
    expect(registry).toContain('Do not intentionally trigger one unless the owner has explicitly authorized');
    expect(registry).toContain('Never silently fall back');
    expect(registry).toContain('Never claim an exact remaining Cloudflare build counter');
  });

  it('requires stale remembered plans to refresh against current truth', () => {
    expect(registry).toContain('Treat remembered/conversational state as a hypothesis, not authority');
    expect(registry).toContain('If executable/live truth contradicts a `current/` document, update or demote the stale document');
  });

  it('protects exact-head validation and honest Preview evidence', () => {
    expect(registry).toContain('Compare the PR branch against current `main` before final acceptance');
    expect(registry).toContain('Re-run the deterministic Gate and build for the **new exact head**');
    expect(registry).toContain('a READY badge alone is not visual/product acceptance');
    expect(registry).toContain('Do not cite an earlier Preview as proof for a later synchronized head');
  });

  it('keeps valid Gates stronger than convenience', () => {
    expect(registry).toContain('If valid, fix the implementation/content so the protected meaning stays explicit');
    expect(registry).toContain('Do not trade research integrity or deployment safety for a green badge');
  });

  it('keeps the offline four-GPU experiment as a real completion path', () => {
    for (const token of ['4×3090','8×A800 80GB','8×A100 80GB','nvidia-smi topo -m','SFTP is deployment/transfer, not version control','method effect is reproduced']) expect(registry).toContain(token);
  });

  it('requires measured timing and current market evidence before paid-compute claims', () => {
    expect(registry).toContain('public catalog');
    expect(registry).toContain('real-time inventory');
    expect(registry).toContain('median(stable update time)');
    expect(registry).toContain('Never present a planning range as a measured benchmark');
  });

  it('preserves actionable-content and holistic-writing lessons', () => {
    expect(registry).toContain('If the user needs this exact thing in the next terminal');
    expect(registry).toContain('Rewrite the **whole affected journey**');
    expect(registry).toContain('what observable evidence counts as PASS');
  });

  it('protects secret, hosting-modernization, cutover, and cross-repo boundaries', () => {
    for (const token of ['Do not commit a live bearer token as plaintext','Do not assume GitHub Secrets are a readable key-value store','Do not rewrite Astro/React merely because Vercel is used for Preview','A working shadow URL is evidence, **not release authorization**','Preserve acceptable provider-native asymmetry','Reuse the **decision pattern**, not literal configuration']) expect(registry).toContain(token);
  });

  it('preserves the ML-to-Agent beginner bridge before deeper research taxonomy', () => {
    for (const token of ['known ML concepts','Agent runtime loop','runtime vs training','minimum RL vocabulary','map into the real paper/method']) expect(registry).toContain(token);
    expect(seedWorkflow).toContain('known ML concepts');
    expect(seedWorkflow).toContain('Agent runtime loop');
    expect(seedWorkflow).toContain('runtime vs training');
    expect(seedWorkflow).toContain('minimum RL vocabulary');
    expect(seedWorkflow).toContain('PR #104 is the active implementation path');
    expect(seedWorkflow).toContain('It is not current Production merely because its Preview passed');
  });

  it('does not silently restore Direct Upload as the ordinary Preview default', () => {
    expect(repositoryMap).toContain('Ordinary Preview surface — Vercel');
    expect(repositoryMap).toContain('Vercel project `basemodel-preview`');
    expect(repositoryMap).toContain('Cloudflare Direct Upload remains a supported fallback');
    expect(repositoryMap).not.toContain('default to local build + Direct Upload public Preview');
  });

  it('keeps the historical case reusable without freezing transient state', () => {
    for (const token of ['Build-budget lesson','Research-guide lesson','Offline-server lesson','Time/cost lesson','Actionable-content lesson','Credential lesson','Provider-ownership lesson','Workers-shadow lesson','Cross-repository lesson','Agent-knowledge lesson','Workflow-drift lesson','Exact-head lesson','Gate-integrity lesson','Beginner-bridge lesson']) expect(history).toContain(token);
    expect(history).toContain('avoids preserving temporary Preview share URLs');
    expect(history).toContain('conversation memory is a hypothesis');
  });
});
