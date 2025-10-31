"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const processSteps = [
  {
    emoji: "🔍",
    key: "discovery",
    delay: 0.1,
  },
  {
    emoji: "🎯",
    key: "planning",
    delay: 0.2,
  },
  {
    emoji: "🛠️",
    key: "development",
    delay: 0.3,
  },
  {
    emoji: "🚀",
    key: "launch",
    delay: 0.4,
  },
];

export function Process() {
  const { t } = useLanguage();

  return (
    <section id="process" className="py-20 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("process.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("process.subtitle")}
          </p>
        </motion.div>

        <div className="space-y-8 md:space-y-12">
          {processSteps.map((step, index) => {
            const isEven = index % 2 === 0;

            // Logical color progression with higher contrast
            const colors = [
              {
                bg: "bg-blue-400",
                border: "border-blue-200 dark:border-blue-700",
                connector: "bg-blue-400",
              },
              {
                bg: "bg-blue-500",
                border: "border-blue-200 dark:border-blue-700",
                connector: "bg-blue-500",
              },
              {
                bg: "bg-blue-600",
                border: "border-blue-200 dark:border-blue-700",
                connector: "bg-blue-600",
              },
              {
                bg: "bg-blue-800",
                border: "border-blue-200 dark:border-blue-700",
                connector: "bg-blue-800",
              },
            ];

            const stepColor = colors[index];

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
                className={`flex flex-col items-center gap-6`}
              >
                {/* Step Number & Emoji */}
                <div className="shrink-0">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: step.delay + 0.2 }}
                      className={`w-20 h-20 ${stepColor.bg} rounded-full flex items-center justify-center relative z-10 shadow-lg`}
                    >
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: step.delay + 0.5,
                          ease: "easeOut",
                        }}
                        className="text-5xl"
                      >
                        {step.emoji}
                      </motion.span>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: step.delay + 0.4 }}
                      className={`absolute -top-2 -left-2 w-24 h-24 border-2 ${stepColor.border} rounded-full`}
                    />
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                </div>

                {/* Content Card */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: step.delay + 0.3 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 ${stepColor.border} max-w-md w-full text-center`}
                >
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: step.delay + 0.4 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                  >
                    {t(`process.step${index + 1}.title`)}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: step.delay + 0.5 }}
                    viewport={{ once: true }}
                    className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed"
                  >
                    {t(`process.step${index + 1}.description`)}
                  </motion.p>
                </motion.div>

                {/* Progress connector line */}
                {index < processSteps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ duration: 0.8, delay: step.delay + 0.6 }}
                    viewport={{ once: true }}
                    className={`w-1 h-32 ${stepColor.connector} mx-auto origin-top`}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
