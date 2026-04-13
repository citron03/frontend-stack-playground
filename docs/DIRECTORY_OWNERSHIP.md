# DIRECTORY_OWNERSHIP

작성일: 2026-04-04

## 1. 목적
디렉토리별 책임 범위를 명확히 하여 충돌을 줄이고 리뷰 품질을 높인다.

## 2. 소유권 매핑
- `apps/web/**`
  - 책임: Next 앱 기능/라우트/API
  - 필수 리뷰: web 담당 1인 이상

- `apps/tanstack/**`
  - 책임: TanStack 앱/SSR/worker
  - 필수 리뷰: tanstack 담당 1인 이상

- `apps/design-system/**`
  - 책임: 컴포넌트 API/스토리/스타일 토큰
  - 필수 리뷰: design-system 담당 1인 이상

- `apps/webpack/**`
  - 책임: webpack 샘플 유지
  - 필수 리뷰: 빌드 도구 담당 1인 이상

- `apps/scripts/**`, `scripts/**`
  - 책임: 개발 자동화 스크립트
  - 필수 리뷰: DX/DevInfra 담당 1인 이상

- `patches/**`
  - 책임: 서드파티 패치
  - 필수 리뷰: 승인자 1인 + 영향 앱 담당 1인

- `vendor/**`
  - 책임: submodule 포인터 관리
  - 원칙: 직접 수정 금지
  - 예외: 사전 합의된 작업만

- 루트 설정 파일(`package.json`, `pnpm-workspace.yaml`, `eslint.config.js`, `turbo.json` 등)
  - 책임: 저장소 운영 정책
  - 필수 리뷰: 최소 2인

## 3. 변경 라벨링 규칙 (권장)
- `area:web`
- `area:tanstack`
- `area:design-system`
- `area:build`
- `area:deps`
- `area:docs`

## 4. 충돌 방지 규칙
- 다중 앱 변경 시 PR을 분리하거나 커밋 단위를 분리
- 설정 변경 PR은 기능 변경과 섞지 않기
- 소유권 경계가 모호하면 `ARCHITECTURE.md` 기준으로 선결정
