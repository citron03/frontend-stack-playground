# DECISIONS (ADR Log)

작성일: 2026-04-04

## ADR-001: 모노레포 도입
- 상태: Accepted
- 결정: `pnpm workspace + Turborepo` 채택
- 이유: 멀티앱 동시 관리, 캐시 기반 빌드 가속, 의존성 중앙 통제

## ADR-002: 버전 중앙화(catalog)
- 상태: Accepted
- 결정: `pnpm-workspace.yaml`의 `catalog/catelogs`로 공통 버전 관리
- 이유: 버전 드리프트 방지, 업그레이드 추적 용이

## ADR-003: 서브모듈 사용
- 상태: Accepted (with constraints)
- 결정: `vendor/colors-helper-tools`를 Git submodule로 관리
- 이유: 외부 저장소 이력/릴리즈와 분리 유지
- 제약: `vendor/` 직접 수정 금지(명시 요청 시 제외)

## ADR-004: patch-package 사용
- 상태: Accepted
- 결정: `tui-grid@4.21.22` CSS 패치 유지
- 이유: 업스트림 반영 전 단기 안정화
- 운영: 버전 업 시 패치 재검증 필수

## ADR-005: 이중 프레임워크 실험 축 유지
- 상태: Accepted (temporary)
- 결정: Next와 TanStack 앱 병행 운영
- 이유: 기술 검증 목적
- 종료 조건: 목적 달성 후 표준 앱 축 재선정

## ADR-006: 자동화 훅/에이전트 자산 보관
- 상태: Accepted
- 결정: `.claude` 디렉토리에 hooks/skills/commands 보관
- 이유: 협업 생산성 향상, 반복 작업 표준화

## ADR-007: strict TypeScript 유지
- 상태: Accepted
- 결정: strict 유지, `any`는 예외적으로만 허용
- 이유: 장기 유지보수성/리팩터링 안정성 확보

## ADR-008: latest 태그 최소화
- 상태: Proposed
- 대상: `apps/tanstack`의 `nitro: latest`
- 제안: 고정 버전으로 전환
- 이유: 재현 가능한 빌드/디버깅

## ADR-009: 공유 코드 수용 경로 고정
- 상태: Proposed
- 결정 후보: 공유 코드는 `packages/*`에서만 제공
- 이유: `apps/*` 상호 참조 난립 방지

## ADR 운영 규칙
- 새로운 큰 결정은 "배경/대안/선택/영향" 4항목으로 추가
- 기존 결정을 뒤집는 경우 superseded 링크를 남긴다
