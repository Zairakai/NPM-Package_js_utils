/**
 * Knip configuration
 * @see https://github.com/webpro/knip
 */
export default {
  project: ['src/**/*.ts'],
  ignoreBinaries: ['eslint', 'prettier', 'markdownlint', 'make'],
  // @typescript-eslint/parser is a transitive dep via @zairakai/js-dev-tools — used directly in eslint.config.js
  ignoreDependencies: ['sort-package-json', '@typescript-eslint/parser'],
}
