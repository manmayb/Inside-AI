"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { NEURAL_TIMING } from "@/motion/neuralMotion";

interface ComputeChamberProps {
  stageProgress: number;
  gpuCount?: number;
}

function ComputeChamberInner({ stageProgress, gpuCount = 8 }: ComputeChamberProps) {
  const phase = stageProgress / 100;

  return (
    <div className="relative min-h-[220px] overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--accent-glow) 0px, transparent 1px, transparent 24px)",
        }}
      />

      <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: gpuCount }).map((_, i) => {
          const load = 50 + ((stageProgress + i * 11) % 100) * 0.45;
          const corridor = i % 2 === 0;

          return (
            <motion.div
              key={i}
              className="relative overflow-hidden neural-frame p-3"
              animate={{
                boxShadow:
                  load > 70
                    ? ["0 0 20px var(--accent-glow)", "0 0 40px var(--accent-glow)", "0 0 20px var(--accent-glow)"]
                    : "0 0 10px rgba(0,0,0,0.3)",
              }}
              transition={{ duration: NEURAL_TIMING.signalPulse, repeat: Infinity, delay: i * 0.15 }}
            >
              <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-wider text-[var(--accent)]">
                <span>{corridor ? "GEMM" : "Tensor"} {i}</span>
                <span className="text-[var(--muted)]">{load.toFixed(0)}%</span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-0.5">
                {Array.from({ length: 8 }).map((_, c) => (
                  <motion.div
                    key={c}
                    className="aspect-square rounded-sm"
                    style={{
                      background: `rgba(0, 229, 196, ${0.1 + ((c + i + phase * 10) % 8) * 0.08})`,
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: (c + i) * 0.05,
                    }}
                  />
                ))}
              </div>

              <motion.div
                className="mt-2 h-0.5 rounded-full bg-[var(--accent)]"
                animate={{ width: [`${load * 0.6}%`, `${load}%`, `${load * 0.8}%`] }}
                transition={{ duration: NEURAL_TIMING.tensorFlow, repeat: Infinity }}
              />
            </motion.div>
          );
        })}
      </div>

      <p className="relative mt-4 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--muted)]">
        Parallel processing corridors · inferencing reactors
      </p>
    </div>
  );
}

export const ComputeChamber = memo(ComputeChamberInner);
