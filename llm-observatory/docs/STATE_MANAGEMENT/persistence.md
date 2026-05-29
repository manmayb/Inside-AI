# Persistence

**Module:** `src/lib/persistence.ts`

---

## Stored preferences

| Field | Default | Applied on load |
|-------|---------|-----------------|
| `viewMode` | `beginner` | Store + UI depth |
| `playbackSpeed` | `1` | Runner |
| `ragEnabled` | `false` | Next `submitPrompt` |
| `themeAccent` | `teal` | `document.documentElement.dataset.accent` |
| `modelPreset` | `standard` | `config` via preset |

---

## Hydration

`PreferencesHydrator` → `hydratePrefs()` on mount in `ObservatoryApp`.

---

## Theme application

```typescript
applyThemeAccent(accent) {
  document.documentElement.dataset.accent = accent;
}
```

CSS in `globals.css` maps `[data-accent="teal|violet|amber"]` to Thought Museum palette.

---

## Prelude / welcome localStorage

| Key | Purpose |
|-----|---------|
| `inside-ai-intro-seen` | **Deprecated** — old WelcomeIntro; prelude is now always shown before first run in flow |

Do not add new keys without documenting here.
