const { createPlaywrightConfig } = require('@practice/e2e-testing');

module.exports = createPlaywrightConfig({
  testDir: './e2e',
  outputDir: './e2e/reports/test-results',
  baseURL: 'http://127.0.0.1:3000',
  webServerCommand: 'pnpm --filter web dev',
  webServerUrl: 'http://127.0.0.1:3000',
  globalTeardown: './e2e/global-teardown.cjs',
});
