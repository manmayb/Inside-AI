"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Server } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { StageLayout } from "@/components/ui/StageLayout";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";
import { usePipelineStore } from "@/store/pipelineStore";
import { estimateTokenCount } from "@/lib/tokenizer";
import { estimateFlops } from "@/lib/inference";

export function InputSection() {
  const prompt = usePipelineStore((s) => s.prompt);
  const networkLatencyMs = usePipelineStore((s) => s.networkLatencyMs);
  const packetSize = usePipelineStore((s) => s.packetSize);
  const config = usePipelineStore((s) => s.config);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const { motionEnabled, repeat } = useMotionPreferences();

  const estTokens = estimateTokenCount(prompt);
  const estFlops = estimateFlops(config, estTokens, 32);

  return (
    <StageLayout
      insight="Your words travel from you to the AI—like a thought leaving your mind and entering another."
      focal={
        <GlassPanel variant="hero" glow="accent" divider={false}>
          <div className="flex items-center justify-center gap-6 py-4">
            <motion.div
              animate={{ opacity: stageProgress > 20 ? 1 : 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <Globe className="h-10 w-10 text-[var(--accent)]" aria-hidden />
              <span className="text-xs text-[var(--muted)]">You</span>
            </motion.div>

            <motion.div
              animate={motionEnabled ? { x: [-12, 12] } : { x: 0 }}
              transition={{ duration: 1.5, repeat, repeatType: "reverse", ease: "easeInOut" }}
            >
              <ArrowRight className="h-6 w-6 text-[var(--accent)]" aria-hidden />
            </motion.div>

            <motion.div
              animate={{ opacity: stageProgress > 50 ? 1 : 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <Server className="h-10 w-10 text-[var(--secondary)]" aria-hidden />
              <span className="text-xs text-[var(--muted)]">AI mind</span>
            </motion.div>
          </div>
        </GlassPanel>
      }
      curious={
        <>
          <StageSectionHeader stage="input" icon={Globe} />
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Travel time" value={networkLatencyMs.toFixed(0)} unit="ms" />
            <MetricCard label="Message size" value={String(packetSize)} unit="bytes" />
          </div>
        </>
      }
      advanced={
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Est. tokens" value={String(estTokens)} />
            <MetricCard label="Est. FLOPs" value={(estFlops / 1e9).toFixed(1)} unit="GFLOP" />
          </div>
          <GlassPanel title="Request payload" glow="secondary" divider={false}>
            <pre className="overflow-x-auto font-mono text-xs text-[var(--muted)]">
              {JSON.stringify(
                {
                  model: "inside-ai-sim",
                  messages: [{ role: "user", content: prompt }],
                  stream: true,
                  max_tokens: 512,
                  temperature: config.temperature,
                },
                null,
                2
              )}
            </pre>
          </GlassPanel>
        </>
      }
    />
  );
}
