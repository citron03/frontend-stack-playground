# Next.js, pnpm, Turborepo를 사용한 모노레포

이 프로젝트는 pnpm 워크스페이스와 Turborepo를 사용하여 모노레포로 재구성되었습니다.

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
