# StageLayout

**Path:** `src/components/ui/StageLayout.tsx`

Documentary chapter composition contract. **`ChapterScene` owns titles** — sections must not add duplicate `h2` headers.

## Slots

| Slot | Visibility | Purpose |
|------|------------|---------|
| `insight` | Beginner (`SimpleInsight`) | Plain-language lesson line |
| `focal` | **Always** | Single hero visualization |
| `explanation` | Always (optional) | Supporting copy below focal |
| `curious` | Curious + Advanced | Wrapped in `LearningDetail` |
| `advanced` | Advanced only | Wrapped in `AdvancedDetail` |

## Example

```tsx
<StageLayout
  insight="One sentence a beginner can feel."
  focal={<GlassPanel variant="hero">…</GlassPanel>}
  curious={
    <>
      <StageSectionHeader stage="logits" icon={Dice5} />
      <MetricCard … />
    </>
  }
  advanced={<GlassPanel title="Export">…</GlassPanel>}
/>
```

## Rules

1. **Focal must never live inside `LearningDetail`.**
2. Use `GlassPanel` with `variant="hero"` for the primary surface.
3. Prefer `divider={false}` on hero panels to avoid double-border noise.
4. Use design tokens (`var(--*)`) — not raw `slate-*` / `cyan-*` in primary UI.
5. Register new chapters in `StageContent.tsx` and `docs/STAGES/`.

## Related

- [../LEARNING_SYSTEM/progressive-disclosure.md](../LEARNING_SYSTEM/progressive-disclosure.md)
- [../UX/philosophy.md](../UX/philosophy.md)
- [GlassPanel](./README.md)
