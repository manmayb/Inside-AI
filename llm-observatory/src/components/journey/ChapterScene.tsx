"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { useSceneComposition } from "@/hooks/useSceneComposition";
import { STAGE_META } from "@/lib/constants";
import { getRegionForStage } from "@/lib/brainRegions";
import { getStageTip } from "@/lib/stageTips";
import { getActiveStages, usePipelineStore } from "@/store/pipelineStore";
import { ChapterBrainFocus } from "./ChapterBrainFocus";
import { signalEase } from "@/motion/neuralMotion";
import { cn } from "@/lib/utils";

interface ChapterSceneProps {
  children: React.ReactNode;
}

/** Single-focus immersive chapter — compact narrative or cinematic stage */
export function ChapterScene({ children }: ChapterSceneProps) {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const viewMode = usePipelineStore((s) => s.viewMode);
  const ragEnabled = usePipelineStore((s) => s.ragEnabled);
  const { isBeginner } = useLearningDepth();
  const { mode } = useSceneComposition();
  const cinematic = mode === "cinematic";

  const activeStages = getActiveStages(ragEnabled);
  const chapterIndex = activeStages.indexOf(currentStage) + 1;
  const chapterTotal = activeStages.length;
  const meta = STAGE_META[currentStage];
  const tip = getStageTip(currentStage, viewMode);
  const headline = isBeginner ? meta.simpleLabel : meta.label;
  const region = getRegionForStage(currentStage);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        className={cn(
          "chapter-scene relative flex min-h-0 flex-1 flex-col",
          cinematic ? "chapter-scene--cinematic overflow-hidden" : "chapter-scene--compact overflow-hidden"
        )}
        data-region={region.id}
        data-scene-mode={mode}
      >
        <header
          className={cn(
            "chapter-scene-header shrink-0 text-center",
            cinematic
              ? "scene-header-overlay pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-12 md:pt-14"
              : "px-6 pb-1 pt-8 md:pt-10"
          )}
        >
          <p className="text-[10px] font-medium tracking-[0.2em] text-[var(--muted)] uppercase">
            Chapter {chapterIndex} of {chapterTotal}
          </p>
          <h1
            className={cn(
              "display-title text-[var(--text)]",
              cinematic ? "mt-1.5 text-2xl md:text-3xl" : "mt-2 text-2xl md:text-3xl"
            )}
          >
            {headline}
          </h1>
          <p
            className={cn(
              "mx-auto max-w-md leading-relaxed text-[var(--muted)]",
              cinematic ? "mt-1.5 text-sm md:text-base" : "mt-2 text-sm md:text-base"
            )}
          >
            {tip.summary}
          </p>
        </header>

        {/* ChapterBrainFocus: compact mode only — cinematic chapters own the full visual canvas */}
        {isBeginner && !cinematic && (
          <div className="z-20 shrink-0">
            <ChapterBrainFocus />
          </div>
        )}

        <main
          id="chapter-content"
          className={cn(
            "relative flex min-h-0 flex-1 flex-col",
            cinematic ? "overflow-hidden" : "scene-compact-stage overflow-hidden px-6"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: cinematic ? 0 : 8, scale: cinematic ? 0.99 : 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: signalEase, delay: 0.06 }}
            className={cn(
              "flex min-h-0 w-full flex-1 flex-col",
              !cinematic && "mx-auto max-w-2xl justify-center"
            )}
          >
            {children}
          </motion.div>

          {tip.tryThis && isBeginner && (
            <p
              className={cn(
                "pointer-events-none z-20 px-6 text-center text-sm text-[var(--muted)]",
                cinematic ? "scene-try-this absolute inset-x-0" : "scene-try-this-compact shrink-0 pb-2"
              )}
            >
              {tip.tryThis}
            </p>
          )}
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
