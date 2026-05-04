import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['**/__tests__/**/*.{ts,tsx}', '**/?(*.)+(spec|test).[jt]s?(x)'],
  },
});
