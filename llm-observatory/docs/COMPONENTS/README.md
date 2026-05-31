# Components index

Major UI and visualization components. **Active path** = used in documentary journey.

## Journey shell (active)

| Component | Path | Role |
|-----------|------|------|
| `ObservatoryApp` | `ObservatoryApp.tsx` | Phase routing |
| `WelcomeScreen` | `home/WelcomeScreen.tsx` | Welcome |
| `PreJourneyIntro` | `home/PreJourneyIntro.tsx` | Prelude |
| `DocumentaryJourney` | `journey/DocumentaryJourney.tsx` | Journey shell |
| `ChapterScene` | `journey/ChapterScene.tsx` | Chapter layout + copy |
| `ChapterBrainFocus` | `journey/ChapterBrainFocus.tsx` | Beginner region chip |
| `SceneProgress` | `journey/SceneProgress.tsx` | Dot progress |
| `SceneChrome` | `journey/SceneChrome.tsx` | Transport + menu |
| `JourneyComplete` | `journey/JourneyComplete.tsx` | Finale overlay |
| `StageSection` | `sections/StageContent.tsx` | Stage router |
| `StageLayout` | `ui/StageLayout.tsx` | Compact chapter composition |
| `CinematicScene` | `ui/CinematicScene.tsx` | Viewport-owned immersive scenes — [cinematic-scene.md](./cinematic-scene.md) |

## Visualizations

| Component | Stage(s) | Doc |
|-----------|----------|-----|
| `AttentionArcs` | attention | [attention-arcs.md](./attention-arcs.md) |
| `AttentionHeatmap` | attention | Curious+ D3 heatmap |
| `ProbabilityField` | logits | [probability-field.md](./probability-field.md) |
| `SemanticToken` | tokenization, attention | Token glyph |
| `TransformerCity` | transformer | Layer megastructure |
| `ComputeChamber` | gpu | Matrix reactors |
| `NeuralUniverse` | ambient | [neural-universe.md](./neural-universe.md) |
| `ArtificialBrain` | legacy | [artificial-brain.md](./artificial-brain.md) |

## UI primitives

`GlassPanel`, `SimpleInsight`, `LearningDetail`, `MetricCard`, `AmbientShell` — see [../VISUAL_SYSTEM/surfaces.md](../VISUAL_SYSTEM/surfaces.md).

## Legacy (dashboard era — not mounted)

`TopBar`, `StageRail`, `BrainJourney`, `TimelineScrubber`, `PromptBanner`, `TokenConsciousness`, `MiniPipelineMap`, `HomeView`, `WelcomeIntro`

Do not wire these back without ADR. See [../DECISIONS/001-scene-based-ux.md](../DECISIONS/001-scene-based-ux.md).
