# Project Configuration (Agent)

이 파일은 이 모노레포에서 작업할 때의 기본 규칙과 맥락을 정의한다.
AI Agent는 작업 시작 시 이 문서를 우선 참고한다.

## 우선 참고 문서
- `docs/README.md`: 프로젝트 문서 인덱스
- `docs/PROJECT_CONVENTIONS.md`: 저장소 전체 통일 코딩/구조/패턴/주석/리뷰 규약 (다인 협업 표준)
- `docs/PROJECT_AUDIT_REPORT.md`: 현재 프로젝트 구조/의존성 정밀 분석 보고서

## 프로젝트 요약
- pnpm 워크스페이스 + Turborepo 기반 모노레포
- 주요 앱: Next.js 앱(`apps/web`), TanStack + Vite 앱(`apps/tanstack`), 디자인 시스템(`apps/design-system`), Webpack 샘플(`apps/webpack`)
- Git Submodule: `vendor/colors-helper-tools`
- 패치: `patch-package`로 `tui-grid@4.21.22` 패치 적용

## 디렉토리 구조
- `apps/`
  - `web/`: Next.js App Router 기반 메인 앱
  - `tanstack/`: Vite + TanStack React Router/Start 기반 앱
  - `design-system/`: Storybook 기반 컴포넌트 라이브러리
  - `webpack/`: Webpack 샘플 앱
  - `scripts/`: 커밋/준비용 노드 스크립트
- `packages/`: 공유 패키지(현재 비어 있을 수 있음)
- `vendor/`: 서브모듈(외부 저장소)
- `patches/`: patch-package 패치 파일

## 기술 스택
- 언어: TypeScript (strict)
- 런타임/패키지 매니저: Node.js, pnpm
- 빌드/캐시: Turborepo
- 프론트엔드:
  - Next.js 15 (App Router) + React 19 RC (`apps/web`)
  - Vite + TanStack Router/Start (`apps/tanstack`)
  - Storybook (`apps/design-system`)
  - Webpack (`apps/webpack`)
- 스타일: vanilla-extract (Next/Storybook), Tailwind (tanstack)
- 테스트: Vitest + Testing Library (앱별)
- E2E 테스트: Playwright (`apps/web/e2e/`), JSON 기반 TC (`apps/web/e2e/tc/`)
- 린트/포맷: ESLint(Flat config), Prettier, Stylelint
- 기타: xstate, valtio, MDX, patch-package

## 패키지/워크스페이스 규칙
- 패키지 매니저는 반드시 pnpm 사용
- 워크스페이스 범위는 `apps/*`, `packages/*`
- 루트 스크립트는 Turborepo를 통해 실행

주요 스크립트(루트):
- `pnpm dev` / `pnpm build` / `pnpm lint` / `pnpm test`
- `pnpm typecheck`
- `pnpm format` / `pnpm format:check`
- `pnpm stylelint` / `pnpm stylelint:fix`
- 앱 단위 실행: `pnpm web:dev`, `pnpm tanstack:dev`, `pnpm ds:dev`, `pnpm web:e2e`

## 앱별 특징/경로
- `apps/web`
  - Next.js App Router (`app/` 디렉토리 사용)
  - TS path alias: `@/*` -> `apps/web/*`
  - Vitest 설정: `vitest.config.ts`, `vitest.setup.ts`
- `apps/tanstack`
  - Vite + TanStack Router/Start
  - TS path alias: `@/*` -> `apps/tanstack/src/*`
- `apps/design-system`
  - Storybook + vanilla-extract
  - 빌드 산출물: `dist/`, 타입 선언 포함

## 코딩/스타일 규칙
- TypeScript strict를 유지하고 `any` 사용 지양
- ESLint 규칙 준수(특히 `simple-import-sort`, `react-compiler`, `prettier`)
- 포맷은 Prettier 기준
- CSS는 Stylelint 규칙 준수
- App Router 컴포넌트는 서버/클라이언트 경계를 명확히

## 테스트 규칙
- 단위/통합 테스트는 Vitest 기반 (`apps/web/__tests__` 또는 `*.test.ts(x)` 패턴 유지)
- E2E 테스트는 Playwright + JSON TC (`apps/web/e2e/tc/`) 사용

## Git/커밋 규칙
- Conventional Commit 사용
- `pnpm commit` 스크립트로 커밋 메시지 생성 가능
- `husky` + `lint-staged` 사용 중

