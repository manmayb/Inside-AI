"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { HelpDrawer } from "./HelpDrawer";
import { GlossaryDrawer } from "./GlossaryDrawer";
import { ThemePicker } from "./ThemePicker";
import { PipelineProgress } from "./PipelineProgress";
import { usePipelineStore } from "@/store/pipelineStore";
import { STAGE_META } from "@/lib/constants";

export function TopBar() {
  const active = usePipelineStore((s) => s.active);
  const currentStage = usePipelineStore((s) => s.currentStage);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const reset = usePipelineStore((s) => s.reset);
  const rerunTour = usePipelineStore((s) => s.rerunTour);
  const generationComplete = usePipelineStore((s) => s.generationComplete);
  const isPaused = usePipelineStore((s) => s.isPaused);
  const viewMode = usePipelineStore((s) => s.viewMode);

  const stageLabel =
    viewMode === "beginner"
      ? STAGE_META[currentStage].simpleLabel
      : STAGE_META[currentStage].label;

  return (
    <header className="relative shrink-0 border-b border-[var(--panel-border)] bg-void/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-glow)]">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-[var(--text)]">
              Inside AI
            </h1>
            <p className="truncate text-xs text-[var(--muted)]">
              {active ? "Interactive journey" : "Learn how models think"}
            </p>
          </div>
        </div>

        {active && (
          <div className="hidden min-w-0 flex-1 justify-center px-4 lg:flex">
            <PipelineProgress />
          </div>
        )}

        {active && (
          <div className="flex min-w-0 flex-1 flex-col items-end gap-0.5 lg:hidden">
            <span className="truncate text-sm font-medium text-[var(--text)]">
              {stageLabel}
            </span>
            <span className="text-xs text-[var(--muted)]">
              {isPaused ? "Paused" : `${Math.round(stageProgress)}%`}
            </span>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <ThemePicker />
          <GlossaryDrawer />
          <HelpDrawer />
          <ModeToggle />
          {active && generationComplete && (
            <button
              type="button"
              onClick={rerunTour}
              className="btn-ghost hidden sm:inline-flex"
            >
              Watch again
            </button>
          )}
          {active && (
            <button
              type="button"
              onClick={reset}
              className="btn-ghost flex items-center gap-1.5"
              aria-label="Exit journey"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          )}
        </div>
      </div>

      {active && (
        <div className="hidden border-t border-[var(--panel-border)] px-6 py-2 lg:block">
          <p className="text-sm text-[var(--muted)]">
            <span className="font-medium text-[var(--accent)]">{stageLabel}</span>
            {isPaused && !generationComplete && (
              <span className="ml-2 text-[var(--warm)]">· Paused</span>
            )}
          </p>
        </div>
      )}
    </header>
  );
}
