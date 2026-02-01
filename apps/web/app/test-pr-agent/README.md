Test PR Agent review samples

검토 포인트:

- `useLeakyEffect`는 cleanup을 반환하지 않아 이벤트 리스너 누수 가능성이 있습니다.
- `fetcher.ts`에서 `any`를 사용하고 있어 타입 안정성이 낮습니다.
- API 라우트(`api/hello/route.ts`)가 예상되는 데이터 구조를 준수하지 않습니다(문자열 반환).
- 클라이언트 코드가 서버의 내부 모듈을 직접 호출하지 않도록 네트워크 요청만 사용하세요.
- 접근성(버튼 aria-label 등)을 확인하세요.

목표: 간단한 코드 리뷰를 유도할 수 있는 예제 파일 모음입니다.
