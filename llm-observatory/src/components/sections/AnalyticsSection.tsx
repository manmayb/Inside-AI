"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // CHANGED: Imported motion hook
import { BarChart3, Check, Copy, Download, Sparkles } from "lucide-react";
import { formatFlops } from "@/lib/analytics";
import { MetricCard } from "@/components/ui/MetricCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StageLayout } from "@/components/ui/StageLayout";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { getActiveStages, usePipelineStore } from "@/store/pipelineStore";
import { getPreset } from "@/lib/modelPresets";

export function AnalyticsSection() {
  const metrics = usePipelineStore((s) => s.metrics);
  const prompt = usePipelineStore((s) => s.prompt);
  const modelPreset = usePipelineStore((s) => s.modelPreset);
  const ragEnabled = usePipelineStore((s) => s.ragEnabled);
  const [copied, setCopied] = useState(false);

  if (!metrics) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        <p className="text-sm text-[var(--muted)]">Wrapping up your journey…</p>
      </div>
    );
  }

  const chapterCount = getActiveStages(ragEnabled).length;
  const report = {
    prompt,
    model: getPreset(modelPreset).name,
    timestamp: new Date().toISOString(),
    metrics,
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inside-ai-journey-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyReport = async () => {
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <StageLayout
      insight="You followed a thought from your first words to a streamed reply—all simulated calmly in your browser."
      focal={
        <GlassPanel variant="hero" glow="accent" divider={false}>
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <Sparkles className="h-8 w-8 text-[var(--accent)]" aria-hidden />
            <p className="display-title text-2xl text-[var(--text)]">Journey complete</p>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
              {chapterCount} chapters · {metrics.promptTokens} words in · {metrics.outputTokens}{" "}
              words out · about {(metrics.latencyMs / 1000).toFixed(1)}s on this run
            </p>

            {/* Proportional token bar */}
            <div className="mt-4 w-full max-w-sm"> {/* CHANGED: Added proportional token bar under journey completion metric */}
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--elevated)]">
                <motion.div
                  className="h-full bg-[var(--accent)]"
                  style={{ width: `${(metrics.promptTokens / (metrics.promptTokens + metrics.outputTokens)) * 100}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="h-full bg-[var(--secondary)]"
                  style={{ width: `${(metrics.outputTokens / (metrics.promptTokens + metrics.outputTokens)) * 100}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  Prompt: {metrics.promptTokens}T
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary)]" />
                  Output: {metrics.outputTokens}T
                </span>
              </div>
            </div>
          </div>
        </GlassPanel>
      }
      curious={
        <>
          <StageSectionHeader stage="analytics" icon={BarChart3} />
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Total tokens" value={String(metrics.totalTokens)} highlight />
            <MetricCard label="Latency" value={metrics.latencyMs.toFixed(0)} unit="ms" />
            <MetricCard label="Throughput" value={metrics.throughputTokPerSec.toFixed(1)} unit="tok/s" />
            <MetricCard label="Memory" value={String(metrics.memoryMb)} unit="MB" />
          </div>
        </>
      }
      advanced={
        <>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={exportJson} className="btn-ghost flex items-center gap-2 text-xs">
              <Download className="h-3.5 w-3.5" />
              Export JSON
            </button>
            <button type="button" onClick={copyReport} className="btn-ghost flex items-center gap-2 text-xs">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy report"}
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="FLOPs" value={formatFlops(metrics.estimatedFlops)} />
            <MetricCard label="VRAM" value={String(metrics.vramMb)} unit="MB" />
            <MetricCard label="Attention ops" value={metrics.attentionComplexity.toExponential(2)} />
            <MetricCard label="Est. cost" value={`$${metrics.estimatedCostUsd.toFixed(4)}`} />
          </div>
          <GlassPanel title="Token breakdown" glow="secondary" variant="strong" divider={false}>
            <div className="flex flex-wrap justify-center gap-12">
              <div>
                <span className="text-[var(--muted)]">Prompt tokens</span>
                <p className="mt-1 text-3xl text-[var(--accent)]">{metrics.promptTokens}</p>
              </div>
              <div>
                <span className="text-[var(--muted)]">Generated</span>
                <p className="mt-1 text-3xl text-[var(--secondary)]">{metrics.outputTokens}</p>
              </div>
            </div>
          </GlassPanel>
        </>
      }
    />
  );
}
