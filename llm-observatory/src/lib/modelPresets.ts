import type { InferenceConfig } from "@/types/pipeline";
import { DEFAULT_CONFIG } from "./constants";

export type ModelPresetId = "compact" | "standard" | "frontier";

export interface ModelPreset {
  id: ModelPresetId;
  name: string;
  tagline: string;
  config: InferenceConfig;
}

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: "compact",
    name: "Compact-7B",
    tagline: "Fast · edge deployment",
    config: {
      ...DEFAULT_CONFIG,
      layers: 32,
      heads: 32,
      hiddenDim: 4096,
      contextWindow: 4096,
    },
  },
  {
    id: "standard",
    name: "Standard-32B",
    tagline: "Balanced production",
    config: { ...DEFAULT_CONFIG },
  },
  {
    id: "frontier",
    name: "Frontier-70B",
    tagline: "Max capability · high VRAM",
    config: {
      ...DEFAULT_CONFIG,
      layers: 80,
      heads: 64,
      hiddenDim: 8192,
      contextWindow: 128000,
    },
  },
];

export function getPreset(id: ModelPresetId): ModelPreset {
  return MODEL_PRESETS.find((p) => p.id === id) ?? MODEL_PRESETS[1];
}
