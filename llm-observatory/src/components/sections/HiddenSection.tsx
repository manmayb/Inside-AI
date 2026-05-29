"use client";

import { Layers } from "lucide-react";
import { HiddenStateFlow } from "@/components/viz/HiddenStateFlow";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";

export function HiddenSection() {
  const config = usePipelineStore((s) => s.config);
  const hiddenStates = usePipelineStore((s) => s.hiddenStates);
  const inspectedLayer = usePipelineStore((s) => s.inspectedLayer);
  const setInspectedLayer = usePipelineStore((s) => s.setInspectedLayer);
  const selectedTokenIndex = usePipelineStore((s) => s.selectedTokenIndex);
  const stageProgress = usePipelineStore((s) => s.stageProgress);
  const autoLayer = Math.floor((stageProgress / 100) * (config.layers - 1));
  const layer = inspectedLayer;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <StageSectionHeader stage="hidden" icon={Layers}>
        <div className="flex items-center gap-3">
          <label className="font-mono text-[10px] text-slate-500">
            Layer {layer + 1}
          </label>
          <input
            type="range"
            min={0}
            max={config.layers - 1}
            value={layer}
            onChange={(e) => setInspectedLayer(parseInt(e.target.value, 10))}
            className="w-32 accent-[var(--accent)] sm:w-48"
          />
          <button
            type="button"
            onClick={() => setInspectedLayer(autoLayer)}
            className="rounded border border-white/10 px-2 py-1 font-mono text-[10px] text-slate-500 hover:text-[var(--accent)]"
          >
            Sync to tour
          </button>
        </div>
      </StageSectionHeader>

      <GlassPanel title="Representation trajectories" glow="secondary">
        {hiddenStates.length > 0 ? (
          <HiddenStateFlow
            slices={hiddenStates}
            inspectedLayer={layer}
            selectedTokenIndex={selectedTokenIndex}
            maxLayers={config.layers}
          />
        ) : (
          <p className="font-mono text-sm text-slate-500">No hidden-state slices yet.</p>
        )}
      </GlassPanel>

      <GlassPanel title={`Layer ${layer + 1} magnitudes`}>
        <div className="space-y-3">
          {hiddenStates.map((slice, ti) => {
            const m = slice.layerMagnitudes[Math.min(layer, slice.layerMagnitudes.length - 1)] ?? 0;
            return (
              <div key={ti} className="flex items-center gap-3">
                <span className="w-20 truncate font-mono text-xs text-slate-500">{slice.text}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all"
                    style={{ width: `${m * 100}%`, opacity: ti === selectedTokenIndex ? 1 : 0.4 }}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-600">{m.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 font-mono text-[10px] text-slate-500">
          Scrub layers to see abstraction emerge · tour at layer {autoLayer + 1}
        </p>
      </GlassPanel>
    </div>
  );
}
