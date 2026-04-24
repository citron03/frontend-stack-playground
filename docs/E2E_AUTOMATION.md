# E2E_AUTOMATION

작성일: 2026-04-24

## 1. 개요
- `apps/web`에 TC(Test Case) 기반 Playwright E2E 자동화를 도입한다.
- MCP 서버(`playwright-mcp`)를 함께 제공해 AI 에이전트 자동 브라우저 워크플로우를 지원한다.

## 2. 실행 명령
- 브라우저 설치: `pnpm --filter web run e2e:install`
- E2E 실행: `pnpm --filter web run e2e`
- MCP 서버: `pnpm --filter web run e2e:mcp`

## 3. TC 구조
- 경로: `apps/web/e2e/tc/*.tc.json`
- 필수: `id`, `name`, `steps`
- Step 액션:
  - `goto`, `click`, `fill`, `press`, `waitForSelector`
  - `expectText`, `expectVisible`, `expectUrlContains`

## 4. 오류 분류 체계
- `api`
  - HTTP 4xx/5xx 응답
  - fetch/xhr request failure
- `render`
  - `pageerror` 이벤트
  - 브라우저 console `error`
- `network`
  - 정적 리소스 로딩 실패 등 비 API request failure
- `assertion`
  - TC step assertion 실패

## 5. 결과 리포트
- raw: `apps/web/e2e/reports/raw/*.json`
- summary json: `apps/web/e2e/reports/summary.json`
- summary markdown: `apps/web/e2e/reports/summary.md`

## 6. 운영 가이드
- 기능 추가/버그 수정 시 관련 TC를 먼저 추가 또는 수정한다.
- 실패 분석은 `summary.md` -> 해당 raw report 순서로 진행한다.
- 오류 건수뿐 아니라 category 분포(api/render/network/assertion)를 함께 본다.
