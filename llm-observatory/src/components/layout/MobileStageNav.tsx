"use client";

import { List } from "lucide-react";
import { useState } from "react";
import { StageRail } from "./StageRail";
import { STAGE_META } from "@/lib/constants";
import { usePipelineStore } from "@/store/pipelineStore";
import { cn } from "@/lib/utils";

export function MobileStageNav() {
  const [open, setOpen] = useState(false);
  const currentStage = usePipelineStore((s) => s.currentStage);
  const stageProgress = usePipelineStore((s) => s.stageProgress);

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-white/5 bg-black/40 px-3 py-2 md:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[10px] text-cyan-400">
            {STAGE_META[currentStage].label}
          </p>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-cyan-400 transition-all"
              style={{ width: `${stageProgress}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 font-mono text-[10px] uppercase text-slate-400"
          aria-label="Open stage list"
        >
          <List className="h-4 w-4" />
          Stages
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Pipeline stages"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
            aria-label="Close"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-hidden rounded-t-2xl border border-white/10 bg-deep">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                Jump to stage
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-1 font-mono text-xs text-cyan-400"
                )}
              >
                Done
              </button>
            </div>
            <div className="max-h-[calc(70vh-52px)] overflow-y-auto" onClick={() => setOpen(false)}>
              <StageRail />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
