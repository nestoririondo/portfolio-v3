"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { MessageCircle, FileText, Code, Rocket } from "lucide-react";

const processSteps = [
  {
    icon: MessageCircle,
    key: "discovery",
    delay: 0.1,
  },
  {
    icon: FileText,
    key: "planning",
    delay: 0.2,
  },
  {
    icon: Code,
    key: "development",
    delay: 0.3,
  },
  {
    icon: Rocket,
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
          <h2 className="text-4xl md:text-5xl pb-4 md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("process.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("process.subtitle")}
          </p>
        </motion.div>

        <div className="space-y-8 md:space-y-12">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
                className={`flex flex-col items-center gap-6`}
              >
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: step.delay + 0.2 }}
                      className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center relative z-10"
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: step.delay + 0.4 }}
                      className="absolute -top-2 -left-2 w-24 h-24 border-2 border-blue-300 dark:border-blue-400 rounded-full"
                    />
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 text-center `}>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: step.delay + 0.3 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                  >
                    {t(`process.step${index + 1}.title`)}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: step.delay + 0.4 }}
                    viewport={{ once: true }}
                    className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed"
                  >
                    {t(`process.step${index + 1}.description`)}
                  </motion.p>

                  {/* Timeline connector for mobile */}
                  {index < processSteps.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: step.delay + 0.6 }}
                      viewport={{ once: true }}
                      className="w-px h-32 bg-blue-300 dark:bg-blue-600 mx-auto mt-6 origin-top"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
