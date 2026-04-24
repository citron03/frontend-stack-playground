# Superpowers Docs

작성일: 2026-04-24

## 문서 목적
- 이 디렉토리는 Codex 전용 `superpowers` 운영 문서 모음이다.
- 설정 파일(`.claude/ai/superpowers.json`)의 의미와 운영 절차를 한 곳에서 관리한다.

## 문서 목록
- [OVERVIEW.md](./OVERVIEW.md): superpowers 개념/범위/핵심 원칙
- [CONFIG_REFERENCE.md](./CONFIG_REFERENCE.md): JSON 필드 정의와 변경 규칙
- [RUNBOOK.md](./RUNBOOK.md): 설정 변경/검증/롤백 운영 절차
- [FIRST_RUN_SETUP.md](./FIRST_RUN_SETUP.md): 레포 최초 실행 시 셋업 가이드

## 원칙
- Source of Truth는 `.claude/**` 이다.
- Codex 반영은 `pnpm ai:sync-config` 또는 `pnpm ai:setup-stack`으로 수행한다.
- 문서와 설정은 같은 PR에서 함께 업데이트한다.
