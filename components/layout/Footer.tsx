import { useLanguage } from "@/lib/contexts/LanguageContext";
import { motion } from "framer-motion";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <motion.footer
      className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-12 pb-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-gray-600 dark:text-gray-400 font-mono text-sm">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </div>

          <div className="flex flex-wrap gap-6 items-center">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium"
            >
              {t("nav.home")}
            </a>
            <a
              href="#services"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium"
            >
              {t("footer.nav.services")}
            </a>
            <a
              href="#approach"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium"
            >
              {t("nav.approach")}
            </a>
            <a
              href="#about"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium"
            >
              {t("footer.nav.about")}
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
