---
name: e2e-playwright-mcp
description: Run TC-based Playwright E2E and collect categorized runtime errors.
---

Run:
- `pnpm --filter web run e2e:install`
- `pnpm --filter web run e2e`

Optional:
- `pnpm --filter web run e2e:mcp`
