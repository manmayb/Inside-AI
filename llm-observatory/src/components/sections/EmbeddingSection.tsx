"use client";

import dynamic from "next/dynamic";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Equation } from "@/components/ui/Equation";
import { usePipelineStore } from "@/store/pipelineStore";

const LatentSpaceR3F = dynamic(
  () => import("@/components/viz/LatentSpaceR3F").then((m) => m.LatentSpaceR3F),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-white/5 bg-black/40 font-mono text-xs text-slate-600">
        Loading latent space…
      </div>
    ),
  }
);

export function EmbeddingSection() {
  const embeddings = usePipelineStore((s) => s.embeddings);
  const selectedTokenIndex = usePipelineStore((s) => s.selectedTokenIndex);
  const setSelectedTokenIndex = usePipelineStore((s) => s.setSelectedTokenIndex);
  const config = usePipelineStore((s) => s.config);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-white">Embedding Space</h2>
        <p className="mt-1 text-sm text-slate-500">
          {`Tokens → dense vectors in ℝ^${config.hiddenDim}`}
        </p>
      </header>

      <Equation
        beginner="Each token becomes a list of numbers capturing its meaning."
        engineer="h₀ = E[token_id] + positional_encoding(pos); E ∈ ℝ^{V×d}"
        research="Embedding lookup: h⁽⁰⁾ᵢ = W_E[xᵢ] + W_P[i]; semantic neighbors → low cosine distance"
      />

      <GlassPanel title="3D latent explorer" subtitle="Orbit · click tokens · similarity links">
        <LatentSpaceR3F
          points={embeddings}
          selectedIndex={selectedTokenIndex}
          onSelect={setSelectedTokenIndex}
        />
      </GlassPanel>
    </div>
  );
}
