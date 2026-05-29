"use client";

import { motion } from "framer-motion";
import { panelChild } from "@/motion/stageTransitions";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  glow?: "accent" | "secondary" | "emerald" | "amber" | "none";
  variant?: "default" | "strong";
  float?: boolean;
}

const glowMap = {
  accent: "shadow-[0_4px_24px_var(--accent-glow)]",
  secondary: "shadow-[0_4px_20px_rgba(196,165,116,0.08)]",
  emerald: "shadow-[0_4px_20px_rgba(107,155,122,0.1)]",
  amber: "shadow-[0_4px_20px_rgba(196,165,116,0.1)]",
  none: "",
};

export function GlassPanel({
  children,
  className,
  title,
  subtitle,
  glow = "none",
  variant = "default",
  float = true,
}: GlassPanelProps) {
  return (
    <motion.div
      variants={panelChild}
      initial="initial"
      animate="animate"
      className={cn(
        variant === "strong" ? "museum-card-elevated" : "museum-card",
        glowMap[glow],
        float && "my-1",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="border-b border-[var(--panel-border)] px-5 py-4">
          {title && (
            <h3 className="text-sm font-medium text-[var(--accent)]">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{subtitle}</p>
          )}
        </div>
      )}
      <div className="relative p-5">{children}</div>
    </motion.div>
  );
}
