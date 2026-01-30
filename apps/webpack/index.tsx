import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return <h1>Hello, React!</h1>; // 여기에 실제 컴포넌트 추가
};

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<App />);
