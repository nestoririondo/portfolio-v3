"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { scrollToContact } from "@/lib/utils/scroll";
import { useAnimation } from "@/lib/contexts/AnimationContext";
import { ShinyButton } from "./shiny-button";

export function FloatingContactButton() {
  const { heroComplete } = useAnimation();
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={
        heroComplete ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
      }
      transition={{
        duration: 0.8,
        type: "spring",
        stiffness: 400,
        damping: 9,
        delay: 1.0,
      }}
    >
      <ShinyButton onClick={scrollToContact} className="btn-secondary !p-4">
        <MessageCircle className="w-8 h-8" />
      </ShinyButton>
    </motion.div>
  );
}
