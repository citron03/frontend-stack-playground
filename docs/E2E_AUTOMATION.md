# E2E_AUTOMATION

## 1. 개요
이 문서는 이 레포지토리의 E2E(End-to-End) 테스트를 초심자도 이해할 수 있도록 설명합니다. E2E 테스트는 사용자가 앱을 실제로 사용하는 것처럼 브라우저를 제어해서 전체 흐름을 검증합니다.

### E2E 테스트란?
- E2E는 애플리케이션의 시작부터 끝까지 전체 흐름을 검증합니다.
- 예: 홈 페이지 진입 → 버튼 클릭 → 페이지 이동 → 결과 확인.
- 단위 테스트(Unit Test)가 함수나 컴포넌트 단위를 검증한다면, E2E는 사용자 관점에서 앱 전체를 검증합니다.

### 왜 E2E가 필요한가?
- UI/UX 오류를 잡습니다. 예: 버튼은 렌더링되지만 클릭이 안 되는 경우.
- 실제 브라우저 환경에서 동작을 확인합니다.
- 새 기능 추가 후 전체 앱이 깨지지 않는지 확인합니다.
- 단, 실행 속도가 느리기 때문에 모든 테스트를 E2E로만 작성하지는 않습니다.

## 2. 이 프로젝트의 E2E 구조
이 프로젝트의 E2E는 `apps/web` 앱을 대상으로 하고, **Playwright** 기반으로 구성되어 있습니다.

- **앱 위치**: `apps/web`
- **E2E 위치**: `apps/web/e2e/`
- **공통 패키지**: `packages/e2e-testing/`에 Playwright/TC/MCP 공통 로직을 저장합니다.
- **실행 명령**:
  - 브라우저 설치: `pnpm --filter web run e2e:install`
  - E2E 실행: `pnpm --filter web run e2e`
  - MCP 서버 실행: `pnpm --filter web run e2e:mcp`

### 어떤 방식으로 실행되나?
- `apps/web/playwright.config.cjs`가 Playwright를 설정합니다.
- `tc.spec.cjs`는 `apps/web/e2e/tc/` 폴더에서 TC JSON 파일을 읽고 각 TC를 테스트로 변환합니다.
- `@playwright/test`가 브라우저를 켜고, 페이지를 조작하며 검증합니다.

## 3. E2E 디렉토리 구성
```
apps/web/e2e/
├── framework/
│   ├── error-collector.cjs    # 에러 수집기
│   ├── load-tc.cjs           # TC JSON 파일 로드
│   ├── report.cjs            # 보고서 작성
│   └── tc-runner.cjs         # TC 단계별 실행기
├── global-teardown.cjs       # 테스트 종료 후 정리
├── README.md                 # E2E 간단 설명
├── reports/                  # 실행 결과 저장 디렉토리
├── tc/                       # JSON 기반 테스트 케이스
│   └── home-smoke.tc.json    # 기본 스모크 테스트 예시
└── tc.spec.cjs               # Playwright 테스트 스펙 파일
```

### 각 파일 역할
- `framework/error-collector.cjs`
  - 브라우저 테스트 중 발생한 에러를 모으고 기록합니다.
- `framework/load-tc.cjs`
  - `tc/` 하위 `.tc.json` 파일을 모두 읽어서 테스트 케이스로 변환합니다.
- `framework/report.cjs`
  - 테스트가 끝난 뒤 결과 리포트를 만듭니다.
- `framework/tc-runner.cjs`
  - JSON에 적힌 동작(step)을 Playwright 명령으로 실행합니다.
- `tc.spec.cjs`
  - `load-tc.cjs`에서 읽은 TC를 실제 Playwright 테스트로 돌립니다.
- `global-teardown.cjs`
  - 테스트가 끝난 뒤 서버나 브라우저 리소스를 정리합니다.

## 4. TC(Test Case)란?
이 프로젝트는 TC를 **JSON 파일**로 작성합니다. JSON 형식으로 테스트를 선언하고, 코드가 아니라 데이터로 테스트 흐름을 정의합니다.

### TC JSON 예시
```json
{
  "name": "Home Smoke Test",
  "description": "Basic check for the home page",
  "startUrl": "/",
  "steps": [
    {"action": "expectVisible", "selector": "body"},
    {"action": "expectText", "selector": "body", "text": "Next.js"}
  ]
}
```

### TC 파일 위치
- `apps/web/e2e/tc/`에 `.tc.json` 확장자로 저장합니다.
- 예: `apps/web/e2e/tc/home-smoke.tc.json`, `apps/web/e2e/tc/login.tc.json`

## 5. 현재 지원하는 TC 액션
현재 프로젝트에서 `framework/tc-runner.cjs`가 지원하는 동작은 다음과 같습니다.

- `goto`
  - 페이지 이동: `{"action": "goto", "url": "/login"}`
- `click`
  - 요소 클릭: `{"action": "click", "selector": "#submit-btn"}`
- `fill`
  - 입력값 채우기: `{"action": "fill", "selector": "#username", "value": "testuser"}`
- `press`
  - 키 입력: `{"action": "press", "selector": "#password", "key": "Enter"}`
