"use client";

import { Layers } from "lucide-react";
import { HiddenStateFlow } from "@/components/viz/HiddenStateFlow";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { CinematicScene } from "@/components/ui/CinematicScene";
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
    <CinematicScene
      insight="Early layers catch structure; deeper layers shape ideas and intent."
      hero={
        hiddenStates.length > 0 ? (
          <HiddenStateFlow
            slices={hiddenStates}
            inspectedLayer={layer}
            selectedTokenIndex={selectedTokenIndex}
            maxLayers={config.layers}
            cinematic
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
            Representations are still forming…
          </div>
        )
      }
      curious={
        <>
          <StageSectionHeader stage="hidden" icon={Layers}>
            <div className="flex items-center gap-3">
              <label className="text-xs text-[var(--muted)]" htmlFor="layer-scrub">
                Layer {layer + 1}
              </label>
              <input
                id="layer-scrub"
                type="range"
                min={0}
                max={config.layers - 1}
                value={layer}
                onChange={(e) => setInspectedLayer(parseInt(e.target.value, 10))}
                className="w-32 accent-[var(--accent)] sm:w-48"
                aria-valuemin={0}
                aria-valuemax={config.layers - 1}
                aria-valuenow={layer}
                aria-label="Inspect layer"
              />
              <button
                type="button"
                onClick={() => setInspectedLayer(autoLayer)}
                className="btn-ghost text-xs"
              >
                Sync to tour
              </button>
            </div>
          </StageSectionHeader>
          <GlassPanel title={`Layer ${layer + 1} magnitudes`} divider={false}>
            <div className="space-y-3">
              {hiddenStates.map((slice, ti) => {
                const m =
                  slice.layerMagnitudes[Math.min(layer, slice.layerMagnitudes.length - 1)] ?? 0;
                return (
                  <div key={ti} className="flex items-center gap-3">
                    <span className="w-20 truncate text-xs text-[var(--muted)]">{slice.text}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--elevated)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-all"
                        style={{ width: `${m * 100}%`, opacity: ti === selectedTokenIndex ? 1 : 0.4 }}
                      />
                    </div>
                    <span className="text-[10px] text-[var(--muted)]">{m.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-[var(--muted)]">
              Tour is at layer {autoLayer + 1} of {config.layers}
            </p>
          </GlassPanel>
        </>
      }
    />
  );
}
