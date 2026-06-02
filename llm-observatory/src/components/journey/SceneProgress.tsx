"use client";

import { getActiveStages, usePipelineStore } from "@/store/pipelineStore";

/** Minimal chapter dots — invisible until needed */
export function SceneProgress() {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const stageStatuses = usePipelineStore((s) => s.stageStatuses);
  const ragEnabled = usePipelineStore((s) => s.ragEnabled);
  const jumpToStage = usePipelineStore((s) => s.jumpToStage);
  const generationComplete = usePipelineStore((s) => s.generationComplete);

  const stages = getActiveStages(ragEnabled);

  return (
    <div
      className="pointer-events-auto flex items-center justify-center gap-1 px-4"
      role="tablist"
      aria-label="Chapter progress"
    >
      {stages.map((stage, i) => {
        const status = stageStatuses.find((s) => s.stage === stage);
        const canJump = status?.complete || status?.active || generationComplete;
        const isCurrent = stage === currentStage;

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
                : status?.complete
                  ? "h-1.5 w-1.5 bg-[var(--accent)]/50 hover:bg-[var(--accent)]"
                  : "h-1.5 w-1.5 bg-[var(--muted)]/25"
            } ${!canJump ? "cursor-default" : "cursor-pointer"}`}
          />
        );
      })}
    </div>
  );
}
