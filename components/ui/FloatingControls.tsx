"use client";

import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useAnimation } from "@/lib/contexts/AnimationContext";
import { CircleBlurThemeToggle } from "./CircleBlurThemeToggle";

export function FloatingControls() {
  const { language, setLanguage, t } = useLanguage();
  const { heroComplete } = useAnimation();
  const pathname = usePathname();

  const isBlogPage = pathname.startsWith("/blog");
  const shouldShow = isBlogPage || heroComplete;

  const cycleLanguage = () => {
    const languages = ["en", "de", "es"] as const;
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <motion.div
      className="fixed top-6 right-6 z-40 flex flex-col md:flex-row gap-3"
      initial={{ scale: 0, opacity: 0 }}
      animate={shouldShow ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Language Toggle - Hidden on blog pages */}
      {!isBlogPage && (
        <motion.button
          onClick={cycleLanguage}
          className="btn-secondary"
          title={t("language.toggle")}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="font-mono text-xs font-bold uppercase">
              {language}
            </span>
          </div>
        </motion.button>
      )}

      {/* Theme Toggle - Always visible */}
      <CircleBlurThemeToggle
        start="center"
        title={t("theme.toggle")}
        className="btn-secondary"
      />
    </motion.div>
  );
}
