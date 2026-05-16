import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const bffBaseUrl = process.env.BFF_BASE_URL || 'http://localhost:3001';

    // Forward client request headers, but remove hop-by-hop headers per RFC7230
    const headersToForward = new Headers(request.headers);
    headersToForward.delete('host');
    headersToForward.delete('connection');
    headersToForward.delete('keep-alive');
    headersToForward.delete('proxy-authenticate');
    headersToForward.delete('proxy-authorization');
    headersToForward.delete('te');
    headersToForward.delete('trailer');
    headersToForward.delete('transfer-encoding');
    headersToForward.delete('upgrade');

    const response = await fetch(`${bffBaseUrl}/api/hello`, {
      headers: headersToForward,
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errBody.error || 'Failed to fetch from BFF' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
