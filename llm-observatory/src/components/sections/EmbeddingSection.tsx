"use client";

import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { EmbeddingSpace } from "@/components/viz/EmbeddingSpace";
import { CinematicScene } from "@/components/ui/CinematicScene";
import { Equation } from "@/components/ui/Equation";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";

const LatentSpaceR3F = dynamic(
  () => import("@/components/viz/LatentSpaceR3F").then((m) => m.LatentSpaceR3F),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[16/10] items-center justify-center text-sm text-[var(--muted)]">
        Loading space…
      </div>
    ),
  }
);

export function EmbeddingSection() {
  const embeddings = usePipelineStore((s) => s.embeddings);
  const selectedTokenIndex = usePipelineStore((s) => s.selectedTokenIndex);
  const setSelectedTokenIndex = usePipelineStore((s) => s.setSelectedTokenIndex);

  return (
    <CinematicScene
      hero={
        <EmbeddingSpace
          points={embeddings}
          selectedIndex={selectedTokenIndex}
          onSelect={setSelectedTokenIndex}
          cinematic
        />
      }
      curious={
        <>
          <StageSectionHeader stage="embedding" icon={Sparkles} />
          <Equation
            beginner=""
            engineer="h₀ = E[token_id] + positional_encoding(pos); E ∈ ℝ^{V×d}"
            research="Embedding lookup: h⁽⁰⁾ᵢ = W_E[xᵢ] + W_P[i]; semantic neighbors → low cosine distance"
          />
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--panel-border)]">
            <LatentSpaceR3F
              points={embeddings}
              selectedIndex={selectedTokenIndex}
              onSelect={setSelectedTokenIndex}
            />
          </div>
        </>
      }
    />
  );
}
