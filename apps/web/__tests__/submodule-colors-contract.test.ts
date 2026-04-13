import { describe, expect, it } from 'vitest';

import { parseColorQuery } from '../app/api/submodule-colors/contract';

describe('parseColorQuery', () => {
  it('returns error when action is missing', () => {
    const params = new URLSearchParams();
    expect(parseColorQuery(params)).toEqual({ ok: false, error: 'action is required' });
  });

  it('returns error when action is invalid', () => {
    const params = new URLSearchParams({ action: 'rainbow' });
    expect(parseColorQuery(params)).toEqual({
      ok: false,
      error: 'action must be one of: pastel, complementary, lighten, darken',
    });
  });

  it('returns error when color format is invalid for non-pastel action', () => {
    const params = new URLSearchParams({ action: 'lighten', color: 'not-a-color' });
    expect(parseColorQuery(params)).toEqual({
      ok: false,
      error: 'color must be #RRGGBB format',
    });
  });

  it('returns default color when optional color is omitted', () => {
    const params = new URLSearchParams({ action: 'complementary' });
    expect(parseColorQuery(params)).toEqual({
      ok: true,
      action: 'complementary',
      color: '#3b82f6',
    });
  });
});
