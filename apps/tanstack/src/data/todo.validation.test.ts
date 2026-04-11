import { describe, expect, it } from 'vitest';

import { validateTodoInput } from './todo.validation';

describe('validateTodoInput', () => {
  it('trims and returns valid input', () => {
    expect(validateTodoInput('  buy milk  ')).toBe('buy milk');
  });

  it('throws when value is not a string', () => {
    expect(() => validateTodoInput(123)).toThrowError('todo must be a string');
  });

  it('throws when value is empty after trim', () => {
    expect(() => validateTodoInput('   ')).toThrowError('todo must not be empty');
  });
});
