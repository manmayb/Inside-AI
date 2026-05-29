/** Calm motion primitives — slower, intentional, museum-like pacing */
export const NEURAL_TIMING = {
  signalPulse: 2.8,
  tensorFlow: 3.6,
  activationRipple: 0.85,
  collapseBeat: 0.55,
  ambientDrift: 36,
} as const;

export const signalEase = [0.25, 0.46, 0.45, 0.94] as const;
export const tensorEase = [0.4, 0, 0.2, 1] as const;
export const collapseEase = [0.4, 0, 0.2, 1] as const;
