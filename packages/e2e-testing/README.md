# @practice/e2e-testing

This package contains shared E2E utilities for the practice-next-15 monorepo.

## Purpose
- Provide common Playwright configuration helpers
- Load JSON-based TC files
- Execute TC steps uniformly across apps
- Generate aggregated reports
- Support MCP-aware test orchestration

## API
- `createPlaywrightConfig(options)`
- `loadAllTestCases(tcDir)`
- `runTcStep(page, step)`
- `attachErrorCollector(page, options)`
- `writeRunReport(outputDir, report)`
- `writeAggregateReport(rawDir, outputDir)`
- `TC_ACTIONS`
- `TC_ACTION_EXAMPLES`

## Usage
Import from the package in app-specific wrappers and use the shared TC schema and runtime.
