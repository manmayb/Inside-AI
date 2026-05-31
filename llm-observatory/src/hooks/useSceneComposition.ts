import { getSceneComposition } from "@/lib/sceneComposition";
import { usePipelineStore } from "@/store/pipelineStore";

export function useSceneComposition() {
  const currentStage = usePipelineStore((s) => s.currentStage);
  return getSceneComposition(currentStage);
}
