# Design principles

Design documentation spans three layers:

| Layer | Folder | Question answered |
|-------|--------|-----------------|
| Visual | [../VISUAL_SYSTEM/overview.md](../VISUAL_SYSTEM/overview.md) | How does it look? |
| Motion | [../MOTION/overview.md](../MOTION/overview.md) | How does it move? |
| UX | [../UX/philosophy.md](../UX/philosophy.md) | How does it feel to use? |

---

## Guiding principles

1. **Clarity over spectacle** — Motion and atmosphere support comprehension; they do not compete with it.
2. **One focal point** — Each chapter has one dominant visual idea.
3. **Warm editorial typography** — Fraunces + DM Sans; avoid “sci-fi dashboard” monospace on primary UI.
4. **Honest simulation** — Visuals are pedagogical metaphors, not fake precision.
5. **Progressive depth** — Advanced visuals (heatmaps, JSON, equations) appear only in Curious/Advanced.

---

## Neural metaphor (when to use)

Use **sparingly** in Beginner mode:

- Region focus chip (`ChapterBrainFocus`) — where in the cognitive journey  
- Soft ambient particles (`NeuralUniverse`) — atmosphere only  

Avoid in Beginner primary UI:

- Full six-region SVG brain always visible (legacy `ArtificialBrain` in dashboard layout)  
- Tensor rivers, grid drift, holographic frames  

See [../DECISIONS/003-contextual-brain.md](../DECISIONS/003-contextual-brain.md).

---

## Implementation map

| Concern | Source of truth |
|---------|-----------------|
| CSS tokens | `src/app/globals.css` |
| Tailwind theme | `@theme inline` in `globals.css` |
| Fonts | `src/app/layout.tsx` |
| Component surfaces | `.museum-card`, `.btn-primary` in `globals.css` |
| Chapter layout | `src/components/journey/ChapterScene.tsx` |
