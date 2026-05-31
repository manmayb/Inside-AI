"use client";

import { motion } from "framer-motion";
import { panelChild } from "@/motion/stageTransitions";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  glow?: "accent" | "secondary" | "emerald" | "amber" | "none";
  variant?: "default" | "strong" | "hero";
  /** Title divider — off for hero surfaces to avoid double-border noise */
  divider?: boolean;
  /** Entrance animation — default off for calmer chapters */
  animate?: boolean;
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
  divider = true,
  animate = false,
  float = false,
}: GlassPanelProps) {
  const { motionEnabled } = useMotionPreferences();

  const surfaceClass = cn(
    variant === "hero" || variant === "strong"
      ? "museum-card-elevated"
      : "museum-card",
    variant === "hero" && "ring-1 ring-[var(--accent-dim)]",
    glowMap[glow],
    float && "my-1",
    className
  );

  const header =
    (title || subtitle) && divider ? (
      <div className="border-b border-[var(--panel-border)] px-5 py-4">
        {title && <h3 className="text-sm font-medium text-[var(--accent)]">{title}</h3>}
        {subtitle && (
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{subtitle}</p>
        )}
      </div>
    ) : title || subtitle ? (
      <div className="px-5 pt-5">
        {title && <h3 className="text-sm font-medium text-[var(--accent)]">{title}</h3>}
        {subtitle && (
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{subtitle}</p>
        )}
      </div>
    ) : null;

  const body = (
    <>
      {header}
      <div className={cn("relative", title || subtitle ? "p-5" : "p-5")}>{children}</div>
    </>
  );

  if (animate && motionEnabled) {
    return (
      <motion.div
        variants={panelChild}
        initial="initial"
        animate="animate"
        className={surfaceClass}
        role={title ? "region" : undefined}
        aria-label={title}
      >
        {body}
      </motion.div>
    );
  }

  return (
    <div className={surfaceClass} role={title ? "region" : undefined} aria-label={title}>
      {body}
    </div>
  );
}
