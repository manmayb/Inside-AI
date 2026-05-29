# AI / Cursor contributor guide

For **AI coding assistants** and automation working in this repo.

---

## Read first

1. [../PRODUCT/vision.md](../PRODUCT/vision.md)  
2. [../UX/philosophy.md](../UX/philosophy.md)  
3. [../DECISIONS/001-scene-based-ux.md](../DECISIONS/001-scene-based-ux.md)  
4. [../ARCHITECTURE/app-structure.md](../ARCHITECTURE/app-structure.md)  

---

## Non-negotiable rules

| Rule | Reason |
|------|--------|
| **Do not** remount dashboard shell (sidebar + always-on brain + scrubber) as default | ADR-001 |
| **Do not** break Zustand single-store flow or `PIPELINE_STAGES` order without updating all docs | Pipeline contract |
| **Do not** call real LLM APIs without explicit feature flag + docs | Product is simulated |
| **Do not** expose tensors/logits/heatmaps in Beginner primary focal area | Progressive disclosure |
| **Do** update `docs/` when changing flows, stages, or design tokens | Maintenance policy |
| **Do** match Thought Museum tokens in `globals.css` | Visual consistency |

---

## Architecture rules

- **Presentation** changes go in `components/journey/`, `components/home/`, `sections/`, `viz/`.  
- **Simulation** changes go in `src/lib/*` only — no React in lib.  
- **Orchestration** in `hooks/usePipelineRunner.ts` — 50ms tick contract.  
- **Prelude** is React local state in `ObservatoryApp` — not Zustand until `submitPrompt`.  

---

## Adding a pipeline chapter

See [../PIPELINE/stage-machine.md](../PIPELINE/stage-machine.md) checklist + [../STAGES/README.md](../STAGES/README.md).

---

## UI consistency

- Headlines: `.display-title`  
- Panels: `.museum-card` / `GlassPanel`  
- CTAs: `.btn-primary`  
- Motion easing: `src/motion/neuralMotion.ts`  

---

## Naming conventions

| Kind | Convention |
|------|------------|
| Stage sections | `FooSection.tsx` in `sections/` |
| Viz | `PascalCase` in `viz/` |
| ViewMode IDs | `beginner` \| `engineer` \| `research` (UI: Beginner/Curious/Advanced) |

---

## What NOT to break

- `submitPrompt` artifact build sequence  
- `PreferencesHydrator` + `persistence.ts` key  
- `useLearningDepth` gating pattern  
- ChapterScene single-focus layout  

---

## After your change

1. Update relevant `docs/STAGES/<id>.md`  
2. Update [../WORKFLOWS/README.md](../WORKFLOWS/README.md) if flow changed  
3. Run `npm run build` and `npm run lint`  
