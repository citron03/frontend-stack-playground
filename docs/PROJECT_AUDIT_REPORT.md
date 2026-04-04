# practice-next-15 프로젝트 정밀 분석 보고서

작성일: 2026-04-04 (Asia/Seoul)

## 1) 분석 범위와 방법
- 분석 기준 파일셋: `git ls-files` 기준 추적 파일 전체
- 총 추적 파일 수: 149개
- 텍스트 파일(실제 내용 읽기): 139개
- 바이너리/비텍스트/포인터: 10개
- 바이너리/포인터 목록:
  - `apps/tanstack/public/favicon.ico`
  - `apps/tanstack/public/logo192.png`
  - `apps/tanstack/public/logo512.png`
  - `apps/tanstack/public/tanstack-circle-logo.png`
  - `apps/web/app/favicon.ico`
  - `apps/web/app/fonts/GeistMonoVF.woff`
  - `apps/web/app/fonts/GeistVF.woff`
  - `apps/web/image/icon-192x192.png`
  - `apps/web/image/icon-512x512.png`
  - `vendor/colors-helper-tools` (Git Submodule gitlink 포인터)
- 추가 분석 대상:
  - 워크스페이스/빌드/린트/테스트 설정 파일
  - 모든 `package.json`(루트 + apps + vendor submodule 내부)
  - `pnpm-lock.yaml`(lockfile 구조/규모/importer별 의존성)
  - 코드 import 스캔(정적 import/dynamic import/require)

## 2) 모노레포 구조 요약
이 저장소는 **pnpm workspace + Turborepo** 기반 모노레포이며, 실제 실행 단위는 아래 5개입니다.

- `apps/web`: Next.js 15 App Router 기반 데모 앱
- `apps/tanstack`: Vite + TanStack Start/Router 기반 앱
- `apps/design-system`: Storybook + vanilla-extract 컴포넌트 패키지
- `apps/webpack`: Webpack + React 샘플 앱
- `apps/scripts`: 커밋/준비 자동화 스크립트 패키지

보조 레이어:
- 루트 설정: ESLint Flat config, Prettier, Stylelint, Husky, lint-staged, Turbo
- `patches/`: `tui-grid@4.21.22` 패치 적용
- `vendor/colors-helper-tools`: Git Submodule 연결(외부 저장소)
- `.claude/`: 프로젝트 자동화 훅/명령/스킬 정의

## 3) 디렉토리/역할 상세

### 3-1. 루트
- `package.json`: 터보 태스크/앱별 shortcut/서브모듈 운영/patch-package 적용
- `pnpm-workspace.yaml`: `apps/*`, `packages/*` 워크스페이스 + catalog/catelogs 버전 중앙관리
- `turbo.json`: `build/lint/dev/test` 파이프라인 구성
- `eslint.config.js`: TS/React Compiler/Prettier/simple-import-sort 규칙
- `lint-staged.config.js`, `.husky/*`: pre-commit/commit-msg 게이트
- `scripts/convert-to-catalog.mjs`: package.json 버전 참조를 `catalog:*`로 정규화하는 유틸

### 3-2. `apps/web`
- 성격: Next.js 15 데모 허브(다수 실험 페이지)
- 핵심 기술: React 19 RC, Next App Router, XState, Valtio, MDX, vanilla-extract, tui-grid
- 주요 구현 묶음:
  - 라우트 데모: 마우스 이벤트, 컨텍스트 메뉴, 가상 리스트, 모달 병렬 라우트, Activity API 패턴, IndexedDB
  - 상태관리 데모: `xstate`, `@xstate/react`, `valtio`
  - 스타일/빌드 데모: `@vanilla-extract/css`, `@next/mdx`
  - 외부 연동: `vendor/colors-helper-tools` 함수 직접 호출 API(`app/api/submodule-colors/route.ts`)
  - PWA 관련: manifest 응답, 서비스워커 등록 컴포넌트, install/push 테스트 UI

### 3-3. `apps/tanstack`
- 성격: TanStack Start 기능 데모 앱
- 핵심 기술: TanStack Router/Start, Vite, Nitro, Tailwind 4, Web Worker
- 주요 구현 묶음:
  - 파일기반 라우팅 + 생성 파일(`routeTree.gen.ts`)
  - SSR 모드 비교 데모(`ssr: false` / `data-only` / 기본 full SSR)
  - server function 기반 todo 예제(파일 기반 저장)
  - API route 데모(`/demo/api/names`)
  - Worker + 타입 안전 메시지 프로토콜 예제

