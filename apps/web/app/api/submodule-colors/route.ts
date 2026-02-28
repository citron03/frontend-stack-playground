import { NextResponse } from 'next/server';

import {
  complementaryColorHex,
  darkenHex,
  lightenHex,
  pasteltoneHex,
} from '../../../../../vendor/colors-helper-tools/packages/colors-helper-tools/src';

type Action = 'pastel' | 'complementary' | 'lighten' | 'darken';

function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') as Action | null;
  const color = searchParams.get('color') ?? '#3b82f6';

  if (!action) {
    return NextResponse.json({ error: 'action is required' }, { status: 400 });
  }

  if (action !== 'pastel' && !isHexColor(color)) {
    return NextResponse.json({ error: 'color must be #RRGGBB format' }, { status: 400 });
  }

  let nextColor = color;

  if (action === 'pastel') nextColor = pasteltoneHex();
  if (action === 'complementary') nextColor = complementaryColorHex(color);
  if (action === 'lighten') nextColor = lightenHex(color, 0.1);
  if (action === 'darken') nextColor = darkenHex(color, 0.1);

  return NextResponse.json({ color: nextColor });
}
