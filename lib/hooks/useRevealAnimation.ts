/**
 * Custom hook for consistent reveal animations across components
 */

interface RevealAnimationOptions {
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function useRevealAnimation(options: RevealAnimationOptions = {}) {
  const {
    delay = 0,
    duration = 0.6,
    distance = 30,
    once = true,
  } = options;

  return {
    initial: { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once },
    transition: { duration, delay },
  };
}

export function useRevealAnimationX(options: RevealAnimationOptions & { direction?: 'left' | 'right' } = {}) {
  const {
    delay = 0,
    duration = 0.6,
    distance = 30,
    once = true,
    direction = 'left',
  } = options;

  return {
    initial: { opacity: 0, x: direction === 'left' ? -distance : distance },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once },
    transition: { duration, delay },
  };
}

export function useFadeInAnimation(delay: number = 0) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
  };
}