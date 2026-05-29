import type { PipelineStage } from "@/types/pipeline";
import { PIPELINE_STAGES } from "@/types/pipeline";

export function globalProgress(stage: PipelineStage, stageProgress: number): number {
  const idx = PIPELINE_STAGES.indexOf(stage);
  const clamped = Math.max(0, Math.min(100, stageProgress));
  return ((idx + clamped / 100) / PIPELINE_STAGES.length) * 100;
}

export function fromGlobalProgress(global: number): {
  stage: PipelineStage;
  stageProgress: number;
} {
  const g = Math.max(0, Math.min(100, global));
  const stageFloat = (g / 100) * PIPELINE_STAGES.length;
  const idx = Math.min(Math.floor(stageFloat), PIPELINE_STAGES.length - 1);
  const stageProgress = Math.min(100, (stageFloat - idx) * 100);
  return { stage: PIPELINE_STAGES[idx], stageProgress };
}

export function formatGlobalProgress(global: number): string {
  const { stage, stageProgress } = fromGlobalProgress(global);
  return `${stage} · ${Math.round(stageProgress)}%`;
}
