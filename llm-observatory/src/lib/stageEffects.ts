import type { PipelineStage } from "@/types/pipeline";

/** Side effects when entering a chapter — keeps runner + manual navigation in sync */
export function stageEnterPatches(
  stage: PipelineStage
): Record<string, unknown> | null {
  switch (stage) {
    case "streaming":
      return { streamedText: "" };
    case "autoregressive":
      return { isGenerating: true, arStep: 0 };
    default:
      return null;
  }
}
