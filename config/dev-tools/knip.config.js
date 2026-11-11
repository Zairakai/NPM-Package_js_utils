/**
 * Knip configuration
 * @see https://knip.dev/reference/configuration
 */
export default {
  project: ['src/**/*.ts'],
  // The tools are run by the Makefile and the npm scripts, which Knip does not read
  ignoreBinaries: ['eslint', 'prettier', 'markdownlint', 'make'],
  ignoreDependencies: ['sort-package-json'],
}
