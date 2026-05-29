# Visual system overview

**Codename:** Thought Museum  
**Implementation:** `src/app/globals.css` + Tailwind v4 `@theme inline`

---

## Color philosophy

Warm dark surfaces with **restrained** accent color — readable, calm, educational. Not neon cyberpunk.

| Token | Role |
|-------|------|
| `--void` | Page background base |
| `--deep` / `--elevated` / `--surface` | Layered surfaces |
| `--accent` | Primary actions, focus, progress |
| `--secondary` | Warm secondary highlights |
| `--text` / `--muted` | Body and supporting copy |

Accent moods (`data-accent` on `<html>`): internal IDs `teal` | `violet` | `amber` — UI labels Sage, Lavender, Warm. See [../THEMING/overview.md](../THEMING/overview.md).

---

## Typography hierarchy

| Role | Font | Usage |
|------|------|--------|
| Display | Fraunces (`.display-title`) | Chapter titles, welcome headline |
| Body | DM Sans | UI, paragraphs, buttons |
| Code / metrics | IBM Plex Mono | Advanced mode only |

**Scale (journey):**

- Chapter label: `text-xs` uppercase tracking  
- Chapter title: `text-3xl`–`4xl` display  
- Summary: `text-base`–`lg` muted  
- Insight highlight: `SimpleInsight` panel in sections  

---

## Spacing & layout

- **Welcome / prelude:** centered column, `max-w-lg`–`max-w-2xl`, generous vertical padding  
- **Chapter content:** `max-w-lg` (Beginner) / `max-w-3xl` (Curious+)  
- **Bottom chrome:** fixed gradient fade + `pb-28` on main so content clears transport bar  

---

## Surfaces

| Class | Use |
|-------|-----|
| `.museum-card` | Standard panel |
| `.museum-card-elevated` | Welcome form, menus |
| `.btn-primary` / `.btn-ghost` | CTAs |

Legacy aliases `.glass`, `.neural-frame` map to museum cards for backward compatibility.

---

## Atmospheric systems

| Layer | Component | Beginner intensity |
|-------|-----------|-------------------|
| Canvas particles | `NeuralUniverse` | ~35 particles, low opacity |
| CSS fog / orbs | `AmbientShell` | Always `calm` |
| Noise overlay | `.noise-overlay` | Very low opacity |

**Removed from default ambient:** grid drift, tensor rivers, megastructures.

---

## Visual rhythm

Alternate **calm copy scenes** (prelude, chapter headers) with **interactive moments** (token tap, attention arcs). Auto-advance provides pacing; user can pause.

---

## Screenshots

> Placeholder: add `docs/REFERENCE/screenshots/` when capturing welcome, prelude, and sample chapters.

---

## Related

- [typography.md](./typography.md)  
- [surfaces.md](./surfaces.md)  
- [../MOTION/overview.md](../MOTION/overview.md)  
