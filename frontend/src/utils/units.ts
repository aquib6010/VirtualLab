/**
 * Physics unit constants for converting between Matter.js pixels and SI meters.
 *
 * Matter.js operates in pixels internally.
 * All user-facing values (velocity, position, KE) should be in SI units (m, m/s, J).
 *
 * Scale: 1 meter = 50 pixels
 */
export const PIXELS_PER_METER = 50;

/** Convert px to meters */
export const pxToM = (px: number) => px / PIXELS_PER_METER;

/** Convert meters to px */
export const mToPx = (m: number) => m * PIXELS_PER_METER;

/** Convert px/s to m/s */
export const pxToMs = (pxPerSec: number) => pxPerSec / PIXELS_PER_METER;

/** Convert m/s to px/s */
export const msToPx = (mPerSec: number) => mPerSec * PIXELS_PER_METER;

/** Convert px/s² to m/s² */
export const pxToMs2 = (pxPerSec2: number) => pxPerSec2 / PIXELS_PER_METER;

/**
 * Convert kinetic energy from px-based to SI.
 * KE = 0.5 * m * v²  (where v is in m/s)
 * Matter.js gives v in px/s, so: KE_si = 0.5 * m * (v_px / PPM)²
 */
export const keToSI = (mass: number, speedPx: number) =>
  0.5 * mass * Math.pow(speedPx / PIXELS_PER_METER, 2);
