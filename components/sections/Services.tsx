"use client";

import { Code, Plug, Wrench } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";
import { TECH_STACK } from "@/lib/constants/skills";

const services = [
  {
    icon: Code,
    titleKey: "services.custom.title",
    descriptionKey: "services.custom.description",
    number: "01",
  },
  {
    icon: Plug,
    titleKey: "services.api.title", 
    descriptionKey: "services.api.description",
    number: "02",
  },
  {
    icon: Wrench,
    titleKey: "services.consulting.title",
    descriptionKey: "services.consulting.description", 
    number: "03",
  },
];

export function Services() {
  const { t } = useLanguage();

  return (
    <section id="services" className="section">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white">
            Services
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="group relative">
                <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 p-8 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                  <div className="absolute top-4 right-4 text-6xl font-mono text-gray-100 dark:text-gray-800 font-bold pointer-events-none">
                    {service.number}
                  </div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t(service.descriptionKey)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {TECH_STACK.map((tech, index) => (
              <span 
                key={index} 
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono text-sm rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}