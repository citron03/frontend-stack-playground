---
name: ai-stack-setup
description: Securely bootstrap MCP/plugin/multi-agent policy for this monorepo and sync Claude/Codex settings.
---

1. Run `pnpm ai:setup-stack` from repo root.
2. Validate generated policy files:
   - `.claude/ai/settings.json`
   - `.claude/ai/mcp.policy.json`
   - `.claude/ai/plugins.policy.json`
   - `.claude/ai/multi-agent.policy.json`
   - `.claude/ai/superpowers.json`
   - `.claude/ai/ANALYSIS.md`
3. Confirm Claude/Codex sync:
   - `pnpm ai:check-config-sync`
4. If any policy override is needed, update `.claude/ai/*` source files and run:
   - `pnpm ai:sync-config`

규칙:
- 원격/네트워크 기반 플러그인은 기본 비활성화한다.
- `vendor/`, `patches/`는 자동화에서 쓰기 금지한다.
- app-scoped 테스트/검증을 기본으로 한다.
