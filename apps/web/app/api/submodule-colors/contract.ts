export const COLOR_ACTIONS = ['pastel', 'complementary', 'lighten', 'darken'] as const;

export type Action = (typeof COLOR_ACTIONS)[number];

export type ParsedColorQuery =
  | { ok: true; action: Action; color: string }
  | { ok: false; error: string };

function isAction(value: string): value is Action {
  return COLOR_ACTIONS.includes(value as Action);
}

export function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function parseColorQuery(searchParams: URLSearchParams): ParsedColorQuery {
  const actionValue = searchParams.get('action');

  if (!actionValue) {
    return { ok: false, error: 'action is required' };
  }

  if (!isAction(actionValue)) {
    return { ok: false, error: `action must be one of: ${COLOR_ACTIONS.join(', ')}` };
  }

  const color = searchParams.get('color') ?? '#3b82f6';

  if (actionValue !== 'pastel' && !isHexColor(color)) {
    return { ok: false, error: 'color must be #RRGGBB format' };
  }

  return { ok: true, action: actionValue, color };
}
