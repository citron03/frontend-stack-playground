# API_CONTRACTS

작성일: 2026-04-04

## 1. 공통 규약
- 응답은 JSON 기본
- 실패 시 명확한 status code + 오류 메시지
- 입력 검증 실패는 400 계열 반환

## 2. apps/web

### 2.1 GET `/api/submodule-colors`
- 위치: `apps/web/app/api/submodule-colors/route.ts`
- Query:
  - `action`: `pastel | complementary | lighten | darken` (필수)
  - `color`: `#RRGGBB` (action이 `pastel`이 아닐 때 검증)

성공 응답:
```json
{ "color": "#aabbcc" }
```

실패 응답 예:
```json
{ "error": "action is required" }
```
```json
{ "error": "color must be #RRGGBB format" }
```

## 3. apps/tanstack

### 3.1 GET `/demo/api/names`
- 위치: `apps/tanstack/src/routes/demo/api.names.ts`
- 응답:
```json
["Alice", "Bob", "Charlie"]
```

## 4. TanStack Server Functions (HTTP 직접 공개 아님)
- `getPunkSongs` (`src/data/demo.punk-songs.ts`)
- `getTodos` / `addTodo` (`src/routes/demo/start.server-funcs.tsx`)

권장 사항:
- `inputValidator`를 모든 server function에 기본 적용
- 반환 타입 명시 강화
- 에러 모델(코드/메시지) 표준화
