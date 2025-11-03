"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { scrollToContact } from "@/lib/utils/scroll";
import DotGrid from "../ui/DotGrid";
import { useTheme } from "@/lib/contexts/ThemeContext";
import BlurText from "../ui/BlurText";
import { useAnimation } from "@/lib/contexts/AnimationContext";
import { trackEvent } from "@/lib/posthog";
import { getThemeColors } from "@/lib/utils/theme";
import { Container } from "@/components/layout/Container";

export function Hero() {
  const { t } = useLanguage();
  const { heroComplete, setHeroComplete } = useAnimation();
  const { theme } = useTheme();
  
  const themeColors = getThemeColors(theme);

  const handleHeroContactClick = () => {
    trackEvent("hero_contact_button_clicked", {
      hero_animation_complete: heroComplete,
    });
    scrollToContact();
  };

  return (
    <div className="relative h-screen">
      <DotGrid
        dotSize={8}
        gap={15}
        baseColor={themeColors.dotGrid.base}
        activeColor={themeColors.dotGrid.active}
        proximity={300}
        shockRadius={400}
        shockStrength={5}
        resistance={500}
        returnDuration={2.5}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <section id="hero" className="absolute inset-0 h-full flex flex-col justify-center items-start z-20">
        <Container size="xl" className="h-full flex flex-col justify-center items-start">
        <div className="w-full relative z-30">
          <h1>
            <BlurText
              text={t("hero.title")}
              delay={200}
              animateBy="words"
              direction="bottom"
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight text-black dark:text-white mb-8 tracking-tight uppercase relative z-30"
              onAnimationComplete={() => setHeroComplete(true)}
            />
          </h1>

          <motion.div
            className="flex flex-col lg:flex-row md:items-center md:justify-between items-center gap-16 md:gap-8 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={
              heroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <button
              onClick={handleHeroContactClick}
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
        </Container>
      </section>
    </div>
  );
}
