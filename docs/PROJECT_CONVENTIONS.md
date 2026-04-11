# 프로젝트 통일 개발 규약 (Single Author Convention)

작성일: 2026-04-04
적용 범위: `practice-next-15` 전체 모노레포 (`apps/*`, 루트 설정, `.claude`, `scripts`, `patches`, `vendor`)

## 0. 목적
이 문서는 여러 명의 개발자/에이전트가 동시에 작업해도 결과물이 "한 사람이 일관되게 작성한 코드"처럼 보이도록 만드는 운영 표준이다.

핵심 원칙:
- 동일한 문제는 항상 동일한 방식으로 해결한다.
- 파일 배치, 네이밍, 주석, 타입, 테스트, 커밋 메시지까지 같은 어조를 유지한다.
- 규칙 충돌 시 "이 문서 > 개별 습관" 우선순위를 따른다.

## 1. 저장소 기준 구조 (정본)

## 1-1. 최상위 디렉토리 역할
- `apps/web`: Next.js 15 App Router 데모/실험 앱
- `apps/tanstack`: Vite + TanStack Start/Router 앱
- `apps/design-system`: Storybook 기반 컴포넌트 패키지
- `apps/webpack`: Webpack 샘플
- `apps/scripts`: 개발 보조 스크립트
- `scripts`: 루트 운영 스크립트(현재 catalog 변환)
- `patches`: `patch-package` 패치 파일
- `vendor`: Git submodule (직접 수정 금지, 명시 요청 시만)
- `.claude`: 에이전트 자동화 설정 자산

## 1-2. 구조 확장 규칙
- 새 앱은 반드시 `apps/<name>` 하위에 생성한다.
- 새 공유 패키지는 `packages/<name>` 하위에 생성한다.
- 루트에는 실행 코드 대신 설정/문서/오케스트레이션 파일만 둔다.
- 임시 실험 디렉토리는 커밋 금지. 필요 시 `apps/<name>`로 정식 승격 후 추적한다.

## 1-3. 생성물/캐시 취급
- 커밋 금지: `node_modules`, `.next`, `dist`, `build`, `coverage`, `.turbo`
- `routeTree.gen.ts` 같은 자동 생성 파일은 "수정 금지"를 주석/문서로 명시하고 규칙적으로 재생성한다.

## 2. 공통 코딩 스타일

## 2-1. 언어/포맷 기준
- 언어: TypeScript 우선 (`.ts`, `.tsx`)
- 포맷: Prettier 단일 기준 (세미콜론, single quote, trailing comma)
- 린트: ESLint Flat config + stylelint
- import 정렬: `simple-import-sort` 규칙 준수

## 2-2. 타입 규칙
- `any`는 원칙적으로 금지, 불가피하면 이유를 주석으로 남긴다.
- 공용 타입은 파일 상단 또는 `types` 성격 파일에 명시한다.
- 비동기 함수는 반환 타입 추론이 불명확하면 명시한다.
- UI 컴포넌트 props는 `interface`를 기본으로 한다.

## 2-3. 함수/컴포넌트 규칙
- 컴포넌트는 가능한 한 "한 파일, 한 책임"을 유지한다.
- 이벤트 핸들러 이름은 `handleXxx` 형식을 따른다.
- 불리언 상태는 `is/has/can/should` 접두어를 사용한다.
- 하드코딩 문자열/숫자는 의미 있는 상수로 분리한다.

## 2-4. import 경로 규칙
- 같은 기능 묶음 내부: 상대 경로 우선
- 앱 루트 전역 참조: 각 앱의 alias(`@/*`) 사용 가능
- 외부 패키지 import와 내부 모듈 import는 시각적으로 분리한다.

## 3. 디렉토리/파일 네이밍 규칙

## 3-1. 기본 네이밍
- 파일/폴더: `kebab-case` 기본
- React 컴포넌트 파일: 컴포넌트명 기준 `PascalCase` 허용 (`ThemeProvider.tsx`)
- 스타일 파일: `<name>.css.ts` 또는 `<name>.css`
- 테스트 파일: `*.test.ts(x)` 또는 `__tests__/*`