### 3-4. `apps/design-system`
- 성격: Storybook 기반 컴포넌트 패키지
- 현재 실체 컴포넌트: `ColorPicker` 1종
- 구현 포인트:
  - `react-color` + `@floating-ui/react` + `vanilla-extract`
  - 스토리북 구성(`@storybook/react-vite`, essentials, interactions)

### 3-5. `apps/webpack`
- 성격: 독립 Webpack 학습/실험 샘플
- 핵심: `babel-loader`, `react-refresh-webpack-plugin`, HMR/HTTPS 옵션

### 3-6. `apps/scripts`
- 성격: DX 자동화
- `commit.mjs`: Conventional commit 메시지 인터랙티브 생성
- `ready-script.mjs`: Windows/Chocolatey 중심 초기 셋업 보조

### 3-7. `vendor/colors-helper-tools` (Submodule)
- 루트에서는 gitlink로만 추적되며, 로컬에 서브모듈 실제 파일이 존재
- web 앱이 submodule 내부 소스를 직접 import해서 API 라우트에서 사용
- 서브모듈 내부도 별도 모노레포 구조(`packages/colors-helper-tools`, `packages/docs`)

## 4) 외부 패키지 분석 (전체)

## 4-1. 락파일/설치 규모
- lockfile: `pnpm-lock.yaml` (lockfileVersion 9.0)
- importers: 6개 (`.`, `apps/design-system`, `apps/scripts`, `apps/tanstack`, `apps/web`, `apps/webpack`)
- 해석된 패키지 엔트리 수: 1,788개

importer별 직접 의존성 개수:
- `.`: deps 0 / devDeps 64
- `apps/design-system`: deps 5 / devDeps 11
- `apps/scripts`: deps 3 / devDeps 0
- `apps/tanstack`: deps 13 / devDeps 15
- `apps/web`: deps 14 / devDeps 24
- `apps/webpack`: deps 1 / devDeps 6

## 4-2. 선언된 외부 패키지 총량
- `package.json` 전체(루트+apps+vendor) 기준 선언된 고유 패키지: **114개**
- 코드 import 스캔으로 직접 사용 확인된 고유 패키지: **47개**

주의: 선언은 빌드/테스트/CLI/타입 전용 패키지까지 포함하므로, 코드 import 수와 1:1 일치하지 않는 것이 정상입니다.

## 4-3. 앱별 핵심 패키지와 실제 사용 맥락

### `apps/web`
- 프레임워크: `next`, `react`, `react-dom`
- 상태관리: `xstate`, `@xstate/react`, `valtio`
- 스타일/문서: `@vanilla-extract/css`, `@vanilla-extract/recipes`, `@next/mdx`, `@mdx-js/*`
- UI/기타: `@loadable/component`, `tui-grid`
- 내부 의존: `@citron03/design-system` (workspace link)
- 실제 코드 사용 확인 예시:
  - `next/link`, `next/dynamic`, `next/server`, `next/font/local`
  - `@xstate/react`, `xstate`, `valtio`, `@loadable/component`, `tui-grid`

### `apps/tanstack`
- 핵심: `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/react-devtools`
- 빌드/런타임: `vite`, `nitro`, `@tailwindcss/vite`, `tailwindcss`, `vite-tsconfig-paths`
- UI: `lucide-react`
- 개발 보조: `@locator/runtime`, `@locator/babel-jsx`, `@vitejs/plugin-basic-ssl`
- 실제 코드 사용 확인 예시:
  - router 생성/route 파일/SSR 모드/server function/vite plugin 조합 전부 사용 중

### `apps/design-system`
- 컴포넌트 런타임: `react-color`, `@floating-ui/react`
- 스타일: `@vanilla-extract/css`
- 문서화: Storybook 패키지군
- 피어디펜던시: `react`, `react-dom`

### `apps/webpack`
- `react`, `react-dom` + `webpack`, `webpack-cli`, `webpack-dev-server`, `babel-loader`, `@pmmmwh/react-refresh-webpack-plugin`
- 설정 파일에서 plugin/loader 직접 사용

### 루트 도구 체인
- 코드 품질: `eslint*`, `@typescript-eslint/*`, `prettier`, `stylelint*`
- 테스트: `vitest`, `@testing-library/*`, `jsdom`
- 워크플로: `husky`, `lint-staged`, `@commitlint/*`, `patch-package`

## 4-4. 선언 vs 실제 import 대조 결과

