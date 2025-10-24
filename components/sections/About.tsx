"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { SKILLS } from "@/lib/constants/skills";
import Example from "../ui/Status";

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
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="order-2 lg:order-1">
            <div className="flex flex-col items-center lg:items-start space-y-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  NI
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-mono text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t("about.profile.role")}
                  <br />
                  {t("about.profile.location")}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("about.description1")}
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-3">
                {SKILLS.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium text-sm rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Example>{t("about.status")}</Example>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
