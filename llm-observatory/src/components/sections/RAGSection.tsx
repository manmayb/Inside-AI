"use client";

import { motion } from "framer-motion";
import { Database, Search } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StageLayout } from "@/components/ui/StageLayout";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";
import { usePipelineStore } from "@/store/pipelineStore";

export function RAGSection() {
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const { motionEnabled, repeat } = useMotionPreferences();

  const chunks = [
    { id: "doc_42", score: 0.94, text: "Qubits exploit superposition and entanglement…" },
    { id: "doc_17", score: 0.87, text: "Classical bits are 0 or 1; quantum gates rotate amplitudes…" },
    { id: "doc_91", score: 0.81, text: "Shor's algorithm factors integers exponentially faster…" },
  ];

  return (
    <StageLayout
      insight="The AI searches notes or documents first, then uses what it finds to answer more accurately."
      focal={
        <>
          <div className="flex items-center justify-center gap-8 py-2">
            <Search className="h-10 w-10 text-[var(--accent)]" aria-hidden />
            <motion.div
              className="h-1 w-24 rounded-full bg-[var(--gradient-brand)]"
              animate={motionEnabled ? { scaleX: [0.4, 1, 0.4] } : { scaleX: 1 }}
              transition={{ repeat, duration: 2 }}
            />
            <Database className="h-10 w-10 text-[var(--secondary)]" aria-hidden />
          </div>
          <GlassPanel title="Best matches" variant="hero" glow="secondary">
            {chunks.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: stageProgress > i * 30 ? 1 : 0.35, x: 0 }}
                className="mb-3 rounded-lg border border-[var(--panel-border)] p-3 last:mb-0"
              >
                <p className="text-xs font-medium text-[var(--accent)]">Match {i + 1}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{c.text}</p>
              </motion.div>
            ))}
          </GlassPanel>
        </>
      }
      curious={
        <>
          <StageSectionHeader stage="rag" icon={Search} />
          <GlassPanel title="Retrieved chunks" divider={false}>
            {chunks.map((c) => (
              <div
                key={c.id}
                className="mb-3 rounded-lg border border-[var(--panel-border)] p-3 font-mono text-xs last:mb-0"
              >
                <div className="flex justify-between text-[var(--muted)]">
                  <span>{c.id}</span>
                  <span className="text-[var(--accent)]">score={c.score}</span>
                </div>
                <p className="mt-2 text-sm text-[var(--text)]">{c.text}</p>
              </div>
            ))}
          </GlassPanel>
        </>
      }
    />
  );
}
