export function parseLch(str) {
  const exp = /lch\((.*)\s+(.*)\s+(.*)\)/;
  const parts = str.match(exp);
  const l = parseFloat(parts[1]);
  const c = parseFloat(parts[2]);
  const h = parseFloat(parts[3]);

  return { l, c, h };
}

function minMaxWrap(value, min, max) {
  const range = max - min;

  while (value < 0) {
    value += range;
  }
  while (value >= max) {
    value -= range;
  }

  return value;
}

export function applyLchLimits(lch) {
  const l = Math.max(0, Math.min(100, lch.l));
  const c = Math.max(0, Math.min(150, lch.c));
  const h = minMaxWrap(lch.h, 0, 360);

  return { l, c, h };
}

export function toLchStr({ l, c, h }, digits) {
  if (typeof digits === 'number') {
    const ld = l.toFixed(digits);
    const cd = c.toFixed(digits);
    const hd = h.toFixed(digits);

    return `lch(${ld} ${cd} ${hd})`;
  }
  return `lch(${l} ${c} ${h})`;
}
