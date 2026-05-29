"use client";

import { BarChart3, RotateCcw, Sparkles } from "lucide-react";
import { usePipelineStore } from "@/store/pipelineStore";

export function CompletionBanner() {
  const generationComplete = usePipelineStore((s) => s.generationComplete);
  const jumpToStage = usePipelineStore((s) => s.jumpToStage);
  const rerunTour = usePipelineStore((s) => s.rerunTour);
  const reset = usePipelineStore((s) => s.reset);

  if (!generationComplete) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--accent-dim)] bg-[var(--accent-glow)] px-4 py-3 md:px-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[var(--accent)]" />
        <p className="text-sm text-[var(--text)]">
          <span className="font-medium">You made it through the journey.</span>{" "}
          <span className="text-[var(--muted)]">Explore the summary or try another question.</span>
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => jumpToStage("analytics")}
          className="btn-ghost flex items-center gap-1.5"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          See summary
        </button>
        <button type="button" onClick={rerunTour} className="btn-ghost flex items-center gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          Watch again
        </button>
        <button type="button" onClick={reset} className="btn-primary text-sm !py-2 !px-4">
          New question
        </button>
      </div>
    </div>
  );
}
