# CinematicScene

**Path:** `src/components/ui/CinematicScene.tsx`  
**Config:** `src/lib/sceneComposition.ts`

## Purpose

Viewport-driven chapter layout for immersive stages. The hero visualization **owns the screen**; narrative floats as overlay; Curious+ content opens in a bottom sheet instead of stacking vertically.

Use for chapters marked `mode: "cinematic"` in `SCENE_COMPOSITION`.

## Structure

```
CinematicScene
├── scene-hero-layer (absolute fill — no card wrapper)
├── vignettes (readability gradients)
├── insight overlay (Beginner only)
└── SceneDetailsPanel (Curious+ — bottom sheet)
```

## When to use

| Layout | Component |
|--------|-----------|
| Immersive viz chapters (embedding, transformer, gpu, …) | `CinematicScene` |
| Narrative / compact chapters (input, tokenization, …) | `StageLayout` |

## Props

| Prop | Role |
|------|------|
| `hero` | Full-bleed visualization — must use `h-full min-h-0` internally |
| `insight` | Beginner insight string or node — floats above chrome |
| `curious` | Curious+ panels — **not** rendered inline |
| `advanced` | Advanced metrics — appended inside details sheet |

## Scene composition

Per-stage settings in `sceneComposition.ts`:

- `mode`: `"compact"` \| `"cinematic"`
- `viewportUsage`: target hero fraction (0–1)
- `minimizeChrome`: slimmer bottom transport

`ChapterScene` reads composition via `useSceneComposition()` and switches header/main layout.

## Related

- [stage-layout.md](./stage-layout.md) — compact chapters  
- [../UX/philosophy.md](../UX/philosophy.md)  
- ADR-001 scene-based UX
