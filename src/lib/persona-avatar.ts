// Deterministische, abstrakte Avatar-Geometrie pro Persona-Slug — bewusst
// nicht fotorealistisch (überlappende geometrische Formen, keine Gesichter).
// Derselbe Slug ergibt bei jedem Build dieselben Formen (Hash + seeded PRNG,
// kein Math.random), damit Avatare reproduzierbar bleiben.

export interface AvatarShape {
  kind: 'circle' | 'rect' | 'triangle';
  cx: number;
  cy: number;
  size: number;
  rotation: number;
  opacity: number;
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// mulberry32 — kleiner, deterministischer PRNG, gut genug für Layout-Streuung.
function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const KINDS: AvatarShape['kind'][] = ['circle', 'rect', 'triangle'];
const OPACITIES = [1, 0.55, 0.3];

export function generateAvatarShapes(seedInput: string, count = 3): AvatarShape[] {
  const rand = mulberry32(hashString(seedInput));
  return Array.from({ length: count }, (_, i) => ({
    kind: KINDS[Math.floor(rand() * KINDS.length)],
    cx: 18 + rand() * 28,
    cy: 18 + rand() * 28,
    size: 12 + rand() * 18,
    rotation: Math.floor(rand() * 360),
    opacity: OPACITIES[i % OPACITIES.length],
  }));
}
