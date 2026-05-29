# ADR-003: Contextual brain focus vs permanent full brain

## Status
Accepted

## Context
`ArtificialBrain` six-region SVG always visible duplicated narration and competed with chapter visuals.

## Decision
- Beginner journey: `ChapterBrainFocus` — single region chip + one-line `doing` text  
- Full `ArtificialBrain` retained for legacy / optional future “map view” in menu  
- Region mapping unchanged in `brainRegions.ts`  

## Consequences

- ✅ Less visual noise per chapter  
- ✅ Brain metaphor appears when relevant to “where am I?”  
- 📁 `ArtificialBrain.tsx` still maintained for Curious+ experiments  
