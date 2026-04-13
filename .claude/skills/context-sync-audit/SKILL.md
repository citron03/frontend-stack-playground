---
name: context-sync-audit
description: Perform a full project context audit and synchronize docs/AI configs into one consistent state.
---

1. Baseline scan
- Run:
  - `git status --short`
  - `rg --files docs .claude .codex apps`
  - `find apps -maxdepth 3 -type d`
- Confirm whether `apps/docs` exists. If not, treat root `docs/` as source of truth.

2. Consistency checks
- Verify `.claude` and `.codex` parity:
  - `pnpm ai:check-config-sync`
  - `diff -rq .claude .codex`
- Verify AI policy generation consistency:
  - `pnpm ai:check-stack`
- Search stale keywords in docs/config:
  - `nitro: latest`, `.cluade`, `apps/docs`, outdated app list entries.

3. Reconcile state
- Update docs that conflict with current code/config.
- Keep historical reports explicit: if snapshot content is old, add/update a dated "갱신 메모" section.
- Ensure app inventory is based on `apps/<name>/package.json` existence.
- If `.claude` changes are made, run:
  - `pnpm ai:setup-stack`
  - `pnpm ai:sync-config`

4. Validation (required)
- Run:
  - `pnpm ai:check-stack`
  - `pnpm ai:check-config-sync`
- Re-run targeted grep checks for stale terms.
- Report:
  - changed files
  - unresolved mismatches (if any)
  - exact commands used

5. Guardrails
- Do not edit `vendor/**` directly.
- Do not delete `patches/**`.
- Keep edits minimal and scoped to consistency fixes.
