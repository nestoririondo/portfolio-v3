"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface Message {
  text: string;
  sent: boolean;
}


const transition = {
  type: 'spring' as const,
  stiffness: 200,
  mass: 0.2,
  damping: 20,
};

const variants = {
  initial: {
    opacity: 0,
    y: 300,
  },
  enter: {
    opacity: 1,
    y: 0,
  },
};

export function ChatBubble() {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { t, language } = useLanguage();

  const messages: Message[] = useMemo(() => [
    { text: t("chat.demo.1"), sent: false },
    { text: t("chat.demo.2"), sent: true },
    { text: t("chat.demo.3"), sent: false },
    { text: t("chat.demo.4"), sent: true },
    { text: t("chat.demo.5"), sent: false },
    { text: t("chat.demo.6"), sent: true },
    { text: t("chat.demo.7"), sent: false },
  ], [t]);

  // Intersection Observer for viewport detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animation trigger when in view or language changes
  useEffect(() => {
    if (!isInView) return;
    
    const timeouts: NodeJS.Timeout[] = [];
    const initialDelay = 500; // 1 second delay before first message
    
    // Reset messages after a micro-task to avoid synchronous setState
    const resetTimeout = setTimeout(() => {
      setVisibleMessages([]);
    }, 0);
    timeouts.push(resetTimeout);
    
    messages.forEach((message, index) => {
      const timeout = setTimeout(() => {
        setVisibleMessages(prev => [...prev, message]);
      }, initialDelay + (index * 1500));
      timeouts.push(timeout);
    });
    
    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isInView, language, messages]);

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';

  return (
    <div ref={ref} className="relative mx-auto">
      {/* iPhone Frame */}
      <div className="relative w-80 h-[640px] bg-black rounded-[3rem] p-2 shadow-2xl">
        {/* iPhone Screen */}
        <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>
          
          {/* Messages Header */}
          <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 pt-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs">N</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">Néstor</h3>
                  <p className="text-xs text-green-500">online</p>
                </div>
              </div>
              <div className="text-blue-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Messages Container */}
          <div 
            className={`flex-1 p-4 overflow-y-hidden ${bgColor}`} 
            style={{ height: 'calc(100% - 120px)' }}
          >
            <ol className="flex flex-col justify-end h-full p-0 list-none space-y-1 pb-4">
              <AnimatePresence>
                {visibleMessages.map((message, i) => {
                  const isLast = i === visibleMessages.length - 1;
                  const noTail = !isLast && visibleMessages[i + 1]?.sent === message.sent;
                  
                  return (
                    <motion.li
                      key={i}
                      className={`
                        relative max-w-[200px] mb-3 px-3 py-2 leading-5 overflow-wrap-break-word rounded-2xl text-sm
                        ${message.sent 
                          ? "ml-auto bg-blue-500 text-white" 
                          : `mr-auto ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`
                        }
                        
                        /* Tail for sent messages */
                        ${!noTail && message.sent ? `
                          before:content-[''] before:absolute before:bottom-0 before:-right-2 before:w-3 before:h-4
                          before:bg-blue-500 before:rounded-bl-[12px_10px]
                          after:content-[''] after:absolute after:bottom-0 after:-right-4 after:w-4 after:h-4
                          after:rounded-bl-lg ${theme === 'dark' ? 'after:bg-gray-900' : 'after:bg-white'}
                        ` : ''}
                        
                        /* Tail for received messages */
                        ${!noTail && !message.sent ? `
                          before:content-[''] before:absolute before:bottom-0 before:-left-2 before:w-3 before:h-4
                          ${theme === 'dark' ? 'before:bg-gray-700' : 'before:bg-gray-200'} before:rounded-br-[12px_10px]
                          after:content-[''] after:absolute after:bottom-0 after:-left-4 after:w-4 after:h-4
                          after:rounded-br-lg ${theme === 'dark' ? 'after:bg-gray-900' : 'after:bg-white'}
                        ` : ''}
                      `}
                      initial="initial"
                      animate="enter"
                      variants={variants}
                      transition={transition}
                      layout
                    >
                      {message.text}
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
          </div>
          
          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-900 p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white dark:bg-gray-700 rounded-full px-3 py-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Message...</span>
              </div>
              <button className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}