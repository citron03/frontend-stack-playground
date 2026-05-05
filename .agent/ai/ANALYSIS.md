# AI Stack Analysis

작성일: managed-by-ai-setup-stack

## 프로젝트 특성 요약
- monorepo: pnpm workspace + turbo
- 앱 축: design-system, scripts, tanstack, web, webpack
- 운영 문서: docs/*에 구조/테스트/보안/의존성 규약 명시

## 보안 기준
- 외부 원격 플러그인 비활성화
- MCP는 로컬/읽기 중심 정책으로 제한
- vendor/, patches/는 쓰기 금지
- 비밀정보는 env 기반만 허용

## 자동화 범위
- .agent/ai/* 정책 파일 자동 생성
- sync-ai-config를 통해 AI 설정 동기화
- ai-setup 스킬/커맨드 제공
- superpowers 프로필(.agent/ai/superpowers.json) 생성
