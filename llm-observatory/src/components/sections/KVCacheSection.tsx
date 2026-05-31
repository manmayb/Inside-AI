"use client";

import { Archive } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { StageLayout } from "@/components/ui/StageLayout";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";
import { formatBytes } from "@/lib/utils";

export function KVCacheSection() {
  const kvCache = usePipelineStore((s) => s.kvCache);
  const totalBytes = kvCache.reduce((a, e) => a + e.bytes, 0);
  const reused = kvCache.filter((e) => e.reused).length;
  const preview = kvCache.slice(0, 12);

  return (
    <StageLayout
      insight="The AI saves earlier work so it doesn't re-read the whole conversation every time."
      focal={
        <GlassPanel title="Saved work" subtitle="Green slots are reused on the next word" variant="hero" glow="accent">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {preview.map((e, i) => (
              <div
                key={i}
                className={`rounded-lg border p-3 text-center text-xs ${
                  e.reused
                    ? "border-[var(--accent-dim)] bg-[var(--accent-glow)] text-[var(--accent)]"
                    : "border-[var(--panel-border)] bg-[var(--elevated)] text-[var(--muted)]"
                }`}
              >
                <p className="font-medium">Layer {e.layer + 1}</p>
                <p className="mt-1 text-[10px] opacity-80">{e.reused ? "Reused" : "New"}</p>
              </div>
            ))}
          </div>
          {kvCache.length > preview.length && (
            <p className="mt-3 text-center text-xs text-[var(--muted)]">
              +{kvCache.length - preview.length} more slots in technical view
            </p>
          )}
        </GlassPanel>
      }
      curious={
        <>
          <StageSectionHeader stage="kvcache" icon={Archive} />
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="Cache entries" value={String(kvCache.length)} />
            <MetricCard label="Reused layers" value={String(reused)} />
            <MetricCard label="Memory" value={formatBytes(totalBytes)} />
          </div>
          <GlassPanel title="Cache tensor map" glow="secondary">
            <div className="grid max-h-64 gap-1 overflow-y-auto md:grid-cols-4">
              {kvCache.map((e, i) => (
                <div
                  key={i}
                  className={`rounded border p-2 font-mono text-[9px] ${
                    e.reused
                      ? "border-[var(--accent-dim)] bg-[var(--accent-glow)] text-[var(--accent)]"
                      : "border-[var(--panel-border)] bg-[var(--elevated)] text-[var(--muted)]"
                  }`}
                >
                  L{e.layer} H{e.head}
                  <br />
                  K/V {e.keyDim}d
                  <br />
                  {formatBytes(e.bytes)}
                </div>
              ))}
            </div>
          </GlassPanel>
        </>
      }
    />
  );
}
