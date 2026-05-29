# Surfaces & components

## Museum cards

Primary container pattern — rounded corners, soft border, subtle shadow. No clip-path chamfers.

```css
.museum-card          /* standard */
.museum-card-elevated /* welcome form, modals */
```

`GlassPanel` (`src/components/ui/GlassPanel.tsx`) wraps museum card classes for section panels.

---

## Buttons

| Class | Role |
|-------|------|
| `.btn-primary` | Main CTAs — filled accent, pill shape |
| `.btn-ghost` | Secondary — outline pill |

---

## Semantic tokens

`.semantic-token` — rounded token glyphs in tokenization / attention UIs. Softer shadow in Thought Museum vs legacy glow rings.

---

## Journey chrome

`SceneChrome` uses:

- `border-[var(--panel-border)]`  
- `bg-[var(--deep)]/90 backdrop-blur-md`  
- Fixed bottom gradient from `--void`  

Keeps transport visible without a “dashboard header.”
