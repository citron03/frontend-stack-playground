# Superpowers Overview

작성일: 2026-04-24

## 1. 정의
`superpowers`는 Codex가 이 레포에서 안전하고 일관되게 작업하기 위한 능력 프로필이다.
- 위치: `.claude/ai/superpowers.json`
- 동기화 대상: `.codex/ai/superpowers.json`

## 2. 목표
- 레포 구조 탐색/분석을 빠르게 수행한다.
- 품질 검증(lint/typecheck/test)을 작업 범위 중심으로 수행한다.
- Claude/Codex 설정 동기화를 자동화한다.
- 최초 실행 시 공통 셋업 절차를 표준화한다.

## 3. 핵심 구성
- `repo-orientation`: 안전한 읽기 중심 탐색 명령 세트
- `quality-guard`: 품질 게이트 명령 세트
- `ai-config-parity`: 설정 동기화/검증 명령 세트
- `first-run-bootstrap`: 최초 실행 준비 명령 세트

## 4. 안전 기본값
- `vendor/**` 직접 수정 금지
- `patches/**` 삭제/무단 수정 금지
- 정책 커맨드에 원격 다운로드 명령 등록 금지

## 5. 적용 범위
- 이 문서는 도구 자체 권한을 강제하지 않는다.
- 팀 운영상 표준 실행 경로와 체크리스트를 제공한다.
