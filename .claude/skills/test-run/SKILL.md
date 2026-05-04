---
name: test-run
description: Run the right tests for this monorepo with minimal scope.
---

1. Identify target app(s) based on files touched.
2. Prefer app-scoped tests:
   - `pnpm web:test` for `apps/web`
   - `pnpm tanstack:test` for `apps/tanstack`
   - `pnpm ds:test` for `apps/design-system`
3. If scope is unclear, run `pnpm test` from repo root.
4. For web unit tests, ensure Vitest + jsdom config is used.
5. Report the exact command used and any failing test names.
