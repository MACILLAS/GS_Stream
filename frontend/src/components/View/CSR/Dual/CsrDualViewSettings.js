const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

export const INITIAL_DELTA = 0.5;
export const INITIAL_ROTATION_DELTA = 0.1;

export const DUAL_VIEW_SETTINGS = {
  delta: INITIAL_DELTA,
  rotationDelta: INITIAL_ROTATION_DELTA,
  modelPosition: [0, 0, 0],
  maxPanX: 200,
  maxPanY: 200,
  maxPanZ: 200,
  cameraSettings: {
    position: [-28.35, 10.55, -4.12],
    rotation: [
      degreesToRadians(-0.8),
      degreesToRadians(-48.63),
      degreesToRadians(-4.88),
    ],
    fov: 75,
    near: 0.1,
    far: 1000,
  },
};
