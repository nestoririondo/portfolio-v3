"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRevealAnimation } from "@/lib/hooks/useRevealAnimation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/layout/Container";

const CARDS = [
  {
    icon: "5+",
    titleKey: "about.cards.experience",
  },
  {
    icon: "💬",
    titleKey: "about.cards.languages",
  },
  {
    icon: "📍",
    titleKey: "about.cards.location",
  },
];

export function About() {
  const { t } = useLanguage();
  const profileAnimation = useRevealAnimation({ delay: 0.2, duration: 0.6 });
  const bioAnimation = useRevealAnimation({ delay: 0.6 });

  return (
    <section id="about" className="section mt-20">
      <Container size="lg">
        <SectionHeader title={t("about.title")} />
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            {...profileAnimation}
            initial={{ opacity: 0, y: 30, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="inline-block relative mb-8"
          >
            <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg mx-auto overflow-hidden">
              <Image
                src="/icons/favicon.svg"
                alt="Néstor Iriondo"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900"></div>
          </motion.div>

          <motion.div {...bioAnimation} className="max-w-3xl mx-auto space-y-6">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {t("about.description1")
                .split(" ")
                .map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="font-mono"
                  >
                    {word}{" "}
                  </motion.span>
                ))}
            </p>

            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {t("about.description2")
                .split(" ")
                .map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 + 0.8 }}
                    className="font-mono"
                  >
                    {word}{" "}
                  </motion.span>
                ))}
            </p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {CARDS.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center"
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {card.icon}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {t(card.titleKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
