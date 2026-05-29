"use client";

import { motion } from "framer-motion";

interface TensorGridProps {
  rows?: number;
  cols?: number;
  label?: string;
}

export function TensorGrid({ rows = 8, cols = 12, label = "GEMM" }: TensorGridProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/5 bg-black/60 p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-cyan-400/80">
        {label} · CUDA warp lanes
      </p>
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded-sm bg-gradient-to-br from-cyan-500/30 to-violet-500/20"
            animate={{
              opacity: [0.2, 0.9, 0.2],
              scale: [0.95, 1, 0.95],
            }}
            transition={{
              duration: 1.5 + (i % 5) * 0.1,
              repeat: Infinity,
              delay: (i % cols) * 0.05,
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[9px] text-slate-600">
        <span>block(16×16)</span>
        <span>shared mem 48KB</span>
        <span>tensor cores active</span>
      </div>
    </div>
  );
}
