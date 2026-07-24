'use client';

import { useState } from 'react';

export default function TestPrAgentPage() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test PR Agent Page</h1>
      <p>This is a simple page to test the pr_agent workflow.</p>
      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{count}</span>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    </div>
  );
}
