"use client";

import { ChevronDown } from "lucide-react";
import { MODEL_PRESETS } from "@/lib/modelPresets";
import { usePipelineStore } from "@/store/pipelineStore";

export function ModelPresetSelect({ disabled }: { disabled?: boolean }) {
  const modelPreset = usePipelineStore((s) => s.modelPreset);
  const setModelPreset = usePipelineStore((s) => s.setModelPreset);
  const active = usePipelineStore((s) => s.active);

  if (active) return null;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="model-preset" className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
        Simulated model
      </label>
      <div className="relative">
        <select
          id="model-preset"
          disabled={disabled}
          value={modelPreset}
          onChange={(e) => setModelPreset(e.target.value as typeof modelPreset)}
          className="w-full appearance-none rounded-xl border border-white/10 bg-black/50 py-2.5 pl-4 pr-10 font-mono text-sm text-white focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        >
          {MODEL_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.tagline}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </div>
    </div>
  );
}