## 서브모듈/패치 주의사항
- `vendor/`는 서브모듈이므로 임의 수정 금지(요청 시에만 수정)
- `patches/`는 `patch-package` 적용 대상이므로 삭제/수정 시 주의

## 금지/주의
- npm/yarn 사용 금지 (pnpm만 사용)
- `vendor/` 내 코드 임의 변경 금지
- `patches/` 삭제 금지
- 기존 테스트 삭제 금지
- 무분별한 의존성 추가 금지(필요 시 근거 제시)

## 행동 지침 (Behavioral Guidelines)

LLM 코딩 품질을 위한 지침. 중요한 작업에서는 신중함을 우선하되, 자명한 작업에서는 판단력을 발휘하세요.

### 1. 코딩 전에 호흡하기
**문제를 묵묵히 풀지 말 것. 가정을 드러낼 것. 필요하면 이의를 제기할 것.**

흔한 문제: 모델이 의도를 잘못 읽고 계속 진행한다. 확인 단계가 없다.

구현 전에:
- 가정을 명시하고, 하나라도 불명확하면 먼저 물어봅니다.
- 여러 방식이 있으면 각각의 장단을 제시합니다. 조용히 선택하지 않습니다.
- 이미 더 간단한 방법이 있으면 말합니다.
- 혼동이 있으면 멈추고, 정확히 무엇이 불명확한지 명시합니다.

### 2. 단순함 우선, 나머지는 나중에
**필요한 것만, 정확히 그것만 구현합니다. 투기적 추상화는 절대 금지.**

흔한 함정: 1000줄 분량의 "확장성 좋은" 구조로 50줄 문제를 푼다. 죽은 코드가 남는다.

체크리스트:
- 요청되지 않은 기능 없음
- "다음에 필요할 수도" 하는 식의 설계 없음
- 일회용 코드에는 추상화 계층 없음
- 불가능한 에러 케이스 처리 없음

감감각:
- 200줄로 쓴 것이 50줄로 가능해 보인다면, 50줄로 다시 쓰세요.
- "시니어가 이걸 보면 뭐라 할까?" 생각이 든다면, 이미 과한 신호입니다.

### 3. 범위 내에서만, 필요한 것만 손대기
**더 이상, 더 이하도 아닌. 이미 작동하는 것을 건드리지 않습니다.**

흔한 부작용: 무관한 코드까지 "정리"한다. 주석을 없앤다. 포맷을 바꾼다. 이미 있는 테스트를 깨뜨린다.

편집 시 규칙:
- 범위 밖 코드는 "개선"하지 않습니다. 포맷도, 주석도, 변수명도.
- 작동하는 코드를 리팩터하지 않습니다. (요청 없이)
- 기존 스타일을 따릅니다. 다르더라도.
- 데드 코드를 발견했으면 언급만 하고 지우지 않습니다.

YOUR 변경의 부산물:
- 당신의 변경 때문에 사용되지 않은 import/변수/함수만 제거합니다.
- 원래부터 있던 데드 코드는 건드리지 않습니다.

**테스트:** 모든 라인이 사용자 요청으로 직접 추적되어야 합니다.

### 4. 목표를 정하고, 루프로 도달하기
**"작동하게 하기"가 아니라 "이것을 증명하기"로 생각합니다. 검증 가능할 때까지 반복합니다.**

모델의 강점: 지치지 않고 계속 시도한다.

변환:
- "검증 추가" → 테스트 먼저 (실패), 그 다음 구현 (통과)
- "버그 수정" → 재현 테스트 (실패), 수정 (통과)
- "리팩터" → 전후 테스트 (둘 다 통과)

다단계 작업은 계획을 명시합니다:
```
1. [구체적 스텝] → 확인: [누가/어떻게 봤는가]
2. [구체적 스텝] → 확인: [누가/어떻게 봤는가]
3. [구체적 스텝] → 확인: [누가/어떻게 봤는가]
```

강한 성공 기준이 독립 루핑을 가능하게 합니다. 약한 기준("작동하는")은 끝없이 명확화를 요청합니다.

**결과:** 불필요한 줄 감소 → 재작성 감소 → 명확화 질문이 실패 이전에 나타남

## 작업 방식 가이드
- 변경 범위를 최소화하고 대상 앱/패키지에만 수정
- 관련 스크립트/설정 파일을 먼저 확인한 후 수정
- 새 파일 추가 시 프로젝트 구조를 유지
- 필요 시 `turbo`/`pnpm` 스크립트로 로컬 검증 권장