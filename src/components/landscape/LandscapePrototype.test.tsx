import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import LandscapePrototype from './LandscapePrototype';

describe('LandscapePrototype SSR readiness', () => {
  it('publishes React-owned controls as unavailable until hydration', () => {
    const html = renderToStaticMarkup(<LandscapePrototype models={[]} />);
    expect(html).toContain('class="landscape-controls"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('完整视图');
  });
});
