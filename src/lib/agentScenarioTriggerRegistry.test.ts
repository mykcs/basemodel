import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = readFileSync(new URL('../../AGENTS.md', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../../docs/agents/README.md', import.meta.url), 'utf8');
const registry = readFileSync(new URL('../../docs/agents/current/scenario-trigger-registry.md', import.meta.url), 'utf8');
const history = readFileSync(new URL('../../docs/agents/history/2026-08-11-seed-preview-and-agent-workflow-lessons.md', import.meta.url), 'utf8');

describe('Agent scenario-trigger discovery', () => {
  it('routes future non-trivial work through the trigger registry', () => {
    for (const file of [root, readme]) {
      expect(file).toContain('scenario-trigger-registry.md');
    }
    expect(root).toContain('scan scenario-trigger-registry');
    expect(readme).toContain('scan scenario-trigger-registry against the task');
    expect(registry).toContain('Do not wait for the owner to repeat these reminders');
  });

  it('protects the recurring high-cost situations from this project', () => {
    for (const trigger of [
      'TRIGGER: deployment-budget / Preview / Cloudflare',
      'TRIGGER: SEED / ALFWorld / WebShop / reproduction / GPU choice',
      'TRIGGER: offline lab server / SFTP / no outbound internet',
      'TRIGGER: time estimate / GPU rental cost / current compute catalog',
      'TRIGGER: beginner-facing technical writing / broad UI rewrite',
      'TRIGGER: actionable content / code blocks / generated artifacts',
      'TRIGGER: blocked Agent / unavailable tool / failed approach',
      'TRIGGER: overlapping PRs / large cross-site change',
      'TRIGGER: reusable lesson discovered',
    ]) expect(registry).toContain(trigger);
  });

  it('keeps Cloudflare build budget as a hard pre-authorization boundary', () => {
    expect(registry).toContain('Do not intentionally trigger one unless the owner has explicitly authorized');
    expect(registry).toContain('Never silently fall back');
    expect(registry).toContain('Never claim an exact remaining Cloudflare build counter');
  });

  it('keeps the offline four-GPU experiment as a real completion path', () => {
    for (const token of [
      '4×3090',
      '8×A800 80GB',
      '8×A100 80GB',
      'nvidia-smi topo -m',
      'SFTP is deployment/transfer, not version control',
      'method effect is reproduced',
    ]) expect(registry).toContain(token);
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

  it('keeps the historical case reusable without freezing transient state', () => {
    for (const token of [
      'Build-budget lesson',
      'Research-guide lesson',
      'Offline-server lesson',
      'Time/cost lesson',
      'Actionable-content lesson',
      'Agent-knowledge lesson',
    ]) expect(history).toContain(token);
    expect(history).toContain('avoids preserving temporary Preview share URLs');
  });
});
