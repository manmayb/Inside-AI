"use client";

import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LogitCandidate } from "@/types/pipeline";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { collapseTransition } from "@/motion/stageTransitions";

interface ProbabilityFieldProps {
  candidates: LogitCandidate[];
  highlightTop?: number;
  animateKey?: string | number;
}

/** Competing semantic futures — collapse into one outcome */
function ProbabilityFieldInner({
  candidates,
  highlightTop = 8,
  animateKey,
}: ProbabilityFieldProps) {
  const { isBeginner } = useLearningDepth();
  const top = candidates.slice(0, highlightTop);
  const maxP = top[0]?.probability ?? 1;
  const entropy = useMemo(
    () =>
      -top.reduce(
        (s, c) => s + (c.probability > 0 ? c.probability * Math.log2(c.probability) : 0),
        0
      ),
    [top]
  );

  return (
    <div className="relative min-h-[320px]" key={animateKey}> {/* CHANGED: Increased min-h to 320px per audit finding */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 80%, var(--accent-glow), transparent 70%)",
        }}
      />

      {!isBeginner && (
        <p className="relative mb-4 text-[10px] uppercase tracking-[0.15em] text-[var(--muted)]">
          Uncertainty · H ≈ {entropy.toFixed(2)} bits
        </p>
      )}

      <div className="relative space-y-3">
        <AnimatePresence mode="popLayout">
          {top.map((c, i) => {
            const isChosen = i === 0;
            const branchAngle = (i - (top.length - 1) / 2) * 8;

            return (
              <motion.div
                key={`${c.id}-${c.token}`}
                layout
                initial={{ opacity: 0, x: -20, rotate: branchAngle }}
                animate={{
                  opacity: isChosen ? 1 : 0.55 + (1 - i / top.length) * 0.3,
                  x: 0,
                  rotate: isChosen ? 0 : branchAngle * 0.3,
                  scale: isChosen ? 1.02 : 0.98,
                }}
                exit={{ opacity: 0, filter: "blur(8px)" }}
                transition={isChosen ? collapseTransition : { delay: i * 0.06, duration: 0.5 }}
                className={cnBranch(isChosen)}
              >
                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span className={isChosen ? "text-[var(--text)]" : "text-[var(--muted)]"}>
                    {isChosen && (
                      <span className="mr-2 text-[var(--accent)]">◆ chosen</span>
                    )}
                    &quot;{c.token.trim()}&quot;
                  </span>
                  <span className={isChosen ? "text-[var(--accent)]" : "text-[var(--muted)]"}>
                    {(c.probability * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="relative h-3 overflow-hidden rounded-full bg-[var(--elevated)]">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: isChosen
                        ? "linear-gradient(90deg, var(--secondary), var(--accent))"
                        : "linear-gradient(90deg, var(--accent-dim), var(--accent-glow))",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.probability / maxP) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.05, ease: [0.7, 0, 0.2, 1] }}
                  />
                </div>

                {!isBeginner && (
                  <p className="mt-0.5 text-[10px] text-[var(--muted)]">
                    logit {c.logit.toFixed(2)}
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function cnBranch(chosen: boolean) {
  return chosen ? "collapse-chosen relative rounded-lg px-1 py-0.5" : "relative";
}

export const ProbabilityField = memo(ProbabilityFieldInner);
