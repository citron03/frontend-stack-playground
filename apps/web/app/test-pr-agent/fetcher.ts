// 의도적으로 any 사용
export async function fetchData(): Promise<any> {
  const res = await fetch('/api/test-pr-agent');
  if (!res.ok) throw new Error('Network error');
  return res.json();
}
