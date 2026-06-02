"use client";

import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StageLayout } from "@/components/ui/StageLayout";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";
import { usePipelineStore } from "@/store/pipelineStore";

const LOOP_STEPS = [
  { id: "think", label: "Think" },
  { id: "choose", label: "Choose a word" },
  { id: "add", label: "Add it" },
  { id: "remember", label: "Remember" },
  { id: "repeat", label: "Repeat" },
];

const TECH_LOOP_STEPS = [
  { id: "forward-prefill", label: "Forward" },
  { id: "sample", label: "Sample" },
  { id: "append", label: "Append" },
  { id: "kv-update", label: "KV update" },
  { id: "forward-decode", label: "Forward" },
] as const;

export function AutoregressiveSection() {
  const generatedTokens = usePipelineStore((s) => s.generatedTokens);
  const arStep = usePipelineStore((s) => s.arStep);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const visibleCount = Math.floor((stageProgress / 100) * generatedTokens.length);
  const activeStep = arStep % LOOP_STEPS.length;
  const { motionEnabled, repeat } = useMotionPreferences(); // CHANGED: Fetch motion repeat settings

  return (
    <StageLayout
      insight="Write one word → think again → write another—until the reply is complete."
      focal={
        <GlassPanel title="The writing loop" variant="hero" glow="accent" className="min-h-[260px]"> {/* CHANGED: Added min-h-[260px] wrapper per spatial comfort audit */}
          <div className="flex flex-col items-center justify-center py-2">
            <svg viewBox="0 0 300 200" className="mx-auto h-40 w-40 sm:h-44 sm:w-44"> {/* CHANGED: Replaced static text chips with circular loop visual per audit findings */}
              {/* Circular trace path */}
              <circle
                cx={150}
                cy={100}
                r={65}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              
              {/* Active step connector arc */}
              <motion.circle
                cx={150}
                cy={100}
                r={65}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3}
                strokeDasharray="80 320"
                animate={{ rotate: activeStep * 72 }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                style={{ originX: "150px", originY: "100px" }}
              />

              {LOOP_STEPS.map((step, i) => {
                const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                const x = 150 + 65 * Math.cos(angle);
                const y = 100 + 65 * Math.sin(angle);
                const isActive = activeStep === i;

                return (
                  <g key={step.id} transform={`translate(${x}, ${y})`}>
                    <motion.circle
                      r={isActive ? 12 : 7}
                      fill={isActive ? "var(--accent)" : "var(--panel)"}
                      stroke={isActive ? "var(--accent)" : "rgba(255,255,255,0.15)"}
                      strokeWidth={1.5}
                      animate={isActive && motionEnabled ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 1.5, repeat }}
                    />
                    <text
                      y={isActive ? -18 : -12}
                      textAnchor="middle"
                      fontSize={isActive ? 9 : 7}
                      fontWeight={isActive ? "bold" : "normal"}
                      fill={isActive ? "var(--accent)" : "var(--muted)"}
                      fontFamily="var(--font-dm-sans)"
                    >
                      {step.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          {visibleCount > 0 && (
            <p className="mt-5 text-center text-sm text-[var(--muted)]">
              {visibleCount} word{visibleCount === 1 ? "" : "s"} drafted so far
            </p>
          )}
        </GlassPanel>
      }
      curious={
        <>
          <StageSectionHeader stage="autoregressive" icon={PenLine} />
          <GlassPanel title="Technical loop" divider={false}>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {TECH_LOOP_STEPS.map((step, i) => (
                <div
                  key={step.id}
                  className={`rounded-lg border border-[var(--panel-border)] bg-[var(--accent-glow)] px-3 py-2 ${
                    arStep % 5 === i ? "text-[var(--accent)]" : "text-[var(--muted)]"
                  }`}
                >
                  {step.label}
                  {i < TECH_LOOP_STEPS.length - 1 && (
                    <span className="ml-2 text-[var(--muted)]">→</span>
                  )}
                </div>
              ))}
            </div>
          </GlassPanel>
          <GlassPanel title="Generated sequence" divider={false}>
            <div className="flex flex-wrap gap-1">
              {generatedTokens.slice(0, visibleCount).map((t, i) => (
                <span
                  key={i}
                  className="rounded-full bg-[var(--accent-glow)] px-2 py-0.5 text-sm text-[var(--text)]"
                >
                  {t.text}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">
              Step {arStep} · {visibleCount}/{generatedTokens.length} tokens
            </p>
          </GlassPanel>
        </>
      }
    />
  );
}