## 3-2. Next.js (`apps/web`) 규칙
- 라우트 단위 폴더에 `page.tsx`를 둔다.
- 같은 라우트 전용 컴포넌트는 해당 라우트 하위에 둔다.
- 다수 라우트에서 재사용되는 컴포넌트만 `app/components`에 둔다.
- 서버 라우트는 `app/api/**/route.ts` 규칙을 따른다.

## 3-3. TanStack (`apps/tanstack`) 규칙
- 라우트 파일은 `src/routes`에서 file-based routing 관례를 따른다.
- `routeTree.gen.ts`는 수동 수정 금지.
- 서버 함수는 route 파일 안 또는 `src/data` 등 명확한 도메인 경로에 둔다.

## 3-4. Design System 규칙
- 컴포넌트는 `src/components/<Component>/index.tsx` 구조를 기본으로 한다.
- 스타일은 같은 디렉토리 `index.css.ts`에 둔다.
- 스토리는 `src/stories` 또는 컴포넌트 근접 위치 중 한 정책을 택해 일관 유지한다.
- 외부 공개 API는 `src/index.ts` 배럴에서만 export 한다.

## 4. 디자인 패턴 규약

## 4-1. 상태 관리 선택 기준
- 단순 지역 상태: `useState`
- 파생 상태/복잡 전이: `xstate`
- 반응형 전역 실험 상태: `valtio`
- 서로 다른 패턴을 섞는 경우, 파일 상단에 "선택 이유"를 한 줄로 남긴다.

## 4-2. 비동기/데이터 패턴
- 네트워크 호출은 반드시 에러 분기(`!res.ok`)를 처리한다.
- API 응답 타입은 최소 인터페이스를 선언한다.
- UI 이벤트 핸들러 내부 비동기는 `loading/error` 상태를 함께 관리한다.

## 4-3. 컴포넌트 경계
- View와 데이터 로직이 커지면 분리:
  - View: JSX 렌더링 중심
  - Logic: 훅/스토어/유틸
- 특정 라우트 전용 로직은 전역 컴포넌트로 올리지 않는다.

## 4-4. 스타일링 전략
- `apps/web`: global CSS + vanilla-extract 혼용 가능, 신규 코드는 가능한 vanilla-extract 우선
- `apps/tanstack`: Tailwind 유틸리티 중심
- `apps/design-system`: vanilla-extract 기준
- 한 파일에서 서로 다른 스타일링 패러다임을 과도하게 혼합하지 않는다.

## 5. 주석 작성 규칙 (중요)

## 5-1. 주석의 목적
주석은 "코드가 무엇을 하는지"가 아니라 "왜 이 방식이 필요한지"를 설명한다.

## 5-2. 작성 원칙
- 필수 주석만 남긴다. (노이즈 금지)
- TODO 주석은 반드시 다음 형식 사용:
  - `TODO(<owner>, YYYY-MM-DD): 내용`
- 임시 우회(hack)는 이유 + 제거 조건을 함께 남긴다.
- 블로그 링크/외부 참고는 선택 사항이며, 핵심 맥락을 코드에 자체 설명한다.

## 5-3. 금지 패턴
- 코드와 동일한 문장을 반복하는 주석
- 기한/담당자 없는 TODO
- 한국어/영어 혼합으로 의미가 모호한 주석

## 6. 테스트 규칙

## 6-1. 위치/범위
- 테스트는 수정한 앱 범위에서 먼저 실행한다.
- 전역 테스트는 변경 영향 범위가 넓을 때만 수행한다.

## 6-2. 파일 규약
- 단위 테스트: `*.test.ts(x)`
- 렌더 테스트: Testing Library + Vitest 기준
- 테스트명은 "행동 + 기대 결과"를 서술형으로 작성

## 6-3. 최소 검증 기준
- 새 기능: 정상 흐름 1개 + 실패/경계 1개 이상
- 버그 수정: 재현 테스트 1개 + 회귀 방지 1개(가능하면)

## 7. Git/커밋/리뷰 규칙

