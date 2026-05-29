"use client";

import { usePipelineStore } from "@/store/pipelineStore";
import type { ViewMode } from "@/types/pipeline";
import { cn } from "@/lib/utils";

const MODES: { id: ViewMode; label: string; hint: string }[] = [
  { id: "beginner", label: "Beginner", hint: "Plain language, one idea at a time" },
  { id: "engineer", label: "Curious", hint: "Proper terms, more detail" },
  { id: "research", label: "Advanced", hint: "Full technical depth" },
];

export function ModeToggle() {
  const viewMode = usePipelineStore((s) => s.viewMode);
  const setViewMode = usePipelineStore((s) => s.setViewMode);

  return (
    <div
      className="flex rounded-full border border-[var(--panel-border)] bg-[var(--elevated)] p-0.5 text-xs"
      role="group"
      aria-label="Learning depth"
    >
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          title={m.hint}
          onClick={() => setViewMode(m.id)}
          className={cn(
            "rounded-full px-3 py-1.5 transition-all",
            viewMode === m.id
              ? "bg-[var(--accent)] font-medium text-[var(--void)]"
              : "text-[var(--muted)] hover:text-[var(--text)]"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
