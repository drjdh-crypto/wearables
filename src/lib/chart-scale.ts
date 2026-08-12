// Minimal, dependency-free scale helpers for the SVG chart components. Not a
// charting library — just enough linear-scale math to keep BarChart/LineChart/
// ScatterChart legible and consistent (src/components/charts/).

export function linearScale(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0);
}

/** Rounds `value` up to a "nice" axis maximum (1/2/5/10 × 10^n). */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  let niceNormalized: number;
  if (normalized <= 1) niceNormalized = 1;
  else if (normalized <= 2) niceNormalized = 2;
  else if (normalized <= 5) niceNormalized = 5;
  else niceNormalized = 10;
  return niceNormalized * magnitude;
}

/** Pads a numeric [min, max] domain by a fraction of its span on both ends. */
export function padDomain(min: number, max: number, fraction = 0.1): [number, number] {
  const span = max - min || 1;
  const pad = span * fraction;
  return [min - pad, max + pad];
}
