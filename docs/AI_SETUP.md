# AI_SETUP

작성일: 2026-04-11

## 1. 목적
- `.claude` 설정을 기준으로 Codex 설정을 동일하게 유지한다.

## 2. 동기화 기준
- Source of Truth: `.claude/**`
- 동기화 대상:
  - `.codex/**`
  - `CLAUDE.md` -> `CODEX.md`

## 3. 명령어
- 동기화 실행: `pnpm ai:sync-config`
- 동기화 검증: `pnpm ai:check-config-sync`
- AI 스택 자동 생성: `pnpm ai:setup-stack`
- AI 스택 검증: `pnpm ai:check-stack`
- 최초 실행 셋업: `.claude/skills/first-run-setup/SKILL.md` 또는 `.claude/commands/first-run-setup.md`

## 4. 운영 규칙
- `.codex`, `CODEX.md`는 수동 편집하지 않는다.
- 변경이 필요하면 `.claude` 또는 `CLAUDE.md`를 수정하고 동기화를 다시 실행한다.
- MCP/플러그인/멀티에이전트 정책은 `.claude/ai/*`를 기준으로 관리한다.
- Codex superpowers 프로필은 `.claude/ai/superpowers.json`을 기준으로 관리한다.
- 앱 문서는 `apps/docs`가 아니라 각 앱의 `apps/<name>/README.md`를 기준으로 관리한다.
