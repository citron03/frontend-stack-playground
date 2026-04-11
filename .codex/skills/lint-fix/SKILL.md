---
name: lint-fix
description: Run lint/format/stylelint with minimal scope and fixable output.
---

1. Identify affected apps/files.
2. Prefer scoped runs:
   - `pnpm lint` for general lint
   - `pnpm format` for formatting
   - `pnpm stylelint` for CSS issues
3. If only web app changed, use `pnpm web:lint` when available; otherwise root.
4. Apply auto-fixes only (no manual refactor unless requested).
5. Summarize fixes and list any remaining errors.
