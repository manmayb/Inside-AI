import type { InferenceConfig, PipelineMetrics } from "@/types/pipeline";
import { estimateFlops } from "./inference";

export function computeMetrics(
  config: InferenceConfig,
  promptTokens: number,
  outputTokens: number,
  latencyMs: number
): PipelineMetrics {
  const totalTokens = promptTokens + outputTokens;
  const flops = estimateFlops(config, promptTokens, outputTokens);
  const vramMb =
    (promptTokens * config.hiddenDim * config.layers * 2) / (1024 * 1024) + 4200;
  const attentionComplexity =
    config.layers * config.heads * promptTokens * promptTokens;

  return {
    totalTokens,
    promptTokens,
    outputTokens,
    latencyMs,
    estimatedFlops: flops,
    vramMb: Math.round(vramMb),
    throughputTokPerSec: totalTokens / (latencyMs / 1000),
    attentionComplexity,
    estimatedCostUsd: (flops / 1e12) * 0.00002,
    memoryMb: Math.round(vramMb * 1.2),
  };
}

export function formatFlops(n: number): string {
  if (n >= 1e15) return `${(n / 1e15).toFixed(2)} PFLOPs`;
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} TFLOPs`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} GFLOPs`;
  return `${(n / 1e6).toFixed(1)} MFLOPs`;
}
