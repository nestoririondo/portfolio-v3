"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { scrollToContact } from "@/lib/utils/scroll";
import { ShinyButton } from "./shiny-button";

export function FloatingContactButton() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1, type: "spring", stiffness: 100 }}
    >
      <ShinyButton onClick={scrollToContact} className="btn-secondary !p-4">
        <MessageCircle className="w-8 h-8" />
      </ShinyButton>
    </motion.div>
  );
}
