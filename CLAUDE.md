# Project Configuration (Claude Code)

이 파일은 이 모노레포에서 작업할 때의 기본 규칙과 맥락을 정의한다.
Claude는 작업 시작 시 이 문서를 우선 참고한다.

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
- 앱 단위 실행: `pnpm web:dev`, `pnpm tanstack:dev`, `pnpm ds:dev`

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
- 테스트는 Vitest 기반
- `apps/web/__tests__` 또는 `*.test.ts(x)` 패턴 유지

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

## 작업 방식 가이드
- 변경 범위를 최소화하고 대상 앱/패키지에만 수정
- 관련 스크립트/설정 파일을 먼저 확인한 후 수정
- 새 파일 추가 시 프로젝트 구조를 유지
- 필요 시 `turbo`/`pnpm` 스크립트로 로컬 검증 권장
