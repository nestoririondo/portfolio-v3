/**
 * Animation configuration constants
 */

export interface DotGridConfig {
  dotSize: number;
  gap: number;
  baseColor: string;
  activeColor: string;
  proximity: number;
  speedTrigger: number;
  shockRadius: number;
  shockStrength: number;
  maxSpeed: number;
  resistance: number;
  returnDuration: number;
}

export const DEFAULT_DOT_GRID_CONFIG: DotGridConfig = {
  dotSize: 16,
  gap: 32,
  baseColor: "#5227FF",
  activeColor: "#5227FF",
  proximity: 150,
  speedTrigger: 100,
  shockRadius: 250,
  shockStrength: 5,
  maxSpeed: 5000,
  resistance: 750,
  returnDuration: 1.5,
};

export const MOBILE_DOT_GRID_CONFIG: Partial<DotGridConfig> = {
  dotSize: 12,
  gap: 24,
  proximity: 100,
  shockRadius: 200,
  shockStrength: 3,
};

export const PERFORMANCE_CONFIG = {
  throttleLimit: 16, // ~60fps
  maxDots: 2000,
  animationFrameId: null as number | null,
} as const;