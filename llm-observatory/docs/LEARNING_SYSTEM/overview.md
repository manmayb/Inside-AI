# Learning system overview

Three **learning depths** — product labels vs internal IDs:

| UI label | `ViewMode` ID | Hook flags |
|----------|---------------|------------|
| Beginner | `beginner` | `showTechnical: false`, `showMetrics: false`, `calmLayout: true` |
| Curious | `engineer` | `showTechnical: true`, `showMetrics: false` |
| Advanced | `research` | `showTechnical: true`, `showMetrics: true` |

**Default:** Beginner (persisted).

---

## Implementation

| Piece | Path |
|-------|------|
| Flags | `src/hooks/useLearningDepth.ts` |
| Toggle | `ModeToggle` in journey menu |
| Copy | `src/lib/stageTips.ts` per stage × mode |
| Gating wrappers | `LearningDetail`, `AdvancedDetail`, `Equation`, `StageSectionHeader` |
| Beginner insight | `SimpleInsight` |
| Chapter header | `ChapterScene` uses beginner `simpleLabel` |

---

## Progressive disclosure strategy

1. **Chapter title + summary** — always plain language in Beginner  
2. **SimpleInsight** — one highlighted sentence in section  
3. **LearningDetail** — Curious+ panels (heatmaps, terms)  
4. **AdvancedDetail** — metrics, JSON, FLOPs  

Never show logits/heatmaps/tensors as the **first** thing a Beginner sees.

---

## Narration structure

- **Prelude:** three ideas + ready screen  
- **Per chapter:** `getStageTip(stage, viewMode)` → title (in header), summary, optional `tryThis`  
- **Region chip:** `ChapterBrainFocus` — where in cognitive journey (Beginner only)  

---

## Glossary

Static entries in `src/lib/glossary.ts`, surfaced via `GlossaryDrawer` in journey menu.

See [copywriting.md](./copywriting.md) and [progressive-disclosure.md](./progressive-disclosure.md).
