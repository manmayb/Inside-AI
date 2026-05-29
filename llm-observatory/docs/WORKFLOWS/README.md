# Workflows

Technical end-to-end flows. Product UX flow: [../UX/experience-flow.md](../UX/experience-flow.md).

---

## 1. Bootstrap

```
layout.tsx → page.tsx → ObservatoryApp
  → PreferencesHydrator.hydratePrefs()
  → AmbientShell
  → phase === welcome → WelcomeScreen
```

## 2. Start journey (updated)

```
WelcomeScreen onStartJourney(prompt)
  → ObservatoryApp: phase = prelude, pendingPrompt
PreJourneyIntro onBegin
  → submitPrompt(pendingPrompt)
  → phase = journey, active = true
  → usePipelineRunner interval starts
```

**Note:** `submitPrompt` is NOT called on welcome submit anymore.

## 3. submitPrompt (unchanged engine)

See [../STATE_MANAGEMENT/actions.md](../STATE_MANAGEMENT/actions.md) and [../SIMULATION_ENGINE/overview.md](../SIMULATION_ENGINE/overview.md).

## 4. Stage auto-advance

`usePipelineRunner` — 50ms tick, `STAGE_META.durationMs`, respects pause/speed.

Special: `autoregressive` → `refreshLogits`; `streaming` → `appendStreamToken`.

## 5. Manual navigation

| UI | Store |
|----|-------|
| SceneChrome prev/next | `goToPrevStage` / `goToNextStage` |
| SceneProgress dot | `jumpToStage` |
| Space | `togglePause` |

## 6. Exit

`SceneChrome` → `reset()` + `onExit()` → phase `welcome`.

## 7. Tokenization / attention / streaming

Detailed module notes remain valid — see section components and [../STAGES/](../STAGES/).

---

Legacy references to `HomeView`, `StageRail`, `TimelineScrubber` in old WORKFLOWS are **obsolete** for default UX.
