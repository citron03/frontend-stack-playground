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

## 1.1. 최초 설정
1. 모노레포 루트에서 의존성 설치:
   ```bash
   pnpm install
   ```
2. `apps/web` 앱에서 Playwright 브라우저 런타임 설치:
   ```bash
   pnpm --filter web run e2e:install
   ```
3. `@practice/e2e-testing` 공유 패키지는 workspace 링크 방식으로 자동 연결됩니다.
4. 이후 E2E 실행:
   ```bash
   pnpm --filter web run e2e
   ```
5. MCP 모드로 AI/Playwright 통합을 사용하려면:
   ```bash
   pnpm --filter web run e2e:mcp
   ```

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
- `tc.spec.cjs`는 `@practice/e2e-testing` 공유 API로 TC JSON 파일을 읽고 각 TC를 테스트로 변환합니다.
- `@playwright/test`가 브라우저를 켜고, 페이지를 조작하며 검증합니다.

## 3. E2E 디렉토리 구성
이 레포지토리의 E2E 테스트는 앱별 래퍼 코드와 공통 실행 로직을 분리하여 구성되어 있습니다.

### 앱별 E2E 위치
```
apps/web/e2e/
├── framework/                # 앱 레벨 보완 코드(현재는 공통 패키지와 함께 사용)
│   ├── error-collector.cjs
│   ├── load-tc.cjs
│   ├── report.cjs
│   └── tc-runner.cjs
├── global-teardown.cjs       # 테스트 종료 후 정리
├── README.md                 # E2E 간단 설명
├── reports/                  # 실행 결과 저장 디렉토리
├── tc/                       # JSON 기반 테스트 케이스
│   └── home-smoke.tc.json    # 기본 스모크 테스트 예시
└── tc.spec.cjs               # Playwright 테스트 스펙 파일
```

### 공통 E2E 패키지 위치
```
packages/e2e-testing/
├── error-collector.cjs
├── index.cjs
├── load-tc.cjs
├── package.json
├── playwright-config.cjs
├── README.md
├── report.cjs
├── schema.cjs
└── tc-runner.cjs
```

### 각 파일 역할
- `apps/web/e2e/tc.spec.cjs`
  - `@practice/e2e-testing` 공유 API를 호출해 TC를 실행합니다.
- `apps/web/e2e/global-teardown.cjs`
  - 테스트 종료 후 집계 리포트를 생성합니다.
- `apps/web/e2e/README.md`
  - 앱별 E2E 간단 설명을 담습니다.
- `apps/web/e2e/tc/`
  - JSON TC 파일을 저장합니다.
- `packages/e2e-testing/index.cjs`
  - 공통 E2E API를 내보내는 진입점입니다.
- `packages/e2e-testing/playwright-config.cjs`
  - 공통 Playwright 설정 생성 함수(`createPlaywrightConfig`)를 제공합니다.
- `packages/e2e-testing/load-tc.cjs`
  - `.tc.json` 테스트 케이스를 로드합니다.
- `packages/e2e-testing/tc-runner.cjs`
  - TC 단계별 동작을 Playwright 명령으로 실행합니다.
- `packages/e2e-testing/error-collector.cjs`
  - 브라우저 에러/네트워크/콘솔 이벤트를 수집합니다.
- `packages/e2e-testing/report.cjs`
  - 개별 및 집계 리포트를 작성합니다.
- `packages/e2e-testing/schema.cjs`
  - 지원하는 TC 액션 목록과 예시를 정의합니다.

## 4. 공유 E2E 패키지 API
이 프로젝트는 공통 E2E 로직을 `packages/e2e-testing/`에 두고, 앱별 Playwright 설정과 TC 실행은 이 패키지에서 가져와 사용합니다.

### 주요 API
- `createPlaywrightConfig(options)`
  - Playwright 설정 객체를 생성합니다.
  - 옵션: `testDir`, `outputDir`, `baseURL`, `webServerCommand`, `webServerUrl`, `globalTeardown`.
  - `apps/web/playwright.config.cjs`에서 이 함수를 호출하여 공통 설정을 재사용합니다.
