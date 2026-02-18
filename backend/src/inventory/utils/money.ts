export function round(value: number, precision = 2): number {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function safeMultiply(a: number, b: number): number {
  return round(a * b, 6);
}

export function safeDivide(a: number, b: number): number {
  if (b === 0) {
    return 0;
  }
  return round(a / b, 6);
}
