import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('../components/research/AlfworldTaskFamilies.astro', import.meta.url), 'utf8');

describe('ALFWorld task-family teaching boundary', () => {
  it('shows six core families while preserving the upstream movable-receptacle variant', () => {
    for (const family of [
      'pick_and_place_simple',
      'look_at_obj_in_light',
      'pick_clean_then_place_in_recep',
      'pick_heat_then_place_in_recep',
      'pick_cool_then_place_in_recep',
      'pick_two_obj_and_place',
    ]) expect(source).toContain(family);
    expect(source).toContain('pick_and_place_with_movable_recep');
    expect(source).toContain('train / valid_seen / valid_unseen');
    expect(source).toContain('not a claim that the upstream generator contains only six GOALS');
  });
});
