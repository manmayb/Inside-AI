"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { usePipelineStore } from "@/store/pipelineStore";
import { STAGE_META } from "@/lib/constants";
import { formatGlobalProgress } from "@/lib/tourProgress";
import { NEURAL_TIMING } from "@/motion/neuralMotion";
import { cn } from "@/lib/utils";

/** Focus chip — Curious/Advanced only (Beginner uses the brain view) */
export function TokenConsciousness() {
  const { isBeginner } = useLearningDepth();
  const active = usePipelineStore((s) => s.active);
  const tokens = usePipelineStore((s) => s.tokens);
  const selectedTokenIndex = usePipelineStore((s) => s.selectedTokenIndex);
  const currentStage = usePipelineStore((s) => s.currentStage);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const globalScrubProgress = usePipelineStore((s) => s.globalScrubProgress);
  const isScrubbing = usePipelineStore((s) => s.isScrubbing);
  const isPaused = usePipelineStore((s) => s.isPaused);

  if (!active || isBeginner || tokens.length === 0) return null;

  const token = tokens[selectedTokenIndex];
  const meta = STAGE_META[currentStage];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-none absolute right-4 top-3 z-30"
      >
        <div className={cn("flex items-center gap-3 px-4 py-2 neural-frame text-xs")}>
          <motion.div
            className="h-2 w-2 rounded-full bg-[var(--accent)]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: NEURAL_TIMING.signalPulse, repeat: Infinity }}
          />
          <span className="font-mono text-white">&quot;{token?.text ?? "—"}&quot;</span>
          <span className="text-[var(--muted)]">{meta.simpleLabel}</span>
          <span className="font-mono text-[9px] text-[var(--muted)]">
            {formatGlobalProgress(globalScrubProgress)}
            {(isPaused || isScrubbing) && " · hold"}
          </span>
          <div className="h-1 w-16 overflow-hidden rounded-full bg-black/40">
            <motion.div
              className="h-full bg-[var(--accent)]"
              animate={{ width: `${stageProgress}%` }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
