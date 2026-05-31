"use client";

import { Hash } from "lucide-react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SemanticToken } from "@/components/ui/SemanticToken";
import { StageLayout } from "@/components/ui/StageLayout";
import { Equation } from "@/components/ui/Equation";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";
import { cn } from "@/lib/utils";

export function TokenizationSection() {
  const tokens = usePipelineStore((s) => s.tokens);
  const prompt = usePipelineStore((s) => s.prompt);
  const selectedTokenIndex = usePipelineStore((s) => s.selectedTokenIndex);
  const setSelectedTokenIndex = usePipelineStore((s) => s.setSelectedTokenIndex);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const selected = tokens[selectedTokenIndex];

  return (
    <StageLayout
      insight="The AI splits your sentence into small glowing pieces—each one a unit of meaning it can work with."
      focal={
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {tokens.map((t, i) => (
            <SemanticToken
              key={i}
              index={i}
              active={selectedTokenIndex === i}
              onClick={() => setSelectedTokenIndex(i)}
              style={{ opacity: stageProgress > (i / tokens.length) * 60 ? 1 : 0.35 }}
            >
              {t.text}
            </SemanticToken>
          ))}
        </motion.div>
      }
      curious={
        <>
          <StageSectionHeader stage="tokenization" icon={Hash} />
          <Equation
            beginner=""
            engineer="Byte-Pair Encoding turns text into subword tokens with stable IDs."
            research="BPE(S) = merge(rank_pairs); token_id ∈ V maps to embedding row E[id]"
          />
          <GlassPanel title="Your message" glow="accent" divider={false}>
            <p className="text-lg text-[var(--text)]">{prompt}</p>
          </GlassPanel>
          <div className="grid gap-4 md:grid-cols-2">
            <GlassPanel title="Number codes" glow="secondary" divider={false}>
              <div className="flex flex-wrap gap-2 text-xs">
                {tokens.map((t, i) => (
                  <span
                    key={i}
                    className={cn(
                      "rounded-full border border-[var(--panel-border)] bg-[var(--elevated)] px-2 py-1 font-mono",
                      i === selectedTokenIndex ? "text-[var(--accent)]" : "text-[var(--muted)]"
                    )}
                  >
                    {t.id}
                  </span>
                ))}
              </div>
            </GlassPanel>
            {selected && (
              <GlassPanel title="Piece details" divider={false}>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--muted)]">text</dt>
                    <dd>&quot;{selected.text}&quot;</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--muted)]">id</dt>
                    <dd className="text-[var(--accent)]">{selected.id}</dd>
                  </div>
                </dl>
              </GlassPanel>
            )}
          </div>
        </>
      }
    />
  );
}
