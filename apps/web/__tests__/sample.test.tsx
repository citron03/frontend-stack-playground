import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

function Hello() {
  return <h1>Hello, Next.js 15!</h1>;
}

test('Hello renders correctly', () => {
  render(<Hello />);
  expect(screen.getByText(/Next\.js 15/)).toBeInTheDocument();
});
