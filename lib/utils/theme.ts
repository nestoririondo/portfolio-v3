/**
 * Theme-aware utilities for consistent theming across components
 */

export interface ThemeColors {
  dotGrid: {
    base: string;
    active: string;
  };
  gradient: {
    from: string;
    to: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  background: {
    primary: string;
    secondary: string;
    card: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
}

export function getThemeColors(theme: string): ThemeColors {
  const isDark = theme === "dark";
  
  return {
    dotGrid: {
      base: isDark ? "#2b3142" : "#ededed",
      active: isDark ? "#00FFF7" : "#0022ff",
    },
    gradient: {
      from: isDark ? "#6366f1" : "#3b82f6",
      to: isDark ? "#8b5cf6" : "#6366f1",
    },
    text: {
      primary: isDark ? "#ffffff" : "#111827",
      secondary: isDark ? "#d1d5db" : "#4b5563",
      muted: isDark ? "#9ca3af" : "#6b7280",
    },
    background: {
      primary: isDark ? "#111827" : "#ffffff",
      secondary: isDark ? "#1f2937" : "#f9fafb",
      card: isDark ? "#374151" : "#ffffff",
    },
    border: {
      primary: isDark ? "#4b5563" : "#e5e7eb",
      secondary: isDark ? "#6b7280" : "#d1d5db",
    },
  };
}

export function getThemeClasses(theme: string) {
  const isDark = theme === "dark";
  
  return {
    background: {
      primary: isDark ? "bg-gray-900" : "bg-white",
      secondary: isDark ? "bg-gray-800" : "bg-gray-50",
      card: isDark ? "bg-gray-800" : "bg-white",
    },
    text: {
      primary: isDark ? "text-white" : "text-gray-900",
      secondary: isDark ? "text-gray-300" : "text-gray-600",
      muted: isDark ? "text-gray-400" : "text-gray-500",
    },
    border: {
      primary: isDark ? "border-gray-600" : "border-gray-200",
      secondary: isDark ? "border-gray-700" : "border-gray-300",
    },
    hover: {
      background: isDark ? "hover:bg-gray-700" : "hover:bg-gray-100",
      text: isDark ? "hover:text-white" : "hover:text-gray-900",
    },
  };
}