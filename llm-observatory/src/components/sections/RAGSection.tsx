"use client";

import { motion } from "framer-motion";
import { Database, Search } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { usePipelineStore } from "@/store/pipelineStore";

export function RAGSection() {
  const ragEnabled = usePipelineStore((s) => s.ragEnabled);
  const stageProgress = usePipelineStore((s) => s.stageProgress);

  const chunks = [
    { id: "doc_42", score: 0.94, text: "Qubits exploit superposition and entanglement…" },
    { id: "doc_17", score: 0.87, text: "Classical bits are 0 or 1; quantum gates rotate amplitudes…" },
    { id: "doc_91", score: 0.81, text: "Shor's algorithm factors integers exponentially faster…" },
  ];

  if (!ragEnabled) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold text-white">RAG &amp; Tools</h2>
        <p className="mt-4 text-slate-500">
          RAG mode disabled. Enable on the home screen before submitting to visualize retrieval.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-white">RAG &amp; Tool Pipeline</h2>
        <p className="mt-1 text-sm text-slate-500">Vector search → chunk ranking → context injection</p>
      </header>

      <div className="flex items-center justify-center gap-8 py-8">
        <Search className="h-12 w-12 text-cyan-400" />
        <motion.div
          className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-violet-500"
          animate={{ scaleX: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <Database className="h-12 w-12 text-violet-400" />
      </div>

      <GlassPanel title="Retrieved chunks" glow="secondary">
        {chunks.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: stageProgress > i * 30 ? 1 : 0.2, x: 0 }}
            className="mb-3 rounded-lg border border-white/5 p-3 last:mb-0"
          >
            <div className="flex justify-between font-mono text-xs">
              <span className="text-violet-400">{c.id}</span>
              <span className="text-cyan-400">cos={c.score}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{c.text}</p>
          </motion.div>
        ))}
      </GlassPanel>
    </div>
  );
}
