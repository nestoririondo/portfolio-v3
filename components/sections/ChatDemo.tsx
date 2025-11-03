"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { ChatBubble } from "../ui/ChatBubble";

export function ChatDemo() {
  const { t } = useLanguage();

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {t("chatdemo.title")}
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("chatdemo.description")}
            </motion.p>
          </motion.div>

          {/* Right side - Chat component */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="flex justify-center lg:justify-end"
          >
            <ChatBubble />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
