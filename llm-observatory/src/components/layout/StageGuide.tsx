"use client";

import { Lightbulb } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getStageTip } from "@/lib/stageTips";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { usePipelineStore } from "@/store/pipelineStore";

export function StageGuide() {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const viewMode = usePipelineStore((s) => s.viewMode);
  const isPaused = usePipelineStore((s) => s.isPaused);
  const { isBeginner } = useLearningDepth();
  const tip = getStageTip(currentStage, viewMode);

  if (!tip.tryThis) return null;

  if (isBeginner) {
    return (
      <div className="shrink-0 border-t border-[var(--panel-border)] bg-[var(--deep)]/50 px-4 py-3 md:px-8">
        <p className="mx-auto flex max-w-lg items-start justify-center gap-2 text-center text-sm text-[var(--muted)]">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
          <span>{tip.tryThis}</span>
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={currentStage + viewMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="shrink-0 border-t border-[var(--panel-border)] px-4 py-3 md:px-8"
      >
        <div className="mx-auto max-w-2xl rounded-xl bg-[var(--elevated)] px-4 py-3">
          <p className="text-xs font-medium text-[var(--accent)]">
            {isPaused ? "Paused · " : ""}
            Try this
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">{tip.tryThis}</p>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
