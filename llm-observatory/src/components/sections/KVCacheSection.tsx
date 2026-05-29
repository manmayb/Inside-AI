"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { usePipelineStore } from "@/store/pipelineStore";
import { formatBytes } from "@/lib/utils";

export function KVCacheSection() {
  const kvCache = usePipelineStore((s) => s.kvCache);
  const totalBytes = kvCache.reduce((a, e) => a + e.bytes, 0);
  const reused = kvCache.filter((e) => e.reused).length;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-white">KV Cache</h2>
        <p className="mt-1 text-sm text-slate-500">Cached keys/values · O(n) → O(1) per new token</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Cache entries" value={String(kvCache.length)} />
        <MetricCard label="Reused layers" value={String(reused)} />
        <MetricCard label="Memory" value={formatBytes(totalBytes)} />
      </div>

      <GlassPanel title="Cache tensor map" glow="emerald">
        <div className="grid max-h-64 gap-1 overflow-y-auto md:grid-cols-4">
          {kvCache.map((e, i) => (
            <div
              key={i}
              className={`rounded border p-2 font-mono text-[9px] ${
                e.reused
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-white/5 bg-black/30 text-slate-500"
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
    </div>
  );
}
