# Pipeline lifecycle

## Phase 1: Prelude (no store artifacts)

User enters prompt on welcome → prelude slides → **Begin**.

## Phase 2: Materialize (`submitPrompt`)

Single synchronous build of all simulation data. Sets:

- `active: true`  
- `currentStage: 'input'`  
- `stageProgress: 0`  
- All artifact arrays on store  

## Phase 3: Auto-advance (`usePipelineRunner`)

Every **50ms** when `active && !generationComplete && !isPaused`:

```
increment = (100 / durationMs) * 50 / playbackSpeed
stageProgress += increment
if stageProgress >= 100 → advance to next stage or complete
```

Special cases: `autoregressive` (refreshLogits), `streaming` (appendStreamToken).

## Phase 4: Complete

On last stage 100% → `computeMetrics()` → `generationComplete: true` → `JourneyComplete` UI.

## Phase 5: Exit

`reset()` clears session; prefs remain. `ObservatoryApp` returns to `welcome` phase.
