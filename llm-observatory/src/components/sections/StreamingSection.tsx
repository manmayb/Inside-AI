"use client";

import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";

export function StreamingSection() {
  const streamedText = usePipelineStore((s) => s.streamedText);
  const stageProgress = usePipelineStore((s) => s.stageProgress);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <StageSectionHeader stage="streaming" icon={Radio} />

      <GlassPanel title="Live stream" glow="accent" variant="strong">
        <div className="mb-4 flex h-12 items-end justify-center gap-0.5">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-t bg-[var(--accent)]"
              animate={{
                height: [
                  4 + Math.random() * 8,
                  8 + Math.random() * 28,
                  4 + Math.random() * 12,
                ],
              }}
              transition={{
                duration: 0.8 + (i % 5) * 0.1,
                repeat: Infinity,
                delay: i * 0.03,
              }}
              style={{ opacity: streamedText ? 0.5 + (i / 32) * 0.5 : 0.15 }}
            />
          ))}
        </div>
        <div className="min-h-[120px] rounded-lg border border-white/5 bg-black/50 p-4 font-mono text-sm leading-relaxed text-slate-200">
          {streamedText || (
            <span className="text-slate-600">Awaiting first token from inference server…</span>
          )}
          <motion.span
            className="ml-0.5 inline-block h-4 w-0.5 bg-[var(--accent)]"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          />
        </div>
      </GlassPanel>

      <GlassPanel title="Latency timeline">
        <div className="space-y-3 font-mono text-[10px]">
          {[
            { label: "TTFB", ms: 120, at: 15 },
            { label: "First token", ms: 145, at: 25 },
            { label: "Stream chunk", ms: 18, at: 50 },
            { label: "Render frame", ms: 4, at: 80 },
          ].map((e) => (
            <div key={e.label} className="flex items-center gap-3">
              <span className="w-24 text-slate-500">{e.label}</span>
              <div className="relative h-2 flex-1 rounded-full bg-white/5">
                <motion.div
                  className="absolute h-full rounded-full"
                  style={{ background: "var(--gradient-brand)" }}
                  initial={{ width: 0 }}
                  animate={{ width: stageProgress > e.at ? `${Math.min(100, e.ms / 1.5)}%` : 0 }}
                />
              </div>
              <span className="w-12 text-right text-[var(--accent)]">{e.ms}ms</span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
