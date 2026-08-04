// Mutable pointer state shared between the scene and the camera director.
// A single window listener updates it; components read it in useFrame.
export const pointerState = {
  x: 0,
  y: 0,
  active: false,
};