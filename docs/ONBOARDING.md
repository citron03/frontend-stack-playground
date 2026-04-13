# ONBOARDING

작성일: 2026-04-04

## 1. 빠른 시작
1. Node 버전 확인 (`.nvmrc` 참고)
2. 의존성 설치: `pnpm install`
3. 서브모듈 초기화:
   - `git submodule init`
   - `git submodule update`
4. 실행:
   - web: `pnpm web:dev`
   - tanstack: `pnpm tanstack:dev`
   - design-system: `pnpm ds:dev`

## 2. 필수 문서 읽기 순서
1. `README.md`
2. `docs/PROJECT_CONVENTIONS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DEPENDENCY_POLICY.md`
5. `docs/TEST_STRATEGY.md`

## 3. 작업 시작 체크리스트
- 어떤 앱을 수정할지 명확한가?
- 디렉토리/네이밍 규칙 확인했는가?
- 관련 테스트 전략 확인했는가?

## 4. 첫 기여 권장 흐름
1. 작은 범위 이슈 선택
2. app-scoped 브랜치 작업
3. lint/typecheck/test 수행
4. PR 템플릿에 배경/검증/리스크 작성

## 5. 자주 하는 실수
- `vendor/` 직접 수정
- 자동 생성 파일 수동 수정
- 실험 코드와 운영 코드를 섞어 커밋
- lockfile 변경 이유 미기록
