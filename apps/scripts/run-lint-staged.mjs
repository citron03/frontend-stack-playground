#!/usr/bin/env node
// 실행 환경: Node.js (macOS/Linux/Windows 공통)

import { $ } from 'zx';

(async () => {
  try {
    await $`./node_modules/.bin/lint-staged`;
  } catch (error) {
    console.error('lint-staged failed:', error);
    process.exit(1);
  }
})();
