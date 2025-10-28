"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { scrollToContact } from "@/lib/utils/scroll";
import DotGrid from "../ui/DotGrid";
import { useTheme } from "@/lib/contexts/ThemeContext";
import CurrentStatus from "../ui/Status";
import BlurText from "../BlurText";
import { useAnimation } from "@/lib/contexts/AnimationContext";

export function Hero() {
  const { t } = useLanguage();
  const { heroComplete, setHeroComplete } = useAnimation();
  const { theme } = useTheme();

  const baseColor = theme === "dark" ? "#2b3142" : "#f0f0f0";
  const activeColor = theme === "dark" ? "#00FFF7" : "#0022ff";

  return (
    <div className="relative h-screen">
      <DotGrid
        dotSize={8}
        gap={15}
        baseColor={baseColor}
        activeColor={activeColor}
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
          <BlurText
            text={t("hero.title")}
            delay={200}
            animateBy="words"
            direction="bottom"
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-black dark:text-white mb-8 tracking-tight uppercase relative z-30"
            onAnimationComplete={() => setHeroComplete(true)}
          />

          <motion.div
            className="flex flex-col md:flex-row md:items-center md:justify-between items-center gap-16 md:gap-8 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={
              heroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <button
              onClick={scrollToContact}
              className={`btn-primary-animated group ${
                heroComplete ? "opacity-100" : "opacity-0"
              }`}
            >
              <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
              <span className="font-bold text-[1rem] transition-none">
                {t("hero.subtitle")}
              </span>
              <ArrowRight className="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-125" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
