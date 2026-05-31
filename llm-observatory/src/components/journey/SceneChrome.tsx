"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { HelpDrawer } from "@/components/layout/HelpDrawer";
import { GlossaryDrawer } from "@/components/layout/GlossaryDrawer";
import { STAGE_META } from "@/lib/constants";
import { getActiveStages, usePipelineStore } from "@/store/pipelineStore";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { useSceneComposition } from "@/hooks/useSceneComposition";
import { cn } from "@/lib/utils";
import { SceneProgress } from "./SceneProgress";

interface SceneChromeProps {
  onExit: () => void;
}

export function SceneChrome({ onExit }: SceneChromeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentStage = usePipelineStore((s) => s.currentStage);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const isPaused = usePipelineStore((s) => s.isPaused);
  const generationComplete = usePipelineStore((s) => s.generationComplete);
  const togglePause = usePipelineStore((s) => s.togglePause);
  const goToNextStage = usePipelineStore((s) => s.goToNextStage);
  const goToPrevStage = usePipelineStore((s) => s.goToPrevStage);
  const reset = usePipelineStore((s) => s.reset);
  const rerunTour = usePipelineStore((s) => s.rerunTour);
  const viewMode = usePipelineStore((s) => s.viewMode);
  const ragEnabled = usePipelineStore((s) => s.ragEnabled);
  const { isBeginner } = useLearningDepth();
  const { minimizeChrome } = useSceneComposition();

  const stages = getActiveStages(ragEnabled);
  const idx = stages.indexOf(currentStage);
  const label =
    viewMode === "beginner"
      ? STAGE_META[currentStage].simpleLabel
      : STAGE_META[currentStage].label;

  const handleExit = () => {
    reset();
    onExit();
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    menuRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const dwelling = stageProgress >= 100 && !generationComplete && !isPaused;

  return (
    <>
      {isPaused && !generationComplete && (
        <p
          className="pointer-events-none fixed left-1/2 top-4 z-30 -translate-x-1/2 rounded-full border border-[var(--panel-border)] bg-[var(--deep)]/90 px-4 py-1.5 text-xs text-[var(--muted)] backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          Paused — press Space to continue
        </p>
      )}
      {dwelling && (
        <p
          className="pointer-events-none fixed left-1/2 top-4 z-30 -translate-x-1/2 rounded-full border border-[var(--panel-border)] bg-[var(--deep)]/90 px-4 py-1.5 text-xs text-[var(--muted)] backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          Take a moment — next chapter shortly
        </p>
      )}
      <div
        className={cn(
          "scene-chrome pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 bg-gradient-to-t from-[var(--void)] via-[var(--void)]/75 to-transparent px-4 pb-4",
          minimizeChrome ? "pt-6" : "gap-3 pb-6 pt-12"
        )}
        data-chrome-mode={minimizeChrome ? "minimal" : "standard"}
      >
        {!minimizeChrome && (
          <div className="pointer-events-auto w-full max-w-lg">
            <SceneProgress />
          </div>
        )}

        <div
          className={cn(
            "pointer-events-auto flex w-full items-center justify-between gap-2 rounded-2xl border border-[var(--panel-border)] bg-[var(--deep)]/80 px-3 backdrop-blur-md",
            minimizeChrome ? "max-w-md py-1.5" : "max-w-lg py-2"
          )}
        >
          <button
            type="button"
            onClick={goToPrevStage}
            disabled={idx <= 0}
            className="rounded-xl p-2.5 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)] disabled:opacity-30"
            aria-label="Previous chapter"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={togglePause}
            disabled={generationComplete}
            className="rounded-xl p-2.5 text-[var(--accent)] hover:bg-[var(--accent-glow)]"
            aria-label={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </button>

          <div className="min-w-0 flex-1 px-1 text-center">
            <p className="truncate text-xs text-[var(--muted)]">
              {isBeginner ? "Now" : "Chapter"}
            </p>
            <p className="truncate text-sm font-medium text-[var(--text)]">{label}</p>
            {!generationComplete && (
              <p className="text-[10px] text-[var(--muted)]">{Math.round(stageProgress)}%</p>
            )}
          </div>

          <button
            type="button"
            onClick={goToNextStage}
            disabled={generationComplete}
            className="rounded-xl p-2.5 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)] disabled:opacity-30"
            aria-label="Next chapter"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-xl p-2.5 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setMenuOpen(false)}
            role="presentation"
          >
            <motion.div
              ref={menuRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="journey-menu-title"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              className="museum-card-elevated w-full max-w-sm p-6 outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <p id="journey-menu-title" className="font-medium text-[var(--text)]">
                  Journey menu
                </p>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg p-1 text-[var(--muted)] hover:text-[var(--text)]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs text-[var(--muted)]">Learning depth</p>
                  <ModeToggle />
                </div>
                <div className="flex gap-2">
                  <GlossaryDrawer />
                  <HelpDrawer />
                </div>
                {generationComplete && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      rerunTour();
                    }}
                    className="btn-ghost flex w-full items-center justify-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Watch again
                  </button>
                )}
                <button type="button" onClick={handleExit} className="btn-ghost w-full">
                  Leave journey
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
