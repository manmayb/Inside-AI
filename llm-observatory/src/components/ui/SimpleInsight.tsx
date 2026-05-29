"use client";

import { motion } from "framer-motion";
import { useLearningDepth } from "@/hooks/useLearningDepth";

interface SimpleInsightProps {
  children: React.ReactNode;
}

/** Beginner-only plain-language insight — the main lesson line */
export function SimpleInsight({ children }: SimpleInsightProps) {
  const { isBeginner } = useLearningDepth();
  if (!isBeginner) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl bg-[var(--accent-glow)] px-5 py-4 text-center text-lg leading-relaxed text-[var(--text)]"
    >
      {children}
    </motion.p>
  );
}
