"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { StageLayout } from "@/components/ui/StageLayout";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";

export function ContextSection() {
  const contextBlocks = usePipelineStore((s) => s.contextBlocks);
  const config = usePipelineStore((s) => s.config);
  const stageProgress = usePipelineStore((s) => s.stageProgress);

  const usedTokens = contextBlocks.reduce((a, b) => a + b.tokens, 0);
  const saturation = (usedTokens / config.contextWindow) * 100;

  return (
    <StageLayout
      insight="The AI bundles instructions, past chat, and your question into one working memory."
      focal={
        <GlassPanel variant="hero" glow="accent" divider={false}>
          <div className="relative h-10 overflow-hidden rounded-lg bg-[var(--elevated)]">
            {contextBlocks.map((block, i) => {
              const width = (block.tokens / usedTokens) * 100;
              return (
                <motion.div
                  key={block.id}
                  className="absolute top-0 h-full border-r border-[var(--void)]/50"
                  style={{
                    left: `${contextBlocks.slice(0, i).reduce((a, b) => a + (b.tokens / usedTokens) * 100, 0)}%`,
                    width: `${width}%`,
                    backgroundColor: block.color + "55",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: stageProgress > 30 ? 1 : 0 }}
                  transition={{ delay: i * 0.1 }}
                />
              );
            })}
          </div>
          <div className="mt-4 space-y-2">
            {contextBlocks.map((block) => (
              <div
                key={block.id}
                className="flex items-start gap-3 rounded-lg border border-[var(--panel-border)] p-3"
                style={{ borderLeftColor: block.color, borderLeftWidth: 3 }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--accent)]">{block.label}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{block.content}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      }
      curious={
        <>
          <StageSectionHeader stage="context" icon={BookOpen} />
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="Context budget" value={String(config.contextWindow)} unit="tokens" />
            <MetricCard label="Used" value={String(usedTokens)} unit="tokens" />
            <MetricCard label="Saturation" value={saturation.toFixed(1)} unit="%" />
          </div>
        </>
      }
    />
  );
}
