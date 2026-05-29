"use client";

/**
 * 50ms stage machine — advances chapter progress and handles streaming/AR side effects.
 * Paused when isPaused; stops at generationComplete.
 * @see docs/PIPELINE/lifecycle.md
 */

import { useEffect, useRef } from "react";
import { computeMetrics } from "@/lib/analytics";
import { getNextStage, getStageDuration, usePipelineStore } from "@/store/pipelineStore";
import type { GeneratedToken } from "@/types/pipeline";

export function usePipelineRunner() {
  const active = usePipelineStore((s) => s.active);
  const generationComplete = usePipelineStore((s) => s.generationComplete);
  const generatedTokens = usePipelineStore((s) => s.generatedTokens);
  const tokens = usePipelineStore((s) => s.tokens);
  const config = usePipelineStore((s) => s.config);
  const startTime = useRef(0);
  const streamIndex = useRef(0);
  const lastRecord = useRef(0);

  useEffect(() => {
    if (!active || generationComplete) return;

    const tickMs = 50;

    const interval = setInterval(() => {
      const state = usePipelineStore.getState();
      if (state.isPaused || state.isScrubbing || state.generationComplete) return;

      const { currentStage, stageProgress, playbackSpeed } = state;
      const duration = getStageDuration(currentStage);
      const increment = ((100 / duration) * tickMs) / playbackSpeed;

      if (Date.now() - lastRecord.current > 400) {
        state.recordTourKeyframe();
        lastRecord.current = Date.now();
      }

      if (stageProgress >= 100) {
        const next = getNextStage(currentStage);
        if (!next) {
          const latencyMs = Date.now() - startTime.current;
          usePipelineStore.setState({
            generationComplete: true,
            metrics: computeMetrics(
              config,
              tokens.length,
              state.generatedTokens.length,
              latencyMs
            ),
          });
          state.recordTourKeyframe();
          return;
        }
        usePipelineStore.getState().setStage(next, 0);
        state.recordTourKeyframe();
        if (next === "streaming") streamIndex.current = 0;
        if (next === "autoregressive") {
          usePipelineStore.setState({ isGenerating: true, arStep: 0 });
        }
        return;
      }

      state.advanceProgress(increment);

      const updated = usePipelineStore.getState();
      if (updated.currentStage === "autoregressive" && stageProgress % 25 < increment) {
        updated.refreshLogits(updated.arStep + 1);
      }

      if (updated.currentStage === "streaming") {
        const idx = streamIndex.current;
        const prog = updated.stageProgress;
        if (idx < generatedTokens.length && prog > (idx / generatedTokens.length) * 80) {
          updated.appendStreamToken(generatedTokens[idx] as GeneratedToken);
          streamIndex.current++;
        }
      }
    }, tickMs);

    return () => clearInterval(interval);
  }, [active, generationComplete, generatedTokens, tokens.length, config]);

  useEffect(() => {
    if (active) {
      startTime.current = Date.now();
      streamIndex.current = 0;
      lastRecord.current = Date.now();
    }
  }, [active]);
}
