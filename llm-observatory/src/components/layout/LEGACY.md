# Legacy dashboard components

**Status:** Not mounted in the documentary journey (ADR-001).

These files remain for reference and optional Curious+ experiments. **Do not import from `components/journey/` or `ObservatoryApp`.**

| Component | Former role |
|-----------|-------------|
| `TopBar` | Persistent header |
| `StageRail` | Sidebar chapter list |
| `BrainJourney` | Dashboard shell wrapper |
| `TimelineScrubber` | Global tour scrubber |
| `PromptBanner` | Always-on prompt display |
| `PlaybackControls` | Speed + transport (partially duplicated in `SceneChrome`) |
| `MiniPipelineMap` | Compact stage map |
| `MobileStageNav` | Mobile rail drawer |
| `HomeView` / `WelcomeIntro` | Pre-redesign welcome |

Active journey chrome: `SceneChrome`, `SceneProgress`, `ChapterScene`.

When removing a legacy file, update [../../docs/COMPONENTS/README.md](../../docs/COMPONENTS/README.md) and [../../docs/ROADMAP/technical-debt.md](../../docs/ROADMAP/technical-debt.md).
