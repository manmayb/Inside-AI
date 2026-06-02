"use client";

/**
 * 50ms stage machine — advances chapter progress and handles streaming/AR side effects.
 * Paused when isPaused; stops at generationComplete.
 * Each chapter holds at STAGE_DWELL_MS at 100% before advancing.
 * @see docs/PIPELINE/lifecycle.md
 */

import { useEffect, useRef } from "react";
import { computeMetrics } from "@/lib/analytics";
import { STAGE_DWELL_MS } from "@/lib/stagePacing";
import { getNextStage, getStageDuration, usePipelineStore } from "@/store/pipelineStore";
import type { GeneratedToken, PipelineStage } from "@/types/pipeline";

export function usePipelineRunner() {
  const active = usePipelineStore((s) => s.active);
  const generationComplete = usePipelineStore((s) => s.generationComplete);
  const generatedTokens = usePipelineStore((s) => s.generatedTokens);
  const tokens = usePipelineStore((s) => s.tokens);
  const config = usePipelineStore((s) => s.config);
  const currentStage = usePipelineStore((s) => s.currentStage);
  const startTime = useRef(0);
  const streamIndex = useRef(0);
  const lastRecord = useRef(0);
  const lastStage = useRef<PipelineStage | null>(null);
  const dwellUntil = useRef(0);

  useEffect(() => {
    if (currentStage !== lastStage.current) {
      if (currentStage === "streaming") streamIndex.current = 0;
      dwellUntil.current = 0;
      lastStage.current = currentStage;
    }
  }, [currentStage]);

  useEffect(() => {
    if (!active || generationComplete) return;

    const tickMs = 50;

    const interval = setInterval(() => {
      const state = usePipelineStore.getState();
      if (state.isPaused || state.isScrubbing || state.generationComplete) return;

      const { currentStage: stage, stageProgress, playbackSpeed } = state;
      const duration = getStageDuration(stage);
      const increment = ((100 / duration) * tickMs) / playbackSpeed;

      if (Date.now() - lastRecord.current > 400) {
        state.recordTourKeyframe();
        lastRecord.current = Date.now();
      }

      if (stageProgress >= 100) {
        if (dwellUntil.current === 0) {
          dwellUntil.current = Date.now() + STAGE_DWELL_MS;
          return;
        }
        if (Date.now() < dwellUntil.current) return;
        dwellUntil.current = 0;

        const next = getNextStage(stage, state.ragEnabled);
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
      lastStage.current = "input";
      dwellUntil.current = 0;
    }
  }, [active]);
}
