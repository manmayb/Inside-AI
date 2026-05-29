"use client";

import { usePipelineStore } from "@/store/pipelineStore";
import { STAGE_META } from "@/lib/constants";
import { useLearningDepth } from "@/hooks/useLearningDepth";
import { cn } from "@/lib/utils";

export function StageRail() {
  const statuses = usePipelineStore((s) => s.stageStatuses);
  const jumpToStage = usePipelineStore((s) => s.jumpToStage);
  const generationComplete = usePipelineStore((s) => s.generationComplete);
  const { isBeginner } = useLearningDepth();

  return (
    <nav
      className="flex h-full flex-col gap-1 overflow-y-auto p-3"
      aria-label="Journey chapters"
    >
      <p className="mb-2 px-2 text-xs text-[var(--muted)]">
        {generationComplete ? "Jump to any chapter" : "Following along"}
      </p>
      {statuses.map((s, index) => {
        const canJump = s.complete || s.active || generationComplete;
        const meta = STAGE_META[s.stage];
        const label = isBeginner ? meta.simpleLabel : meta.short;

        return (
          <button
            key={s.stage}
            type="button"
            disabled={!canJump}
            data-active={s.active ? "true" : "false"}
            onClick={() => canJump && jumpToStage(s.stage)}
            title={canJump ? meta.simpleLabel : undefined}
            className={cn(
              "journey-rail-item rounded-xl px-3 py-2.5 text-left transition-all",
              s.active && "bg-[var(--accent-glow)] text-[var(--accent)]",
              s.complete && !s.active && "text-[var(--muted)] hover:bg-white/[0.03] hover:text-[var(--text)]",
              !canJump && "cursor-not-allowed opacity-40"
            )}
          >
            <span className="flex items-baseline gap-2">
              <span className="text-xs tabular-nums text-[var(--muted)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="block truncate text-sm font-medium">{label}</span>
            </span>
            {s.active && (
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                  style={{ width: `${s.progress}%` }}
                />
              </div>
            )}
          </button>
        );
      })}
    </nav>
  );
}
