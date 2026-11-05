import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('site token classes', () => {
  it('keeps typography size, foreground, family and weight as separate properties', () => {
    const classes = cn('tw:text-control tw:text-foreground tw:font-sans tw:font-label').split(' ');
    expect(classes).toEqual(['tw:text-control', 'tw:text-foreground', 'tw:font-sans', 'tw:font-label']);
  });

  it('allows a consumer to override prefixed spacing without removing its semantic hook', () => {
    expect(cn('actionable-result-copy tw:px-2', 'tw:px-4')).toBe('actionable-result-copy tw:px-4');
  });
});
