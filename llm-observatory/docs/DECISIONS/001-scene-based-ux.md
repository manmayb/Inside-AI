# ADR-001: Scene-based documentary UX over dashboard

## Status
Accepted (2025 — structural redesign)

## Context
Early layouts exposed sidebar rails, always-visible brain map, timeline scrubber, top bar, and prompt banner simultaneously. Beginners reported feeling they needed to “understand the whole system.”

## Decision
Replace persistent dashboard shell with:

- Phases: welcome → prelude → journey  
- Full-screen **chapters** via `DocumentaryJourney` + `ChapterScene`  
- Minimal chrome: `SceneProgress` + `SceneChrome`  
- Legacy layout components remain in repo but are **not mounted** in default flow  

## Consequences

- ✅ Lower cognitive load, clearer focal point per chapter  
- ✅ Better alignment with “interactive documentary” product vision  
- ⚠️ Power users lose always-visible scrubber — dots + menu partially compensate  
- 📁 `src/components/layout/*` mostly legacy until removed or repurposed  
