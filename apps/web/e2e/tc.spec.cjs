const path = require('node:path');

const { test } = require('@playwright/test');

const { attachErrorCollector } = require('./framework/error-collector.cjs');
const { loadAllTestCases } = require('./framework/load-tc.cjs');
const { writeRunReport } = require('./framework/report.cjs');
const { runTcStep } = require('./framework/tc-runner.cjs');

const tcDir = path.join(__dirname, 'tc');
const reportRawDir = path.join(__dirname, 'reports', 'raw');
const testCases = loadAllTestCases(tcDir);

for (const tc of testCases) {
  test(`[TC] ${tc.id} - ${tc.name}`, async ({ page }) => {
    const startedAt = new Date().toISOString();
    let currentStepId;

    const collector = attachErrorCollector(page, {
      getCurrentStepId: () => currentStepId,
    });

    let status = 'passed';

    try {
      if (tc.startUrl) {
        await page.goto(tc.startUrl);
      }

      for (const step of tc.steps) {
        currentStepId = step.id;
        try {
          await runTcStep(page, step);
        } catch (error) {
          status = 'failed';
          collector.addAssertionError(error);
          throw error;
        }
      }
    } finally {
      collector.detach();
      const endedAt = new Date().toISOString();
      const stats = collector.summarize();

      const report = {
        tcId: tc.id,
        tcName: tc.name,
        startedAt,
        endedAt,
        status,
        errors: collector.list,
        stats,
      };

      await writeRunReport(reportRawDir, report);
    }
  });
}
