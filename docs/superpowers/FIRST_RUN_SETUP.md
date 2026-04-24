# First Run Setup (Superpowers)

작성일: 2026-04-24

## 1. 목적
레포를 처음 실행하는 개발자/에이전트가 동일한 초기 상태를 빠르게 맞춘다.

## 2. 표준 명령
```bash
pnpm install
git submodule sync --recursive
git submodule update --init --recursive
pnpm ai:setup-stack
pnpm ai:check-stack
pnpm ai:check-config-sync
```

## 3. 자동화 스킬
- 스킬 경로: `.claude/skills/first-run-setup/SKILL.md`
- 커맨드 경로: `.claude/commands/first-run-setup.md`

## 4. 완료 기준
- `.claude/ai/superpowers.json` 생성됨
- `.codex/ai/superpowers.json` 동기화됨
- `ai:check-stack`, `ai:check-config-sync`가 모두 성공

## 5. 주의사항
- `vendor/**` 직접 수정 금지
- `patches/**` 삭제 금지
- 정책 설정 시 원격 다운로드 명령 등록 금지
