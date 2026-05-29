"use client";

import { usePipelineStore } from "@/store/pipelineStore";
import type { ThemeAccent } from "@/types/pipeline";
import { cn } from "@/lib/utils";

const ACCENTS: { id: ThemeAccent; label: string; color: string }[] = [
  { id: "teal", label: "Sage", color: "#6b9b7a" },
  { id: "violet", label: "Lavender", color: "#9b8bb8" },
  { id: "amber", label: "Warm", color: "#c4a574" },
];

export function ThemePicker() {
  const themeAccent = usePipelineStore((s) => s.themeAccent);
  const setThemeAccent = usePipelineStore((s) => s.setThemeAccent);

  return (
    <div
      className="flex items-center gap-1.5 rounded-full border border-[var(--panel-border)] bg-[var(--elevated)] p-1"
      title="Color mood"
      role="group"
      aria-label="Color mood"
    >
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          type="button"
          title={a.label}
          onClick={() => setThemeAccent(a.id)}
          className={cn(
            "h-5 w-5 rounded-full border-2 transition-transform hover:scale-110",
            themeAccent === a.id ? "border-[var(--text)] scale-110" : "border-transparent"
          )}
          style={{ backgroundColor: a.color }}
          aria-label={`${a.label} mood`}
          aria-pressed={themeAccent === a.id}
        />
      ))}
    </div>
  );
}
