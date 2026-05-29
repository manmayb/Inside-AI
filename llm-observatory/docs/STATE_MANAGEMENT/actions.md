# Store actions reference

**Source:** `src/store/pipelineStore.ts`

---

## `submitPrompt(prompt: string)`

1. Reads `config` from current model preset.  
2. Runs all `lib/*` builders (see [../SIMULATION_ENGINE/overview.md](../SIMULATION_ENGINE/overview.md)).  
3. Sets `active: true`, resets stage to `input`, clears metrics/stream.  
4. Records first tour keyframe.

**Must not** be called on welcome screen submit — only after prelude **Begin**.

---

## `advanceProgress(delta: number)`

Increments `stageProgress` 0–100 for `currentStage`. Updates `stageStatuses` and `globalScrubProgress`.

---

## `setStage(stage, progress?)`

Hard jump within machine; updates statuses.

---

## `jumpToStage(stage)`

User navigation — sets pause, progress 100 if revisiting past chapter.

---

## `goToNextStage` / `goToPrevStage`

Discrete chapter boundaries. Next may trigger `computeMetrics` at end.

---

## `togglePause` / `setPlaybackSpeed`

Runner respects both.

---

## `scrubToGlobal(progress: number)`

Maps 0–100 global progress → stage + progress via `fromGlobalProgress`. Sets pause.

---

## `reset()`

Returns to `initialState` but **keeps** user prefs (viewMode, theme, preset, rag, speed, config).

---

## `rerunTour()`

Re-runs `submitPrompt` with existing `prompt`.
