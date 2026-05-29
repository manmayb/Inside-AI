# Stage machine

## Definition

```typescript
// src/types/pipeline.ts
export const PIPELINE_STAGES = [
  "input", "tokenization", "embedding", "context",
  "transformer", "attention", "gpu", "hidden",
  "logits", "autoregressive", "kvcache", "safety",
  "rag", "streaming", "analytics",
] as const;
```

## Status computation

`buildStageStatuses(current, progress)` in `lib/constants.ts`:

- Index `< current` → `complete: true`, `progress: 100`  
- Index `=== current` → `active: true`, `progress: stageProgress`  
- Index `>` current → pending  

Used by `SceneProgress` dots.

## Manual override

| Method | Effect |
|--------|--------|
| `jumpToStage` | Jump + pause |
| `goToNextStage` | Next boundary, progress 0 |
| `goToPrevStage` | Previous at 100%, pause |

## Global scrub progress

`lib/tourProgress.ts` maps `(stage, stageProgress)` ↔ 0–100 global for legacy scrubber. Store field `globalScrubProgress` still updated on ticks.

## Adding a stage (checklist)

1. Append to `PIPELINE_STAGES`  
2. Add `STAGE_META` entry  
3. Add `STAGE_TIPS` in `stageTips.ts`  
4. Map in `brainRegions.ts`  
5. Create `sections/NewSection.tsx` + register in `StageContent.tsx`  
6. Add `docs/STAGES/<id>.md`  
7. Update [../AI/contributor-guide.md](../AI/contributor-guide.md) if patterns change  
