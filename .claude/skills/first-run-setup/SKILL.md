---
name: first-run-setup
description: Bootstrap this repository on first run (install deps, init submodules, setup AI stack, and run baseline checks).
---

1. Repository bootstrap
- Run from repo root:
  - `pnpm install`
  - `git submodule sync --recursive`
  - `git submodule update --init --recursive`

2. AI stack and superpowers setup
- Run:
  - `pnpm ai:setup-stack`
- Confirm generated files exist:
  - `.claude/ai/settings.json`
  - `.claude/ai/mcp.policy.json`
  - `.claude/ai/plugins.policy.json`
  - `.claude/ai/multi-agent.policy.json`
  - `.claude/ai/superpowers.json`
  - `.claude/ai/ANALYSIS.md`

3. Sync and consistency checks
- Run:
  - `pnpm ai:check-stack`
  - `pnpm ai:check-config-sync`

4. Baseline quality checks (fast path)
- Prefer scoped checks first:
  - `pnpm typecheck`
  - `pnpm lint`

5. Report format
- Always report:
  - executed commands
  - failures and root cause
  - next recommended recovery command

규칙:
- `vendor/**`는 직접 수정하지 않는다.
- `patches/**`는 삭제/무단 수정하지 않는다.
- 네트워크 의존 명령(curl/wget/http URL)은 정책 설정 커맨드에 등록하지 않는다.
