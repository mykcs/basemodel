import { defineConfig } from 'vitest/config';
import { behaviorTestFiles } from './vitest.test-taxonomy';

export default defineConfig({
  test: {
    include: [...behaviorTestFiles],
  },
});
