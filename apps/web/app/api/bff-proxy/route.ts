import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bffBaseUrl = process.env.BFF_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${bffBaseUrl}/api/hello`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch from BFF' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
