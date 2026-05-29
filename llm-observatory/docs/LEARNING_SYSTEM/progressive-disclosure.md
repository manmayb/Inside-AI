# Progressive disclosure

## Layers (outer → inner)

| Layer | Visible in Beginner? |
|-------|---------------------|
| Welcome + prelude copy | Yes |
| Chapter title + summary | Yes |
| Region focus chip | Yes |
| `SimpleInsight` | Yes |
| Primary metaphor viz (tokens, arcs, collapse) | Yes |
| `StageSectionHeader` | No |
| `LearningDetail` blocks | No |
| Equations, heatmaps, matrix chambers | No |
| `AdvancedDetail` metrics / JSON | No |

## Component wrappers

```tsx
<LearningDetail>{/* Curious+ */}</LearningDetail>
<AdvancedDetail>{/* Advanced only */}</AdvancedDetail>
```

`useLearningDepth()` provides `isBeginner`, `showTechnical`, `showMetrics`, `calmLayout`.

## Calm layout

`calmLayout: true` → narrower max-width, less vertical padding in legacy layouts; chapter scene uses fixed `max-w-lg` for Beginner content.

## Changing depth mid-journey

`setViewMode` updates store immediately; `ChapterScene` and sections re-render with new gating. Tips text swaps via `getStageTip(..., viewMode)`.
