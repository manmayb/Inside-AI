"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  highlight?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  highlight,
  className,
}: MetricCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "museum-card px-4 py-3",
        highlight && "ring-1 ring-[var(--accent-dim)]",
        className
      )}
    >
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mt-1 text-2xl font-semibold text-[var(--text)]"
      >
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-[var(--muted)]">{unit}</span>}
      </motion.p>
      {trend && <p className="mt-1 text-xs text-[var(--accent)]">{trend}</p>}
    </motion.div>
  );
}
