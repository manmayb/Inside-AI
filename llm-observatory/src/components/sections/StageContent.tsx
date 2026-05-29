"use client";

import { usePipelineStore } from "@/store/pipelineStore";
import { InputSection } from "./InputSection";
import { TokenizationSection } from "./TokenizationSection";
import { EmbeddingSection } from "./EmbeddingSection";
import { ContextSection } from "./ContextSection";
import { TransformerSection } from "./TransformerSection";
import { AttentionSection } from "./AttentionSection";
import { GPUSection } from "./GPUSection";
import { HiddenSection } from "./HiddenSection";
import { LogitsSection } from "./LogitsSection";
import { AutoregressiveSection } from "./AutoregressiveSection";
import { KVCacheSection } from "./KVCacheSection";
import { SafetySection } from "./SafetySection";
import { RAGSection } from "./RAGSection";
import { StreamingSection } from "./StreamingSection";
import { AnalyticsSection } from "./AnalyticsSection";
import type { PipelineStage } from "@/types/pipeline";

const SECTIONS: Record<PipelineStage, React.ComponentType> = {
  input: InputSection,
  tokenization: TokenizationSection,
  embedding: EmbeddingSection,
  context: ContextSection,
  transformer: TransformerSection,
  attention: AttentionSection,
  gpu: GPUSection,
  hidden: HiddenSection,
  logits: LogitsSection,
  autoregressive: AutoregressiveSection,
  kvcache: KVCacheSection,
  safety: SafetySection,
  rag: RAGSection,
  streaming: StreamingSection,
  analytics: AnalyticsSection,
};

/** Stage visualization only — wrapped by ChapterScene in documentary mode */
export function StageSection() {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const Section = SECTIONS[currentStage];
  return <Section />;
}

/** @deprecated Use StageSection inside DocumentaryJourney / ChapterScene */
export function StageContent() {
  return <StageSection />;
}
