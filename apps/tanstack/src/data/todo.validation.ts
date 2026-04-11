export function validateTodoInput(input: unknown): string {
  if (typeof input !== 'string') {
    throw new Error('todo must be a string');
  }

  const normalized = input.trim();

  if (normalized.length === 0) {
    throw new Error('todo must not be empty');
  }

  if (normalized.length > 120) {
    throw new Error('todo must be at most 120 characters');
  }

  return normalized;
}
