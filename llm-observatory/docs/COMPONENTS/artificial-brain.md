# ArtificialBrain

**Path:** `src/components/brain/ArtificialBrain.tsx`  
**Status:** Legacy — **not mounted** in documentary journey (replaced by `ChapterBrainFocus` for Beginner).

## Responsibility

Full six-region SVG map with paths, region labels, and narration from `stageTips`.

## When to use

- Optional “full map” feature in menu (future)  
- Curious+ overview mode  
- Do **not** restore as always-visible header without ADR  

## Dependencies

`brainRegions.ts`, `stageTips.ts`, `NEURAL_TIMING`, Zustand `currentStage`, `viewMode`

## Performance

SVG + Framer Motion paths; dynamic import recommended.

See [../DECISIONS/003-contextual-brain.md](../DECISIONS/003-contextual-brain.md).
