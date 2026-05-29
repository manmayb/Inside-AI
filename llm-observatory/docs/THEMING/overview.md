# Theming

## Accent moods

User selects in welcome **Customize** or legacy `ThemePicker` (journey menu).

| UI label | `ThemeAccent` ID | CSS `[data-accent]` |
|----------|------------------|---------------------|
| Sage | `teal` | default sage greens |
| Lavender | `violet` | muted purple |
| Warm | `amber` | gold tones |

Applied via:

```typescript
document.documentElement.dataset.accent = accent;
```

Defined in `src/lib/persistence.ts` → `applyThemeAccent`.

## Thought Museum tokens

All moods override `--accent`, `--accent-glow`, `--panel-border`, `--gradient-brand` in `globals.css`.

Default html in `layout.tsx`: `data-accent="sage"` maps to `:root` sage palette.

## View mode attribute

`ObservatoryApp` root: `data-view={viewMode}` for optional CSS targeting (`beginner` | `engineer` | `research`).

## Phase attribute

`data-phase={phase}` on app root — `welcome` | `prelude` | `journey` for debugging/styles.
