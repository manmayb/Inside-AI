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
          <div className="flex h-36 w-full items-center justify-center py-2"> {/* CHANGED: Replaced icon trio with taller, custom SVG network diagram per audit finding */}
            <svg viewBox="0 0 400 120" className="h-full w-full max-w-lg">
              <defs>
                <linearGradient id="network-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--secondary)" stopOpacity="1" />
                </linearGradient>
              </defs>
              
              {/* Connecting paths */}
              <motion.path
                d="M 60 60 L 140 30 L 260 30 L 340 60 M 60 60 L 140 90 L 260 90 L 340 60 M 60 60 L 200 60 L 340 60"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={2}
              />
              
              {/* Animated signals */}
              {stageProgress > 20 && (
                <motion.path
                  d="M 60 60 L 140 30 L 260 30 L 340 60"
                  fill="none"
                  stroke="url(#network-flow)"
                  strokeWidth={2.5}
                  strokeDasharray="120"
                  initial={{ strokeDashoffset: 120 }}
                  animate={motionEnabled ? { strokeDashoffset: 0 } : { strokeDashoffset: 0 }}
                  transition={{ duration: 2, repeat, ease: "linear" }}
                />
              )}
              {stageProgress > 40 && (
                <motion.path
                  d="M 60 60 L 200 60 L 340 60"
                  fill="none"
                  stroke="url(#network-flow)"
                  strokeWidth={2.5}
                  strokeDasharray="140"
                  initial={{ strokeDashoffset: 140 }}
                  animate={motionEnabled ? { strokeDashoffset: 0 } : { strokeDashoffset: 0 }}
                  transition={{ duration: 1.6, repeat, ease: "linear", delay: 0.2 }}
                />
              )}

              {/* Node: You */}
              <g transform="translate(60, 60)">
                <circle r={18} fill="var(--panel)" stroke="var(--accent)" strokeWidth={1.5} />
                <Globe className="h-5 w-5 -translate-x-2.5 -translate-y-2.5 text-[var(--accent)]" />
                <text y={28} textAnchor="middle" fontSize={9} fill="var(--muted)" fontFamily="var(--font-dm-sans)">You</text>
              </g>

              {/* Node: Gateway Middle */}
              <g transform="translate(200, 60)">
                <circle r={10} fill="var(--panel)" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
                <circle r={3} fill={stageProgress > 30 ? "var(--accent)" : "rgba(255,255,255,0.2)"} />
                <text y={20} textAnchor="middle" fontSize={8} fill="var(--muted)" fontFamily="var(--font-dm-sans)">Node</text>
              </g>

              {/* Node: AI Mind */}
              <g transform="translate(340, 60)">
                <circle r={18} fill="var(--panel)" stroke="var(--secondary)" strokeWidth={1.5} />
                <Server className="h-5 w-5 -translate-x-2.5 -translate-y-2.5 text-[var(--secondary)]" />
                <text y={28} textAnchor="middle" fontSize={9} fill="var(--muted)" fontFamily="var(--font-dm-sans)">AI Mind</text>
              </g>
            </svg>
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
