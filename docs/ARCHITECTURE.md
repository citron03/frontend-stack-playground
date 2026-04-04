# ARCHITECTURE

작성일: 2026-04-04

## 1. 시스템 개요
이 저장소는 `pnpm workspace + Turborepo` 기반 모노레포이며, 단일 제품보다 "실험/학습/검증" 성격이 강한 멀티앱 구조다.

핵심 앱:
- `apps/web`: Next.js 15 App Router 데모 앱
- `apps/tanstack`: TanStack Start + Vite 데모 앱
- `apps/design-system`: Storybook 기반 UI 패키지
- `apps/webpack`: Webpack 학습 샘플
- `apps/scripts`: 개발 자동화 스크립트

## 2. 책임 경계

### 2.1 apps/web
- 역할: React/Next 최신 기능 검증 허브
- 책임: 라우트 데모, Next API route, PWA 실험, 상태관리 데모
- 비책임: 다른 앱 공통 라이브러리 제공(공유화 필요 시 `packages/`로 이동)

### 2.2 apps/tanstack
- 역할: TanStack Router/Start/SSR 모드 검증
- 책임: file-based routing, server function, SSR 모드 비교, worker 데모
- 비책임: Next 생태계 의존 기능

### 2.3 apps/design-system
- 역할: 재사용 UI 컴포넌트 배포 기반
- 책임: 컴포넌트 API, 스타일 시스템, Storybook 문서
- 비책임: 앱 전용 비즈니스 로직

### 2.4 apps/webpack
- 역할: 번들러 학습/실험 샘플
- 책임: webpack/babel 구성 실험
- 비책임: 제품 코드 수용

### 2.5 apps/scripts / scripts
- 역할: DX 자동화
- 책임: commit 보조, catalog 변환 등 운영 스크립트
- 비책임: 런타임 비즈니스 로직

## 3. 의존 관계
- `web` -> `@citron03/design-system` (workspace link)
- `web` -> `vendor/colors-helper-tools` (submodule 소스 참조)
- `tanstack`, `webpack`은 독립 실행 축

권장 원칙:
- 앱 간 직접 참조 금지 (`apps/*` -> `apps/*`)
- 공유 코드가 필요하면 `packages/*` 신설 후 이동

## 4. 빌드/실행 아키텍처
- 오케스트레이션: `turbo.json`
- 패키지 해석: `pnpm-workspace.yaml`
- 공통 타입/린트: 루트 `tsconfig.base.json`, `eslint.config.js`
- 패치 적용: `patch-package` + `patches/tui-grid@4.21.22.patch`

## 5. 구조 리스크
- React 버전 축 이원화(`web`: 19 RC, `tanstack`: 19.2)
- `apps/tanstack`의 `nitro: latest` 재현성 리스크
- 서브모듈 직접 import는 경계 약화 가능성 있음

## 6. 타깃 상태
- 공통 유틸/컴포넌트는 `packages/`로 통합
- 앱별 역할 문서화 유지
- 실험 코드와 안정 코드의 경계 명확화
