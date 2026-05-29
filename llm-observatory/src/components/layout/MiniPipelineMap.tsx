"use client";

import { usePipelineStore } from "@/store/pipelineStore";
import { PIPELINE_STAGES } from "@/types/pipeline";
import { STAGE_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MiniPipelineMap() {
  const currentStage = usePipelineStore((s) => s.currentStage);
  const stageStatuses = usePipelineStore((s) => s.stageStatuses);
  const jumpToStage = usePipelineStore((s) => s.jumpToStage);
  const generationComplete = usePipelineStore((s) => s.generationComplete);

  const idx = PIPELINE_STAGES.indexOf(currentStage);

  return (
    <div className="fixed bottom-24 right-4 z-40 hidden w-48 rounded-xl border border-white/10 bg-deep/95 p-2 shadow-2xl backdrop-blur-xl xl:block">
      <p className="mb-2 px-1 font-mono text-[9px] uppercase tracking-widest text-slate-600">
        Pipeline map
      </p>
      <div className="flex flex-wrap gap-1">
        {stageStatuses.map((s, i) => {
          const canJump = s.complete || s.active || generationComplete;
          return (
            <button
              key={s.stage}
              type="button"
              disabled={!canJump}
              title={STAGE_META[s.stage].label}
              onClick={() => canJump && jumpToStage(s.stage)}
              className={cn(
                "h-2 flex-1 min-w-[8px] max-w-[calc(20%-4px)] rounded-sm transition-all",
                i === idx && "h-2.5 bg-[var(--accent)] ring-1 ring-[var(--accent)]",
                i < idx && "bg-emerald-500/50",
                i > idx && !generationComplete && "bg-white/10",
                generationComplete && i !== idx && "bg-white/20 hover:bg-[var(--accent)]/40"
              )}
            />
          );
        })}
      </div>
      <p className="mt-2 truncate px-1 text-[10px] text-slate-500">
        {STAGE_META[currentStage].label}
      </p>
    </div>
  );
}
