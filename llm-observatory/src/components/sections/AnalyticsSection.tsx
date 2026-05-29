"use client";

import { useState } from "react";
import { BarChart3, Check, Copy, Download } from "lucide-react";
import { formatFlops } from "@/lib/analytics";
import { MetricCard } from "@/components/ui/MetricCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";
import { getPreset } from "@/lib/modelPresets";

export function AnalyticsSection() {
  const metrics = usePipelineStore((s) => s.metrics);
  const prompt = usePipelineStore((s) => s.prompt);
  const modelPreset = usePipelineStore((s) => s.modelPreset);
  const [copied, setCopied] = useState(false);

  if (!metrics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

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
    a.download = `inference-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyReport = async () => {
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <StageSectionHeader stage="analytics" icon={BarChart3}>
        <button
          type="button"
          onClick={exportJson}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--panel-border)] px-3 py-1.5 text-xs text-[var(--accent)] hover:bg-[var(--accent-glow)]"
        >
          <Download className="h-3.5 w-3.5" />
          Export JSON
        </button>
        <button
          type="button"
          onClick={copyReport}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </StageSectionHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total tokens" value={String(metrics.totalTokens)} highlight />
        <MetricCard label="Latency" value={metrics.latencyMs.toFixed(0)} unit="ms" />
        <MetricCard label="FLOPs" value={formatFlops(metrics.estimatedFlops)} />
        <MetricCard label="VRAM" value={String(metrics.vramMb)} unit="MB" />
        <MetricCard
          label="Throughput"
          value={metrics.throughputTokPerSec.toFixed(1)}
          unit="tok/s"
        />
        <MetricCard label="Attention ops" value={metrics.attentionComplexity.toExponential(2)} />
        <MetricCard label="Memory" value={String(metrics.memoryMb)} unit="MB" />
        <MetricCard label="Est. cost" value={`$${metrics.estimatedCostUsd.toFixed(4)}`} />
      </div>

      <GlassPanel title="Token breakdown" glow="secondary" variant="strong">
        <div className="flex flex-wrap gap-12 font-mono">
          <div>
            <span className="text-slate-500">Prompt tokens</span>
            <p className="mt-1 text-3xl text-[var(--accent)]">{metrics.promptTokens}</p>
          </div>
          <div>
            <span className="text-slate-500">Generated</span>
            <p className="mt-1 text-3xl text-violet-400">{metrics.outputTokens}</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
