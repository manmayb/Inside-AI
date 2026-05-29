"use client";

import { usePipelineStore } from "@/store/pipelineStore";
import { PIPELINE_STAGES } from "@/types/pipeline";

/** Minimal chapter dots — invisible until needed */
export function SceneProgress() {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const stageStatuses = usePipelineStore((s) => s.stageStatuses);
  const jumpToStage = usePipelineStore((s) => s.jumpToStage);
  const generationComplete = usePipelineStore((s) => s.generationComplete);

  const currentIndex = PIPELINE_STAGES.indexOf(currentStage);

  return (
    <div
      className="pointer-events-auto flex items-center justify-center gap-1 px-4"
      role="tablist"
      aria-label="Chapter progress"
    >
      {PIPELINE_STAGES.map((stage, i) => {
        const status = stageStatuses[i];
        const canJump = status.complete || status.active || generationComplete;
        const isCurrent = i === currentIndex;

        return (
          <button
            key={stage}
            type="button"
            disabled={!canJump}
            onClick={() => canJump && jumpToStage(stage)}
            title={canJump ? `Chapter ${i + 1}` : undefined}
            aria-label={`Chapter ${i + 1}`}
            aria-current={isCurrent ? "step" : undefined}
            className={`rounded-full transition-all ${
              isCurrent
                ? "h-2 w-6 bg-[var(--accent)]"
                : status.complete
                  ? "h-1.5 w-1.5 bg-[var(--accent)]/50 hover:bg-[var(--accent)]"
                  : "h-1.5 w-1.5 bg-[var(--muted)]/25"
            } ${!canJump ? "cursor-default" : "cursor-pointer"}`}
          />
        );
      })}
    </div>
  );
}