- `waitForElement`
  - 요소 대기: `{"action": "waitForElement", "selector": ".loading"}`
- `expectText`
  - 텍스트 검사: `{"action": "expectText", "selector": ".message", "text": "Welcome"}`
- `expectVisible`
  - 요소 보임 여부 검사: `{"action": "expectVisible", "selector": ".modal"}`
- `expectUrlContains`
  - 현재 URL에 문자열 포함 여부 검사: `{"action": "expectUrlContains", "value": "dashboard"}`

> 주의: `navigate`, `type`, `assertText` 같은 이름은 이 프로젝트의 기본 TC에서 바로 사용할 수 없습니다. 대신 위에 정의된 액션 이름으로 작성해야 합니다.

## 6. TC 작성 방법
### 1) 새 TC 파일 만들기
- 위치: `apps/web/e2e/tc/`
- 파일명 예: `login.tc.json`
- 꼭 필요한 필드:
  - `name` : 테스트 이름
  - `description` : 테스트 설명
  - `steps` : 순서대로 실행할 동작 목록
  - `startUrl` : 테스트 시작 페이지 (선택)

### 2) 단계 작성 예시
```json
{
  "name": "Login Test",
  "description": "Test user login flow",
  "startUrl": "/login",
  "steps": [
    {"action": "fill", "selector": "#username", "value": "testuser"},
    {"action": "fill", "selector": "#password", "value": "password123"},
    {"action": "click", "selector": "#login-btn"},
    {"action": "waitForElement", "selector": ".dashboard"},
    {"action": "expectText", "selector": ".welcome", "text": "Welcome, testuser"}
  ]
}
```

### 3) 작성 팁
- **작은 단위로 작성**: 한 TC에 너무 많은 동작을 넣지 말고, 하나의 흐름을 검증하는 테스트를 만듭니다.
- **셀렉터는 명확하게**: `id`, 고유 클래스, 버튼 텍스트보다 안정적인 selector를 사용합니다.
- **먼저 수동으로 확인**: 브라우저에서 페이지를 직접 열고, 해당 요소가 있는지 확인한 후 TC에 넣습니다.
- **예상값은 정확하게**: `expectText`의 `text`는 실제 화면에 있는 문구의 일부 또는 전체여야 합니다.

## 7. 실행 및 확인
### 로컬 실행
```bash
pnpm --filter web run e2e:install
pnpm --filter web run e2e
```

### Playwright MCP 모드
- `pnpm --filter web run e2e:mcp`
- `@playwright/mcp`는 AI 에이전트와 통합된 브라우저 제어를 지원합니다.
- 이 레포에서는 TC 기반 Playwright 테스트 실행과 함께 MCP 사용을 학습 대상으로 삼습니다.

### 실행 결과 확인
- 결과 디렉토리: `apps/web/e2e/reports/`
- 주요 파일:
  - `summary.md` : 실행 요약
  - `summary.json` : 기계가 읽기 쉬운 결과
  - `raw/` : 상세한 테스트 로그
  - `test-results/` : Playwright 스크린샷, 비디오 등

## 8. Playwright과 MCP/Skill 학습 포인트
### Playwright란?
- Playwright는 브라우저 자동화 도구입니다.
- 크롬, 파이어폭스, 웹킷을 지원하며 실제 브라우저를 띄워서 테스트합니다.
- 요소 클릭, 입력, 페이지 이동, 텍스트 검사 같은 작업을 코드로 실행합니다.

### MCP란?
- MCP는 Playwright와 AI 에이전트를 연결하는 기술입니다.
- AI가 브라우저를 조작하도록 도와주고, 자동화 워크플로우를 지원합니다.
- 이 레포의 `e2e:mcp` 명령은 MCP 관련 워크플로우를 실행하기 위한 진입점입니다.

### Skill이란?
- 이 레포의 `.claude/skills/`는 AI 스킬 정의 폴더입니다.
- 예: `create-e2e-tc` 스킬은 자연어로 TC를 만들도록 돕습니다.
- 스킬은 반복 작업을 자동화하고, TC 작성이나 E2E 실행을 더 쉽게 만듭니다.

## 9. 초심자를 위한 요약
- E2E 테스트는 실제 사용자 흐름을 브라우저에서 재현하는 테스트입니다.
- 이 프로젝트는 JSON 파일을 통해 테스트 시나리오를 작성하고, Playwright가 이를 실행합니다.
- `pnpm --filter web run e2e`로 테스트를 실행하고, `apps/web/e2e/reports/`에서 결과를 확인합니다.
- `pnpm --filter web run e2e:mcp`로 AI/Playwright 통합 학습도 시도해볼 수 있습니다.
- 처음에는 작은 TC 하나부터 시작하고, 하나씩 동작을 추가하며 결과를 확인하세요.

## 10. 참고
- TC 파일은 `apps/web/e2e/tc/`에 저장합니다.
- 꼭 `playwright.config.cjs`와 `framework/tc-runner.cjs`에서 지원하는 액션 이름을 확인하세요.
- `vendor/`와 `patches/`는 수정하지 않습니다.

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
