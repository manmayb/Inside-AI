# Typography

**Implementation:** `src/app/layout.tsx` (Google Fonts) + `globals.css` utilities.

---

## Font stack

```tsx
// layout.tsx
Fraunces  → --font-fraunces  (display)
DM Sans   → --font-dm-sans   (body)
IBM Plex Mono → --font-plex-mono (code)
```

Body default: `font-family: var(--font-dm-sans)`.

---

## Classes

| Class | Font | When |
|-------|------|------|
| `.display-title` | Fraunces | Headlines, chapter titles |
| `.text-gradient` | Brand gradient clip | Welcome accent line (sparingly) |
| `font-mono` | Plex Mono | Advanced metrics, JSON payloads |

**Do not** use monospace uppercase tracking on primary Beginner navigation — reads as observability tooling.

---

## Hierarchy by screen

### Welcome (`WelcomeScreen`)

- H1: `display-title text-4xl md:text-5xl`  
- Subcopy: `text-lg text-[var(--muted)]`  

### Chapter (`ChapterScene`)

- Label: `text-xs uppercase tracking-widest`  
- Title: `display-title text-3xl md:text-4xl`  
- Summary: `text-base md:text-lg muted`  

### Advanced panels (`GlassPanel`, `MetricCard`)

- Title: `text-sm font-medium text-accent` (not mono uppercase)  
