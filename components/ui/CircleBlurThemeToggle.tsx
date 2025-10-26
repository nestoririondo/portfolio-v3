"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";

type StartPosition =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface CircleBlurThemeToggleProps {
  start?: StartPosition;
  className?: string;
  title?: string;
}

export function CircleBlurThemeToggle({
  start = "center",
  className,
  title,
}: CircleBlurThemeToggleProps) {
  const { theme, toggleThemeWithTransition } = useTheme();

  const handleClick = useCallback(() => {
    const animationFn = () => {
      const styleId = `theme-transition-${Date.now()}`;
      const style = document.createElement("style");
      style.id = styleId;

      const positions = {
        center: "center",
        "top-left": "top left",
        "top-right": "top right",
        "bottom-left": "bottom left",
        "bottom-right": "bottom right",
      };

      const cx =
        start === "center" ? "50" : start.includes("left") ? "0" : "100";
      const cy =
        start === "center" ? "50" : start.includes("top") ? "0" : "100";

      const css = `
        @supports (view-transition-name: root) {
          ::view-transition-old(root) { 
            animation: none;
          }
          ::view-transition-new(root) {
            animation: circle-blur-expand 0.5s ease-out;
            transform-origin: ${positions[start]};
            filter: blur(0);
          }
          @keyframes circle-blur-expand {
            from {
              clip-path: circle(0% at ${cx}% ${cy}%);
              filter: blur(4px);
            }
            to {
              clip-path: circle(150% at ${cx}% ${cy}%);
              filter: blur(0);
            }
          }
        }
      `;

      style.textContent = css;
      document.head.appendChild(style);

      setTimeout(() => {
        const styleEl = document.getElementById(styleId);
        if (styleEl) {
          styleEl.remove();
        }
      }, 1000);
    };

    toggleThemeWithTransition(animationFn);
  }, [start, toggleThemeWithTransition]);

  return (
    <button
      onClick={handleClick}
      className={className}
      title={title}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 md:w-[1.125rem] md:h-[1.125rem]" />
      ) : (
        <Sun className="w-5 h-5 md:w-[1.125rem] md:h-[1.125rem]" />
      )}
    </button>
  );
}
