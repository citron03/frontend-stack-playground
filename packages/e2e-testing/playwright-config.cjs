const { defineConfig, devices } = require('@playwright/test');

function createPlaywrightConfig(options = {}) {
  const {
    testDir = './e2e',
    outputDir = './e2e/reports/test-results',
    baseURL = 'http://127.0.0.1:3000',
    webServerCommand = 'pnpm --filter web dev',
    webServerUrl = 'http://127.0.0.1:3000',
    globalTeardown = './e2e/global-teardown.cjs',
  } = options;

  return defineConfig({
    testDir,
    testMatch: /.*\.spec\.cjs$/,
    timeout: 30_000,
    expect: {
      timeout: 5_000,
    },
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list']],
    use: {
      baseURL,
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
    webServer: {
      command: webServerCommand,
      url: webServerUrl,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    globalTeardown,
    outputDir,
  });
}

module.exports = { createPlaywrightConfig };
