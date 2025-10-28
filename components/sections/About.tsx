"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import Example from "../ui/Status";

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
    icon: "🚀",
    titleKey: "about.cards.approach",
  },
];

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="section">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white">
            {t("about.title")}
          </h2>
        </motion.div>

        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-block relative mb-8">
              <div className="w-32 h-32 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mx-auto">
                NI
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("about.description1")}
              </p>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {t("about.description2")}
              </p>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {CARDS.map((card, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.3,
                  ease: "easeInOut",
                }}
                key={index}
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
        </motion.div>
      </div>
    </section>
  );
}
