# UX philosophy

## Core thesis

Beginners do not learn well from **persistent multi-panel workspaces**. They learn from **focused scenes** with a single dominant idea and invisible navigation.

The product is an **interactive guided documentary**, not a live AI control room.

---

## Rejected pattern: dashboard UX

We explicitly abandoned layouts that included:

- Always-visible side rails with 15 stage labels  
- Permanent full-brain diagram + stage panel + scrubber + top bar simultaneously  
- Engineering copy (“signal held,” token counts in headers) on primary surfaces  
- Multiple competing focal points per screen  

**Why rejected:** Creates subconscious pressure — “I need to understand all of this at once.” See [../DECISIONS/001-scene-based-ux.md](../DECISIONS/001-scene-based-ux.md).

---

## Accepted pattern: scene-based chapters

Each pipeline stage renders as a **full-screen chapter**:

1. Chapter label + human title + one plain-language summary  
2. (Beginner) One **region focus** chip — not the full six-region map  
3. **One** primary visualization / interaction for that idea  
4. Minimal chrome: progress dots + compact transport bar + menu  

Implementation: `DocumentaryJourney` → `ChapterScene` → `StageSection`.

---

## Cognitive load reduction

| Technique | Implementation |
|-----------|----------------|
| Hide advanced settings | Welcome → “Customize experience” `<details>` |
| Hide technical chrome | No TopBar during journey; menu for depth/glossary |
| One idea per chapter | `ChapterScene` headline from `stageTips.ts` |
| Progressive disclosure | `LearningDetail`, `AdvancedDetail`, `useLearningDepth` |
| Prelude before simulation | `PreJourneyIntro` sets expectations before `submitPrompt` |

---

## Emotional design goals

- **Safe** — nothing hits a real API; stated on welcome screen  
- **Curious** — prelude frames the journey as exploration  
- **Guided** — auto-advance with pause; user never “lost”  
- **Digestible** — breathing room, large type, calm motion  

---

## Beginner-first default

`viewMode` defaults to `beginner` and persists via `localStorage`. Technical sections, equations, and dense metrics are gated. See [../LEARNING_SYSTEM/overview.md](../LEARNING_SYSTEM/overview.md).

---

## Navigation philosophy

Navigation should feel **invisible** until needed:

- **Primary:** Auto-play through chapters  
- **Secondary:** Bottom transport (pause, prev/next)  
- **Tertiary:** Dot progress (jump to completed chapters)  
- **Quaternary:** Menu (depth, glossary, exit)  

No permanent sidebar in the documentary flow.

---

## Related docs

- [experience-flow.md](./experience-flow.md) — phase diagram  
- [../ARCHITECTURE/app-structure.md](../ARCHITECTURE/app-structure.md) — code mapping  
