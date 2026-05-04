# Superpowers Config Reference

작성일: 2026-04-24

대상 파일: `.claude/ai/superpowers.json`

## 1. 최상위 필드
- `version` (number): 스키마 버전
- `profile` (object): 프로필 메타데이터
- `capabilities` (array): 활성 능력 정의
- `restrictions` (array): 운영 금지/제약 조건
- `observability` (object): 보고/검증 기준

## 2. profile
- `id`: 프로필 식별자 (`codex-superpowers`)
- `description`: 프로필 설명
- `mode`: 운영 모드 (`safe-default`)

## 3. capabilities 항목 스키마
- `id`: capability 식별자
- `enabled`: 사용 여부
- `purpose`: capability 목적
- `commands`: 권장 명령 목록

## 4. capability 추가/수정 규칙
1. 명령은 로컬 개발에 필요한 최소 범위만 포함한다.
2. `curl`, `wget`, `http://`, `https://` 문자열 포함 커맨드는 금지한다.
3. `vendor/**`, `patches/**`를 직접 변경하는 흐름은 넣지 않는다.
4. 변경 후 반드시 아래 검증을 실행한다.
   - `pnpm ai:setup-stack`
   - `pnpm ai:check-stack`
   - `pnpm ai:check-config-sync`

## 5. 동기화 원칙
- `.claude`가 source of truth이다.
- `.codex`는 자동 동기화 결과물이므로 수동 수정하지 않는다.
