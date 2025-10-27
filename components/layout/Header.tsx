"use client";

import { Globe, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { CircleBlurThemeToggle } from "../ui/CircleBlurThemeToggle";
import { scrollToContact, scrollToTop } from "@/lib/utils/scroll";

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  const cycleLanguage = () => {
    const languages = ["en", "de", "es"] as const;
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black/90 border-b-2 md:border-b-4 border-black dark:border-white h-[70px] md:h-20 shadow-none"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
    >
      <div className="max-w-6xl mx-auto px-8 h-full flex justify-between items-center overflow-hidden">
        <div
          className="font-mono text-xl md:text-xl font-black cursor-pointer transition-all duration-200 uppercase tracking-wider hover:transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:text-shadow-[2px_2px_0_#0066cc] "
          onClick={scrollToTop}
        >
          <span className="text-black dark:text-white">
            <span className="sm:hidden">n</span>
            <span className="hidden sm:inline">néstor</span>
          </span>
          <span className="text-blue-600">
            <span className="sm:hidden">i</span>
            <span className="hidden sm:inline">iriondo</span>
          </span>
        </div>

        <div className="flex items-center gap-0">
          <button
            onClick={cycleLanguage}
            title={t("language.toggle")}
          >
            <Globe className="w-3.5 h-3.5 md:w-[1.125rem] md:h-[1.125rem]" />
            {language.toUpperCase()}
          </button>

          <CircleBlurThemeToggle
            start="center"
            title={t("theme.toggle")}
          />

          <button
            onClick={scrollToContact}
            className="!px-4 md:!px-6 md:!min-w-[120px]"
          >
            <MessageCircle className="w-3.5 h-3.5 md:w-[1.125rem] md:h-[1.125rem]" />
            <div className="hidden md:block font-extrabold relative">
              {t("nav.contact")}
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
