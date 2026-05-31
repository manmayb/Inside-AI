"use client";

import { Focus } from "lucide-react";
import { AttentionHeatmap } from "@/components/viz/AttentionHeatmap";
import { AttentionArcs } from "@/components/viz/AttentionArcs";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SemanticToken } from "@/components/ui/SemanticToken";
import { CinematicScene } from "@/components/ui/CinematicScene";
import { Equation } from "@/components/ui/Equation";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";
import { usePipelineStore } from "@/store/pipelineStore";
import { getAttentionForToken } from "@/lib/inference";

export function AttentionSection() {
  const attention = usePipelineStore((s) => s.attention);
  const selectedTokenIndex = usePipelineStore((s) => s.selectedTokenIndex);
  const setSelectedTokenIndex = usePipelineStore((s) => s.setSelectedTokenIndex);
  const compareTokenIndex = usePipelineStore((s) => s.compareTokenIndex);
  const setCompareTokenIndex = usePipelineStore((s) => s.setCompareTokenIndex);
  const selectedHead = usePipelineStore((s) => s.selectedHead);
  const setSelectedHead = usePipelineStore((s) => s.setSelectedHead);
  const config = usePipelineStore((s) => s.config);
  const tokens = usePipelineStore((s) => s.tokens);

  if (!attention) return null;

  const flows = getAttentionForToken(attention, selectedTokenIndex)
    .filter((f) => f.weight > 0.08)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);

  return (
    <CinematicScene
      insight="Tap a word below—glowing bridges show which other words the AI leans on right now."
      hero={
        <div className="relative flex h-full min-h-0 flex-col">
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-2 pt-24">
            <AttentionArcs
              matrix={attention}
              sourceIndex={selectedTokenIndex}
              compareIndex={compareTokenIndex}
            />
          </div>
          <div className="pointer-events-auto flex shrink-0 flex-wrap justify-center gap-3 px-6 pb-[calc(var(--scene-chrome-h)+3rem)]">
            {tokens.map((t, i) => (
              <SemanticToken
                key={i}
                index={i}
                active={i === selectedTokenIndex}
                compare={i === compareTokenIndex}
                onClick={(e) => {
                  if (e.shiftKey) setCompareTokenIndex(i);
                  else setSelectedTokenIndex(i);
                }}
              >
                {t.text}
              </SemanticToken>
            ))}
          </div>
        </div>
      }
      curious={
        <>
          <StageSectionHeader stage="attention" icon={Focus} />
          <Equation
            beginner=""
            engineer="Self-attention lets each token gather context from others—multiple heads see different patterns."
            research="head_i = softmax(Q_i K_i^T / √d_h) V_i; concat · W_O"
          />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.min(8, config.heads) }).map((_, h) => (
              <button
                key={h}
                type="button"
                onClick={() => setSelectedHead(h)}
                className={`rounded-full border border-[var(--panel-border)] bg-[var(--elevated)] px-3 py-1.5 text-xs ${
                  selectedHead === h ? "text-[var(--accent)]" : "text-[var(--muted)]"
                }`}
              >
                Head {h}
              </button>
            ))}
          </div>
          <GlassPanel title="Focus map" glow="secondary">
            <AttentionHeatmap
              matrix={attention}
              selectedIndex={selectedTokenIndex}
              head={selectedHead}
              onSelectToken={setSelectedTokenIndex}
              causalMask
            />
          </GlassPanel>
          <GlassPanel title="Strongest links" divider={false}>
            <ul className="space-y-2 text-sm">
              {flows.map((f) => (
                <li key={f.target} className="flex items-center gap-3">
                  <span className="text-[var(--accent)]">→</span>
                  <span>{attention.tokens[f.target]}</span>
                  <div className="h-1 flex-1 rounded-full bg-[var(--elevated)]">
                    <div
                      className="h-full bg-[var(--accent)]"
                      style={{ width: `${f.weight * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </>
      }
    />
  );
}
