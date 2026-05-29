"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { AttentionMatrix } from "@/types/pipeline";
import { getAttentionForToken } from "@/lib/inference";
import { NEURAL_TIMING } from "@/motion/neuralMotion";

interface AttentionArcsProps {
  matrix: AttentionMatrix;
  sourceIndex: number;
  compareIndex?: number | null;
  maxArcs?: number;
}

function AttentionArcsInner({
  matrix,
  sourceIndex,
  compareIndex = null,
  maxArcs = 8,
}: AttentionArcsProps) {
  const n = matrix.tokens.length;
  const width = Math.min(720, 48 * n + 80);
  const height = 200;
  const slot = (width - 60) / Math.max(n - 1, 1);

  const primaryFlows = useMemo(
    () =>
      getAttentionForToken(matrix, sourceIndex)
        .filter((f) => f.weight > 0.06)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, maxArcs),
    [matrix, sourceIndex, maxArcs]
  );

  const compareFlows = useMemo(
    () =>
      compareIndex !== null
        ? getAttentionForToken(matrix, compareIndex)
            .filter((f) => f.weight > 0.06)
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 5)
        : [],
    [matrix, compareIndex, maxArcs]
  );

  const xPos = (i: number) => 30 + i * slot;

  const arcPath = (from: number, to: number, lift: number) => {
    const x1 = xPos(from);
    const x2 = xPos(to);
    const y = height - 50;
    const midX = (x1 + x2) / 2;
    const midY = y - lift;
    return `M ${x1} ${y} Q ${midX} ${midY} ${x2} ${y}`;
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        width={width}
        height={height}
        className="mx-auto block"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <linearGradient id="beam-primary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="beam-compare" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {primaryFlows.map((f, i) => (
          <motion.path
            key={`p-${f.target}`}
            d={arcPath(sourceIndex, f.target, 40 + i * 12 + f.weight * 60)}
            fill="none"
            stroke="url(#beam-primary)"
            strokeWidth={1 + f.weight * 4}
            strokeLinecap="round"
            filter="url(#glow)"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: 0.5 + f.weight * 0.5 }}
            transition={{
              duration: NEURAL_TIMING.signalPulse,
              delay: i * 0.08,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 0.5,
            }}
          />
        ))}

        {compareIndex !== null &&
          compareFlows.map((f, i) => (
            <motion.path
              key={`c-${f.target}`}
              d={arcPath(compareIndex, f.target, 25 + i * 10)}
              fill="none"
              stroke="url(#beam-compare)"
              strokeWidth={1 + f.weight * 3}
              strokeDasharray="80"
              initial={{ strokeDashoffset: 80, opacity: 0 }}
              animate={{ strokeDashoffset: 0, opacity: 0.4 + f.weight * 0.4 }}
              transition={{
                duration: NEURAL_TIMING.tensorFlow,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}

        {matrix.tokens.map((tok, i) => {
          const isSource = i === sourceIndex;
          const isCompare = i === compareIndex;
          const isTarget = primaryFlows.some((f) => f.target === i);
          return (
            <g key={i} transform={`translate(${xPos(i)}, ${height - 42})`}>
              <motion.circle
                r={isSource ? 10 : isTarget ? 7 : 5}
                fill={isSource ? "var(--accent)" : isCompare ? "#a78bfa" : "rgba(15,23,42,0.9)"}
                stroke={isSource || isTarget ? "var(--accent)" : "rgba(255,255,255,0.15)"}
                strokeWidth={1.5}
                animate={
                  isSource
                    ? { scale: [1, 1.15, 1], opacity: [0.9, 1, 0.9] }
                    : isTarget
                      ? { opacity: [0.6, 1, 0.6] }
                      : {}
                }
                transition={{ duration: NEURAL_TIMING.signalPulse, repeat: Infinity }}
              />
              <text
                y={22}
                textAnchor="middle"
                fill={isSource ? "var(--accent)" : "#94a3b8"}
                fontSize={9}
                fontFamily="var(--font-plex-mono)"
              >
                {tok.slice(0, 8)}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-widest text-[var(--muted)]">
        Energetic routing · probability beams
      </p>
    </div>
  );
}

export const AttentionArcs = memo(AttentionArcsInner);
