# Superpowers Runbook

작성일: 2026-04-24

## 1. 변경 절차
1. `.claude/ai/superpowers.json` 또는 `scripts/setup-ai-stack.mjs` 수정
2. `pnpm ai:setup-stack` 실행
3. `pnpm ai:check-stack` 실행
4. `pnpm ai:check-config-sync` 실행
5. `docs/superpowers/*` 문서 업데이트

## 2. 장애 대응
### 증상 A: `ai:check-stack` 실패
- 원인 후보:
  - 정책 커맨드에 금지 토큰 포함
  - 생성 파일 누락
- 조치:
  - 최근 수정된 `scripts/setup-ai-stack.mjs` 검토
  - 금지 토큰 제거 후 재실행

### 증상 B: `ai:check-config-sync` 실패
- 원인 후보:
  - `.claude`와 `.codex` 간 불일치
- 조치:
  - `pnpm ai:sync-config` 실행
  - 재검증: `pnpm ai:check-config-sync`

## 3. 롤백
- 문제 있는 변경 커밋을 되돌리고 아래 순서 재실행:
  - `pnpm ai:setup-stack`
  - `pnpm ai:check-stack`
  - `pnpm ai:check-config-sync`

## 4. 리뷰 체크리스트
- superpowers capability 목적이 명확한가?
- 제약 조건(`restrictions`)이 최신 규칙을 반영하는가?
- 문서(`docs/superpowers/*`)가 설정과 일치하는가?
