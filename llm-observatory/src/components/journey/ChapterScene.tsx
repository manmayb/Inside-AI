"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { STAGE_META } from "@/lib/constants";
import { getStageTip } from "@/lib/stageTips";
import { usePipelineStore } from "@/store/pipelineStore";
import { PIPELINE_STAGES } from "@/types/pipeline";
import { ChapterBrainFocus } from "./ChapterBrainFocus";
import { signalEase } from "@/motion/neuralMotion";

interface ChapterSceneProps {
  children: React.ReactNode;
}

/** Single-focus immersive chapter — one idea, one screen */
export function ChapterScene({ children }: ChapterSceneProps) {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const viewMode = usePipelineStore((s) => s.viewMode);
  const { isBeginner, showTechnical } = useLearningDepth();

  const chapterIndex = PIPELINE_STAGES.indexOf(currentStage) + 1;
  const meta = STAGE_META[currentStage];
  const tip = getStageTip(currentStage, viewMode);
  const headline = isBeginner ? meta.simpleLabel : meta.label;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        className="flex min-h-0 flex-1 flex-col"
      >
        <header className="shrink-0 px-6 pb-2 pt-10 text-center md:pt-14">
          <p className="text-xs font-medium tracking-widest text-[var(--muted)] uppercase">
            Chapter {chapterIndex} of {PIPELINE_STAGES.length}
          </p>
          <h1 className="display-title mt-3 text-3xl text-[var(--text)] md:text-4xl">
            {headline}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--muted)] md:text-lg">
            {tip.summary}
          </p>
        </header>

        {isBeginner && <ChapterBrainFocus />}

        <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 pb-28 pt-4">
          <motion.div
            initial={{ opacity: 0, y: showTechnical ? 16 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: signalEase, delay: 0.08 }}
            className={`w-full ${showTechnical ? "max-w-3xl" : "max-w-lg"}`}
          >
            {children}
          </motion.div>

          {tip.tryThis && isBeginner && (
            <p className="mt-8 max-w-sm text-center text-sm text-[var(--muted)]">{tip.tryThis}</p>
          )}
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
