import { usePipelineStore } from "@/store/pipelineStore";
import type { ViewMode } from "@/types/pipeline";

export interface LearningDepth {
  mode: ViewMode;
  isBeginner: boolean;
  isCurious: boolean;
  isAdvanced: boolean;
  /** Show equations, tensors, heatmaps, metrics */
  showTechnical: boolean;
  /** Show secondary metrics and JSON */
  showMetrics: boolean;
  /** Compact stage panels */
  calmLayout: boolean;
}

export function useLearningDepth(): LearningDepth {
  const mode = usePipelineStore((s) => s.viewMode);
  const isBeginner = mode === "beginner";
  const isCurious = mode === "engineer";
  const isAdvanced = mode === "research";

  return {
    mode,
    isBeginner,
    isCurious,
    isAdvanced,
    showTechnical: isCurious || isAdvanced,
    showMetrics: isAdvanced,
    calmLayout: isBeginner,
  };
}
