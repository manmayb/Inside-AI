import type { PipelineStage } from "@/types/pipeline";

export type SceneMode = "compact" | "cinematic";

export interface SceneComposition {
  /** compact = stacked narrative; cinematic = viewport-owned hero */
  mode: SceneMode;
  /** Target fraction of stage area for hero visualization (0–1) */
  viewportUsage: number;
  /** Slimmer bottom chrome on this chapter */
  minimizeChrome: boolean;
}

/** Per-chapter scene composition — source of truth for layout mode */
export const SCENE_COMPOSITION: Record<PipelineStage, SceneComposition> = {
  input: { mode: "compact", viewportUsage: 0.55, minimizeChrome: false },
  tokenization: { mode: "compact", viewportUsage: 0.7, minimizeChrome: false },
  embedding: { mode: "cinematic", viewportUsage: 0.95, minimizeChrome: true },
  context: { mode: "compact", viewportUsage: 0.75, minimizeChrome: false },
  transformer: { mode: "cinematic", viewportUsage: 1, minimizeChrome: true },
  attention: { mode: "cinematic", viewportUsage: 0.9, minimizeChrome: true },
  gpu: { mode: "cinematic", viewportUsage: 1, minimizeChrome: true },
  hidden: { mode: "cinematic", viewportUsage: 0.9, minimizeChrome: true },
  logits: { mode: "compact", viewportUsage: 0.8, minimizeChrome: false },
  autoregressive: { mode: "compact", viewportUsage: 0.75, minimizeChrome: false },
  kvcache: { mode: "compact", viewportUsage: 0.7, minimizeChrome: false },
  safety: { mode: "compact", viewportUsage: 0.65, minimizeChrome: false },
  rag: { mode: "compact", viewportUsage: 0.7, minimizeChrome: false },
  streaming: { mode: "cinematic", viewportUsage: 0.85, minimizeChrome: true },
  analytics: { mode: "compact", viewportUsage: 0.6, minimizeChrome: false },
};

export function getSceneComposition(stage: PipelineStage): SceneComposition {
  return SCENE_COMPOSITION[stage];
}

export function isCinematicStage(stage: PipelineStage): boolean {
  return SCENE_COMPOSITION[stage].mode === "cinematic";
}
