"use client";

import { useLearningDepth } from "@/hooks/useLearningDepth";
import { cn } from "@/lib/utils";

interface EquationProps {
  beginner: string;
  engineer: string;
  research: string;
  className?: string;
}

/** Technical depth — hidden in Beginner mode (brain + tips carry the story) */
export function Equation({ beginner, engineer, research, className }: EquationProps) {
  const { mode } = useLearningDepth();

  if (mode === "beginner") return null;

  const text = mode === "engineer" ? engineer : research;

  return (
    <div
      className={cn(
        "rounded-lg border border-violet-500/15 bg-violet-500/5 px-4 py-3 text-sm leading-relaxed text-violet-200/90",
        mode === "engineer" ? "font-sans" : "font-mono",
        className
      )}
    >
      {text}
    </div>
  );
}
