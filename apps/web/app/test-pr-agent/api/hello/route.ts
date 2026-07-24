import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // 의도적으로 느린 응답, 그리고 타입 불일치(숫자 대신 문자열 반환)
  await new Promise((r) => setTimeout(r, 200));
  return NextResponse.json({ data: 'this-should-be-object' });
}
