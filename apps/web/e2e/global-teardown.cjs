const path = require('node:path');

const { writeAggregateReport } = require('./framework/report.cjs');

async function globalTeardown() {
  const reportsDir = path.join(__dirname, 'reports');
  const rawDir = path.join(reportsDir, 'raw');

  await writeAggregateReport(rawDir, reportsDir);
}

module.exports = globalTeardown;
