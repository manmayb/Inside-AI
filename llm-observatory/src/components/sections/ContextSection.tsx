"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { usePipelineStore } from "@/store/pipelineStore";

export function ContextSection() {
  const contextBlocks = usePipelineStore((s) => s.contextBlocks);
  const config = usePipelineStore((s) => s.config);
  const stageProgress = usePipelineStore((s) => s.stageProgress);

  const usedTokens = contextBlocks.reduce((a, b) => a + b.tokens, 0);
  const saturation = (usedTokens / config.contextWindow) * 100;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-white">Context Window Assembly</h2>
        <p className="mt-1 text-sm text-slate-500">
          System · memory · history · user · RAG → unified sequence
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Context budget" value={String(config.contextWindow)} unit="tokens" />
        <MetricCard label="Used" value={String(usedTokens)} unit="tokens" />
        <MetricCard label="Saturation" value={saturation.toFixed(1)} unit="%" />
      </div>

      <GlassPanel title="Context compression" glow="accent">
        <div className="relative h-12 overflow-hidden rounded-lg bg-black/40">
          {contextBlocks.map((block, i) => {
            const width = (block.tokens / usedTokens) * 100;
            return (
              <motion.div
                key={block.id}
                className="absolute top-0 h-full border-r border-black/50"
                style={{
                  left: `${contextBlocks.slice(0, i).reduce((a, b) => a + (b.tokens / usedTokens) * 100, 0)}%`,
                  width: `${width}%`,
                  backgroundColor: block.color + "40",
                  borderColor: block.color,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: stageProgress > 30 ? 1 : 0 }}
                transition={{ delay: i * 0.1 }}
              />
            );
          })}
        </div>
        <div className="mt-4 grid gap-2">
          {contextBlocks.map((block) => (
            <div
              key={block.id}
              className="flex items-start gap-3 rounded-lg border border-white/5 p-3"
              style={{ borderLeftColor: block.color, borderLeftWidth: 3 }}
            >
              <div className="flex-1">
                <p className="font-mono text-xs text-slate-400">{block.label}</p>
                <p className="mt-1 text-sm text-slate-300 line-clamp-2">{block.content}</p>
              </div>
              <span className="font-mono text-xs text-cyan-400">{block.tokens} tok</span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
