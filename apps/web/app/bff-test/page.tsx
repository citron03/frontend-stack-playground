'use client';

import { useEffect, useState } from 'react';

type BFFHelloResponse = {
  message: string;
  data: {
    id: number;
    name: string;
    description: string;
  };
};

export default function BFFTestPage() {
  const [data, setData] = useState<BFFHelloResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/bff-proxy') // Use the Next.js API proxy
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch from BFF');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>BFF Integration Test</h1>
      {loading && <p>Loading data from BFF...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h3>Message: {data.message}</h3>
          <pre>{JSON.stringify(data.data, null, 2)}</pre>
        </div>
      )}
      <div style={{ marginTop: '2rem' }}>
        <a href="/">← Back to Home</a>
      </div>
    </div>
  );
}
