/**
 * Project ESLint configuration.
 * Extends the @zairakai/js-dev-tools base config — customize as needed.
 *
 * Example of adding project-specific rules:
 *   export default [
 *     ...baseConfig,
 *     {
 *       rules: {
 *         'no-console': 'warn',
 *       },
 *     },
 *   ]
 */

import parserTypeScript from '@typescript-eslint/parser'
import baseConfig from '@zairakai/js-dev-tools/config/eslint.config.js'

export default [
  ...baseConfig,
  {
    files: ['tests/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        project: './tsconfig.test.json',
      },
    },
  },
]
