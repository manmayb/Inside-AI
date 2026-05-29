"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { usePipelineStore } from "@/store/pipelineStore";
import { PIPELINE_STAGES } from "@/types/pipeline";
import { formatGlobalProgress } from "@/lib/tourProgress";
import { STAGE_META } from "@/lib/constants";

export function TimelineScrubber() {
  const active = usePipelineStore((s) => s.active);
  const globalScrubProgress = usePipelineStore((s) => s.globalScrubProgress);
  const tourKeyframes = usePipelineStore((s) => s.tourKeyframes);
  const scrubToGlobal = usePipelineStore((s) => s.scrubToGlobal);
  const setScrubbing = usePipelineStore((s) => s.setScrubbing);
  const isScrubbing = usePipelineStore((s) => s.isScrubbing);
  const trackRef = useRef<HTMLDivElement>(null);

  const seek = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      scrubToGlobal(ratio * 100);
    },
    [scrubToGlobal]
  );

  if (!active) return null;

  return (
    <div className="border-t border-[var(--panel-border)] bg-[var(--deep)]/90 px-4 py-3 backdrop-blur-md">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-[var(--muted)]">Journey timeline</span>
        <span className="text-xs font-medium text-[var(--accent)]">
          {formatGlobalProgress(globalScrubProgress)}
        </span>
      </div>

      <div
        ref={trackRef}
        className="relative h-6 cursor-pointer rounded-full bg-[var(--surface)]"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(globalScrubProgress)}
        aria-label="Scrub tour progress"
        onPointerDown={(e) => {
          setScrubbing(true);
          seek(e.clientX);
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (isScrubbing || e.buttons === 1) seek(e.clientX);
        }}
        onPointerUp={() => setScrubbing(false)}
        onPointerLeave={() => setScrubbing(false)}
      >
        <div className="absolute inset-x-0 top-1/2 flex h-px -translate-y-1/2">
          {PIPELINE_STAGES.map((stage, i) => (
            <div
              key={stage}
              className="flex-1 border-r border-white/5 last:border-r-0"
              title={STAGE_META[stage].label}
            />
          ))}
        </div>

        {tourKeyframes.map((kf) => (
          <div
            key={kf.id}
            className="absolute top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent)]/40"
            style={{ left: `${kf.globalProgress}%` }}
          />
        ))}

        <motion.div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--accent)] bg-[var(--void)]"
          style={{ left: `${globalScrubProgress}%` }}
          layout
        />
      </div>

      <p className="mt-1.5 text-xs text-[var(--muted)]">Drag to revisit any moment</p>
    </div>
  );
}
