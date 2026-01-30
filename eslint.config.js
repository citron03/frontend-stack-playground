import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactCompilerPlugin from 'eslint-plugin-react-compiler';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/',
      'apps/web/.next/',
      '.turbo/',
      'dist/',
      'build/',
      'coverage/',
      'apps/web/public/service-worker.js',
      'eslint.config.js',
    ],
  },
  js.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
      'react-compiler': reactCompilerPlugin,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        window: 'readonly',
        document: 'readonly',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-unused-vars': 'warn',
      'react-compiler/react-compiler': 'error',
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['apps/scripts/**/*.mjs', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
