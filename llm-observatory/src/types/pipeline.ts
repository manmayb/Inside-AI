export const PIPELINE_STAGES = [
  "input",
  "tokenization",
  "embedding",
  "context",
  "transformer",
  "attention",
  "gpu",
  "hidden",
  "logits",
  "autoregressive",
  "kvcache",
  "safety",
  "rag",
  "streaming",
  "analytics",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export type ViewMode = "beginner" | "engineer" | "research";

export type ThemeAccent = "teal" | "violet" | "amber";

export type SamplingMethod = "greedy" | "top_k" | "top_p";

export interface TourKeyframe {
  id: number;
  globalProgress: number;
  stage: PipelineStage;
  stageProgress: number;
  timestamp: number;
}

export interface TokenUnit {
  text: string;
  id: number;
  byteLength: number;
  frequency: number;
  mergeRank?: number;
}

export interface EmbeddingPoint {
  tokenIndex: number;
  text: string;
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

export interface ContextBlock {
  id: string;
  label: string;
  type: "system" | "user" | "memory" | "rag" | "history";
  tokens: number;
  content: string;
  color: string;
}

export interface AttentionMatrix {
  tokens: string[];
  weights: number[][];
  heads: number;
}

export interface LogitCandidate {
  token: string;
  id: number;
  logit: number;
  probability: number;
}

export interface KVCacheEntry {
  layer: number;
  head: number;
  keyDim: number;
  valueDim: number;
  reused: boolean;
  bytes: number;
}

export interface GeneratedToken {
  text: string;
  id: number;
  probability: number;
  step: number;
}

export interface PipelineMetrics {
  totalTokens: number;
  promptTokens: number;
  outputTokens: number;
  latencyMs: number;
  estimatedFlops: number;
  vramMb: number;
  throughputTokPerSec: number;
  attentionComplexity: number;
  estimatedCostUsd: number;
  memoryMb: number;
}

export interface InferenceConfig {
  layers: number;
  heads: number;
  hiddenDim: number;
  vocabSize: number;
  contextWindow: number;
  temperature: number;
  topK: number;
  topP: number;
  sampling: SamplingMethod;
}

export interface StageStatus {
  stage: PipelineStage;
  label: string;
  short: string;
  progress: number;
  active: boolean;
  complete: boolean;
}

/** Per-token hidden-state slice for visualization (layer × magnitude) */
export interface HiddenStateSlice {
  tokenIndex: number;
  text: string;
  layerMagnitudes: number[];
}
