export function parseLch(str) {
  const exp = /lch\((.*)%?\s+(.*)\s+(.*)deg?\)/;
  const parts = str.match(exp);
  const l = parts[1];
  const c = parts[2];
  const h = parts[3];

  return { l, c, h };
}
