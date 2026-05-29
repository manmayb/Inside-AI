"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { usePipelineStore } from "@/store/pipelineStore";

export function AutoregressiveSection() {
  const generatedTokens = usePipelineStore((s) => s.generatedTokens);
  const arStep = usePipelineStore((s) => s.arStep);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const visibleCount = Math.floor((stageProgress / 100) * generatedTokens.length);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-white">Autoregressive Generation</h2>
        <p className="mt-1 text-sm text-slate-500">predict → append → recompute → repeat</p>
      </header>

      <GlassPanel title="Generation loop" glow="amber">
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
          {[
            { id: "forward-prefill", label: "Forward" },
            { id: "sample", label: "Sample" },
            { id: "append", label: "Append" },
            { id: "kv-update", label: "KV update" },
            { id: "forward-decode", label: "Forward" },
          ].map((step, i) => (
            <motion.div
              key={step.id}
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-amber-200"
              animate={{
                scale: arStep % 5 === i ? 1.05 : 1,
                borderColor: arStep % 5 === i ? "rgba(251,191,36,0.8)" : "rgba(251,191,36,0.2)",
              }}
            >
              {step.label}
              {i < 4 && <span className="ml-2 text-slate-600">→</span>}
            </motion.div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel title="Generated sequence (preview)">
        <div className="flex flex-wrap gap-1">
          {generatedTokens.slice(0, visibleCount).map((t, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded bg-cyan-500/10 px-1.5 py-0.5 font-mono text-sm text-cyan-200"
            >
              {t.text}
            </motion.span>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10px] text-slate-500">
          Step {arStep} · {visibleCount}/{generatedTokens.length} tokens materialized
        </p>
      </GlassPanel>
    </div>
  );
}
