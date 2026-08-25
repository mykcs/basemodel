// ESLint minimal config for basemodel.
//
// Scope: catch only the highest-signal rules. The repo has not had
// ESLint before, so this config is deliberately narrow — broad
// style rules (import/order, prefer-const, etc.) are left off so
// the first ESLint pass is a baseline, not a 200-warning flood.
// Tighter rules (react-hooks/exhaustive-deps, jsx-a11y, etc.) can
// be added in a follow-up once the baseline is reviewed.
//
// Two parser entries:
//   - typescript-eslint parser for .ts / .tsx
//   - eslint-plugin-astro parser for .astro
//
// Both feed into the same flat-config rule set.
import tseslint from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.vercel/**',
      '.astro/**',
      'reports/**',
      'playwright-report/**',
      'src/content/models/**',
      'src/content/papers/**',
      'src/content/coverage/**',
      'src/content/benchmarkRuns/**',
      'src/i18n/**',
      'dist-ssr/**',
    ],
  },
  ...tseslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // High-signal: catching actual bugs
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-unused-vars': 'off', // typescript-eslint version is more accurate

      // Allow TS / Astro patterns
      '@typescript-eslint/no-explicit-any': 'off', // repo has these; would be 100+ warnings
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
      },
    },
  },
];
