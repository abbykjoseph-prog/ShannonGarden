// Watering-can geometry shared by the scenes on /about and /contact.

/** Milliseconds of continuous watering to soak the soil. */
export const SOAK_MS = 1500;

// Can geometry, in the can's own frame (pivot at the body's centre).
export const TILT_DEG = 35;
const SPOUT = { x: 94, y: -36 };
const rad = (TILT_DEG * Math.PI) / 180;
/** Where the rose (sprinkler head) ends up once the can is tilted to pour. */
export const POUR_TIP = {
  x: SPOUT.x * Math.cos(rad) - SPOUT.y * Math.sin(rad),
  y: SPOUT.x * Math.sin(rad) + SPOUT.y * Math.cos(rad),
};
