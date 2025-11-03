/**
 * Device detection utilities
 */

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

export function isTabletDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  return (
    /iPad|Android(?=.*Tablet)|BlackBerry.*Tablet|PlayBook|Silk/i.test(
      navigator.userAgent
    ) ||
    (navigator.maxTouchPoints > 0 && window.innerWidth >= 768)
  );
}

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}