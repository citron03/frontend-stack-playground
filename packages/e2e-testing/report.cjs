const fs = require('node:fs/promises');
const path = require('node:path');

const CATEGORIES = ['api', 'render', 'network', 'assertion'];

async function writeRunReport(outputDir, report) {
  await fs.mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${report.tcId}.json`);
  await fs.writeFile(filePath, JSON.stringify(report, null, 2), 'utf8');
}

async function writeAggregateReport(rawDir, outputDir) {
  await fs.mkdir(outputDir, { recursive: true });

  const files = (await fs.readdir(rawDir).catch(() => [])).filter((name) => name.endsWith('.json')).sort();

  const reports = [];
  for (const file of files) {
    const content = await fs.readFile(path.join(rawDir, file), 'utf8');
    reports.push(JSON.parse(content));
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    totalCases: reports.length,
    passedCases: reports.filter((item) => item.status === 'passed').length,
    failedCases: reports.filter((item) => item.status === 'failed').length,
    errorsByCategory: summarizeByCategory(reports),
  };

  await fs.writeFile(path.join(outputDir, 'summary.json'), JSON.stringify({ summary, reports }, null, 2), 'utf8');
  await fs.writeFile(path.join(outputDir, 'summary.md'), renderMarkdownSummary(summary, reports), 'utf8');
}

function summarizeByCategory(reports) {
  const result = { api: 0, render: 0, network: 0, assertion: 0 };
  for (const report of reports) {
    for (const category of CATEGORIES) {
      result[category] += report.stats.byCategory[category] ?? 0;
    }
  }

  return result;
}

function renderMarkdownSummary(summary, reports) {
  const lines = [
    '# E2E Error Summary',
    '',
    `- Generated: ${summary.generatedAt}`,
    `- Total cases: ${summary.totalCases}`,
    `- Passed: ${summary.passedCases}`,
    `- Failed: ${summary.failedCases}`,
    '',
    '## Error Categories',
    '',
    `- API errors: ${summary.errorsByCategory.api}`,
    `- Render errors: ${summary.errorsByCategory.render}`,
    `- Network errors: ${summary.errorsByCategory.network}`,
    `- Assertion errors: ${summary.errorsByCategory.assertion}`,
    '',
    '## Cases',
    '',
  ];

  for (const report of reports) {
    lines.push(`### ${report.tcId} (${report.status})`);
    lines.push(`- Name: ${report.tcName}`);
    lines.push(`- Errors: ${report.stats.total}`);
    lines.push(`- API/Render/Network/Assertion: ${report.stats.byCategory.api}/${report.stats.byCategory.render}/${report.stats.byCategory.network}/${report.stats.byCategory.assertion}`);
    if (report.errors[0]) {
      lines.push(`- First error: ${report.errors[0].message}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

module.exports = { writeRunReport, writeAggregateReport };
