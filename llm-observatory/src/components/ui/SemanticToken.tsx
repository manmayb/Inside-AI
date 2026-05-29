"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SemanticTokenProps {
  children: React.ReactNode;
  active?: boolean;
  compare?: boolean;
  index?: number;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

/** Living semantic entity — not a dashboard chip */
export function SemanticToken({
  children,
  active,
  compare,
  index = 0,
  onClick,
  className,
  style,
}: SemanticTokenProps) {
  return (
    <motion.button
      type="button"
      data-active={active ? "true" : "false"}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 0.68, 0.12, 1] }}
      whileHover={{ scale: 1.06 }}
      className={cn(
        "semantic-token px-4 py-2 font-mono text-sm text-[var(--text)]",
        compare && "!border-violet-400/50 !shadow-[0_0_24px_rgba(139,92,246,0.35)]",
        compare && "text-violet-200",
        className
      )}
      style={style}
    >
      <span className="relative z-[1]">{children}</span>
    </motion.button>
  );
}
