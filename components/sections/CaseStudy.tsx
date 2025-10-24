"use client";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export function CaseStudy() {
  const { t } = useLanguage();
  
  return (
    <section id="case-study" className="section">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-4">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-2">
              {t("casestudy.title")}
            </h2>
            <div className="w-20 h-1 bg-blue-600"></div>
          </div>
          <div className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            CASE STUDY
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Text content */}
          <div className="space-y-8">
            <motion.div
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-blue-500 transition-colors duration-300"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-4">
                <div className="text-sm font-mono text-blue-600 dark:text-blue-400 font-bold mb-2">
                  01 / Challenge
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  {t("casestudy.challenge")}
                </h3>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t("casestudy.challenge.description")}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-green-500 transition-colors duration-300"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="mb-4">
                <div className="text-sm font-mono text-green-600 dark:text-green-400 font-bold mb-2">
                  02 / Solution
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  {t("casestudy.solution")}
                </h3>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t("casestudy.solution.description")}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-purple-500 transition-colors duration-300"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="mb-4">
                <div className="text-sm font-mono text-purple-600 dark:text-purple-400 font-bold mb-2">
                  03 / Results
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  {t("casestudy.results")}
                </h3>
              </div>
              <div>
                <div className="space-y-3">
                  {[
                    t("casestudy.result1"),
                    t("casestudy.result2"),
                    t("casestudy.result3"),
                  ].map((result, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {result}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column - Images */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="group">
              <div className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {t("casestudy.image1.alt")}
              </div>
              <div className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-colors duration-300">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1630522790545-67ad2cb700fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWJzaXRlJTIwbGFwdG9wfGVufDF8fHx8MTc2MDg4MDQ0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt={t("casestudy.image1.alt")}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            
            <div className="group">
              <div className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {t("casestudy.image2.alt")}
              </div>
              <div className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-green-500 transition-colors duration-300">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1649769425782-8cdb757da2b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZWFsJTIwZXN0YXRlJTIwbHV4dXJ5JTIwaG9tZXxlbnwxfHx8fDE3NjA4MzMxMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt={t("casestudy.image2.alt")}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}