import { NextResponse } from 'next/server';
import { createRequire } from 'node:module';

import { parseColorQuery } from './contract';

const require = createRequire(import.meta.url);
const colorsHelper =
  require('../../../../../vendor/colors-helper-tools/packages/colors-helper-tools/src') as {
    complementaryColorHex: (hex: string) => string;
    darkenHex: (hex: string, amount: number) => string;
    lightenHex: (hex: string, amount: number) => string;
    pasteltoneHex: () => string;
  };

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = parseColorQuery(searchParams);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { action, color } = parsed;

  let nextColor = color;

  if (action === 'pastel') nextColor = colorsHelper.pasteltoneHex();
  if (action === 'complementary') nextColor = colorsHelper.complementaryColorHex(color);
  if (action === 'lighten') nextColor = colorsHelper.lightenHex(color, 0.1);
  if (action === 'darken') nextColor = colorsHelper.darkenHex(color, 0.1);

  return NextResponse.json({ color: nextColor });
}