## 7-1. 브랜치/커밋
- 커밋 메시지는 Conventional Commit 사용
- 하나의 커밋은 하나의 의도만 담는다.
- 자동 생성물/포맷 변경은 기능 변경 커밋과 분리한다.

## 7-2. PR/리뷰
- PR 설명에는 아래를 반드시 포함:
  - 배경
  - 변경 범위
  - 테스트 결과
  - 리스크/롤백 포인트
- 리뷰 코멘트 반영 시 "수정 이유"를 짧게 남긴다.

## 8. 금지/주의 규칙
- 패키지 매니저는 `pnpm`만 사용
- `vendor/` 직접 수정 금지 (요청 시에만)
- `patches/` 삭제 금지
- 자동 생성 파일 수동 수정 금지 (`routeTree.gen.ts` 등)
- 무분별한 신규 의존성 추가 금지 (필요 시 근거와 대안 기록)

## 9. 에이전트/다인 협업 전용 규칙

## 9-1. 작업 시작 체크리스트
- 변경 대상 앱을 명시했는가?
- 기존 규칙 문서(`CLAUDE.md`, 본 문서)를 확인했는가?
- 수정 범위를 최소화했는가?

## 9-2. 작업 중 체크리스트
- 디렉토리 규칙을 지켰는가?
- 타입/주석/테스트 규칙을 지켰는가?
- 관련 없는 파일이 섞이지 않았는가?

## 9-3. 작업 종료 체크리스트
- lint/typecheck/test 최소 검증 수행
- 변경 파일 self-review
- 문서/규칙 위반 여부 최종 확인

## 10. 앱별 상세 컨벤션

## 10-1. `apps/web`
- `app/<route>/page.tsx`는 페이지 조립 역할에 집중
- 복잡 로직은 `store/`, `components/`로 분리
- 브라우저 전용 API 사용 시 `'use client'` + 런타임 가드
- Next API route는 입력 검증 로직을 route 내부에서 명시

## 10-2. `apps/tanstack`
- 라우트 파일 상단에 `createFileRoute` 선언을 고정 위치로 둔다.
- 서버 함수(`createServerFn`)는 입력 검증을 반드시 둔다.
- Web Worker 메시지 타입은 요청/응답 union 타입으로 선언

## 10-3. `apps/design-system`
- 컴포넌트 public API는 최소화
- 접근성 props/aria 고려를 우선
- Storybook 스토리에 기본 상태 + 상호작용 상태를 포함

## 10-4. `apps/webpack`
- 학습용 샘플 성격 유지
- 실서비스 로직 이관 금지

## 10-5. `apps/scripts` / `scripts`
- 실행 환경(OS 의존 여부)을 파일 상단 주석으로 명시
- 쉘 의존 명령은 실패 시 메시지를 명확히 출력

## 11. 의존성 운영 정책
- 버전 표기는 가능한 `catalog:*`를 사용해 중앙 관리
- `latest` 사용은 원칙적으로 금지, 예외 시 사유 기록
- 중복 버전 축(예: React RC/정식 공존) 발생 시 영향 범위를 문서화
- lockfile 변경은 의도된 변경일 때만 포함

## 12. 문서 운영 정책
- 구조/규약 변경 시 이 문서를 먼저 갱신한다.
- 프로젝트 상태 분석은 `docs/PROJECT_AUDIT_REPORT.md`를 기준으로 갱신한다.
- 자동화 작업 가이드는 `CLAUDE.md`와 본 문서를 동시에 참고한다.

## 13. 즉시 적용 항목 (현재 레포 기준)
- `apps/web` 내 `any` 사용 지점 점진 제거
- `apps/tanstack`의 `nitro` beta 고정 버전 안정화 전략(정식/고정 정책) 수립
- `apps/event-bus`는 현재 `package.json` 없는 미완성 디렉토리이므로 앱 등록 기준(`apps/<name>/package.json`)에 맞춰 정리
- 테스트 커버리지 최소선(핵심 라우트 기준) 수립

---
이 문서는 "코드 통일성"을 위한 기준 문서다. 예외가 필요하면 PR 설명에 예외 사유를 명시하고, 합의 후 문서를 업데이트한다.
