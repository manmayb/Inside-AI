# Reference

## Keyboard shortcuts

| Key | When | Action |
|-----|------|--------|
| Space | Journey active | Pause / resume |
| Shift + ← | Journey active | Previous chapter |
| Shift + → | Journey active | Next chapter |
| ⌘/Ctrl + Enter | Welcome textarea | Start the journey |

## Glossary

Source: `src/lib/glossary.ts` — UI: `GlossaryDrawer` in journey menu.

## File map (critical paths)

| Path | Purpose |
|------|---------|
| `src/components/ObservatoryApp.tsx` | Phase router |
| `src/components/journey/DocumentaryJourney.tsx` | Journey shell |
| `src/store/pipelineStore.ts` | State |
| `src/hooks/usePipelineRunner.ts` | Auto-advance |
| `src/lib/stageTips.ts` | Chapter copy |
| `src/types/pipeline.ts` | Stage order + types |
| `src/app/globals.css` | Design tokens |

## localStorage keys

| Key | Purpose |
|-----|---------|
| `neural-observatory-prefs` | User preferences |
| `inside-ai-intro-seen` | Legacy — optional cleanup |

## Screenshots

> Add captures to `docs/REFERENCE/screenshots/` when available.
