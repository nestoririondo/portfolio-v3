"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { scrollToContact } from "@/lib/utils/scroll";
import SplitText from "@/components/ui/SplitText";
import { StatusIndicator } from "../ui/shadcn-io/status";
import Example from "../ui/Status";

export function Hero() {
  const { t, language } = useLanguage();

  return (
    <div className="bg-grid-small-black/[0.05] dark:bg-grid-small-white/[0.05]">
      <section
        id="hero"
        className="h-screen snap-start flex flex-col justify-center items-start relative max-w-6xl mx-auto px-4 md:px-0"
      >
        <div className="w-full">
          <SplitText
            key={`hero-title-${language}`}
            text={t("hero.title")}
            tag="h1"
            className="font-heading text-6xl md:text-8xl font-extrabold leading-tight text-black dark:text-white mb-8 tracking-tight uppercase"
            delay={100}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 60, rotationX: -90 }}
            to={{ opacity: 1, y: 0, rotationX: 0 }}
            threshold={0.1}
            rootMargin="-50px"
            textAlign="left"
          />

          <SplitText
            key={`hero-subtitle-${language}`}
            text={t("hero.subtitle")}
            tag="p"
            className="font-body text-xl md:text-2xl font-normal leading-relaxed text-gray-600 dark:text-gray-400 mb-12 max-w-2xl"
            delay={50}
            duration={0.6}
            ease="power2.out"
            splitType="words"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
            textAlign="left"
          />

          <motion.div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-8 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <button
              onClick={scrollToContact}
              className="group bg-black text-white px-12 py-6 font-mono text-base font-extrabold uppercase tracking-wider border-3 border-black hover:border-blue-600 cursor-pointer inline-flex items-center gap-4 transition-all duration-200 shadow-[6px_6px_0_#0066cc] hover:shadow-[3px_3px_0_#0066cc] hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-blue-600 hover:text-black active:translate-x-[6px] active:translate-y-[6px] active:shadow-none min-w-[250px] justify-center"
            >
              <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
              <span className="font-bold relative">{t("hero.cta")}</span>
              <ArrowRight className="w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-125" />
            </button>

            <motion.div
              className="flex items-center mx-auto md:mx-0 gap-3 font-mono text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1, ease: "backIn" }}
            >
              <Example>{t("hero.status")}</Example>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
