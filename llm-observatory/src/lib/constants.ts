import type { InferenceConfig, StageStatus } from "@/types/pipeline";
import { PIPELINE_STAGES } from "@/types/pipeline";

export const DEFAULT_CONFIG: InferenceConfig = {
  layers: 32,
  heads: 32,
  hiddenDim: 4096,
  vocabSize: 50257,
  contextWindow: 8192,
  temperature: 0.7,
  topK: 40,
  topP: 0.9,
  sampling: "top_p",
};

export const STAGE_META: Record<
  (typeof PIPELINE_STAGES)[number],
  { label: string; short: string; simpleLabel: string; durationMs: number }
> = {
  input: { label: "Request Pipeline", simpleLabel: "Receiving your words", short: "In", durationMs: 1200 },
  tokenization: { label: "Tokenization Engine", simpleLabel: "Breaking into pieces", short: "Split", durationMs: 1800 },
  embedding: { label: "Embedding Space", simpleLabel: "Finding meaning", short: "Mean", durationMs: 2000 },
  context: { label: "Context Assembly", simpleLabel: "Building memory", short: "Mem", durationMs: 1600 },
  transformer: { label: "Transformer Stack", simpleLabel: "Thinking deeper", short: "Think", durationMs: 2800 },
  attention: { label: "Self-Attention", simpleLabel: "What matters most", short: "Focus", durationMs: 2400 },
  gpu: { label: "GPU Tensor Ops", simpleLabel: "Fast parallel thought", short: "Speed", durationMs: 2000 },
  hidden: { label: "Hidden States", simpleLabel: "Ideas evolving", short: "Grow", durationMs: 1800 },
  logits: { label: "Logits & Sampling", simpleLabel: "Choosing next words", short: "Pick", durationMs: 2200 },
  autoregressive: { label: "Autoregressive Loop", simpleLabel: "Writing step by step", short: "Write", durationMs: 3200 },
  kvcache: { label: "KV Cache", simpleLabel: "Remembering past work", short: "Save", durationMs: 1600 },
  safety: { label: "Safety & Moderation", simpleLabel: "Checking safety", short: "Safe", durationMs: 1400 },
  rag: { label: "RAG & Tools", simpleLabel: "Looking things up", short: "Find", durationMs: 1800 },
  streaming: { label: "Response Streaming", simpleLabel: "Speaking back", short: "Say", durationMs: 2400 },
  analytics: { label: "Inference Analytics", simpleLabel: "Journey complete", short: "Done", durationMs: 1000 },
};

export function buildStageStatuses(
  current: (typeof PIPELINE_STAGES)[number],
  progress: number
): StageStatus[] {
  const idx = PIPELINE_STAGES.indexOf(current);
  return PIPELINE_STAGES.map((stage, i) => ({
    stage,
    label: STAGE_META[stage].label,
    short: STAGE_META[stage].short,
    progress: i === idx ? progress : i < idx ? 100 : 0,
    active: i === idx,
    complete: i < idx,
  }));
}

export const SYSTEM_PROMPT =
  "You are a helpful assistant. Answer concisely with technical accuracy.";

export const SAMPLE_MEMORY = [
  "User prefers simple explanations",
  "Previous topic: neural networks basics",
];
