'use client';

import { useState } from 'react';

const DEFAULT_COLOR = '#3b82f6';

async function requestColor(
  action: 'pastel' | 'complementary' | 'lighten' | 'darken',
  color: string,
) {
  const query = new URLSearchParams({ action, color });
  const res = await fetch(`/api/submodule-colors?${query.toString()}`);

  if (!res.ok) {
    throw new Error(`Failed to get color: ${res.status}`);
  }

  const data = (await res.json()) as { color: string };
  return data.color;
}

export default function SubmoduleColorsPage() {
  const [baseColor, setBaseColor] = useState(DEFAULT_COLOR);
  const [previousColor, setPreviousColor] = useState(DEFAULT_COLOR);
  const [lastAction, setLastAction] = useState<string>('init');
  const [loading, setLoading] = useState(false);

  const runAction = async (action: 'pastel' | 'complementary' | 'lighten' | 'darken') => {
    try {
      setLoading(true);
      setPreviousColor(baseColor);
      const nextColor = await requestColor(action, baseColor);
      setBaseColor(nextColor);
      setLastAction(action);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Submodule Colors Demo</h1>
      <p>
        `colors-helper-tools`를 Git Submodule로 연동한 뒤, 라이브러리 함수를 실제 버튼 액션에 연결한
        예제입니다.
      </p>

      <section
        style={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 12,
        }}
      >
        <input
          aria-label="base color"
          disabled={loading}
          onChange={(e) => setBaseColor(e.target.value)}
          type="color"
          value={baseColor}
        />
        <button disabled={loading} onClick={() => runAction('pastel')} type="button">
          랜덤 파스텔
        </button>
        <button disabled={loading} onClick={() => runAction('complementary')} type="button">
          보색 적용
        </button>
        <button disabled={loading} onClick={() => runAction('lighten')} type="button">
          밝게
        </button>
        <button disabled={loading} onClick={() => runAction('darken')} type="button">
          어둡게
        </button>
        <button disabled={loading} onClick={() => setBaseColor(DEFAULT_COLOR)} type="button">
          리셋
        </button>
      </section>

      <p style={{ marginTop: 10 }}>
        현재 색상: <code>{baseColor}</code> / 이전 색상: <code>{previousColor}</code> / 마지막 액션:{' '}
        <code>{lastAction}</code> {loading ? '(계산 중)' : ''}
      </p>

      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          marginTop: 12,
        }}
      >
        <section
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: 12,
          }}
        >
          <div
            style={{
              backgroundColor: previousColor,
              borderRadius: 8,
              height: 80,
              width: '100%',
            }}
          />
          <p style={{ margin: '10px 0 0 0', fontWeight: 600 }}>이전 색상</p>
          <code>{previousColor}</code>
        </section>
        <section
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            padding: 12,
          }}
        >
          <div
            style={{
              backgroundColor: baseColor,
              borderRadius: 8,
              height: 80,
              width: '100%',
            }}
          />
          <p style={{ margin: '10px 0 0 0', fontWeight: 600 }}>현재 색상</p>
          <code>{baseColor}</code>
        </section>
      </div>
    </main>
  );
}
