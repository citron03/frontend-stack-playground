# TEST_STRATEGY

작성일: 2026-04-04

## 1. 테스트 목표
- 회귀 방지
- 실험 코드라도 최소 동작 보장
- 변경 영향 범위 내 빠른 피드백

## 2. 테스트 레벨
- Unit: 함수/훅/컴포넌트 단위
- Integration: 라우트 단위 상호작용
- E2E: `apps/web`는 Playwright TC 기반 E2E 도입 (`pnpm --filter web run e2e`)

## 3. 앱별 실행 기준
- `apps/web` 변경: 최소 `pnpm --filter web test`
- `apps/web` E2E/라우팅 변경: `pnpm --filter web run e2e`
- `apps/tanstack` 변경: 최소 `pnpm --filter tanstack-temp test`
- `apps/design-system` 변경: `pnpm --filter @citron03/design-system test`
- 범위 불명확: 루트 `pnpm test`

## 4. 파일/네이밍 규칙
- `*.test.ts`, `*.test.tsx`
- 혹은 `__tests__` 디렉토리
- 테스트 이름은 "행동 + 기대" 서술형

## 5. 최소 품질선
- 신규 기능: 정상 1 + 실패/경계 1 이상
- 버그 수정: 재현 테스트 1 이상
- 데이터 요청 코드: 성공/실패 분기 모두 검증

## 6. 금지사항
- 테스트 없이 리그레션 수정 머지
- flaky 테스트를 원인 분석 없이 skip 처리
- 과도한 snapshot 의존

## 7. CI 권장 게이트
- lint
- typecheck
- app-scoped test
- 필요 시 build smoke
