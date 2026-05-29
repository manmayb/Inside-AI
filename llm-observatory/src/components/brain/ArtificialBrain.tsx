"use client";

import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePipelineStore } from "@/store/pipelineStore";
import {
  BRAIN_REGIONS,
  REGION_PATHS,
  STAGE_BRAIN_REGION,
  type BrainRegionId,
} from "@/lib/brainRegions";
import { getStageTip } from "@/lib/stageTips";
import { NEURAL_TIMING } from "@/motion/neuralMotion";

const REGION_ORDER: BrainRegionId[] = [
  "ingress",
  "language",
  "memory",
  "thought",
  "choice",
  "expression",
];

function pathD(from: BrainRegionId, to: BrainRegionId) {
  const a = BRAIN_REGIONS[from];
  const b = BRAIN_REGIONS[to];
  const mx = (a.cx + b.cx) / 2;
  const my = (a.cy + b.cy) / 2 - 16;
  return `M ${a.cx} ${a.cy} Q ${mx} ${my} ${b.cx} ${b.cy}`;
}

function ArtificialBrainInner() {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const viewMode = usePipelineStore((s) => s.viewMode);
  const prompt = usePipelineStore((s) => s.prompt);
  const tokens = usePipelineStore((s) => s.tokens);

  const activeId = STAGE_BRAIN_REGION[currentStage];
  const active = BRAIN_REGIONS[activeId];
  const tip = getStageTip(currentStage, viewMode);
  const pulse = stageProgress / 100;
  const activeIdx = REGION_ORDER.indexOf(activeId);

  const litPaths = useMemo(() => {
    return REGION_PATHS.filter(({ to }) => REGION_ORDER.indexOf(to) <= activeIdx + 1);
  }, [activeIdx]);

  return (
    <div className="relative mx-auto w-full max-w-2xl px-2">
      <p className="mb-4 text-center text-sm text-[var(--muted)]">
        Where your thought is right now
      </p>

      <svg
        viewBox="0 0 400 240"
        className="mx-auto block w-full max-h-[min(36vh,280px)]"
        role="img"
        aria-label="Conceptual map of where the AI is in its thinking process"
      >
        <defs>
          <radialGradient id="region-active" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="200" cy="120" rx="150" ry="88" fill="var(--accent-glow)" opacity="0.2" />

        {REGION_PATHS.map(({ from, to }) => {
          const lit = litPaths.some((p) => p.from === from && p.to === to);
          return (
            <path
              key={`${from}-${to}`}
              d={pathD(from, to)}
              fill="none"
              stroke={lit ? "var(--accent)" : "rgba(255,255,255,0.08)"}
              strokeWidth={lit ? 2 : 1}
              opacity={lit ? 0.4 + pulse * 0.3 : 0.25}
            />
          );
        })}

        {litPaths.map(({ from, to }) => (
          <motion.path
            key={`pulse-${from}-${to}`}
            d={pathD(from, to)}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="4 12"
            animate={{ strokeDashoffset: [0, -32] }}
            transition={{
              duration: NEURAL_TIMING.signalPulse,
              repeat: Infinity,
              ease: "linear",
            }}
            opacity={0.5}
          />
        ))}

        {REGION_ORDER.map((regionId) => {
          const region = BRAIN_REGIONS[regionId];
          const isActive = regionId === activeId;
          const isPast = REGION_ORDER.indexOf(regionId) <= activeIdx;
          const r = isActive ? 28 : 22;

          return (
            <g key={regionId}>
              {isActive && (
                <circle
                  cx={region.cx}
                  cy={region.cy}
                  r={r + 8}
                  fill="url(#region-active)"
                />
              )}
              <motion.circle
                cx={region.cx}
                cy={region.cy}
                r={r}
                fill={isActive ? "var(--accent)" : isPast ? "var(--elevated)" : "var(--surface)"}
                stroke={isActive ? "var(--accent)" : isPast ? "var(--accent-dim)" : "rgba(255,255,255,0.1)"}
                strokeWidth={isActive ? 2 : 1}
                animate={isActive ? { scale: [1, 1.04, 1] } : undefined}
                transition={{
                  duration: NEURAL_TIMING.signalPulse,
                  repeat: isActive ? Infinity : 0,
                }}
              />
              <text
                x={region.cx}
                y={region.cy + 4}
                textAnchor="middle"
                fill={isActive ? "var(--void)" : isPast ? "var(--text)" : "var(--muted)"}
                fontSize={isActive ? 11 : 10}
                fontWeight={isActive ? 600 : 400}
                fontFamily="var(--font-dm-sans)"
              >
                {region.label.split(/\s/)[0]}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex flex-wrap justify-center gap-2 px-2">
        {REGION_ORDER.map((regionId) => {
          const region = BRAIN_REGIONS[regionId];
          const isActive = regionId === activeId;
          return (
            <span
              key={`chip-${regionId}`}
              className={`rounded-full px-2.5 py-0.5 text-xs transition-colors ${
                isActive
                  ? "bg-[var(--accent-glow)] font-medium text-[var(--accent)]"
                  : "text-[var(--muted)]"
              }`}
            >
              {region.label}
            </span>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage + viewMode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="display-title text-xl text-[var(--text)] md:text-2xl">{tip.title}</p>
          <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-[var(--muted)]">
            {tip.summary}
          </p>
          {prompt && activeId === "ingress" && (
            <p className="mt-3 text-sm italic text-[var(--accent)]">
              &ldquo;{prompt.slice(0, 72)}
              {prompt.length > 72 ? "…" : ""}&rdquo;
            </p>
          )}
          {tokens.length > 0 && activeId === "language" && (
            <p className="mt-2 text-sm text-[var(--muted)]">
              Breaking into {tokens.length} meaningful pieces…
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-center text-sm text-[var(--muted)]">{active.doing}</p>
    </div>
  );
}

export const ArtificialBrain = memo(ArtificialBrainInner);
