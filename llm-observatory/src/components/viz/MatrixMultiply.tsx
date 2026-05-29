"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { multiplyVisual, seededMatrix } from "@/lib/tensorAnim";
import { NEURAL_TIMING } from "@/motion/neuralMotion";

interface MatrixMultiplyProps {
  label: string;
  rows?: number;
  cols?: number;
  inner?: number;
  seed?: number;
  phase: number;
}

function MatrixMultiplyInner({
  label,
  rows = 4,
  cols = 4,
  inner = 4,
  seed = 42,
  phase,
}: MatrixMultiplyProps) {
  const a = useMemo(() => seededMatrix(rows, inner, seed), [rows, inner, seed]);
  const b = useMemo(() => seededMatrix(inner, cols, seed + 7), [inner, cols, seed]);
  const { result, highlight } = useMemo(
    () => multiplyVisual(a, b, phase),
    [a, b, phase]
  );

  const highlightSet = useMemo(
    () => new Set(highlight.map(([i, k, j]) => `${i}-${k}-${j}`)),
    [highlight]
  );

  const renderMatrix = (data: number[][], title: string, active?: boolean) => (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--muted)]">
        {title}
      </span>
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${data[0]?.length ?? 0}, minmax(0, 1fr))` }}
      >
        {data.flatMap((row, i) =>
          row.map((v, j) => (
            <div
              key={`${title}-${i}-${j}`}
              className="flex h-5 w-5 items-center justify-center rounded-sm font-mono text-[7px]"
              style={{
                background: active
                  ? `color-mix(in srgb, var(--accent) ${25 + Math.abs(v) * 50}%, transparent)`
                  : `color-mix(in srgb, var(--secondary) ${15 + Math.abs(v) * 35}%, transparent)`,
                color: Math.abs(v) > 0.5 ? "var(--accent)" : "var(--muted)",
                boxShadow: highlightSet.has(`${i}-0-${j}`) && active ? "0 0 8px var(--accent)" : undefined,
              }}
            >
              {v.toFixed(1)}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="neural-frame p-5">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
        {label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {renderMatrix(a, "A")}
        <motion.span
          className="font-mono text-xl text-[var(--accent)]"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: NEURAL_TIMING.signalPulse, repeat: Infinity }}
        >
          ⊗
        </motion.span>
        {renderMatrix(b, "B")}
        <span className="font-mono text-lg text-[var(--muted)]">⇒</span>
        {renderMatrix(result, "C", true)}
      </div>
      <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-widest text-[var(--muted)]">
        Warp phase {Math.floor(phase * 100) % 100}
      </p>
    </div>
  );
}

export const MatrixMultiply = memo(MatrixMultiplyInner);
