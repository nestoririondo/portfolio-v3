"use client";

import { motion } from "framer-motion";
import { useRevealAnimation } from "@/lib/hooks/useRevealAnimation";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className = "",
  delay = 0,
  size = 'lg',
}: SectionHeaderProps) {
  const animation = useRevealAnimation({ delay });
  
  const sizeClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl", 
    lg: "text-4xl md:text-5xl",
  };

  const containerClasses = `mb-12 ${centered ? "text-center" : ""} ${className}`;

  return (
    <motion.div className={containerClasses} {...animation}>
      <h2 className={`${sizeClasses[size]} font-heading font-bold text-gray-900 dark:text-white mb-8`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}