"use client";

import { motion } from "framer-motion";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";
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

/** Living semantic entity — keyboard-focusable word piece */
export function SemanticToken({
  children,
  active,
  compare,
  index = 0,
  onClick,
  className,
  style,
}: SemanticTokenProps) {
  const { motionEnabled } = useMotionPreferences();
  const label = typeof children === "string" ? children : `Word ${index + 1}`;

  return (
    <motion.button
      type="button"
      data-active={active ? "true" : "false"}
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      initial={motionEnabled ? { opacity: 0, scale: 0.6, filter: "blur(4px)" } : false}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ delay: motionEnabled ? index * 0.05 : 0, duration: 0.5, ease: [0.22, 0.68, 0.12, 1] }}
      whileHover={motionEnabled ? { scale: 1.04 } : undefined}
      className={cn(
        "semantic-token px-4 py-2 text-sm text-[var(--text)]",
        compare && "!border-[var(--secondary)]/50 !shadow-[0_0_20px_var(--accent-glow)]",
        compare && "text-[var(--secondary)]",
        className
      )}
      style={style}
    >
      <span className="relative z-[1]">{children}</span>
    </motion.button>
  );
}
