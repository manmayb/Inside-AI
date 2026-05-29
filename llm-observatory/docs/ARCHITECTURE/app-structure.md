# App structure

## Entry

```
src/app/page.tsx
  └── ObservatoryApp
```

## Phase state (React local)

`ObservatoryApp` holds:

- `phase: 'welcome' | 'prelude' | 'journey'`  
- `pendingPrompt: string`  

Zustand `active` becomes `true` only after prelude **Begin** → `submitPrompt(pendingPrompt)`.

**Why local phase:** Prelude is pre-simulation UX; it should not pollute global store or trigger runner.

## Directory tree (abbreviated)

```
src/
├── app/
├── components/
│   ├── ObservatoryApp.tsx
│   ├── PreferencesHydrator.tsx
│   ├── home/           WelcomeScreen, PreJourneyIntro
│   ├── journey/        DocumentaryJourney, ChapterScene, SceneChrome, …
│   ├── sections/       *Section.tsx ×15, StageContent.tsx
│   ├── viz/            AttentionArcs, ProbabilityField, …
│   ├── ui/             GlassPanel, SimpleInsight, AmbientShell, …
│   ├── layout/         Legacy dashboard chrome (unused in documentary)
│   ├── brain/          ArtificialBrain (legacy full map)
│   └── environment/    NeuralUniverse
├── hooks/
├── lib/
├── motion/
├── store/
└── types/
```

## Dynamic imports

| Component | Reason |
|-----------|--------|
| `NeuralUniverse` | Canvas — no SSR |
| `ArtificialBrain` | SVG animation — optional legacy |

## Next.js config

`next.config.ts`: `transpilePackages: ['three']`, `allowedDevOrigins` for local HMR only.
