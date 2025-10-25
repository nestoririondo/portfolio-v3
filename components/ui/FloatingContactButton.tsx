"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { scrollToContact } from "@/lib/utils/scroll";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { ShinyButton } from "./shiny-button";

export function FloatingContactButton() {
  const { t } = useLanguage();

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <ShinyButton
        onClick={scrollToContact}
        className="p-4 rounded-full "
        whileHover={{ scale: 1.1, background: "linear-gradient(45deg, #3b82f6, #8b5cf6)" }}
      >
        <MessageCircle className="w-6 h-6" />
      </ShinyButton>
    </motion.div>
  );
}
