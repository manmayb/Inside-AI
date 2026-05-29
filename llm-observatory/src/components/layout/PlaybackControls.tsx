"use client";

import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  Pause,
  Play,
} from "lucide-react";
import { usePipelineStore } from "@/store/pipelineStore";
import { PIPELINE_STAGES } from "@/types/pipeline";
import { cn } from "@/lib/utils";

const SPEEDS = [0.5, 1, 1.5, 2];

export function PlaybackControls() {
  const isPaused = usePipelineStore((s) => s.isPaused);
  const playbackSpeed = usePipelineStore((s) => s.playbackSpeed);
  const generationComplete = usePipelineStore((s) => s.generationComplete);
  const currentStage = usePipelineStore((s) => s.currentStage);
  const togglePause = usePipelineStore((s) => s.togglePause);
  const setPlaybackSpeed = usePipelineStore((s) => s.setPlaybackSpeed);
  const goToNextStage = usePipelineStore((s) => s.goToNextStage);
  const goToPrevStage = usePipelineStore((s) => s.goToPrevStage);

  const stageIndex = PIPELINE_STAGES.indexOf(currentStage);
  const canGoBack = stageIndex > 0;
  const canGoForward = !generationComplete;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-1 rounded-xl bg-[var(--surface)] p-1">
        <button
          type="button"
          onClick={goToPrevStage}
          disabled={!canGoBack}
          title="Previous chapter"
          aria-label="Previous chapter"
          className="rounded-lg p-2.5 text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--text)] disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={togglePause}
          disabled={generationComplete}
          title={isPaused ? "Resume" : "Pause"}
          aria-label={isPaused ? "Resume" : "Pause"}
          className="rounded-lg p-2.5 text-[var(--accent)] transition hover:bg-[var(--accent-glow)]"
        >
          {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={goToNextStage}
          disabled={!canGoForward}
          title="Next chapter"
          aria-label="Next chapter"
          className="rounded-lg p-2.5 text-[var(--muted)] transition hover:bg-white/5 hover:text-[var(--text)] disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1" title="Playback speed">
        <Gauge className="h-3.5 w-3.5 text-[var(--muted)]" />
        {SPEEDS.map((speed) => (
          <button
            key={speed}
            type="button"
            onClick={() => setPlaybackSpeed(speed)}
            className={cn(
              "rounded-md px-2 py-1 text-xs transition",
              playbackSpeed === speed
                ? "bg-[var(--accent-glow)] font-medium text-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            )}
          >
            {speed}×
          </button>
        ))}
      </div>
    </div>
  );
}
