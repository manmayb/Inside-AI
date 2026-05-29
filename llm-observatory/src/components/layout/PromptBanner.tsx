"use client";

import { usePipelineStore } from "@/store/pipelineStore";
import { useLearningDepth } from "@/hooks/useLearningDepth";

export function PromptBanner() {
  const prompt = usePipelineStore((s) => s.prompt);
  const { isBeginner } = useLearningDepth();

  return (
    <div className="border-b border-[var(--panel-border)] bg-[var(--deep)]/80 px-4 py-3 md:px-6">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        {isBeginner ? "Your question" : "Prompt"}
      </p>
      <p className="mt-1 truncate text-sm text-[var(--text)]" title={prompt}>
        {prompt}
      </p>
    </div>
  );
}
