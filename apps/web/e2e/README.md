# Web E2E (TC-based)

이 디렉토리는 Playwright 기반 TC(Test Case) 데이터 주도 E2E 테스트를 제공한다.

## 실행
- 브라우저 설치: `pnpm --filter web run e2e:install`
- E2E 실행: `pnpm --filter web run e2e`
- MCP 서버 실행: `pnpm --filter web run e2e:mcp`

## TC 작성
- 위치: `apps/web/e2e/tc/*.tc.json`
- 필드: `id`, `name`, `steps[]`

## 오류 분류
- `api`: HTTP 4xx/5xx, fetch/xhr request 실패
- `render`: pageerror, 콘솔 error
- `network`: 정적 리소스 네트워크 실패
- `assertion`: TC step assertion 실패

## 결과물
- raw: `apps/web/e2e/reports/raw/*.json`
- 집계: `apps/web/e2e/reports/summary.json`, `apps/web/e2e/reports/summary.md`
