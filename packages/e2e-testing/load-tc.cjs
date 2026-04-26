const fs = require('node:fs');
const path = require('node:path');

const TC_SUFFIX = '.tc.json';

function loadAllTestCases(tcDir) {
  const files = fs
    .readdirSync(tcDir)
    .filter((name) => name.endsWith(TC_SUFFIX))
    .sort();

  if (files.length === 0) {
    throw new Error(`No test cases found in ${tcDir}`);
  }

  return files.map((fileName) => {
    const filePath = path.join(tcDir, fileName);
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  });
}

module.exports = { loadAllTestCases };
