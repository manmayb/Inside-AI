import type { PipelineStage } from "@/types/pipeline";

export type BrainRegionId =
  | "ingress"
  | "language"
  | "memory"
  | "thought"
  | "choice"
  | "expression";

export interface BrainRegion {
  id: BrainRegionId;
  label: string;
  /** One-line answer: what is the AI doing? */
  doing: string;
  cx: number;
  cy: number;
}

/** Stylized regions in the artificial brain (SVG coords 0–400 × 0–280) */
export const BRAIN_REGIONS: Record<BrainRegionId, BrainRegion> = {
  ingress: {
    id: "ingress",
    label: "Receiving",
    doing: "Your words arrive—like a thought entering the mind.",
    cx: 200,
    cy: 42,
  },
  language: {
    id: "language",
    label: "Understanding words",
    doing: "The AI breaks your message into pieces it can reason about.",
    cx: 88,
    cy: 118,
  },
  memory: {
    id: "memory",
    label: "Memory & context",
    doing: "It gathers everything it should remember for this conversation.",
    cx: 72,
    cy: 210,
  },
  thought: {
    id: "thought",
    label: "Deep thinking",
    doing: "Connections fire across the network—meaning builds layer by layer.",
    cx: 200,
    cy: 148,
  },
  choice: {
    id: "choice",
    label: "Choosing words",
    doing: "The AI weighs possible next words and picks one path forward.",
    cx: 312,
    cy: 118,
  },
  expression: {
    id: "expression",
    label: "Speaking back",
    doing: "A reply takes shape and flows out to you, piece by piece.",
    cx: 328,
    cy: 210,
  },
};

/** Maps pipeline stages → brain region for continuous flow */
export const STAGE_BRAIN_REGION: Record<PipelineStage, BrainRegionId> = {
  input: "ingress",
  tokenization: "language",
  embedding: "language",
  context: "memory",
  transformer: "thought",
  attention: "thought",
  gpu: "thought",
  hidden: "thought",
  logits: "choice",
  autoregressive: "choice",
  kvcache: "memory",
  safety: "expression",
  rag: "memory",
  streaming: "expression",
  analytics: "expression",
};

export const REGION_PATHS: { from: BrainRegionId; to: BrainRegionId }[] = [
  { from: "ingress", to: "language" },
  { from: "language", to: "memory" },
  { from: "language", to: "thought" },
  { from: "memory", to: "thought" },
  { from: "thought", to: "choice" },
  { from: "choice", to: "expression" },
];

export function getRegionForStage(stage: PipelineStage): BrainRegion {
  const id = STAGE_BRAIN_REGION[stage];
  return BRAIN_REGIONS[id];
}
