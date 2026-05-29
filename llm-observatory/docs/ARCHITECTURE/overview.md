# Architecture overview

Inside AI is a **client-only Next.js SPA** wrapped by the App Router. All inference is **simulated in TypeScript**; there is no backend API.

---

## Layer diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Presentation (React)                                         │
│  welcome / prelude / DocumentaryJourney / ChapterScene       │
│  sections/* · viz/* · ui/*                                   │
├─────────────────────────────────────────────────────────────┤
│ Orchestration (hooks)                                        │
│  usePipelineRunner · useLearningDepth · useKeyboardShortcuts │
├─────────────────────────────────────────────────────────────┤
│ State (Zustand)                                              │
│  pipelineStore.ts                                            │
├─────────────────────────────────────────────────────────────┤
│ Simulation (lib/*)                                           │
│  tokenizer · inference · analytics · tensorAnim              │
├─────────────────────────────────────────────────────────────┤
│ Shell (Next.js)                                              │
│  app/layout.tsx · app/page.tsx · globals.css                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Module responsibilities

| Area | Path | Responsibility |
|------|------|----------------|
| App shell | `src/app/` | HTML, fonts, metadata, CSS tokens |
| Root UI | `ObservatoryApp.tsx` | Phase routing (welcome/prelude/journey) |
| Journey | `src/components/journey/` | Documentary shell, chapter layout, chrome |
| Home | `src/components/home/` | Welcome, prelude |
| Sections | `src/components/sections/` | One component per pipeline stage |
| Viz | `src/components/viz/` | Reusable visualizations |
| Layout (legacy) | `src/components/layout/` | Old dashboard chrome — **not mounted** in documentary flow |
| Brain (legacy) | `src/components/brain/` | Full SVG brain — optional / legacy |
| Store | `src/store/pipelineStore.ts` | Single source of truth |
| Types | `src/types/pipeline.ts` | `PipelineStage`, artifacts, config |
| Motion | `src/motion/` | Timing + transition variants |

---

## Rendering flow

1. `page.tsx` renders `ObservatoryApp` (client).  
2. `PreferencesHydrator` loads `localStorage` prefs.  
3. Phase `journey` + `active` mounts `DocumentaryJourney`.  
4. `usePipelineRunner` ticks → updates `currentStage` / `stageProgress`.  
5. `ChapterScene` reads stage + `viewMode` → `StageSection` renders active section.  
6. Section components read artifacts from Zustand (tokens, attention, etc.).

---

## Data flow summary

See [data-flow.md](./data-flow.md) and [../PIPELINE/lifecycle.md](../PIPELINE/lifecycle.md).

---

## Related

- [app-structure.md](./app-structure.md)  
- [../STATE_MANAGEMENT/overview.md](../STATE_MANAGEMENT/overview.md)  
- [../SIMULATION_ENGINE/overview.md](../SIMULATION_ENGINE/overview.md)  
