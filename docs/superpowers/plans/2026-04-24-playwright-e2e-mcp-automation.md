# Playwright E2E MCP Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** web 앱에 TC 기반 Playwright E2E 자동화와 MCP 서버 실행, 오류 유형별 수집/집계 체계를 도입한다.

**Architecture:** TC JSON을 데이터 소스로 사용하고, Playwright step runner가 이를 실행한다. 런타임 이벤트(response/requestfailed/pageerror/console)와 assertion 실패를 수집해 카테고리(api/render/network/assertion)로 분류 후 raw+summary 리포트로 집계한다.

**Tech Stack:** Next.js, Playwright, @playwright/test, @playwright/mcp, pnpm workspace

---

### Task 1: Runtime & Config Setup

**Files:**
- Modify: `apps/web/package.json`
- Modify: `package.json`
- Modify: `.gitignore`

- [x] Add Playwright/MCP dependencies and scripts
- [x] Add root convenience scripts for web e2e/mcp
- [x] Add ignore rules for playwright result artifacts

### Task 2: TC-driven E2E Engine

**Files:**
- Create: `apps/web/playwright.config.cjs`
- Create: `apps/web/e2e/tc.spec.cjs`
- Create: `apps/web/e2e/global-teardown.cjs`
- Create: `apps/web/e2e/framework/load-tc.cjs`
- Create: `apps/web/e2e/framework/tc-runner.cjs`
- Create: `apps/web/e2e/framework/error-collector.cjs`
- Create: `apps/web/e2e/framework/report.cjs`
- Create: `apps/web/e2e/tc/home-smoke.tc.json`

- [x] Implement TC loader and action runner
- [x] Implement categorized error collector
- [x] Persist raw report per TC and aggregate summary
- [x] Add initial smoke TC

### Task 3: AI Skill + Docs

**Files:**
- Create: `.claude/skills/playwright-e2e-mcp/SKILL.md`
- Create: `.claude/commands/e2e-playwright-mcp.md`
- Create: `docs/E2E_AUTOMATION.md`
- Modify: `docs/README.md`
- Modify: `docs/TEST_STRATEGY.md`

- [x] Add AI skill for e2e/mcp execution flow
- [x] Add command shortcut doc
- [x] Document taxonomy, output, operations

### Task 4: Verification

**Commands:**
- `pnpm --filter web run e2e:install`
- `pnpm --filter web run e2e`
- `pnpm typecheck`
- `pnpm lint`

- [x] Verify browser runtime install
- [x] Verify E2E executes and report files generated
- [x] Verify workspace typecheck/lint
