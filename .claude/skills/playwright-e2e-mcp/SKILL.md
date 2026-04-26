---
name: playwright-e2e-mcp
description: Run TC-based Playwright E2E with categorized runtime error collection (API/render/network/assertion) and MCP server usage.
---

1. Install browser runtime
- `pnpm --filter web run e2e:install`

2. Run TC-based E2E
- `pnpm --filter web run e2e`

3. Start MCP server for browser automation workflows
- `pnpm --filter web run e2e:mcp`

4. Use shared E2E package API
- Ensure TC files follow `@practice/e2e-testing` supported actions and schema.

4. Validate report outputs
- Raw reports: `apps/web/e2e/reports/raw/*.json`
- Summary: `apps/web/e2e/reports/summary.json`
- Human summary: `apps/web/e2e/reports/summary.md`

5. Error taxonomy
- `api`: HTTP 4xx/5xx, fetch/xhr request failures
- `render`: pageerror, console error
- `network`: static/resource request failures
- `assertion`: TC step assertion failures

규칙:
- TC는 `apps/web/e2e/tc/*.tc.json`에 데이터로 관리한다.
- 테스트 실패 시 분류된 오류를 먼저 확인하고 수정한다.
- 테스트/리포트 결과를 근거로만 완료를 선언한다.
