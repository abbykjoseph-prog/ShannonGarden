// The home bed scene from the original build: five plants in a raised bed, the can moves along the top.

export const SCENE = { w: 540, h: 440 };
export const GROUND = 340;
export const CAN_Y = 112;
export const TILT = 35;
export const CAN_MIN_X = 52;
export const CAN_MAX_X = 372;
export const CAN_START_X = 140;

// Spout tip in the can's local frame, rotated by TILT when pouring.
const TIP = { x: 94, y: -36 };
const rad = (TILT * Math.PI) / 180;
export const POUR_TIP = {
  x: TIP.x * Math.cos(rad) - TIP.y * Math.sin(rad),
  y: TIP.x * Math.sin(rad) + TIP.y * Math.cos(rad),
};