직접 import 스캔 기준으로 "선언은 되어 있으나 직접 import가 없는" 패키지군(대표):
- 타입/도구 전용: `typescript`, `@types/*`, `prettier`, `stylelint*`, `eslint-config-*`, `commitlint`, `husky`, `lint-staged`
- 런타임 간접 사용: `@mdx-js/loader`, `@mdx-js/react`, `@tanstack/router-plugin`, `@tanstack/react-router-ssr-query`, `babel-plugin-react-compiler`
- 테스트 전용(현재 테스트 파일이 적음): `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`
- vendor 내부 빌드 전용: rollup/babel/jest 계열

"import 되었으나 선언 누락"으로 탐지된 항목:
- `fs`, `path`
- 판단: Node.js 내장 모듈로 정상

## 4-5. 버전/운영 리스크 체크 포인트
- React 버전 축이 두 갈래로 공존
  - web/root는 React 19 RC 축
  - tanstack은 React 19.2.0 축
- `apps/tanstack`의 `nitro: latest`는 재현성 리스크(잠재적 빌드 변화)
- `pnpm list` 결과에서 `apps/web`에 `unsavedDependencies`로 `@citron03/event-bus` 링크 흔적이 보임
  - 현재 tracked 파일셋에는 `apps/event-bus` 패키지 정의가 없음
  - 로컬 설치 상태와 선언 상태 불일치 가능성 점검 필요
- `apps/web/app/components/*` 일부에서 `any` 사용 존재(타입 엄격도 저하)

## 5) 기능/코드 구조 관점 핵심 정리
- 이 저장소는 “단일 프로덕션 앱”보다 “프론트엔드 실험실/학습형 모노레포” 성격이 강함
- `apps/web`와 `apps/tanstack`이 서로 다른 최신 생태계를 병렬로 검증
- `design-system`은 패키지화 구조를 갖췄지만 현재 컴포넌트 표면적은 작음(1개)
- 서브모듈 + patch-package를 동시에 사용해 외부 코드 통제 포인트를 명시적으로 관리

## 6) 결론
- 요청한 범위(프로젝트 추적 파일 전체 + 외부 패키지 전체) 기준으로 구조/의존성 분석 완료
- 프로젝트는 모노레포 운영 구조가 명확하고, 데모성 기능이 풍부하며, 도구 체인이 강하게 구성되어 있음
- 의존성 측면에서 즉시 장애성 문제는 없지만 아래 3가지는 추후 정리 가치가 큼:
  - React 버전 축 정렬 전략 수립
  - `nitro: latest` 고정 버전화
  - `unsavedDependencies` 상태 정리

---

## 부록 A) `package.json` 발견 경로
- `./package.json`
- `./apps/web/package.json`
- `./apps/tanstack/package.json`
- `./apps/design-system/package.json`
- `./apps/webpack/package.json`
- `./apps/scripts/package.json`
- `./vendor/colors-helper-tools/package.json`
- `./vendor/colors-helper-tools/packages/colors-helper-tools/package.json`
- `./vendor/colors-helper-tools/packages/docs/package.json`
- `./vendor/colors-helper-tools/test-project/package.json`

## 부록 B) import 스캔으로 확인된 외부 모듈(정규화)
- `@eslint/js`
- `@floating-ui/react`
- `@loadable/component`
- `@locator/runtime`
- `@next/mdx`
- `@pmmmwh/react-refresh-webpack-plugin`
- `@storybook/react`
- `@storybook/react-vite`
- `@tailwindcss/vite`
- `@tanstack/devtools-vite`
- `@tanstack/react-devtools`
- `@tanstack/react-router`
- `@tanstack/react-router-devtools`
- `@tanstack/react-start`
- `@testing-library/dom`
- `@testing-library/react`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `@vanilla-extract/css`
- `@vanilla-extract/next-plugin`
- `@vanilla-extract/recipes`
- `@vanilla-extract/vite-plugin`
- `@vitejs/plugin-basic-ssl`
- `@vitejs/plugin-react`
- `@xstate/react`
- `eslint-plugin-import`
- `eslint-plugin-prettier`
- `eslint-plugin-react-compiler`
- `eslint-plugin-simple-import-sort`
- `globals`
- `inquirer`
- `js-yaml`
- `lucide-react`
- `next`
- `nitro`
- `react`
- `react-color`
- `react-dom`
- `tui-grid`
- `valtio`
- `vite`
- `vite-tsconfig-paths`
- `vitest`
- `xstate`
- `zx`
- `fs` (Node built-in)
- `path` (Node built-in)
