"use client";

import { Target, MessageSquare, Award, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";

const principles = [
  {
    icon: Target,
    titleKey: "approach.business.title",
    descriptionKey: "approach.business.description",
    number: "01",
  },
  {
    icon: MessageSquare,
    titleKey: "approach.communication.title",
    descriptionKey: "approach.communication.description",
    number: "02",
  },
  {
    icon: Award,
    titleKey: "approach.professional.title",
    descriptionKey: "approach.professional.description",
    number: "03",
  },
  {
    icon: ShieldCheck,
    titleKey: "approach.lasting.title",
    descriptionKey: "approach.lasting.description",
    number: "04",
  },
];

export function Approach() {
  const { t } = useLanguage();

  return (
    <section id="approach" className="section">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white">
            My Approach
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <div key={index} className="group relative">
                <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 p-8 hover:border-green-500 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute top-4 right-4 text-6xl font-mono text-gray-100 dark:text-gray-800 font-bold pointer-events-none">
                    {principle.number}
                  </div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-green-600 dark:text-green-400 group-hover:text-white" />
                    </div>
                    <h4 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                      {t(principle.titleKey)}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t(principle.descriptionKey)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 italic max-w-3xl mx-auto leading-relaxed">
            Professional development experience meets creative problem-solving
          </p>
        </motion.div>
      </div>
    </section>
  );
}