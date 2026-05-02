# Next.js, pnpm, Turborepo를 사용한 모노레포

이 프로젝트는 pnpm 워크스페이스와 Turborepo를 사용하여 모노레포로 재구성되었습니다.

## 협업 표준 문서

- `docs/README.md`: 프로젝트 문서 인덱스
- `docs/PROJECT_CONVENTIONS.md`: 코드/디렉토리/패턴/주석/테스트/리뷰 통일 규약
- `docs/PROJECT_AUDIT_REPORT.md`: 현재 구조 및 외부 패키지 정밀 분석 보고서
- `docs/superpowers/README.md`: Codex superpowers 설정/운영 문서

## 구조

- `apps`: 개별 애플리케이션을 포함합니다.
  - `web`: 메인 Next.js 애플리케이션입니다.
- `packages`: 여러 앱에서 사용할 수 있는 공유 라이브러리, 컴포넌트 또는 유틸리티를 포함합니다.
  - (이 디렉토리에 새 패키지를 추가할 수 있습니다.)
- `vendor`: Git Submodule 형태의 외부 저장소를 포함합니다.
  - `colors-helper-tools`: 색상 관련 유틸 함수 저장소(서브모듈)입니다.

## 주요 기술

- **pnpm:** 빠르고 디스크 공간 효율적인 패키지 매니저입니다.
- **Turborepo:** JavaScript 및 TypeScript 코드베이스를 위한 고성능 빌드 시스템입니다.
- **Next.js:** 프로덕션용 React 프레임워크입니다.

## AI Tech Stack

이 프로젝트는 최신 AI 에이전트 도구들을 활용하여 개발 생산성을 극대화하도록 설정되어 있습니다.

- **Gemini CLI:** Google Gemini 기반의 강력한 CLI 에이전트입니다. (`.gemini/`)
  - **bkit:** PDCA 방법론 기반의 지능형 워크플로우 엔진이 통합되어 있습니다.
- **Claude Code:** Anthropic의 Claude 3.5 Sonnet 기반 CLI 도구입니다. (`.claude/`)
  - 프로젝트 전용 분석 정책 및 MCP 도구가 설정되어 있습니다.
- **Codex:** AI 에이전트 협업을 위한 통합 설정 프레임워크입니다. (`.codex/`)
  - Superpowers 플러그인을 통한 커스텀 기능 확장을 지원합니다.
- **GitHub Copilot:** IDE 내 실시간 코드 완성 및 채팅 도구입니다.

### MCP (Model Context Protocol)

AI 에이전트들이 보안 가이드라인을 준수하며 프로젝트 컨텍스트에 안전하게 접근할 수 있도록 전용 MCP 서버가 설정되어 있습니다.

- **Workspace Files (Read-only):** 프로젝트 소스 코드 및 문서에 대한 안전한 조회 권한을 제공합니다.
- **Git Metadata:** 변경 이력 및 현재 상태를 파악하여 컨텍스트에 맞는 작업을 수행합니다.
- **Shell Safe-actions:** `rg`, `find` 등 탐색 효율을 높이는 안전한 쉘 명령어를 지원합니다.
- **Test Execution:** 테스트 도구(Vitest 등)와 연동하여 구현 결과를 즉시 검증합니다.

### AI 관리 스크립트

루트 `package.json`에서 제공하는 AI 관련 유틸리티입니다.

```bash
# AI 도구 스택 초기 설정 및 점검
pnpm ai:setup-stack

# 여러 AI 도구 간의 컨텍스트 및 설정 동기화
pnpm ai:sync-config
```

## 시작하기

### 1. 설치

프로젝트의 루트에서 모든 종속성을 설치합니다. pnpm이 워크스페이스 패키지를 자동으로 연결합니다.

```bash
pnpm install
```

서브모듈까지 포함해서 처음 클론할 때는 아래 명령을 권장합니다.

```bash
git clone --recurse-submodules <repo-url>
```

이미 클론한 레포라면 다음을 1회 실행하세요.

```bash
git submodule init
git submodule update
```

### 2. 개발

`web` 애플리케이션의 개발 서버를 시작하려면 루트 디렉토리에서 다음 명령을 실행합니다.

```bash
pnpm dev
```

Turborepo는 `apps/web/package.json`에 정의된 `dev` 스크립트를 지능적으로 실행합니다.

### 3. 빌드

모노레포의 모든 애플리케이션과 패키지를 빌드하려면 루트에서 다음 명령을 실행합니다.

```bash
pnpm build
```

Turborepo는 출력을 캐시하고 변경된 내용만 다시 빌드하여 빌드 프로세스를 매우 빠르게 만듭니다.

### 4. 린팅 및 테스트

루트에서 전체 모노레포에 대한 린팅 및 테스트를 실행할 수도 있습니다.

```bash
# 모든 패키지 린트
pnpm lint

# 모든 패키지 테스트 실행
pnpm test
```

## 새 패키지 추가

1.  `packages` 폴더 내에 새 디렉토리를 만듭니다(예: `packages/ui-library`).
2.  새 디렉토리 내에 고유한 이름을 가진 `package.json` 파일을 만듭니다(예: `"name": "@your-scope/ui-library"`).
3.  새 패키지의 `package.json`에 필요한 종속성과 스크립트를 추가합니다.
4.  이제 다른 애플리케이션(예: `web`)에서 이 새 패키지를 종속성으로 추가하여 사용할 수 있습니다.

    ```json
    // apps/web/package.json에서
    "dependencies": {
      "@your-scope/ui-library": "workspace:*"
    }
    ```

5.  루트에서 `pnpm install`을 실행하여 새 패키지를 연결합니다.

## Git Submodule 운영 가이드

현재 이 레포에는 `vendor/colors-helper-tools` 서브모듈이 연결되어 있습니다.

```bash
git submodule status
```

서브모듈 최신 커밋 반영 방법:

```bash
cd vendor/colors-helper-tools
git pull origin main
cd ../..
git add vendor/colors-helper-tools
git commit -m "Update colors-helper-tools submodule"
```

현재 `.gitmodules` URL은 `https://github.com/citron03/colors-helper-tools.git` 입니다.  
다른 저장소를 사용하려면 아래 명령으로 변경하세요.

```bash
git submodule set-url vendor/colors-helper-tools <your-remote-repo-url>
git submodule sync --recursive
```

## Blog / 블로그

이 레포에서 배운 내용들을 제 블로그(https://citron031.tistory.com/) 에 정리하고 있습니다. 관심 있으시면 놀러와서 읽어주시고 피드백 남겨주세요.
