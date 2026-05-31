"use client";

import { motion } from "framer-motion";
import { usePipelineStore } from "@/store/pipelineStore";
import { getRegionForStage } from "@/lib/brainRegions";

/** One cognitive moment — not the full brain map */
export function ChapterBrainFocus() {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const region = getRegionForStage(currentStage);

  return (
    <motion.div
      key={currentStage}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-md px-6 py-2 text-center"
      aria-live="polite"
    >
      <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--panel-border)] bg-[var(--elevated)] px-4 py-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
        </span>
        <span className="text-sm font-medium text-[var(--accent)]">{region.label}</span>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{region.doing}</p>
    </motion.div>
  );
}
