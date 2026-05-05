---
name: ai-stack-setup
description: Securely bootstrap MCP/plugin/multi-agent policy for this monorepo and sync AI agent settings.
---

1. Run `pnpm ai:setup-stack` from repo root.
2. Validate generated policy files:
   - `.agent/ai/settings.json`
   - `.agent/ai/mcp.policy.json`
   - `.agent/ai/plugins.policy.json`
   - `.agent/ai/multi-agent.policy.json`
   - `.agent/ai/superpowers.json`
   - `.agent/ai/ANALYSIS.md`
3. Confirm AI config sync:
   - `pnpm ai:check-config-sync`
4. If any policy override is needed, update `.agent/ai/*` source files and run:
   - `pnpm ai:sync-config`

규칙:
- 원격/네트워크 기반 플러그인은 기본 비활성화한다.
- `vendor/`, `patches/`는 자동화에서 쓰기 금지한다.
- app-scoped 테스트/검증을 기본으로 한다.
