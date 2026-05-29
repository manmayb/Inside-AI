"use client";

import { motion } from "framer-motion";
import type { LogitCandidate } from "@/types/pipeline";

interface LogitBarsProps {
  candidates: LogitCandidate[];
  highlightTop?: number;
  animateKey?: string | number;
}

export function LogitBars({ candidates, highlightTop = 8, animateKey }: LogitBarsProps) {
  const top = candidates.slice(0, highlightTop);
  const maxP = top[0]?.probability ?? 1;

  return (
    <div className="space-y-2" key={animateKey}>
      {top.map((c, i) => (
        <div key={`${c.id}-${i}`} className="group">
          <div className="mb-0.5 flex justify-between font-mono text-[10px]">
            <span className="text-slate-300">
              {i + 1}. &quot;{c.token.trim()}&quot;
            </span>
            <span className="text-cyan-400">{(c.probability * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${(c.probability / maxP) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            />
          </div>
          <p className="mt-0.5 font-mono text-[9px] text-slate-600">
            logit {c.logit.toFixed(2)} · id {c.id}
          </p>
        </div>
      ))}
    </div>
  );
}
