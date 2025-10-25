"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { scrollToContact } from "@/lib/utils/scroll";
import SplitText from "@/components/ui/SplitText";
import Example from "../ui/Status";
import DotGrid from "../ui/DotGrid";
import { useTheme } from "@/lib/contexts/ThemeContext";

export function Hero() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  console.log("Current theme in Hero:", theme);

  return (
    <div className="relative h-screen outline outline-1 outline-green-500 overflow-hidden">
      <DotGrid
        dotSize={8}
        gap={15}
        baseColor={theme === "dark" ? "#5227FF" : "#e4defc"}
        activeColor={theme === "dark" ? "#00FFFF" : "#7e62ee"}
        proximity={200}
        shockRadius={300}
        shockStrength={5}
        resistance={2000}
        returnDuration={2.5}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <section
        id="hero"
        className="absolute inset-0 h-full flex flex-col justify-center items-start max-w-6xl mx-auto px-4 md:px-4 z-20"
      >
        <div className="w-full relative z-30">
          <SplitText
            key={`hero-title-${language}`}
            text={t("hero.title")}
            tag="h1"
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-black dark:text-white mb-8 tracking-tight uppercase relative z-30"
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

          <motion.div
            className="flex flex-col md:flex-row md:items-center md:justify-between items-center gap-16 md:gap-8 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <button onClick={scrollToContact} className="btn-primary !px-8 !py-6 !text-lg !min-w-[200px]">
              <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
              <span className="font-bold relative">{t("hero.subtitle")}</span>
              <ArrowRight className="w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-125" />
            </button>

            <motion.div
              className="flex md:mx-0 gap-3 font-mono text-sm text-gray-600 dark:text-gray-400 uppercase"
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
