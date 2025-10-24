'use client';

import { Globe, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { CircleBlurThemeToggle } from "../ui/CircleBlurThemeToggle";
import { scrollToContact, scrollToTop } from "@/lib/utils/scroll";

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  const cycleLanguage = () => {
    const languages = ["en", "de", "es"] as const;
    const currentIndex = languages.indexOf(language as any);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b-2 md:border-b-4 border-black dark:border-white h-[70px] md:h-20 shadow-none"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-full flex justify-between items-center">
        <div 
          className="font-mono text-base md:text-xl font-black cursor-pointer transition-all duration-200 uppercase tracking-wider hover:transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:text-shadow-[2px_2px_0_#0066cc]"
          onClick={scrollToTop}
        >
          <span className="text-black dark:text-white">néstor</span>
          <span className="text-blue-600">iriondo</span>
        </div>

        <div className="flex items-center gap-0">
          <button
            onClick={cycleLanguage}
            className="bg-gray-100 dark:bg-zinc-900 border-none border-r-2 md:border-r-4 border-black dark:border-white text-black dark:text-white px-3 md:px-4 py-3 md:py-4 font-mono text-[0.625rem] md:text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-2 transition-all duration-200 min-w-[60px] md:min-w-[80px] justify-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#0066cc] active:transform active:translate-x-0 active:translate-y-0 active:shadow-none"
            title={t("language.toggle")}
          >
            <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
            {language.toUpperCase()}
          </button>

          <CircleBlurThemeToggle 
            start="center" 
            title={t("theme.toggle")}
            className="!bg-gray-100 dark:!bg-zinc-900 !border-none !border-r-2 md:!border-r-4 !border-black dark:!border-white !text-black dark:!text-white !px-3 md:!px-4 !py-3 md:!py-4 !font-mono !text-[0.625rem] md:!text-xs !font-bold !uppercase !tracking-wider !cursor-pointer !flex !items-center !gap-2 !transition-all !duration-200 !min-w-[60px] md:!min-w-[80px] !justify-center hover:!bg-black dark:hover:!bg-white hover:!text-white dark:hover:!text-black hover:!transform hover:!-translate-x-0.5 hover:!-translate-y-0.5 hover:!shadow-[2px_2px_0_#0066cc] active:!transform active:!translate-x-0 active:!translate-y-0 active:!shadow-none !rounded-none"
          />

          <button 
            onClick={scrollToContact} 
            className="bg-gray-100 dark:bg-zinc-900 dark:text-white text-black border-none px-4 md:px-6 py-3 md:py-4 font-mono text-[0.75rem] md:text-xs font-semibold uppercase tracking-wider cursor-pointer flex items-center gap-2 transition-all duration-200 hover:bg-black dark:hover:bg-black hover:text-white dark:hover:text-white hover:transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#0066cc] active:bg-black dark:active:bg-black active:text-white dark:active:text-white active:transform active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            <MessageCircle className="w-3.5 h-3.5 md:w-[1.125rem] md:h-[1.125rem] transition-transform duration-200" />
            <div className="hidden md:block font-extrabold relative">
              {t("nav.contact")}
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
}