"use client";

import { usePipelineStore } from "@/store/pipelineStore";
import type { PipelineStage } from "@/types/pipeline";

/** Narrow subscriptions for section components — reduces re-renders */
export function useStageSlice(stage: PipelineStage) {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const isActive = currentStage === stage;
  return { isActive, stageProgress, currentStage };
}
