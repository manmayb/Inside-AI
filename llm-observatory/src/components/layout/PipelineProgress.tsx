"use client";

import { usePipelineStore } from "@/store/pipelineStore";
import { PIPELINE_STAGES } from "@/types/pipeline";
import { useLearningDepth } from "@/hooks/useLearningDepth";

export function PipelineProgress() {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const generationComplete = usePipelineStore((s) => s.generationComplete);
  const { isBeginner } = useLearningDepth();

  const stageIndex = PIPELINE_STAGES.indexOf(currentStage);
  const overall = generationComplete
    ? 100
    : ((stageIndex + stageProgress / 100) / PIPELINE_STAGES.length) * 100;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-1.5 flex justify-between text-xs text-[var(--muted)]">
        <span>{isBeginner ? "Journey progress" : "Overall progress"}</span>
        <span className="font-medium text-[var(--accent)]">{Math.round(overall)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-700 ease-out"
          style={{ width: `${overall}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Chapter {stageIndex + 1} of {PIPELINE_STAGES.length}
      </p>
    </div>
  );
}
