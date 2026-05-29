"use client";

import { Hash } from "lucide-react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SemanticToken } from "@/components/ui/SemanticToken";
import { SimpleInsight } from "@/components/ui/SimpleInsight";
import { LearningDetail } from "@/components/ui/LearningDetail";
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
    <>
      <SimpleInsight>
        The AI splits your sentence into small glowing pieces—each one a unit of meaning it can work with.
      </SimpleInsight>

      <LearningDetail>
        <StageSectionHeader stage="tokenization" icon={Hash} />
        <Equation
          beginner=""
          engineer="Byte-Pair Encoding turns text into subword tokens with stable IDs."
          research="BPE(S) = merge(rank_pairs); token_id ∈ V maps to embedding row E[id]"
        />
      </LearningDetail>

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

      <LearningDetail>
        <GlassPanel title="Your message" glow="accent">
          <p className="font-mono text-lg text-white">{prompt}</p>
        </GlassPanel>

        <div className="grid gap-4 md:grid-cols-2">
          <GlassPanel title="Number codes" glow="secondary">
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {tokens.map((t, i) => (
                <span
                  key={i}
                  className={cn(
                    "neural-frame px-2 py-1",
                    i === selectedTokenIndex ? "text-[var(--accent)]" : "text-[var(--muted)]"
                  )}
                >
                  {t.id}
                </span>
              ))}
            </div>
          </GlassPanel>

          {selected && (
            <GlassPanel title="Piece details">
              <dl className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <dt className="text-[var(--muted)]">text</dt>
                  <dd>&quot;{selected.text}&quot;</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--muted)]">id</dt>
                  <dd className="text-[var(--accent)]">{selected.id}</dd>
                </div>
              </dl>
            </GlassPanel>
          )}
        </div>
      </LearningDetail>
    </>
  );
}
