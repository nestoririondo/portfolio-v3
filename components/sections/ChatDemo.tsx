"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { ChatBubble } from "../ui/ChatBubble";
import { useRevealAnimation } from "@/lib/hooks/useRevealAnimation";
import { Container } from "@/components/layout/Container";

export function ChatDemo() {
  const { t } = useLanguage();
  const titleAnimation = useRevealAnimation();
  const descriptionAnimation = useRevealAnimation({ delay: 0.2 });
  const chatAnimation = useRevealAnimation({ delay: 0.5, distance: 50 });

  return (
    <section>
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6">
            <motion.h2
              {...titleAnimation}
              className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white text-center"
            >
              {t("chatdemo.title")}
            </motion.h2>

            <motion.p
              {...descriptionAnimation}
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center"
            >
              {t("chatdemo.description")}
            </motion.p>
          </div>

          {/* Right side - Chat component */}
          <motion.div
            {...chatAnimation}
            className="flex justify-center lg:justify-end"
          >
            <ChatBubble />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