- `loadAllTestCases(tcDir)`
  - 지정한 폴더에서 `.tc.json` 파일을 정렬해 모두 로드합니다.
  - TC를 순서대로 읽어 `tc.spec.cjs`에서 테스트로 변환합니다.
- `runTcStep(page, step)`
  - TC 단계별로 `goto`, `click`, `fill`, `press`, `waitForElement`, `expectText`, `expectVisible`, `expectUrlContains`를 실행합니다.
  - 지원되지 않는 액션이 들어오면 오류를 발생시켜 테스트를 실패 처리합니다.
- `attachErrorCollector(page, options)`
  - 페이지에서 `response`, `requestfailed`, `pageerror`, `console` 이벤트를 수집해 에러 리포트를 만듭니다.
  - `options.getCurrentStepId`를 통해 현재 TC 단계 ID를 함께 기록합니다.
- `writeRunReport(outputDir, report)`
  - 개별 TC 실행 결과를 `outputDir/*.json`으로 저장합니다.
- `writeAggregateReport(rawDir, outputDir)`
  - 여러 개별 보고서를 읽어 `summary.json`과 `summary.md`를 생성합니다.
- `TC_ACTIONS`, `TC_ACTION_EXAMPLES`
  - 지원하는 TC 액션 목록과 예시 객체를 제공합니다.

### 앱에서 쓰는 방법
- `apps/web/playwright.config.cjs`
  - `const { createPlaywrightConfig } = require('@practice/e2e-testing');`
  - 공통 webServer, 보고서, baseURL 설정을 재사용합니다.
- `apps/web/e2e/tc.spec.cjs`
  - `const { loadAllTestCases, runTcStep, attachErrorCollector, writeRunReport } = require('@practice/e2e-testing');`
  - TC 파일 로드, 단계 실행, 에러 수집, 리포트 저장을 공통 코드로 처리합니다.

### 장점
- 앱별 테스트 실행 로직을 중복 작성하지 않아도 됩니다.
- TC 스키마와 실행 방식이 중앙에 모여 유지보수가 쉬워집니다.
- 새로운 앱이 추가되면 동일한 패키지를 재사용하여 E2E 구조를 빠르게 확장할 수 있습니다.

## 5. TC(Test Case)란?
이 프로젝트는 TC를 **JSON 파일**로 작성합니다. JSON 형식으로 테스트를 선언하고, 코드가 아니라 데이터로 테스트 흐름을 정의합니다.

### TC JSON 예시
```json
{
  "id": "web-home-smoke",
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

## 6. 현재 지원하는 TC 액션
현재 프로젝트에서 `packages/e2e-testing/tc-runner.cjs`가 지원하는 동작은 다음과 같습니다.

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

## 7. TC 작성 방법
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

## 8. 실행 및 확인
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

## 9. Playwright과 MCP/Skill 학습 포인트
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

## 10. 초심자를 위한 요약
- E2E 테스트는 실제 사용자 흐름을 브라우저에서 재현하는 테스트입니다.
- 이 프로젝트는 JSON 파일을 통해 테스트 시나리오를 작성하고, Playwright가 이를 실행합니다.
- `pnpm --filter web run e2e`로 테스트를 실행하고, `apps/web/e2e/reports/`에서 결과를 확인합니다.
- `pnpm --filter web run e2e:mcp`로 AI/Playwright 통합 학습도 시도해볼 수 있습니다.
- 처음에는 작은 TC 하나부터 시작하고, 하나씩 동작을 추가하며 결과를 확인하세요.

## 11. 참고
- TC 파일은 `apps/web/e2e/tc/`에 저장합니다.
- 꼭 `playwright.config.cjs`와 `packages/e2e-testing/tc-runner.cjs`에서 지원하는 액션 이름을 확인하세요.
- `vendor/`와 `patches/`는 수정하지 않습니다.

