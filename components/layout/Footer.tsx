"use client";

import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <motion.footer
      className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-6 pb-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start md:text-left">
            <div className="text-gray-600 dark:text-gray-400 font-mono text-sm">
              © {new Date().getFullYear()} {t("footer.copyright")}
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-mono text-[.6rem]">
              Made in Berlin with ❤️
            </div>
          </div>

          <div className="text-sm flex flex-wrap gap-2 md:gap-4 items-center">
            <a
              href="#hero"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 active:bg-gray-200 dark:active:bg-gray-700"
            >
              {t("nav.home")}
            </a>
            <a
              href="#process"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 active:bg-gray-200 dark:active:bg-gray-700"
            >
              Process
            </a>
            {/* <a
              href="#about"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 active:bg-gray-200 dark:active:bg-gray-700"
            >
              {t("footer.nav.about")}
            </a> */}
            <a
              href="#contact"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 active:bg-gray-200 dark:active:bg-gray-700"
            >
              {t("nav.contact")}
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
